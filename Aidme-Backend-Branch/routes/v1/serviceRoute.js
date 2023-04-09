const router = (require("express")).Router();
const serviceController = require("../../controllers/serviceController")

/**
    Get Countries, States, Flag, ...
    @method GET
**/

router.get("/getCountries", serviceController.getCountries)

/**
    Get Cities ...
    @method GET
**/

router.get("/getCities", serviceController.getCitiesCategory)

/**
    Get Task Categories
    @method GET
**/

router.get("/getTaskCategories", serviceController.getTaskCategories)

/**
    Get Task Categories
    @method GET
**/

router.get("/getAddress", serviceController.getAddress)


module.exports = router
