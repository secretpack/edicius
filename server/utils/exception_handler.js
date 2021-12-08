function create_message(status, message) {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ status: status, message: message }, null, 2),
  };
}

module.exports.exception_handler = async (errcode) => {
  switch (errcode) {
    case 300:
      return create_message("failed", "existing record");
    case 403:
      return create_message("failed", "missing arguments");
  }
};

module.exports.success = (message) => {
  var response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
  if (typeof message !== "string") {
    response.body = JSON.stringify(message, null, 2);
  } else {
    response.body = JSON.stringify(
      { status: "success", message: message },
      null,
      2
    );
  }
  return response;
};

module.exports.error = (error) => {
  var response = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
  if (typeof error !== "string" && "name" in error) {
    if (error.name === "TokenExpiredError") {
      response.statusCode = 419;
      response.body = JSON.stringify({ message: "Token expired" }, null, 2);
    } else if (error.name === "JsonWebTokenError") {
      response.statusCode = 401;
      response.body = JSON.stringify(
        { message: "Invalid token information" },
        null,
        2
      );
    }
  } else {
    response.statusCode = 200;
    if (typeof error === "string")
      response.body = JSON.stringify({ message: error }, null, 2);
    else response.body = JSON.stringify(error, null, 2);
  }
  return response;
};
