export interface CliOptions {
  token: string
  from: TagFrom
  to: TagTo
  /** github 仓库名 */
  github: string
  title: string
  prerelease: boolean
  draft: boolean
  output: string
}

export type TagFrom = string
export type TagTo = string

export interface Commit {
  hash: string
  author: string
  email: string
  date: string
  subject: string
}
