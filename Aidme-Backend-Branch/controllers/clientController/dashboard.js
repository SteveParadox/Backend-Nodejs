const httpStatus = require('http-status');
const mongoose= require('mongoose');
const { Task, Address, TaskOption } = require('../../models/client/task');
const axios = require('axios');


let dashboardController = {};


dashboardController.createTask = async function(req,res) {
  try {
      const { startAddress,
            endAddress, taskOption, taskDetail, vehicleRequirement, startDate, dueDate, status, budget } = req.body;

       
       const startAddressDoc = await Address.create({
        _id: new mongoose.Types.ObjectId(),
        ...startAddress
      });
      
      const endAddressDoc = await Address.create({
        _id: new mongoose.Types.ObjectId(),
        ...endAddress
      });

       // Get the user ID from the JWT authorization key
       const userId = req.id;


        // Create task option 
        const taskOptionDoc = await TaskOption.create({
            _id: new mongoose.Types.ObjectId(),
            ...taskOption
          });

        //Create the task
        const task = new Task({
            _id: new mongoose.Types.ObjectId(),
            startAddress: startAddressDoc,
            endAddress: endAddressDoc,
            taskOption: taskOptionDoc,
            user : userId,
            taskDetail,
            vehicleRequirement,
            startDate,
            dueDate,
            status,
            budget
        });
    
        await task.save();

        res.status(httpStatus.CREATED).json(task);
    } catch (err) {
       console.error(err);
       res.status(httpStatus.BAD_REQUEST).send(err);
   }
}

dashboardController.trackTask = async function(req,res) {

  const {status} = req.query;

  if (status !== 'open' && status !== 'in progress' && status !== 'completed') {
   return res.status(httpStatus.BAD_REQUEST).json({ error: 'Invalid status parameter' });
  }

  try {
    const tasks = await Task.find({ status });
    res.json(tasks);
  } catch (err) {
    next(err);
  }


};


module.exports = dashboardController;
