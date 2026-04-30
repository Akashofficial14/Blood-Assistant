const responseUtil = require("../utills/response.utill");

const errorMiddleware = async (err, req, res, next) => {
  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
  const message = err.message || "Internal server error";

  if (statusCode === 400) {
    return responseUtil.badRequest(res, {}, message);
  }

  if (statusCode === 404) {
    return responseUtil.notFound(res, {}, message);
  }

  if (statusCode === 500) {
    return responseUtil.internalError(res, {}, message);
  }

  return responseUtil.error(res, statusCode, message, {});
}
module.exports = { errorMiddleware }
