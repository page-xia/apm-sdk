# @ax/apm-sdk-wx



### .npmrc 配置
```
registry=https://registry.npmmirror.com
@ax:registry=http://nexus.axhome.com.cn/repository/local-npm/
```

### 安装依赖

```
npm i @ax/apm-sdk-wx
```
### main.ts中使用
```
import apmWx from '@ax/apm-sdk-wx'
import manifest from './manifest.json'
Vue.use(apmWx, {
  apikey: '项目ID',
  versionName: manifest.versionName,
  versionCode: manifest.versionCode,
  extData: {
    // 存放一些额外上报数据
  },
  backTrackerId(){ // 获取用户id
    return uni.getStorageSync('userId')
  }
})
```
### 手动埋点上报
```
this.$trackEvent({
  trackId: 'click-home-btn', // 埋点事件id
  data: {}// 埋点上报数据
})
```