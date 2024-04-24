import { Octokit } from 'octokit'
import type { CliOptions, Commit } from '.'
import {
  GITHUB_REPOSITORY,
  RELEASE_TOKEN,
  catchEnv,
  getDomain,
  getOriginUrl,
  strip,
  parseLog,
  httpsProtocal,
  PACKAGE_NAME
} from '.'
import {
  getLatestTwoTags,
  getDetailedCommitsBetweenTags
} from '@changelog-tags/gitag'

export const generate = async (config: CliOptions) => {
  const { previous, latest } = await getLatestTwoTags()
  const github = config.github || (await getOriginUrl())
  config.title = config.title || latest
  config.from = config.from || previous
  config.to = config.to || latest
  config.draft = config.draft || false
  config.prerelease = config.prerelease || false
  config.github = github
  if (typeof config.output !== 'string') {
    config.token = config.token || (await catchEnv(RELEASE_TOKEN))
    config.github = github || strip(await catchEnv(GITHUB_REPOSITORY), '/')
  }
  const commits = await getDetailedCommitsBetweenTags(config.from, config.to)
  const md = parseMarkdown(commits, config.github)
  return { config, md }
}

const parseMarkdown = (commits: Commit[], github: string): string => {
  const parseCommitLink = (hash: string) => {
    return github + '/commit/' + hash
  }

  const parseSubject = (subject: string) => {
    return subject.length > 0 ? subject : '*本次提交没有提交信息*'
  }

  return commits.length
    ? commits
        .map((commit) => {
          const date = new Date(commit.date)
          return `### ${parseSubject(commit.subject)}`
            .concat('\n')
            .concat('\n')
            .concat(date.toLocaleString())
            .concat('\n')
            .concat(
              `[${commit.hash.slice(0, 7)}](${parseCommitLink(commit.hash)})`
            )
            .concat(' - ')
            .concat(
              `[${commit.author}](${getDomain(github).concat('/').concat(commit.author)})`
            )
            .concat('\n')
            .concat('\n')
        })
        .reduce((a, b) => a + b)
    : '### 没有变更记录'
}

export const sendReleaseToGithub = async (config: CliOptions, md: string) => {
  const userAgent = PACKAGE_NAME
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const octokit = new Octokit({
    auth: config.token,
    timeZone,
    userAgent
  })
  const { data: user } = await octokit.rest.users.getAuthenticated()
  if (user) console.log(parseLog(`✨ 仓库持有者认证成功 | ${user.login}`))
  const repo = httpsProtocal(config.github)
    .match(/^(https:\/\/|git@)([^/\r\n]+)(\/[^\r\n]*)(\/[^\r\n]*)/)![4]
    .replace(/\//, '')
  console.log(config)
  console.log(md)
  await octokit.request('POST /repos/{owner}/{repo}/releases', {
    owner: user.login,
    repo,
    tag_name: config.to,
    name: config.title,
    body: md,
    draft: config.draft,
    prerelease: config.prerelease,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
}
