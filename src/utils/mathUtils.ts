/* eslint-disable class-methods-use-this */
class MathUtils {
  public static isNaturalNumber(number: Number): boolean {
    return number > 0 && Number.isInteger(number);
  }

  public static isNum(stringNumber: string): boolean {
    return !Number.isNaN(Number(stringNumber));
  }
}

export default MathUtils;
