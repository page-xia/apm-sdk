## 安装依赖
```
npm run bootstrap
```

## 编译
```
npm run build
```

## 发布到npm
```
npm run publish:pkg
```

## 目录结构
├── apm-web  // web sdk
│   ├── README.md
│   ├── package.json
│   ├── rollup.config.js
│   ├── src
│   │   ├── index.ts
│   │   └── web.ts
│   ├── tsconfig.json
│   └── tsconfig.types.json
├── apm-wx // 小程序sdk
│   ├── README.md
│   ├── package.json
│   ├── rollup.config.js
│   ├── src
│   │   ├── index.ts
│   │   └── wx-mini.ts
│   ├── tsconfig.json
│   └── tsconfig.types.json
└── common
    ├── dist
    │   ├── config.d.ts
    │   ├── index.d.ts
    │   ├── index.js
    │   ├── interface.d.ts
    │   ├── types.d.ts
    │   └── utils.d.ts
    ├── node_modules
    ├── package.json
    ├── rollup.config.js
    ├── src
    │   ├── config.ts
    │   ├── index.ts
    │   ├── interface.ts
    │   ├── types.ts
    │   └── utils.ts
    ├── tsconfig.json
    └── tsconfig.types.json