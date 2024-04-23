import { expect, test } from 'vitest'
import {
  getLatestTwoTags,
  getCommitBetweenTags,
  getOriginUrl,
  gitProtocal,
  httpsProtocal,
  getDomain
} from '../src'

test('获取最新的两个tag', async () => {
  const { previous, latest } = await getLatestTwoTags()
  console.log('previous:' + previous)
  console.log('latest:' + latest)
})

test('获取两个tag之间的commit', async () => {
  const commits = await getCommitBetweenTags('v1.0.5', 'v1.0.6')
  commits.forEach((commit) => console.log(commit))
})

test('获取当前origin分支的远程url', async () => {
  const originUrl = await getOriginUrl()
  console.log('远程地址：', originUrl)
  expect(originUrl).matches(/^(https:\/\/|git@){1}.+(.git)?$/)
})

test('远程地址由https转换为git协议', async () => {
  const gitUrl = 'git@github.com:polarove/release-by-tags.git'
  expect(gitProtocal(gitUrl)).toBe(gitUrl)

  const target = 'https://github.com/polarove/release-by-tags'
  expect(gitProtocal(target)).toBe(gitUrl)
})

test('远程地址由git转换为https协议', async () => {
  const httpsUrl = 'https://github.com/polarove/release-by-tags'
  expect(httpsProtocal(httpsUrl)).toBe(httpsUrl)

  const target = 'git@github.com:polarove/release-by-tags.git'
  expect(httpsProtocal(target)).toBe(httpsUrl)
})

test('获取域名', () => {
  const target = 'git@github.com:polarove/release-by-tags.git'
  expect(getDomain(target)).toBe('https://github.com')
  const targetHttps = 'https://github.com/polarove/release-by-tags'
  expect(getDomain(targetHttps)).toBe('https://github.com')
})
