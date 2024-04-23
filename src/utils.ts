/**
 *
 * @param str 需要裁剪的字符串
 * @param identifier 标识符
 * @param recursion 重复执行的次数
 * @param includes 返回值是否包含标识符
 * @example getStringAfter('124/23526', '/') => '23526'
 */
export const getStringAfter = (
    str: string,
    identifier: string,
    recursion: number = 1,
    includes: boolean = false
): string => {
    if (!str.includes(identifier)) return str
    let times = 0
    const knife = (str: string): string | undefined => {
        str = str.slice(
            str.indexOf(identifier) + (includes ? 0 : 1),
            str.length
        )
        times += 1
        if (recursion > 1 && times < recursion) {
            return knife(includes ? str.slice(1, str.length) : str)
        } else return str
    }
    return knife(str)!
}
