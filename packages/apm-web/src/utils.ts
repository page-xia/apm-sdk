export const debounce = (fn: Function, delay: number = 200) => {
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
export function getDeviceId(): string {
  const deviceKey = 'mito--uuid'
  let deviceId = localStorage.getItem(deviceKey)
  if (!deviceId) {
    deviceId = Math.random().toString(36).substring(2)
    localStorage.setItem(deviceKey, deviceId)
  }
  return deviceId;
}