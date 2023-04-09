const httpStatus = require('http-status');
const Client = require('../../models/client/user');
const send_mail = require('../../services/email-service');
const ApiError = require('../../utils/ApiError');
const { acceptableGender, acceptableCountries, comparePassword, filterObjectData } = require("../../utils/helpers")

let authController = {};


authController.register = async function(req, res, next) {
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        country,
        countryCode,
        gender,
        password
    } = req.body

    console.log(req.body)
  
    try {
        // sanitize req body.
        const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if (!firstName || !lastName || !emailReg.test(email) || phoneNumber.length < 8 ||
            !address ||!countryCode || !acceptableCountries.includes(country) || !acceptableGender.includes(gender) ||
            !password
        ) {
            //throw new ApiError("WRONG CREDENTIALS", httpStatus.NOT_ACCEPTABLE, "Wrong credentials!")
            console.log(ApiError)
        }

        // futher validations
        // password -- what are we validating in password?

        // if user already exist?
        const ifExist = await Client.findOne({ email });

        if (ifExist) {
            throw new ApiError("AVOID DUPLICATE", httpStatus.NOT_ACCEPTABLE, "User already exists")
        }

        const createData = new Client({
            firstName,
            lastName,
            email,
            phoneNumber,
            address,
            country,
            countryCode,
            gender,
            password
        })
        const access = await createData.generateToken(createData.id, createData.email)
        const refresh = await createData.generateRefreshToken(access.accessToken, false)

        // verify email - TEST PURPOSE HERE
        const htmlMarkup = `
           <h2>Hello, ${firstName}</h2>
            <img src="cid:uniq-mailtrap.png" alt="mailtrap"/>
           <p>Welcome to Aidme, take a step further by verifying your account</p>
           <a href=/verifyAccount?email=${email}>Verify account</a>
        `
        const text = "Welcome to Aidme, take a step further by verifying your account"

        // Send using cb
       send_mail("Verification Link sent", text, htmlMarkup, email, async function(done, err) {
            if(err) {
                //throw new ApiError("Verification error", httpStatus.BAD_REQUEST,"Couldn't send Verification mail. check network connection")
                return res.status(httpStatus.BAD_REQUEST).send({message: "Couldn't send Verification mail. check network connection"})
            }

            await createData.save();
            res.status(httpStatus.CREATED).send({ message: "Verification link has been sent to your mailbox.", data: filterObjectData(createData, access, refresh) })
        })

    } catch (error) {
        console.log(error)
        res.status(httpStatus.BAD_REQUEST).send(error)
    }

}


authController.login = async function(req, res, next) {
    const { email, password } = req.body;

    let emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailReg.test(email) || !password.length) {
        throw new ApiError("WRONG CREDENTIALS", httpStatus.NOT_ACCEPTABLE, "Wrong credentials")
    }

    try {
        const ifExist = await Client.findOne({ email });
        if (!ifExist) {
            throw new ApiError("NO ACCOUNT", httpStatus.NOT_ACCEPTABLE, "Account doesn't exist!")
        }

        const oldPassword = ifExist.password;
        if ( !(await comparePassword(oldPassword, password)) ) {
            throw new ApiError("WRONG PASSWORD", httpStatus.NOT_ACCEPTABLE, "Incorrect credentials")
        }

        // if blacklisted
        if (ifExist.isBlacklisted) {
            throw new ApiError("User Account Suspended", httpStatus.UNAUTHORIZED, "Sorry this Account has been susended")

        }

        if (!ifExist.isVerified) {
            throw new ApiError("Verify Account", httpStatus.UNAUTHORIZED, "Account is not verified")
        }
        const access = await ifExist.generateToken(ifExist.id, ifExist.email)
        const refresh = await ifExist.generateRefreshToken(access.accessToken, false)
        res.status(httpStatus.OK).send({ message: "Account is registered successfully", data: filterObjectData(ifExist, access, refresh) })

    } catch (error) {
        console.log(error)
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}


authController.forgetPassword = async function(req, res, next) {

}

module.exports = authController;
