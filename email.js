const nodemailer = require('nodemailer');

let mailinfo = require('./config.json')

let userinfo = mailinfo.userinfo

let sendmailinfo = mailinfo.sendmailinfo

let authemail  = nodemailer.createTransport(userinfo)

authemail.sendMail(sendmailinfo,function(err,info){
    if(err){
        console.log(err)
    }
    console.log("send..")
})