export enum TrackActionType {
  // 页面曝光
  PAGE = 'PAGE',
  // 事件埋点
  EVENT = 'EVENT',
  // 区域曝光
  VIEW = 'VIEW',
  // 时长埋点
  DURATION = 'DURATION',
  // 区域曝光的时长埋点
  DURATION_VIEW = 'DURATION_VIEW',
  // 错误埋点
  ERROR = 'ERROR',
  // 其他埋点类型
  OTHER = 'OTHER',
}
export const EventKeyMap: any = {
  firstContentfulPaint: 'FCP',
  firstPaint: 'FP',
  firstRender: 'FR',
  largestContentfulPaint: 'LCP',
}
/** 等级程度枚举 */
export enum Severity {
  Else = 'else',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug',
  /** 上报的错误等级 */
  Low = 'low',
  Normal = 'normal',
  High = 'high',
  Critical = 'critical'
}
export type IVitalsScore = 'good' | 'needsImprovement' | 'poor' | undefined;