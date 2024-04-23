import { env } from 'process'
import { readFileSync } from 'fs'
import { Octokit } from 'octokit'
import { failedWithLogs } from './logs.js'
import { getStringAfter } from './utils.js'

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

const generate = async () => {
  const RELEASE_TOKEN = await catchEnv('RELEASE_TOKEN')
  const userAgent = `@polarove/releaseBetweenTags/${vVersion}`
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const octokit = new Octokit({
    auth: RELEASE_TOKEN,
    timeZone,
    userAgent
  })

  const { data: user } = await octokit.rest.users.getAuthenticated()

  const repository = await catchEnv('GITHUB_REPOSITORY')
  const repoName = getStringAfter(repository, '/')
  console.log(repository, repoName)

  await octokit.request('POST /repos/{owner}/{repo}/releases', {
    owner: user.login,
    repo: repoName,
    tag_name: vVersion,
    name: vVersion,
    body: 'Description of the release',
    draft: false,
    prerelease: false,
    generate_release_notes: false,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
}
await generate()
