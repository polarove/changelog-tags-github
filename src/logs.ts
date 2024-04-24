import { exit } from 'process'
import { PACKAGE_NAME } from './constant'
import { red } from 'kolorist'

export const parseLog = (message: string) => {
  return `[${PACKAGE_NAME}]：`.concat(message)
}

export const failedWithLog = (message: string) => {
  console.error(parseLog('❗ '.concat(red(message))))
  return exit(1)
}

export const finishedWithLog = (message: string) => {
  console.error(parseLog('✨ '.concat(red(message))))
  return exit(0)
}
