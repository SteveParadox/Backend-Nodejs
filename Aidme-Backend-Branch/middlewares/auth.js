const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const ClientModel = require("../models/client/user");
const ErranderModel = require("../models/errander/user");
const ApiError = require("../utils/ApiError");


// Client Authorization Handler
const ClientAuth = async function(req,res,next) {
  const bearerToken = req.headers['authorization'].replace("Bearer ", "");
  // DO SOME JWT VERIFICATION
  

 try {
     if(bearerToken) {
         const decoded = await jwt.verify(bearerToken, config.JWT_SECRETKEY);
         //check user
         const ifUserExist = await ClientModel.findById( {_id: decoded.id} );
        
         if(!ifUserExist) {
             throw new ApiError("Unauthorized user", httpStatus.NOT_FOUND, "We couldn't find user")
         }

         // check if token is registered
         const filterTokens = ifUserExist.tokens.filter(({accessToken}) => {
             if(bearerToken !== accessToken){
                 throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Account has been logged out")
             }
         })

         // if user isBlacklisted
         if(ifUserExist.isBlacklisted){
             throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Sorry this Account has been susended")
         }

         if(!ifUserExist.isVerified){
             throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Unverified account, You are not meant to be here")
         }

         req.id = ifUserExist.id;
         next()
     }else {
         throw new ApiError("Unauthorization user", httpStatus.UNAUTHORIZED, "no bearer token")
     }
    
 } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error)
 }
}


// Errander Authorization Handler
const ErranderAuth = async function(req,res,next) {

  const bearerToken = req.headers['authorization'].replace("Bearer ", "");
  // DO SOME JWT VERIFICATION
 try {
     if(bearerToken) {
         const decoded = await jwt.verify(bearerToken, config.JWT_SECRETKEY);
         //check user
         const ifUserExist = await ErranderModel.findById( {_id: decoded.id} );
        
         if(!ifUserExist) {
             throw new ApiError("Unauthorized user", httpStatus.NOT_FOUND, "We couldn't find user")
         }

         // check if token is registered
         const filterTokens = ifUserExist.tokens.filter(({accessToken}) => {
             if(bearerToken !== accessToken){
                 throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Account has been logged out")
             }
         })


         // if user isBlacklisted
         if(ifUserExist.isBlacklisted){
             throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Sorry this Account has been susended")
         }

         if(!ifUserExist.isVerified){
             throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Unverified account, You are not meant to be here")
         }

         req.id = ifUserExist.id;
         next()
     }else {
         throw new ApiError("Unauthorization user", httpStatus.UNAUTHORIZED, "no bearer token")
     }
    
 } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error)
 }
}

module.exports = {ClientAuth, ErranderAuth};
