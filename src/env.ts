import { env } from 'process'

export const catchEnv = async (name: string): Promise<string> => {
  process.env[name] = '15235'
  const value = env[name]
  if (value) return Promise.resolve(value)
  else return Promise.reject(`未找到名为${name}的环境变量`)
}
