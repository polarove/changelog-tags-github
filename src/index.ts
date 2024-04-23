import { env } from 'process'
import { readFileSync } from 'fs'
import { Octokit } from 'octokit'
import { failedWithLogs } from './logs.js'

const catchEnv = (name: string) => {
  const value = env[name]
  if (value) return Promise.resolve(value)
  else return Promise.reject(`未找到名为${name}的环境变量`)
}

const versionNumber = JSON.parse(
  readFileSync('./package.json', { encoding: 'utf-8' })
).version as string

const vVersion = 'v'.concat(versionNumber)

const prepareRequest = () => {
  const userAgent = `@polarove/releaseBetweenTags/${vVersion}`
  let auth = ''
  catchEnv('GITHUB_TOKEN')
    .then((token) => (auth = token))
    .catch((err) => failedWithLogs(err))
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return {
    userAgent,
    auth,
    timezone
  }
}

const octokit = new Octokit(prepareRequest())
const { data: user } = await octokit.rest.users.getAuthenticated()
console.log(user.login)
