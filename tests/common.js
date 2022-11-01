/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const Login = async (username, password, page) => {
  await page.locator("#txtUserID").type(username);
  await page.locator("#txtPassword").type(password);
  await page.locator("#submit_row .loginButton").click();
};

const getNextDay = () => {
  const today = new Date();
  const theLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  // add 1 day to today
  const nextDay = new Date(today.setDate(today.getDate() + 1));
  // Need to get leading zeroes on single digit months and 4 digit year
  return nextDay.toLocaleDateString(theLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

module.exports = {
  Login,
  getNextDay,
};
