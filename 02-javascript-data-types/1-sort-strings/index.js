/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */

function mySort(arr) {
  const arrCopy = [...arr];
  arrCopy.sort((a, b) =>
    a.localeCompare(b, "ru", { sensitivity: "case", caseFirst: "upper" })
  );
  return arrCopy;
}

export function sortStrings(arr, param = "asc") {
  if (param === "asc") {
    return mySort(arr);
  } else if (param === "desc") {
    return mySort(arr).reverse();
  } else {
    return arr;
  }
}

console.log(sortStrings(["b", "c", "a"]));
