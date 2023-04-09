"use strict";

const { reconstructFieldPath } = require('express-validator/src/select-fields');
const nodemailer = require('nodemailer')
const config = require("../config/config")
/**
 * 
 * @param {String} name 
 * @param {String} header 
 * @param {HTMLDivElement} subject 
 * @param {string} recipient 
 */
function send_mail(header,text,html,recipient, cb){
  var transport = nodemailer.createTransport({
     host: config.MAIL_HOST,
      port: config.MAIL_PORT,
     auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASS
    }
  });

  var mailOptions = {
    from: '"Aidme Team" <Aidme@aid.com>',
    to: recipient,
    subject: header,
    text,
    html,
    attachments: [
      {
        filename: 'mailtrap.png',
        path: __dirname + '/mailtrap.png',
        cid: 'uniq-mailtrap.png' 
      }
]
 };

 transport.sendMail(mailOptions, (error, info) => {
  if (error) {
      console.log(error)
      cb(null, true)
      return;
   }
     console.log("Message sent:-", info?.messageId )
     cb(true, null)
 })

}

module.exports = send_mail 
 
