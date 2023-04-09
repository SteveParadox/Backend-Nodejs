const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path")
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken')
const httpStatus = require('http-status');
const ApiError   = require("../../utils/ApiError");
const config = require('../../config/config');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  countryCode: {
      type: String,
      required:true,
      trim: true
  },
 
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [],
  isBlacklisted: {
   type: Boolean,
   default: false
  },
  isVerified: {
      type: Boolean,
      default: false,
  }
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    let saltRounds = 8;
    try {
        const hashPassword = await bcrypt.hash(this.password, saltRounds)
        this.password = hashPassword
    } catch (error) {
        throw new ApiError("Bcrypt error", httpStatus.BAD_REQUEST,  error)
    }
})

userSchema.method({
    generateToken: async function(id, email) {
        try {
            const payload = {id, email}
            const privateKey = await fs.readFileSync(path.join(path.resolve(__dirname, "../.."), "/cert/key.pem"));
            var token = await jwt.sign(payload, config.JWT_SECRETKEY, {expiresIn: config.JWT_EXPIRES_IN});

            if(token){
                if(this.tokens.length < 1) this.tokens.push({accessToken: token})
                // keep token in virtual
                await updateToken(this.id, {...this.tokens, accessToken: token});
                return {accessToken: token}
            }
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    },

    generateRefreshToken: async function(accesstoken, reqNewAcessToken) {
        // verify token
        const decoded = await jwt.verify(accesstoken, config.JWT_SECRETKEY);

        if(decoded.id === this.id) {            
            const payload = {id: decoded.id, email: decoded.email}
            const privateKey = await fs.readFileSync(path.join(path.resolve(__dirname, "../.."), "/cert/key.pem"));
            var refreshToken = await jwt.sign(payload, config.JWT_SECRETKEY, {expiresIn: config.JWT_REFRESH_EXPIRES_IN});

            //generate new accessToken
            let accessToken;
            if(reqNewAcessToken) {
                accesstoken =  await this.generateToken(decoded.id, decoded.email)
            }

            const returnTokens = {accessToken, refreshToken}
            if(!reqNewAcessToken) delete returnTokens.accessToken;

            return returnTokens
        }
    }
})


const Errander = mongoose.model('Errander', userSchema);

module.exports = Errander;



async function updateToken(id, token){
    try {
       await Errander.findByIdAndUpdate(id, {$set: {tokens: [token]}});
    } catch (error) {
        console.log(error)
        throw new ApiError("SomthingWentWrong", httpStatus.BAD_REQUEST, error)
    }
}

