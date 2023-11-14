/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

const LOCALE_OPTIONS = { sensitivity: "case", caseFirst: "upper" };

function sortStringsAscending(arr) {
  const arrCopy = [...arr];
  arrCopy.sort((a, b) => a.localeCompare(b, "ru", LOCALE_OPTIONS));
  return arrCopy;
}

function sortStringsDescending(arr) {
  const arrCopy = [...arr];
  arrCopy.sort((a, b) => b.localeCompare(a, "ru", LOCALE_OPTIONS));
  return arrCopy;
}

export function sortStrings(arr, param = "asc") {
  const asc = sortStringsAscending(arr);
  const desc = sortStringsDescending(arr);
  return param === "desc" ? desc : asc;
}
