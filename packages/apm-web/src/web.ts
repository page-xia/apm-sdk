import { vuePlugin } from "@mitojs/vue";
import { init } from "@mitojs/browser";
import {Perfume} from 'perfume.js';
import { arrayToObject, getSessionId, getDeviceId, deletePropsByPath } from "./utils";
import {DSNURL} from './config'
import type { IEvent, IOptions } from "./interface";
import { TrackActionType } from "./types";

const plugin: any = vuePlugin;
const typeMap: Record<string, string> = {
  'reload': 'render',
  'navigate': 'navigation'
}
export const webSdk = (app: any, options: IOptions, extData?: any): void => {
  const MitoInstance = init(
    {
      vue: app,
      silentConsole: true,
      silentDom: true,
      dsn: DSNURL,
      debug: true,
      throttleDelayTime: 1000,
      async beforeDataReport(event: any) {
        console.log(event.data, 'event')
        deletePropsByPath(event, ['authInfo.sdkName', 'authInfo.sdkVersion'])
        const { data, ...o } = event;
        const ed = {
          deviceId: getDeviceId(),
          sid: getSessionId(),
          ...o,
          ...extData,
          ...data,
        }
        return arrayToObject(ed);
      },
      ...options,
    },
    [plugin]
  );
  // console.log(new UAParser().getResult(), 'UAParser')
  const defaultEvent: any = {
    actionType: "WX_PERFORMANCE",
    appId: options?.apikey,
    isTrack: true,
  }
  // 性能上报栈
  let eventList: any = {
    ...defaultEvent,
    systemInfo: navigator.userAgent
  }
  let timer: any;
  // 初始化性能上报
  const per = new Perfume({
    analyticsTracker: (item) => {
      const {data, metricName, navigationType, rating} = item
      const itemData: any = {
        // name: metricName,
        navigationType: typeMap[navigationType || 'reload'] || navigationType,
      }
      rating && (itemData.rating = rating)
      if (typeof data === 'number') {
        itemData.duration = data
        eventList[metricName] = itemData
      } else if (data instanceof Object && !['storageEstimate', ''].includes(metricName)) {
        eventList = {
          ...eventList,
          ...data
        }
      }
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        sendPerfume()
      }, 1000);
    }
  })
  const sendPerfume = async () => {
    await MitoInstance.transport.send(eventList)
    eventList = {
      ...defaultEvent
    }
  }
  // 手动事件上报
  const $trackEvent = ({ trackId, data }: IEvent) => {
    return MitoInstance.transport.send({
      isTrack: true,
      actionType: TrackActionType.EVENT,
      trackId,
      ...data
    })
  };
  const vueVersion = app.version?.substring(0, 2);
  // 多vue版本兼容
  if (vueVersion === "3.") {
    app.config.globalProperties.$trackEvent = $trackEvent;
  } else if (vueVersion === "2.") {
    app.prototype.$trackEvent = $trackEvent;
  }
};
