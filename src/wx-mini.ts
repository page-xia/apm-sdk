import { init } from "@mitojs/wx-mini";
import { vuePlugin } from "@mitojs/vue";
import { WxPerformance } from "@mitojs/wx-mini-performance";
import { debounce } from "./utils";
import type { IEvent, IOptions } from "./interface";
import { TrackActionType } from "./types";

export const wxMiniSdk = (app: any, options: IOptions) => {
  const plugin: any = vuePlugin;
  // 暂存当前页面信息
  const currentPage = {
    startTime: 0,
    page: {
      route: undefined,
    },
  };
  // 初始化mito
  const MitoInstance = init(
    {
      pageOnShow,
      pageOnHide,
      vue: app,
      silentConsole: true,
      dsn: "https://aiapi.nestsound.cn/querymodeltype",
      debug: false,
      // maxBreadcrumbs: 10,
      throttleDelayTime: 1000,
      async beforeDataReport(event) {
        // 获取上报内容
        const authInfo: any = event.authInfo || {};
        authInfo.versionName = options?.versionName;
        authInfo.versionCode = options?.versionName;
        return event;
      },
      ...options,
    },
    [plugin]
  );
  // 初始化性能监控
  new WxPerformance({
    appId: options?.apikey,
    immediately: true,
    ignoreUrl: /report/,
    report: debounce((data: any) => {
      const item = data[0];
      if (
        item &&
        ["WX_PERFORMANCE", "MEMORY_WARNING", "WX_USER_ACTION"].includes(
          item?.type
        )
      ) {
        MitoInstance.trackSend({
          actionType: item.type,
          ...data[0],
        });
      }
    }, 500),
  });
  // 页面显示钩子
  function pageOnShow(page: any) {
    currentPage.startTime = Date.now();
    currentPage.page = page;
  }
  // 页面隐藏钩子
  function pageOnHide() {
    // 离开页面埋点
    const endTime = Date.now();
    const elapsedTime = endTime - currentPage.startTime;
    // 拿到信息并上报
    MitoInstance.trackSend({
      actionType: TrackActionType.DURATION,
      // 曝光时间
      elapsedTime,
      // 页面路由
      route: currentPage.page?.route,
    });
  }
  // vue全局错误上报
  app.config.errorHandler = (err: any, vm: any, info: string) => {
    MitoInstance.trackSend({
      actionType: TrackActionType.ERROR,
      isTrack: false,
      message: err?.message,
      stack: err?.stack,
      info,
      page: currentPage.page?.route,
    });
  };
  const vueVersion = app.version?.substring(0, 2);
  // 手动事件上报
  const $trackEvent = ({ trackId, data }: IEvent) => {
    MitoInstance.trackSend({
      // 可自定义
      actionType: TrackActionType.EVENT,
      // 页面路由
      page: currentPage.page?.route,
      trackId,
      data,
    });
  };
  // 多vue版本兼容
  if (vueVersion === "3.") {
    app.config.globalProperties.$trackEvent = $trackEvent;
  } else if (vueVersion === "2.") {
    app.prototype.$trackEvent = $trackEvent;
  }
};
