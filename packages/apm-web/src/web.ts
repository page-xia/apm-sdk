import { vuePlugin } from "@mitojs/vue";
import { init } from "@mitojs/browser";
import {Perfume} from 'perfume.js';
import { debounce, getDeviceId } from "./utils";
import type { IEvent, IOptions } from "./interface";
import { TrackActionType } from "./types";

const plugin: any = vuePlugin;
const typeMap: Record<string, string> = {
  'reload': 'render',
  'navigate': 'navigation'
}
const defaultDsn = 'https://apm-api.axhome.com.cn/'
export const webSdk = (app: any, options: IOptions, extData?: any) => {
  // 测试1
  const MitoInstance = init(
    {
      vue: app,
      silentConsole: true,
      silentDom: true,
      dsn: defaultDsn,
      debug: true,
      // maxBreadcrumbs: 10,
      throttleDelayTime: 1000,
      async beforeDataReport(event) {
        return {
          deviceId: getDeviceId(),
          ...event,
          ...extData,
        };
      },
      ...options,
    },
    [plugin]
  );
  let eventList: any = {
    actionType: "WX_PERFORMANCE",
    appId: options?.apikey,
    item: [],
    isTrack: true,
  }
  new Perfume({
    analyticsTracker: (item) => {
      const {data, metricName, navigationType, rating, ...o} = item
      const itemData: any = {
        name: metricName,
        navigationType: typeMap[navigationType || 'reload'] || navigationType,
      }
      rating && (itemData.rating = rating)
      if (typeof data === 'number') {
        itemData.duration = data
      } else if (data instanceof Object && !['storageEstimate'].includes(metricName)) {
        eventList = {
          ...eventList,
          ...data
        }
      }
      eventList.item.push(itemData)
      sendPerfume()
    }
  })
  const sendPerfume = debounce(async () => {
    await MitoInstance.transport.send(eventList)
    eventList.item = []
  }, 1000)
  // 手动事件上报
  const $trackEvent = ({ trackId, data }: IEvent) => {
    return MitoInstance.transport.send({
      isTrack: true,
      actionType: TrackActionType.EVENT,
      trackId,
      ...data
    })
    // MitoInstance.log({
    //   trackId,
    //   data,
    // });
  };
  const vueVersion = app.version?.substring(0, 2);
  // 多vue版本兼容
  if (vueVersion === "3.") {
    app.config.globalProperties.$trackEvent = $trackEvent;
  } else if (vueVersion === "2.") {
    app.prototype.$trackEvent = $trackEvent;
  }
};
