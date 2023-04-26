import type { IOptions } from "@ax/apm-common/interface";
import { wxMiniSdk } from "./wx-mini";
const install = function(Vue: any, options: IOptions) {
  wxMiniSdk(Vue, options)
}

const _default = { install };
export default _default;