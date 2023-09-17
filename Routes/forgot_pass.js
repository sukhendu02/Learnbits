const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const { count } = require('console');
const session = require('express-session');
const bodyParser = require("body-parser");
const fs = require("fs");


// const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

const cookieParser = require('cookie-parser')
app.use(cookieParser());

const user = require('../modals/user')
const auth = require('../middleware/auth')
const reset_pass = require('../Email/reset-password')

//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())



// ENVIRONMENT VARIABLES (DOT ENVE)
// dotenv.config({path:'../Config/sendinblue.env'})
dotenv.config({path:'/config.env'})


const multer = require('multer')
//  MULTER DEFINING
const storage = multer.diskStorage({
    destination : './public/uploads/',
    filename : function (req,file,cb){
        cb(null,file.fieldname+'-'+ Date.now()+
        path.extname(file.originalname));
        
    }
});
const upload = multer({
    storage: storage
}).single('file');



// PASSWORD VALIDATOR
var passwordValidator = require('password-validator');
// Create a schema
var schema = new passwordValidator();


module.exports = function (app) {

    // GET THE FORGOT PASSWORD PAGE
    app.get('/forgot-password',(req,res)=>{
        if(req.cookies.jwt){
            return res.redirect('/')
        }
      
          return  res.render('forgot_pass.hbs')
        })


        

        // MAKE A LINK AND SEND AS EMAIL
        app.post('/forgot-password', async (req,res)=>{
            if(req.cookies.jwt){
                res.redirect('/')
            }
            const givenid=req.body.cemail;
            const userexist = await user.findOne({email:givenid});
           if(userexist){
        
            // User exsit 
            const sec_ret=process.env.PASSWORD_JWT_SECRET+userexist.password
            // console.log(sec_ret)
            const payload={
                email:userexist.email,
                id:userexist.id,
            }
            const tok=jwt.sign(payload,sec_ret,{expiresIn:'10m'})
            // console.log(tok)
            const link=`http://${process.env.DOMAIN_NAME}/reset-password/${userexist.id}/${tok}`
        
            // console.log(link)
            // SENT THIS LINK AS EMAIL TO USER
            reset_pass(userexist.fullname, userexist.email,link);
            // try {
                
            //     res.redirect('/login');
            //   } catch (error) {
            //     res.render('./profile/forgot-password.hbs',{
            //         emailnotsent:true
            //     });
            //   }
        // res.status(200).send('link generated', link)
        
        req.flash('linksent', 'Reset link sent successfully')
            res.redirect('/forgot-password')
           }
        else{
            // user not exist
        
            // console.log('link not generated')
            req.flash('usernotfound','User not found')
            return res.redirect('/forgot-password')
        } 
           
        })



 // ==========RESET PASS FORM GET USING LINK=========
 app.get('/reset-password/:id/:tok', async  (req,res,next)=>{
    var {id,tok} =  req.params
    // res.send(req.params)
    // console.log(id,tok)


    const userexist = await user.findOne({_id:id})
    // If user doesn't match
    if(!userexist){
        req.flash('usernotfound',"user not exist")
        return res.redirect('/forgot-password')
  }

  const new_sec_ret=process.env.PASSWORD_JWT_SECRET+userexist.password

  try {
        const payload=jwt.verify(tok,new_sec_ret);
       return res.render('reset-password.hbs')
   } catch (error) {
    // res.send(error)
        // console.log(error)
        // console.log('hi in catch')

        req.flash('linkexpired', 'Reset link is expired')
        res.redirect('/forgot-password')
   }
    // res.send(req.params)

})


app.post('/reset-password/:id/:tok',async (req,res,next)=>{
    var {id,tok} =  req.params
    const userexist = await user.findOne({_id:id})
    const {password,cpassword}=req.body

    var cur_url=req.url

    if(!userexist){
        req.flash('usernotfound','User not exist')
        return res.render('/forgot-password.hbs')
  }


  const sec_ret=process.env.PASSWORD_JWT_SECRET+userexist.password
     try {
        const payload=jwt.verify(tok,sec_ret);

        // console.log(userexist.password)
       
        // PERFORM ALL THE VALIDATIONS OF PASSWORD
        if(password!=cpassword){
            req.flash('passnotmatched','password not matched')
            return res.redirect(cur_url)
          }
         
          schema
          .is().min(8)                                    // Minimum length 8
           .is().max(100)                                  // Maximum length 100
           .has().uppercase()                              // Must have uppercase letters
           .has().lowercase()                              // Must have lowercase letters
           .has().digits(1)                                // Must have at least 2 digits
           .has().not().spaces()                           // Should not have spaces
           .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
           // console.log(schema.validate(password));
           if(schema.validate(password)==false){
            req.flash('invalidpassword','Invalid Password')
               return res.redirect(cur_url)
           }
        //    console.log(hi)
        userexist.password =  password
       
        userexist.save()
        // console.log(userexist.password)



        // console.log(userexist)
        req.flash('passupdated', 
        `Your account password updated successfully`)
        return res.redirect('/login')

   } catch (error) {
    // res.send(error)
        // console.log(error)
        req.flash('passnotupdated','Password not updated')
        return res.redirect('/login')
   }
}) 



        



}