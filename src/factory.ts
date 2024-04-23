import { Octokit } from 'octokit'
import type { CliOptions, Commit } from '.'
import {
  GITHUB_REPOSITORY,
  RELEASE_TOKEN,
  catchEnv,
  getCommitBetweenTags,
  getDomain,
  getLatestTwoTags,
  getOriginUrl,
  strip
} from '.'
import { name } from '../package.json'

export const generate = async (config: CliOptions) => {
  const { previous, latest } = await getLatestTwoTags(config.from, config.to)
  console.log('previous: ', previous)
  console.log('latest', latest)
  config.title = config.title || latest
  config.from = config.from || previous
  config.to = config.to || latest
  config.token = config.token || (await catchEnv(RELEASE_TOKEN))
  config.github =
    config.github ||
    (await getOriginUrl()) ||
    strip(await catchEnv(GITHUB_REPOSITORY), '/')
  config.draft = config.draft || false
  config.prerelease = config.prerelease || false
  const commits = await getCommitBetweenTags(config.from, config.to)
  const md = parseMarkdown(commits, config.github)
  return { config, md }
}

const parseMarkdown = (commits: Commit[], github: string) => {
  const parseCommitLink = (hash: string) => {
    return github.concat('/commit/').concat(hash)
  }

  const parseSubject = (subject: string) => {
    return subject.length > 0 ? subject : '*本次提交没有提交信息*'
  }

  return commits.length
    ? commits
        .map((commit) =>
          `
    ### &nbsp;&nbsp;&nbsp;${parseSubject(commit.subject)}
    `
            .concat('')
            .concat(
              `[${commit.hash.slice(0, 7)}](${parseCommitLink(commit.hash)}) - [${commit.author}](${getDomain(github).concat('/').concat(commit.author)})`
            )
            .concat('')
        )
        .toString()
    : '## 没有变更记录'
}

export const sendReleaseToGithub = async (config: CliOptions, md: string) => {
  const userAgent = `@polarove/releaseBetweenTags`
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const octokit = new Octokit({
    auth: config.token,
    timeZone,
    userAgent
  })
  const { data: user } = await octokit.rest.users.getAuthenticated()
  if (user) console.log(`[${name}]：认证成功`)
  await octokit.request('POST /repos/{owner}/{repo}/releases', {
    owner: user.login,
    repo: config.github,
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
