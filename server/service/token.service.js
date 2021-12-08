const config = require("../configuration/config");
const jwt = require("jsonwebtoken");

module.exports = {
  get_jwt_token,
};

async function get_jwt_token(user_info) {
  const { userid, userpw } = user_info;
  const token = jwt.sign({ userid: userid, userpw: userpw }, config.secret, {
    expiresIn: "7d",
  });

  return token;
}

function withoutPassword(userinfo) {
  const { password, ...withoutPasswordInfo } = userinfo;
  return withoutPasswordInfo;
}
