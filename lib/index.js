import { env } from 'process';
import { readFileSync } from 'fs';
import { Octokit } from 'octokit';
import { getStringAfter } from './utils.js';
import { failedWithLogs } from './logs.js';
const catchEnv = (name) => {
    const value = env[name];
    if (value)
        return Promise.resolve(value);
    else
        return Promise.reject(`未找到名为${name}的环境变量`);
};
const versionNumber = JSON.parse(readFileSync('./package.json', { encoding: 'utf-8' })).version;
const vVersion = 'v'.concat(versionNumber);
const prepareRequest = () => {
    const userAgent = `@polarove/releaseBetweenTags/${vVersion}`;
    let auth = '';
    catchEnv('GITHUB_TOKEN')
        .then((token) => (auth = token))
        .catch((err) => failedWithLogs(err));
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return {
        userAgent,
        auth,
        timezone,
    };
};
const octokit = new Octokit(prepareRequest());
const { data: user } = await octokit.rest.users.getAuthenticated();
const createNewRelease = async () => {
    let data = {
        targetCommitish: '',
        repositoryName: '',
    };
    /** GITHUB_REF: 'refs/heads/master' */
    catchEnv('GITHUB_REF')
        .then((ref) => (data.targetCommitish = getStringAfter(ref, '/', 2)))
        .catch((err) => failedWithLogs(err));
    /** GITHUB_REF: 'username/repositoryname' */
    catchEnv('GITHUB_REPOSITORY')
        .then((repo) => (data.repositoryName = getStringAfter(repo, '/')))
        .catch((err) => failedWithLogs(err));
    await octokit.request('POST /repos/{owner}/{repo}/releases', {
        owner: user.login,
        repo: data.repositoryName,
        tag_name: vVersion,
        target_commitish: data.targetCommitish,
        name: vVersion,
        body: 'Description of the release',
        draft: false,
        prerelease: false,
        generate_release_notes: false,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
        },
    });
};
createNewRelease();
