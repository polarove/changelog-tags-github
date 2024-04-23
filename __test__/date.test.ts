import { expect, test } from 'vitest'

test('时间字符串转日期 正例', () => {
  const dateStr = '2024-04-23 13:53:55 +0800'
  expect(typeof new Date(dateStr).getTime()).toBe('number')
})

test('时间字符串转日期 反例', () => {
  const dateStr = '2024-04-23 13:53:55 +0800afsw'
  expect(isNaN(new Date(dateStr).getTime())).toBe(true)
})
