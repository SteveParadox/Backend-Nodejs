const { Schema, model, ObjectId } = require('mongoose');
const user = require('../../models/client/user');
const task = require('../../models/client/task');


const budgetSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  budget: {
    amount: {
    type: Number,
    validate: {
        validator: function(v) {
        return !isNaN(v);
        },
        message: "Amount must be a valid number"
        }
      },
      currency: {
      type: String,
      default: "ngn",
      required: true
        }
      }
});

const billingSchema = new Schema({

});


//
//paymentInformation: {
  //  creditCardNumber: String,
    //expirationDate: Date,
    //cvv: String
  //}


const Budget = model('Budget', budgetSchema);
const Billing = model('Billing', billingSchema);

module.exports = { Budget, Billing };

