const User = require("../models/User");

module.exports.user_test = async (event) => {
  await User.createUserTable();

  const testAccount = { username: "test2", password: "test" };
  // await User.insertOne({ username: "test", password: "test" });
  console.log(await User.insertNewUser(testAccount));
};

module.exports.post_test = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(event, null, 2),
  };
};
