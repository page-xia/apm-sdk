import { vuePlugin } from "@mitojs/vue";
import { init } from "@mitojs/browser";
import { debounce } from "./utils";
import type { IEvent, IOptions } from "./interface";
import { TrackActionType } from "./types";

const plugin: any = vuePlugin;

export const webSdk = (app: any, options: IOptions, extData?: any) => {
  // 初始化mito
  const MitoInstance = init(
    {
      vue: app,
      silentConsole: true,
      dsn: process.env.npm_package_config_dsnUrl,
      debug: true,
      // maxBreadcrumbs: 10,
      throttleDelayTime: 1000,
      async beforeDataReport(event) {
        return {
          ...event,
          ...extData,
        };
      },
      ...options,
    },
    [plugin]
  );
  // 手动事件上报
  const $trackEvent = ({ trackId, data }: IEvent) => {
    MitoInstance.transport.send({
      isTrack: true,
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
