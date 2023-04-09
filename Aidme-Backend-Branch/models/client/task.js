const { Schema, model, ObjectId } = require('mongoose');
const User = require('../../models/client/user')


// Address Schema
const AddressSchema = new Schema({
  _id: ObjectId,
  street: {
    type: String,
    required: [true, 'Street is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
  },
  
  zipCode: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[0-9]{5}(?:-[0-9]{4})?$/.test(v);
      },
      message: props => `${props.value} is not a valid ZIP code!`
    }
  },
});

// Task Option Schema
const TaskOptionSchema = new Schema({
  _id: ObjectId,
  size: {
      type: String,
      required: [true, 'Size is required'],
      enum: {
        values: ['small', 'medium', 'large'],
        message: 'Size must be one of small, medium, or large'
      }
  }
});

// Task Schema
const TaskSchema = new Schema({
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  errander: {
    type: ObjectId,
  },
  startAddress: {
    type: ObjectId,
    ref: 'Address',
    required: true
  },
  endAddress: {
    type: ObjectId,
    ref: 'Address',
    required: true
  },
  taskOption: {
    type: ObjectId,
    ref: 'TaskOption',
    required: true
  },
  vehicleRequirement: {
    type: String,
    enum: {
      values: ['none', 'car', 'truck'],
      message: 'Vehicle requirement must be none, car, or truck'
    }
  },
  taskDetail: {
    type: String,
    required: [true, 'Task detail is required']
  },
  startDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return new Date(v) !== "Invalid Date" && !isNaN(new Date(v));
      },
      message: props => `${props.value} is not a valid date!`
    }
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return new Date(v) !== "Invalid Date" && !isNaN(new Date(v));
      },
      message: props => `${props.value} is not a valid date!`
    }
  },
  status: {
    type: String,
    default: 'open',
    enum: {
      values: ['open', 'in progress', 'completed'],
      message: 'Status must be either in progress or completed'
    }
  }
},
   { 
  timestamps: { 
    createdAt: 'created_at',
   updatedAt: 'updated_at' 
  }
});


const Task = model('Task', TaskSchema);
const TaskOption = model('TaskOption', TaskOptionSchema);
const Address = model('Address', AddressSchema);

module.exports = { Task, TaskOption, Address };

