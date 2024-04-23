import { env } from 'process'
import { readFileSync } from 'fs'
import { Octokit } from 'octokit'
import { failedWithLogs } from './logs.js'

// const GITHUB_TOKEN = env['GITHUB_TOKEN']
// const RELEASE_TOKEN = env['RELEASE_TOKEN']
// console.log('GITHUB_TOKEN: ', env['GITHUB_TOKEN'])
// console.log('RELEASE_TOKEN: ', env['RELEASE_TOKEN'])
// console.log('NPM_TOKEN: ', env['NODE_AUTH_TOKEN'])

// const octokit = new Octokit({
//   auth: RELEASE_TOKEN,
//   timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//   userAgent: '@polarove/release-by-tags'
// })
// const { data: user } = await octokit.rest.users.getAuthenticated()
// console.log('username:', user.login)

const catchEnv = (name: string) => {
  const value = env[name]
  if (value) return Promise.resolve(value)
  else return Promise.reject(`未找到名为${name}的环境变量`)
}

const versionNumber = JSON.parse(
  readFileSync('./package.json', { encoding: 'utf-8' })
).version as string

const vVersion = 'v'.concat(versionNumber)

catchEnv('RELEASE_TOKEN')
  .then(async (auth) => {
    const userAgent = `@polarove/releaseBetweenTags/${vVersion}`
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const octokit = new Octokit({
      auth,
      timeZone,
      userAgent
    })
    const { data: user } = await octokit.rest.users.getAuthenticated()
    console.log('username:', user.login)
  })
  .catch((err) => failedWithLogs(err))
