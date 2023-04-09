const express     = require('express');
require('dotenv').config()
const compression = require('compression')
const helmet      =  require("helmet")
const cors        = require("cors")
const httpStatus  = require("http-status")
const Routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const limiter = require("./middlewares/rate-limiter");
const ApiError = require("./utils/ApiError");
const config = require("./config/config")

// initialize express app
const app = express();

// gzip compression
app.use(compression())

// secure http headers
app.use(helmet())

// parse JSON body req
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({extended: true}));


// cross-origin
const corsOptions = {
   	methods: ["GET", "POST", "PUT", "DELETE"],
	origin: config.validCors,
	optionSuccessStatus: 200,
	headers: ["Content-Type", "Authorization", "x-access-token"],
	// credentials: true, 
	maxAge: 3600,
	preflightContinue: true, 
}
app.use(cors(corsOptions))
app.options("*", cors(corsOptions));


// limit number of request per timing to api route.
if(config.env === "production") {
    app.use("/v1", limiter);
}

// when parent url request
app.get('/', (req,res,next) => {
   res.status(200).send("Please request our api at /v1")
})

// v1 api routes
app.use("/v1", Routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
	throw new ApiError(httpStatus.NOT_FOUND, "Link not found");
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
// export app
module.exports = app;

