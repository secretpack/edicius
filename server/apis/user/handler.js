const utils = require("../../utils/utils");
const { success, error } = require("../../utils/exception_handler");
const config = require("../../configuration/config");

// Database library
const User = require("../../models/User");
const { get_jwt_token } = require("../../service/token.service");

const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");

module.exports.register = async (event) => {
  // const _queryParam = event.queryStringParameters;
  const _queryParam = JSON.parse(event.body);
  // console.log(_queryParam);
  try {
    var _records_info = await axios.post(
      config.server_info.concat("/dev/user/check"),
      _queryParam,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.log(err);
    return error("some errors in register handler");
  }
  console.log(_records_info.data);
  if (_records_info.data.status === "success") {
    await User.insertNewUser(_queryParam);
    return success("register successful");
  } else {
    return error("user already exists");
  }
};
module.exports.login = async (event) => {
  // const _queryParam = event.queryStringParameters;
  const _queryParam = JSON.parse(event.body);

  if (!utils.hasKeys(_queryParam, ["userid", "userpw"])) {
    return error("access error");
  }
  try {
    var _information = await User.findUserRecords(_queryParam);
    if (_information.length > 1) {
      // there are no records more than 1 row (critical security exception)
      return error("duplicated users (contact admin)");
    } else if (_information.length < 1) {
      return error("login failed");
    }
    // Now, there is only one record matched user
    // JWT Token generation logic will be implement to below
  } catch (err) {
    return error("some errors in login handler");
  }
  const token = await get_jwt_token(_information[0]);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      {
        status: "success",
        message: "login successful",
        token: token,
        userid: _information[0].userid,
      },
      null,
      2
    ),
  };
};

module.exports.nickname = async (event) => {
  const { nickname, token } = JSON.parse(event.body);
  try {
    const { userid } = jwt.verify(token, config.secret);
    const result = await User.changeNickname(userid, nickname);

    if (result === false) {
      throw "Nickname setting error";
    }
    return success({ success: true });
  } catch (err) {
    console.log(err);
    return error(err);
  }
};

module.exports.profile = async (event) => {
  const param = JSON.parse(event.body);

  if (!utils.hasKeys(param, ["token"])) {
    return error("access error");
  }
  try {
    const { userid, userpw } = jwt.verify(param.token, config.secret);

    const _fetched = await User.findOne({ userid: userid, userpw: userpw });
    if (_fetched.length !== 1) {
      return error({ status: "failed", message: "some errors in user record" });
    }
    return success(_fetched[0]);
  } catch (err) {
    return error(err);
  }
};

module.exports.check = async (event) => {
  // const _queryParam = event.queryStringParameters;
  console.log(event.body);
  const _queryParam = JSON.parse(event.body);

  if (!utils.hasKeys(_queryParam, ["userid", "userpw"])) {
    // exception code 400 : missing arguments
    return error("access error");
  }
  const _fetched = await User.findOne(_queryParam);

  if (_fetched.length >= 1) {
    // exception code 300 : existing record
    return error({ status: "failed", message: "existing record" });
  }
  return success("no record");
};
module.exports.delete = async (event) => {
  //const _queryParam = event.queryStringParameters;
  const _queryParam = querystring.stringify(event.body);

  if (!utils.hasKeys(_queryParam, ["userid", "userpw", "token"])) {
    return error("access error");
  }
  try {
    const { token } = _queryParam;
    const decoded = await jwt.verify(token, config.secret);
  } catch (err) {
    return error(err);
  }
  // We need to check received user token information for user record accessibility
  const status = await User.deleteUser(_queryParam);
  if (status) {
    return success("delete complete");
  } else {
    return error("some errors in delete handler");
  }
};

module.exports.logout = async (event) => {
  const param = JSON.parse(event.body);
  if (!utils.hasKeys(param, ["token"])) {
    return error("invalid token");
  }
};

module.exports.token_test = async (event) => {
  const _queryParam = event.queryStringParameters;

  if (!utils.hasKeys(_queryParam, ["token"])) {
    return error("access error");
  }
  try {
    const { token } = _queryParam;
    var decoded = jwt.verify(token, config.secret);
    return success(decoded);
  } catch (err) {
    return error(err);
  }
};
