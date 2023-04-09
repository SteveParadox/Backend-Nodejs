const _ = process.env

const developmentMode = {
   PORT: _.PORT,
   DB_URI: `mongodb+srv://${_.DB_USER}:${_.DB_PASS}@${_.DB_HOST}/?retryWrites=true&w=majority`,
   MAIL_HOST: _.MAIL_TEST_HOST,
   MAIL_PORT: _.MAIL_TEST_PORT,
   MAIL_USER:  _.MAIL_TEST_USER,
   MAIL_PASS:  _.MAIL_TEST_PASS
}

const productionMode = {
   PORT: _.PORT,
   DB_URI: `mongodb+srv://${_.DB_USER}:${_.DB_PASS}@${_.DB_HOST}/?retryWrites=true&w=majority`,
   MAIL_HOST: _.MAIL_TEST_HOST,
   MAIL_PORT: _.MAIL_TEST_PORT,
   MAIL_USER:  _.MAIL_TEST_USER,
   MAIL_PASS:  _.MAIL_TEST_PASS
}

// smth here
module.exports = Object.assign({
    validCors: [/^(http|https):\/\/(localhost:|517+\d|aidme.onrender.com)+$/],
    mode:  _.NODE_ENV === "production" ? "Production" : "Development",
    JWT_SECRETKEY: _.JWT_SECRETKEY,
    JWT_EXPIRES_IN: _.JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: _.JWT_REFRESH_EXPIRES_IN
}, _.NODE_ENV === "production" ? productionMode : developmentMode);


