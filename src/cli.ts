import { cac } from 'cac'
import { version } from '../package.json'
import {
  CliOptions,
  RELEASE_TOKEN,
  failedWithLog,
  catchEnv,
  finishedWithLog,
  packageName,
  parseLog
} from '.'
import { sendReleaseToGithub, generate } from './factory'
import { writeFileSync } from 'fs'
import { green } from 'kolorist'

const cli = cac('release-by-tags')
cli
  .version(version)
  .option(
    '-t, --token <path>',
    `Github actions 的 yml 文件中指定的名为 ${RELEASE_TOKEN} 的环境变量`
  )
  .option('--from <ref>', '从指定tag开始，默认值为最新tag的前一个tag')
  .option('--to <ref>', '到指定tag结束，默认值为最新tag')
  .option(
    '--github <path>',
    '指定 github 仓库地址，如 polarove/release-by-tags，默认为当前项目的origin远程分支'
  )
  .option('--title <title>', '本次发版的标题，默认为版本号，如v1.0.0')
  .option(
    '--pre, --prerelease',
    '标记为预发布版本，即测试不全，功能不稳定的版本'
  )
  .option(
    '-d, --draft',
    '标记为蓝图版本，即测试已通过、功能已完善，但需要用户反馈来进一步改进'
  )
  .option(
    '--output <path>',
    '将 release note 写入本地文件，而不是发布到 Github'
  )
  .help()

cli.command('').action(async (args: CliOptions) => {
  console.log(`---------------------${packageName}------------------------`)
  console.log(parseLog('...处理中'))
  await catchEnv(`${RELEASE_TOKEN}`)
    .then((envToken) => (args.token = args.token || envToken))
    .catch((err) => failedWithLog(err))
  try {
    const { config, md } = await generate(args)
    if (typeof args.output === 'string') {
      writeFileSync(args.output, md)
      finishedWithLog(green(`已保存至 ${args.output}`))
    }
    await sendReleaseToGithub(config, md)
    finishedWithLog(green('已发布到Github'))
  } catch (err) {
    failedWithLog(err as string)
  }
})

cli.parse()
