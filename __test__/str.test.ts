import { getStringAfter } from '../src/utils.js'
import { test, expect } from 'vitest'

test('获取指定标识符后的字符串', () => {
    expect(getStringAfter('polarove/test-github-api/test', '/', 2, true)).toBe(
        '/test'
    )
    expect(getStringAfter('polarove/test-github-api/test', '/', 2, false)).toBe(
        'test'
    )
    expect(getStringAfter('polarove/test-github-api/test', '/', 1, true)).toBe(
        '/test-github-api/test'
    )
    expect(getStringAfter('polarove/test-github-api/test', '/', 1, false)).toBe(
        'test-github-api/test'
    )
    expect(getStringAfter('polarove/test-github-api', '/', 1, false)).toBe(
        'test-github-api'
    )
    expect(getStringAfter('polarove/test-github-api', '/', 1, true)).toBe(
        '/test-github-api'
    )
    expect(getStringAfter('polarove', '/', 1, true)).toBe('polarove')
    expect(getStringAfter('polarove', '/', 1, false)).toBe('polarove')
    expect(getStringAfter('polarove/', '/', 1, true)).toBe('/')
    expect(getStringAfter('polarove/', '/', 1, false)).toBe('')
})
