# dubbo.ts Example

本项目仅演示 [dubbo.ts](https://github.com/cevio/dubbo.ts) 架构。

```bash
$ git clone git@github.com:cevio/dubbo.ts-example.git
$ cd dubbo.ts-example
$ npm i
```

## 直连模式

```bash
$ npm run server
$ npm run client
```

> 注意: 分别分两个命令行窗口运行。

在浏览器中浏览地址 `http://localhost:8000/?a=1&b=2` 能看到以下输出：

```
a + b = 3
```

## 注册中心模式

1. 请先开启zookeeper，否则无效果报错。
1. 请修改 `src/registry.ts` 中 `host` 地址为你的 zookeeper 地址，如果有端口，那么修改为 `127.0.0.1:8888`。


```bash
$ npm run server:registry
$ npm run client:registry
```

> 注意: 分别分两个命令行窗口运行。

在浏览器中浏览地址 `http://localhost:8000/?a=1&b=2` 能看到以下输出：

```
a + b = 3
```

# 最后

如果喜欢，请大家不要吝啬给一个star。此架构的性能非常高，具体性能请看[主项目](https://github.com/cevio/dubbo.ts)。