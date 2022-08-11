/**
 * Test if the input can be saved as a task name
 * @param {string} stringToTest - new name i.e
 * @returns boolean - yes if name is correct
 */
export const isTaskNameOk = (stringToTest) => {
  if (stringToTest.length >= 1 && stringToTest.length <= 30) return true;
  return false;
};
