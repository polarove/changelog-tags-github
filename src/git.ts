import { Commit, TagFrom, TagTo } from '.'
import { execute } from '.'

export const getLatestTwoTags = async (from?: TagFrom, to?: TagTo) => {
  if (from && to) return { previous: from, latest: to }
  const tags = await execute('git', [
    'for-each-ref',
    'refs/tags',
    '--sort=-taggerdate',
    '--format=%(refname:short)',
    '--count=2'
  ])
  const previous = tags.split('\n')[1]
  const latest = tags.split('\n')[0]
  return { previous, latest }
}

export const getCommitBetweenTags = async (
  from: TagFrom,
  to: TagTo,
  pure: boolean = false
): Promise<Commit[]> => {
  const commits = await execute('git', [
    'log',
    '--pretty=format:{"hash": "%H", "author": "%cn", "email": "%ce", "date": "%ai", "subject": "%s"},',
    `${from}...${to}`
  ])
  return pure
    ? commits
    : JSON.parse('['.concat(commits).slice(0, commits.length).concat(']'))
}
