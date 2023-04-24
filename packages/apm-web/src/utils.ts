import { IVitalsScore } from "./types";

declare var wx: any;
type AnyObject = {
  [key: string]: any;
};
type AnyArray = any[];

type ObjectOrArray = AnyObject | AnyArray;

const deviceKey = 'mito--uuid';
let sid = ''; // sessionId
/**
 * 节流
 * @param fn 
 * @param delay 
 * @returns 
 */
export const debounce = (fn: any, delay = 200) => {
  let timer: any;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      return fn(...args);
    }, delay);
  };
};
/**
 * 获取设备id
 * @returns 设备id
 */
export function getDeviceId(): string {
  const isInWx = typeof wx !== 'undefined'
  let deviceId = isInWx ? wx.getStorageSync(deviceKey) : localStorage.getItem(deviceKey)
  if (!deviceId) {
    deviceId = Math.random().toString(36).substring(2)
    isInWx ? wx.setStorageSync(deviceKey, deviceId) : localStorage.setItem(deviceKey, deviceId)
  }
  return deviceId;
}
/**
 * 获取会话id
 * @returns 会话id
 */
export function getSessionId(): string {
  if (!sid) {
    sid = Math.random().toString(36).substring(2)
  }
  return sid;
}
/**
 * 数组转对象
 * @param obj 要转船成对象的数组
 * @returns 
 */
export function arrayToObject(obj: any) {
  if (obj instanceof Array) {
    return obj.reduce((acc: any, cur: any, index: number) => {
      acc[index] = cur;
      return acc;
    }, {});
  }
  if (obj instanceof Object) {
    return Object.keys(obj).reduce((acc: any, cur: string) => {
      acc[cur] = arrayToObject(obj[cur]);
      return acc;
    }, {});
  }
  return obj;
}
/**
 * 数组转对象，根据数组中某个属性决定对象key
 * @param arr 
 * @param key 
 * @returns 
 */
export function arrayToObjectByKey(arr: any[], key: string) {
  return arr.reduce((acc: any, cur: any) => {
    acc[cur[key]] = cur;
    return acc;
  }, {});
}

/**
 * 根据path删除属性
 * @param obj 要删除属性的对象
 * @param paths 对象路径，支持通配符，例：[a.*.c, a.b.*]
 * @returns 
 */
export function deletePropsByPath(obj: ObjectOrArray, paths: string[]): ObjectOrArray {
  function deleteProp(obj: ObjectOrArray, pathParts: string[]): void {
    if (!obj || typeof obj !== 'object' || !pathParts.length) return;

    const currentPath = pathParts[0];
    const restPath = pathParts.slice(1);

    if (currentPath === '*') {
      for (const key in obj as AnyObject) {
        if (Array.isArray((obj as AnyObject)[key])) {
          (obj as AnyObject)[key].forEach((item: ObjectOrArray, index: number) => {
            deleteProp(item, restPath);
          });
        } else {
          deleteProp((obj as AnyObject)[key], restPath);
        }

        if (!restPath.length) {
          delete (obj as AnyObject)[key];
        }
      }
    } else {
      if (Object.prototype.hasOwnProperty.call(obj, currentPath)) {
        if (Array.isArray((obj as AnyObject)[currentPath])) {
          (obj as AnyObject)[currentPath].forEach((item: ObjectOrArray, index: number) => {
            deleteProp(item, restPath);
          });
        } else {
          deleteProp((obj as AnyObject)[currentPath], restPath);
        }

        if (!restPath.length) {
          delete (obj as AnyObject)[currentPath];
        }
      }
    }
  }

  paths.forEach(path => {
    const pathParts = path.split('.');
    deleteProp(obj, pathParts);
  });

  return obj;
}

const perThresholds = {
  FCP: [1000, 3000],
  LCP: [2500, 4000],
  FR: [100, 300],
}
export const getRating = (
  value: number,
  name: 'FCP' | 'LCP' | 'FR',
): IVitalsScore => {
  const vitalsThresholds = perThresholds[name];
  if (!vitalsThresholds || !value) return undefined
  if (value <= vitalsThresholds[0]) {
    return 'good';
  }
  return value <= vitalsThresholds[1] ? 'needsImprovement' : 'poor';
};
