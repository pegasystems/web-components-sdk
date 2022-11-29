/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const Login = async (username, password, page) => {
  await page.locator("#txtUserID").type(username);
  await page.locator("#txtPassword").type(password);
  await page.locator("#submit_row .loginButton").click();
};

const getFutureDate = () => {
  const today = new Date();
  // hardcoding locale to en-GB as lion-input-date is always accepts Date in DD/MM/YYYY format
  const theLocale = "en-GB";
  // add 2 days to today
  const futureDate = new Date(today.setDate(today.getDate() + 1));
  // Need to get leading zeroes on single digit months and 4 digit year
  return futureDate.toLocaleDateString(theLocale, { day: "2-digit", month: "2-digit", year: "numeric" });
};

module.exports = {
  Login,
  getFutureDate,
};
