/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (typeof size === "undefined") {
    return string;
  }
  if (size === 0) {
    return "";
  }
  let result = "";
  let count = 0;
  let prevChar = "";
  for (const char of string) {
    if (char !== prevChar) {
      count = 1;
      prevChar = char;
      result += char;
    } else {
      if (count < size) {
        result += char;
        count++;
      }
    }
  }

  return result;
}
