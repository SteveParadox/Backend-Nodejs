const router = (require('express')).Router();
 
const userController = require('../../../controllers/clientController/user');
const dashboardController = require('../../../controllers/clientController/dashboard');
const settingsController = require('../../../controllers/clientController/settings');
const {ClientAuth} = require('../../../middlewares/auth');

/**
    Verify User Account - UNPROTECTED
    @method GET
**/

router.get('/verifyUserAccount', userController.verifyUserAccount);


/** 
    GET USER- PROTECTED
    @method GET
 **/

router.get("/me", ClientAuth, userController.getMe)


/** 
    GET USER- PROTECTED
    @method POST
 **/

    router.post("/update/profile", ClientAuth, settingsController.updateProfile)

/**
    Logout - PROTECTED
    @method GET
**/
router.get("/logout", ClientAuth, userController.logout)

/** 
    GET USER- PROTECTED
    @method POST
 **/
    router.post("/create/task", ClientAuth, dashboardController.createTask)
    
/** 
    GET USER- PROTECTED
    @method GET
 **/
    router.get("/tasks", ClientAuth, dashboardController.trackTask)
    
module.exports = router

