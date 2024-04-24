## @changelog-tags/github

> [!TIP]
> 抓取当前分支最新的两个 tag 并生成软件版本更新日志，并发布到对应的github仓库下
> 你也可以指定 tag
> 也可以写入本地文件，而不是发布到github的仓库下

[![npm version][npm-version-src]][npm-package-href][![npm downloads][npm-monthly-downloads-src]][npm-monthly-downloads-href][![License][license-src]][npm-package-href]

## 使用

你需要准备一个账户token: [了解如何创建token](https://github.com/settings/tokens)

并将它作为需要自动生成 release note 仓库的 secret [了解如何创建secret](https://docs.github.com/zh/actions/security-guides/using-secrets-in-github-actions)

## 开始使用

```yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - run: npx @changelog-tags/github
        env:
          RELEASE_TOKEN: ${{secrets.TOKEN_FOR_ACTIONS}}
```

## todo

emoji支持

commit 分组

shallow clone

## License

[MIT License](./LICENSE)

<!-- Badges -->

[npm-package-href]: https://npmjs.com/package/@changelog-tags/github
[npm-monthly-downloads-src]: https://img.shields.io/npm/dm/@changelog-tags/github.svg?style=flat-square
[npm-monthly-downloads-href]: http://npm-stat.com/charts.html?package=@changelog-tags/github&from=2024-03-16
[npm-version-src]: https://img.shields.io/npm/v/@changelog-tags/github/latest.svg?style=flat-square
[license-src]: https://img.shields.io/npm/l/@changelog-tags/github.svg?style=flat-square
