import { exit } from 'process';
const parseLog = (message) => {
    return `[release-bytags]：${message}`;
};
export const failedWithLogs = (message) => {
    console.error(parseLog(message));
    exit(1);
};
