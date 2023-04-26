import type { TrackActionType } from "./types"

export interface IEvent {
  // uuid
  id?: string
  // 埋点code 一般由人为传进来，可以自定义规范
  trackId?: string
  // 埋点类型，可扩展
  actionType?: TrackActionType | any
  // 埋点开始时间
  startTime?: number
  // 埋点停留时间
  durationTime?: number
  // 埋点参数
  data?: any
}
export interface IOptions {
  apikey: string // 项目id
  backTrackerId?: any // 获取用户id，需要return用户id
  dsn?: string // 上报接口地址
  vue?: any // vue实例
  silentConsole?: boolean // 控制台打印
  debug?: boolean // debug模式
  maxBreadcrumbs?: number // 最大行为追踪条数
  throttleDelayTime?: number // 上报频率
  versionName?: string // mainfest versionName
  versionCode?: string // mainfest versionCode
}