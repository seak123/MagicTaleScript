export default class MathUtil {
    public static readonly deg2Rad = 0.0174532924;
    public static readonly rad2Deg = 57.29578;

    public static clamp(value, min, max) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
}