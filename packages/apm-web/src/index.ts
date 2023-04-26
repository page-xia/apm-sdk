import type { IOptions } from "common/interface";
import { webSdk } from "./web";
const install = function(Vue: any, options: IOptions) {
  webSdk(Vue, options)
}

const _default = { install };
export default _default;