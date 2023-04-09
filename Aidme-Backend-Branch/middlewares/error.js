const httpStatus = require("http-status");
const ApiError   = require("../utils/ApiError");
const config     = require("../config/config")

const errorConverter = (error, req, res, next) => {
    console.log(error)
}


const errorHandler = (error, req, res, next) => {
   console.log(error);
}

module.exports = { errorHandler, errorConverter }
