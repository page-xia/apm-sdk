import { vuePlugin } from "@ax/mito-vue";
import { init } from "@ax/mito-browser";
import {Perfume} from 'perfume.js';
import { arrayToObject, getSessionId, getDeviceId, deletePropsByPath, getRandomId, getUrlPath } from "@ax/apm-common/src";
import {DSNURL} from "@ax/apm-common/src"
import type { IEvent, IOptions } from "@ax/apm-common/src";
import { Severity, TrackActionType } from "@ax/apm-common/src";

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
      beforeDataReport(event: any) {
        // deletePropsByPath(event, ['authInfo.sdkName', 'authInfo.sdkVersion'])
        const { data, ...o } = event;
        const res = {
          deviceId: getDeviceId(),
          sid: getSessionId(),
          now: Date.now(),
          ua: navigator.userAgent,
          eventId: getRandomId(),
          ...o,
          ...extData,
          ...data,
          path: getUrlPath()
        }
        if (!res.url) {
          res.url = window.location.href
        }
        res?.errorId && (res.errorId = res?.errorId?.toString())
        return res;
      },
      beforePushBreadcrumb(breadcrumb: any, hint: any) {
        // breadcrumb.stack.push(hint)
        // breadcrumb.maxBreadcrumbs
        if (hint.type === 'Route') {
          sendBreadcrumb(hint.type)
        }
        // if (breadcrumb.stack?.length >= 3) {
        //   breadcrumb.clear()
        // }
        return hint
      },
      ...options,
    },
    [plugin]
  );
  const sendBreadcrumb = async (type: string) => {
    return MitoInstance.transport.send({
      isTrack: true,
      type,
      level: Severity.Low,
    })
  }
  // console.log(new UAParser().getResult(), 'UAParser')
  const defaultEvent: any = {
    actionType: "WX_PERFORMANCE",
    appId: options?.apikey,
    isTrack: true,
    level: Severity.Low
  }
  // 性能上报栈
  let eventList: any = {
    ...defaultEvent,
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
  const $trackEvent = (trackId: string, data: any) => {
    return MitoInstance.transport.send({
      isTrack: true,
      actionType: TrackActionType.EVENT,
      level: Severity.Low,
      trackId,
      td: data
    })
  };
  const vueVersion = app.version?.substring(0, 2);
  // 多vue版本兼容
  if (vueVersion === "3.") {
    app.config.globalProperties.$trackEvent = $trackEvent;
    app.config.globalProperties.$trackLog = MitoInstance.log
  } else if (vueVersion === "2.") {
    app.prototype.$trackEvent = $trackEvent;
    app.prototype.$trackEvent.$trackLog = MitoInstance.log
  }
};

