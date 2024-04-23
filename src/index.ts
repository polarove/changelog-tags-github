import { env } from 'process'
// import { readFileSync } from 'fs'
// import { Octokit } from 'octokit'
// import { failedWithLogs } from './logs.js'

console.log('GITHUB_TOKEN: ', env['GITHUB_TOKEN'])
console.log('TOKEN_FOR_ACTIONS: ', env['TOKEN_FOR_ACTIONS'])
console.log('NPM_TOKEN: ', env['NPM_TOKEN'])

// const catchEnv = (name: string) => {
//   const value = env[name]
//   if (value) return Promise.resolve(value)
//   else return Promise.reject(`未找到名为${name}的环境变量`)
// }

// const versionNumber = JSON.parse(
//   readFileSync('./package.json', { encoding: 'utf-8' })
// ).version as string

// const vVersion = 'v'.concat(versionNumber)

// catchEnv('RELEASE_TOKEN')
//   .then(async (auth) => {
//     console.log('GITHUB_TOKEN', env['GITHUB_TOKEN'])
//     console.log('RELEASE_TOKEN', auth)
//     const userAgent = `@polarove/releaseBetweenTags/${vVersion}`
//     const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
//     const octokit = new Octokit({
//       auth,
//       userAgent,
//       timeZone
//     })
//     const { data: user } = await octokit.rest.users.getAuthenticated()
//     console.log('username:', user.login)
//   })
//   .catch((err) => failedWithLogs(err))
