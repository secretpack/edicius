<<<<<<< HEAD
<<<<<<< HEAD
const User = require("../../models/User");

const { default: axios } = require("axios");

module.exports.modify_info = async (event) => {
  console.log(event);
  const _queryParam = event.queryStringParameters;
};
module.exports.alarm_setting = async (event) => {
  const { token, isChange } = event.queryStringParameters;

  var _decrypted_token = await User.decryptUserToken(token);

  var username = _decrypted_token[0];
  var password = _decrypted_token[1];

  try {
    var _records_info = await axios.get(
      config.server_url.concat("/dev/user/check"),
      {
        params: { username: username, password: password },
      }
    );
  } catch (err) {}

  if (_records_info.data.status === "failed") {
    // update database alarm column information
    // TODO
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        status: "success",
        message: "alarm setting successful",
      },
      null,
      2
    ),
  };
};
=======
=======
>>>>>>> jhlim_dev
const User = require("../../models/User");

const { default: axios } = require("axios");
const querystring = require("querystring");

module.exports.modify_info = async (event) => {
  console.log(event);
  const _queryParam = event.queryStringParameters;
  // const _queryParam = querystring.stringify(event.body);
};
module.exports.alarm_setting = async (event) => {
  const { token, isChange } = event.queryStringParameters;
  // const { token, isChange } = querystring.stringify(event.body);

  var _decrypted_token = await User.decryptUserToken(token);

  var username = _decrypted_token[0];
  var password = _decrypted_token[1];

  try {
    var _records_info = await axios.get(
      config.server_url.concat("/dev/user/check"),
      {
        params: { username: username, password: password },
      }
    );
  } catch (err) {}

  if (_records_info.data.status === "failed") {
    // update database alarm column information
    // TODO
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        status: "success",
        message: "alarm setting successful",
      },
      null,
      2
    ),
  };
};
<<<<<<< HEAD
>>>>>>> jhlim_dev
=======
>>>>>>> jhlim_dev
