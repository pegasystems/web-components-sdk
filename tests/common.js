/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const Login = async (username, password, page) => {
  await page.locator("#txtUserID").type(username);
  await page.locator("#txtPassword").type(password);
  await page.locator("#submit_row .loginButton").click();
};

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

const getNextDay = () => {
  const date = new Date();
  return [
    padTo2Digits(date.getDate()) + 1,
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('-');
}

module.exports = {
  Login,
  getNextDay
};
