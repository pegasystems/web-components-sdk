/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const Login = async (username, password, page) => {
  await page.locator('#txtUserID').type(username);
  await page.locator('#txtPassword').type(password);
  await page.locator('#submit_row .loginButton').click();
};

const getAttributes = async element => {
  return await element.evaluate(async ele => ele.getAttributeNames());
};

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

const getNextDay = () => {
  const tomorrow = new Date();
  const theLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  // add 1 day to today
  tomorrow.setDate(new Date().getDate() + 1);
  // Need to get leading zeroes on single digit months and 4 digit year
  return tomorrow.toLocaleDateString(theLocale, { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getFormattedDate = date => {
  if (!date) {
    return date;
  }

  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const getFutureDate = () => {
  const today = new Date();
  // add 2 days to today
  const futureDate = new Date(today.setDate(today.getDate() + 2));

  // Need to get leading zeroes on single digit months and 4 digit year
  return getFormattedDate(futureDate);
};

module.exports = {
  Login,
  getNextDay,
  getAttributes,
  getFutureDate,
  getFormattedDate
};
