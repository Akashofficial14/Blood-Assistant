
function sendResponse(res, status, success, message, data = {}, error = null) {
    return res.status(status).send({ 
        status, 
        success, 
        message, 
        data, 
        error 
    });
}

/**
 * Success Responses
 */
const success = (res, data = {}, message = "Success") => {
    return sendResponse(res, 200, true, message, data);
};

const created = (res, data = {}, message = "successfully created") => {
    return sendResponse(res, 201, true, message, data);
};

const updated = (res, data = {}, message = "successfully updated") => {
    return sendResponse(res, 200, true, message, data);
};

const deleted = (res, data = {}, message = "successfully deleted") => {
    return sendResponse(res, 200, true, message, data);
};

/**
 * Error Responses
 */
const notFound = (res, data = {}, message = "Page not found") => {
    return sendResponse(res, 404, false, message, data);
};

const badRequest = (res, data = {}, message = "Bad request") => {
    return sendResponse(res, 400, false, message, data);
};

const internalError = (res, data = {}, message = "Internal server error") => {
    return sendResponse(res, 500, false, message, data);
};

const error = (res, status = 500, message = "Internal server error", data = {}) => {
    return sendResponse(res, status, false, message, data);
};

// CommonJS Export
module.exports = {
    success,
    created,
    updated,
    deleted,
    notFound,
    badRequest,
    internalError,
    error
};