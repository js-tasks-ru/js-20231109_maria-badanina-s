/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  let newObj = { ...obj };
  for (let value of Object.keys(obj)) {
    fields.forEach((el) =>
      el === value ? delete newObj[value] : null
    );
  }
  return newObj;
};
