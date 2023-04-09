const httpStatus = require('http-status');
const mongoose= require('mongoose');
const Client = require('../../models/client/user');
const ApiError   = require("../../utils/ApiError");


let settingsController = {};


settingsController.updateProfile = async function(req,res, next) {

    try {
        const userId = req.id;
        const updates = req.body;
        const allowedUpdates = ['firstName', 'lastName', 'email', 'countryCode', 'phoneNumber', 'address', 'country', 'gender', 'password'];
        const isValidOperation = updates && Object.keys(updates).every(update => allowedUpdates.includes(update));
    
        if (!isValidOperation) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid updates!');
        }
        
        const user = await Client.findById(userId);
    
        if (!user) {
          throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
        }

        allowedUpdates.forEach(update => {
          if (updates[update]) {
            user[update] = updates[update];
          }
        });
    
        await user.save();
    
        res.status(httpStatus.OK).json({ message: 'User updated successfully!', user });
      } catch (error) {
        next(error);
      }
}


module.exports = settingsController;
