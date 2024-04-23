import { exit } from 'process'

const parseLog = (message: string) => {
  return `[release-by-tags]：${message}`
}

export const failedWithLogs = (message: string) => {
  console.error(parseLog(message))
  exit(1)
}
