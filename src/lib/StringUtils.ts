/**
 * 檔案 src/lib/StringUtils.ts 
 */
export class StringUtils {
    /**
     * 將一句英文裏每個字的第一個字母變成大寫。
     * @param str 待處理的字串
     * @returns 字首大寫的字串
     */
	public static capitalize(str: string): string {
        return str.replace(/\b\w/g, (v, offset) => {
            if(str[offset - 1] != "'") {
                return v.toUpperCase()
            } else {
                return v
            }
        });
    }
}
