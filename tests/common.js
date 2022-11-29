/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const Login = async (username, password, page) => {
  await page.locator("#txtUserID").type(username);
  await page.locator("#txtPassword").type(password);
  await page.locator("#submit_row .loginButton").click();
};

const getFormattedDate = (date) => {
  if (!date) {
    return date;
  }
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  return formattedDate;
};

const getFutureDate = () => {
  const today = new Date();
  // const theLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  // add 2 days to today
  const futureDate = new Date(today.setDate(today.getDate() + 2));
  // Need to get leading zeroes on single digit months and 4 digit year
  const formattedFuturedate = getFormattedDate(futureDate);
  return formattedFuturedate;
};

module.exports = {
  Login,
  getFutureDate,
};
