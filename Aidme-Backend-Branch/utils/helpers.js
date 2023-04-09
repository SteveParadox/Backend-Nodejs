const bcrypt = require("bcrypt");
const httpStatus = require("http-status");
const ApiError = require("./ApiError");

let helper = {};


helper.acceptableCountries = ['nigeria'];
helper.acceptableGender    =  ['male', 'female']


helper.comparePassword = async function(oldPassword, newPassword) {
    try {
        const compare = await bcrypt.compare(newPassword, oldPassword);
        return compare;
    } catch (error) {
        throw new ApiError("Error with comparing password", httpStatus.BAD_REQUEST, error)
    }
}

helper.filterObjectData = function(createData, access="", refresh="") {
    return {
        firstname: createData.firstName,
        lastname: createData.lastName,
        country: createData.country,
        gender: createData.gender,
        email: createData.email,
        isVerified: createData.isVerified,
        blacklist: createData.blacklist,
        accessToken: access.accessToken,
        refreshToken: refresh.refreshToken
    }
}
module.exports = helper;

