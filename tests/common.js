/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const Login = async (username, password, page) => {
  await page.locator("#txtUserID").type(username);
  await page.locator("#txtPassword").type(password);
  await page.locator("#submit_row .loginButton").click();
};

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

const getNextDay = () => {
  const tomorrow = new Date();
  // add 1 day to today
  tomorrow.setDate(new Date().getDate() + 1);
  return tomorrow.toLocaleString().split(",")[0];
};

module.exports = {
  Login,
  getNextDay,
};
