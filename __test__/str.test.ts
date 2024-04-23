import { strip } from '../src/utils.js'
import { test, expect } from 'vitest'

test('获取指定标识符后的字符串', () => {
  expect(strip('polarove/test-github-api/test', '/', 2, true)).toBe('/test')
  expect(strip('polarove/test-github-api/test', '/', 2, false)).toBe('test')
  expect(strip('polarove/test-github-api/test', '/', 1, true)).toBe(
    '/test-github-api/test'
  )
  expect(strip('polarove/test-github-api/test', '/', 1, false)).toBe(
    'test-github-api/test'
  )
  expect(strip('polarove/test-github-api', '/', 1, false)).toBe(
    'test-github-api'
  )
  expect(strip('polarove/test-github-api', '/', 1, true)).toBe(
    '/test-github-api'
  )
  expect(strip('polarove', '/', 1, true)).toBe('polarove')
  expect(strip('polarove', '/', 1, false)).toBe('polarove')
  expect(strip('polarove/', '/', 1, true)).toBe('/')
  expect(strip('polarove/', '/', 1, false)).toBe('')
})

test('截取字符串', () => {
  expect('asfsfdasfldfkhjdgfohloklilomodpb'.slice(0, 7)).toBe('asfsfda')
})
