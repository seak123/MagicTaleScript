export default class StringUtil {
    static IsNullOrEmpty(str: string) {
        return str == null || str.length == 0;
    }
}