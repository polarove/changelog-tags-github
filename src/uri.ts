import { execute } from '.'

export const gitProtocal = (url: string) => {
  return /^(git@).+(.git){1}$/.test(url)
    ? url
    : url
        .replace(/^https:\/\//, 'git@')
        .replace(/\//, ':')
        .concat('.git')
}

export const httpsProtocal = (url: string) => {
  return /^(https:\/\/).+/.test(url)
    ? url
    : url
        .replace(/^git@/, 'https:')
        .replace(/:/, '/')
        .replace(/:/, '/')
        .replace(/\//, '://')
        .replace(/(.git){1}$/, '')
}

export const getDomain = (url: string) => {
  const https = httpsProtocal(url).match(
    /^(https:\/\/|git@)([^/\r\n]+)(\/[^\r\n]*)?/
  )!
  return https[1].concat(https[2])
}

export const getOriginUrl = async (protocal: 'git' | 'https' = 'https') => {
  const url = await execute('git', ['config', '--get', 'remote.origin.url'])
  return protocal === 'git' ? gitProtocal(url) : httpsProtocal(url)
}
