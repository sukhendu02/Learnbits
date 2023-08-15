const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 80;
var fs = require('fs');
const hbs = require('hbs');

const multer  = require('multer')
// const mongoose =require('mongoose')



// IMPORTING MONGOOOSE SCHEMAS

const newsletter = require('./modals/newsletter')
const MEMCQ =require('./modals/MEMCQ')
const CSEITMCQ = require('./modals/CSEITMCQ')
const PPinterview = require('./modals/ppinterview.js')
const adminuser= require('./modals/adminuser')
const job_updates= require('./modals/job_up')
const servicecontact= require('./modals/servicecontact')
const interview_exp = require('./modals/interview_exp');
const contest = require('./modals/contest')
const C =require('./modals/C')
const Cpp =require('./modals/Cpp')
const Python =require('./modals/Python')
const java =require('./modals/java')
const javascript =require('./modals/javascript')
const contact =require('./modals/contact')
const PPQA = require('./modals/PP/PPQA')
const PPLR = require('./modals/PP/PPLR')
const PPenglish = require('./modals/PP/PPenglish')
const PPcoding = require('./modals/PP/PPcoding')
const book = require('./modals/book')

// IMPORT EMAILS
const reset_pass=require('./Email/reset-password')


const session = require('express-session');

const flash = require('express-flash');
app.use(flash());

app.use(session({
    secret: process.env.SESSIONFLASH,
    resave: false,
    saveUninitialized: true
}));



const nodemon=require("nodemon")
var passwordValidator = require('password-validator');
// Create a schema
var schema = new passwordValidator();



const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const cookieParser = require('cookie-parser')

var mcq = require('./mcq')(app);
// var interview = require('./interview')(intev);
const interview=require('./interview')(app)
// const contest=require('./contest')(app)
const admin=require('./admin')(app)


const forgot_pass = require('./Routes/forgot_pass')(app)

// require('./memcq')


//----------COOKIE PARSER-----------//
app.use(cookieParser());



// CONNECTION TO DATA-BASE OR MONGODB THROUGH MONGOOSE
const mongoose = require("mongoose");
const { EFAULT } = require("constants");
const { error, Console } = require("console");
mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser:true, useUnifiedTopology:true})
 .then( () => console.log("successful"))
 .catch((err) => console.log(err));


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

// const uploadfile = multer({
//     storage: storage
// }).single('file');


//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())


//  SCHEMA FOR USER REGEISTRATION 
const userSchema = new mongoose.Schema({
   
    fullname: String,
    email: String,
    // phone: Number,
    password:String,
    cpassword:String,
    Date:{ type:Date,
        default:Date.now
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]

    

})

userSchema.pre('save', async function (next) {
    // const user = this

    // bcrypt.hash(user.password && user.cpassword, 12, function (error, encrypted) {
    //     user.password = encrypted
    //     user.cpassword = encrypted
        
    //     next()
    // })
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12)
        // this.cpassword = await bcrypt.hash(this.cpassword,12)
       
    }
next();
    
})
userSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY)
       this.tokens = this.tokens.concat({token:token})
       
       await this.save();
       return token;
    }
    catch{
        res.render('error.hbs')
    }
}

const user = mongoose.model('user', userSchema);
module.exports = user;


//              AUTHENTICATING USER SIGNED IN OR NOT            ///

const auth = async (req,res,next)=>{
    try{
        
        const token = req.cookies.jwt;
        // console.log(token)
        const verifyUser =jwt.verify(token,process.env.SECRET_KEY);
        // console.log(verifyUser)
        

        const data = await user.findOne({_id:verifyUser._id,"tokens.token":token})
       req.token = token;
       req.data = data;
    //    console.log(data.email)
       
       
        next();

    }
    catch{
        req.session.returnTo = req.originalUrl; 

        res.status(401).render('login.hbs')
    }
}



// =========== AUTH FOR ADMINUSER


// const adminauth = async (req,res,next)=>{
//     try{
        
//         const token = req.cookies.adminjwt;
//         // console.log(token)
//         const verifyUser =jwt.verify(token,process.env.ADMINSEC_KEY);
//         // console.log('hi from verify user')

//         const data = await adminuser.findOne({_id:verifyUser._id})
//        req.token = token;
//        req.data = data;
//         next();

//     }
//     catch{
//         res.status(401).render('./Admin/admin-login.hbs')
//     }
// }

const adminauth = require('./middleware/adminauth')
    

//============     SCHEMA FOR LANGUAGE QUEASTIONS  =================



//  ======SCHEMA FOR PP============





 






//  ============SCHEMA FOR MCQ============
// const CSEITMCQSchema = new mongoose.Schema({
//     questionmcq: String,
//     topic: String,
//     option1:String,
//     option2:String,
//     option3:String,
//     option4:String,
//     answer: String,
  
//     date:{type:Date,default:Date.now()
//     }
    
//   })

//  const CSEITMCQ = mongoose.model('CSEITMCQ', CSEITMCQSchema);
//  module.exports=CSEITMCQ;

//  const MEMCQSchema = new mongoose.Schema({
//     questionmcq: String,
//     topic: String,
//     option1:String,
//     option2:String,
//     option3:String,
//     option4:String,
//     answer: String,
  
//     date:{type:Date,default:Date.now()
//     }
    
//   })

//  const MEMCQ = mongoose.model('MEMCQ', MEMCQSchema);
//  module.exports=MEMCQ;

// =========SCHEMA FOR QUESTIONS============
const cseitSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
  
    date:{type:Date,default:Date.now
    }
    
  })

 const cseit = mongoose.model('cseit', cseitSchema);
 module.exports=cseit;

 const MESchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
  
    date:{type:Date,default:Date.now
    }
    
  })

 const ME = mongoose.model('ME', MESchema);
 module.exports=ME;





//  FOR TEMPLETE ENGINE (HANDALBAR)
app.set("view engine","hbs");
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');



hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});


app.get('/',(req,res)=>{
    if(req.cookies.jwt){
            res.render('index.hbs',{
                loggedin:true
            })
        }
      else{
          res.render('index.hbs')
      }
})


// app.get('/books',(req,res)=>{
//     res.render('books.hbs')
// })

app.get('/login',(req,res)=>{
    if(req.cookies.jwt){
        res.redirect('/')
    }else
    res.render('login.hbs')
})

app.get('/sign-up',(req,res)=>{
    if(req.cookies.jwt){
        res.redirect('/')
    }else
    res.render('login.hbs')
})

app.get('/About-us',(req,res)=>{
    res.render('about.hbs')
})

app.get('/profile',auth, async(req,res)=>{
    var value= req.data;
    // console.log(value)
    const contributions = await interview_exp.find({userid:value._id}).sort({date:-1})

      // Find contests where the user has participated
      const myContests = await contest.find({ 'participants._id': req.data.id }).sort({ date: -1 });

       myContests.forEach(contest => {
            contest.participantCount = contest.participants.length;

            const currentDate = new Date();
           
            if(contest.reg_endDate>currentDate) {
                contest.status ='<span class="status bg-warning text-light" >Upcoming</span>';
              
            }
            else if(contest.reg_endDate<currentDate && contest.contest_endDate>currentDate){
                contest.status='<span class="status bg-success text-light" >Active</span>'
            
            }
            else{
                contest.status='<span class="status bg-secondary text-light" >Ended</span>'
               
            }
            // console.log(contest.winners)
            if(contest.winners){
                contest.win='<i class="fa-solid fa-circle-check text-success"></i>'
            }
            else{
                contest.win='<i class="fa-solid fa-circle-xmark text-danger"></i>'
            }
            
            contest.regis_endDate = formatDate(contest.reg_endDate);
            contest.regis_startDate = formatDate(contest.reg_startDate);
            contest.con_startDate = formatDate(contest.contest_startDate);
            contest.con_endDate = formatDate(contest.contest_endDate);
            contest.posted = formatDate(contest.date);
        
           
        });
     

    // console.log(contributions)
    fullname = req.data.fullname,
    email = req.data.email,

   
      res.render('profile.hbs',{
          fullname,email,contributions,myContests
      })
     
      
  })
// app.get('/profile2',auth, async(req,res)=>{
//     var value= req.data;
//     // console.log(value)
//     const contributions = await interview_exp.find({userid:value._id}).sort({date:-1})

//       // Find contests where the user has participated
//       const myContests = await contest.find({ 'participants._id': req.data.id }).sort({ date: -1 });

//        myContests.forEach(contest => {
//             contest.participantCount = contest.participants.length;

//             const currentDate = new Date();
           
//             if(contest.reg_endDate>currentDate) {
//                 contest.status ='<span class="status bg-warning text-light" >Upcoming</span>';
              
//             }
//             else if(contest.reg_endDate<currentDate && contest.contest_endDate>currentDate){
//                 contest.status='<span class="status bg-success text-light" >Active</span>'
            
//             }
//             else{
//                 contest.status='<span class="status bg-secondary text-light" >Ended</span>'
               
//             }
//             // console.log(contest.winners)
//             if(contest.winners){
//                 contest.win='<i class="fa-solid fa-circle-check text-success"></i>'
//             }
//             else{
//                 contest.win='<i class="fa-solid fa-circle-xmark text-danger"></i>'
//             }
            
//             contest.regis_endDate = formatDate(contest.reg_endDate);
//             contest.regis_startDate = formatDate(contest.reg_startDate);
//             contest.con_startDate = formatDate(contest.contest_startDate);
//             contest.con_endDate = formatDate(contest.contest_endDate);
//             contest.posted = formatDate(contest.date);
        
           
//         });
     

//     // console.log(contributions)
//     fullname = req.data.fullname,
//     email = req.data.email,

   
//       res.render('profile.hbs',{
//           fullname,email,contributions,myContests
//       })
     
      
//   })

  app.get('/delete-interview-experience/:id',auth,async (req,res)=>{
    // const exp = 
    const exp = await interview_exp.findById(req.params.id)
    if(req.data._id!=exp.userid){
        res.redirect('/profile')
    }
    const del_exp= await interview_exp.findByIdAndDelete(exp._id)
    req.flash('itemdeleted','Item has been deleted')
    res.redirect('/profile')

  })































// FORGOT PASS WORD ROUTES==========

  app.get('/forgot-password',(req,res)=>{
    //    console.log(req.cookies.jwt)
    if(req.cookies.jwt){
        return res.redirect('/')
    }
  
      return  res.render('forgot_pass.hbs')
    })

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



// ========VALIDATING AND CHANGING PASSWORD============
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
        console.log(userexist.password)



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






// ===========  REGISTRATION ROUTE   -==============       //

app.post('/register',(req,res) => {
    const {fullname,email,phone,password,cpassword} = req.body;
// console.log(fullname,email,password)

    user.findOne({email:email})
        .then((userExist) => {
            if (userExist){
                // return res.status(422).render('login.hbs',{exist:true});
                req.flash('exist','user already exist')
                return res.status(422).redirect('/login');
            }

            // if (password != cpassword){
            //     return res.render('register.hbs',{passnotmatch:true})
            // }
           if(password.length <8){
            req.flash('min8','password must be of at least 8 characters.')
               return res.redirect('/login')
               
           }
           schema
           // .is().min(8)                                    // Minimum length 8
            .is().max(100)                                  // Maximum length 100
            .has().uppercase()                              // Must have uppercase letters
            .has().lowercase()                              // Must have lowercase letters
            .has().digits(1)                                // Must have at least 2 digits
            .has().not().spaces()                           // Should not have spaces
            .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
            // console.log(schema.validate(password));
            if(schema.validate(password)==false){
                req.flash('invalidpass','invalid password')
                return res.redirect('/login')
            }

    var myData = new user(req.body);
    // console.log(req.body);

    myData.save().then(() =>{
        req.flash('signupsuccess', 'regsitration successful')
       res.redirect('/login')
        
    }).catch(() =>{
        res.render('error.hbs')
    });
}).catch(()=>{
    res.render('error.hbs')
})



});



// ======= LOGIN ROUTE  ==========//

app.post('/login',async(req,res)=>{
    try {
        let token;
        const {email , password} = req.body;

        const userlogin = await user.findOne({email:email});
        

      if (userlogin){

            const matched = await bcrypt.compare(password,userlogin.password);
            // console.log(matched)

            if(!matched){
                // console.log('hi from not matched')
            // res.status(400).render('login.hbs',{
        
            //     invalidcredential:true
            // })
            req.flash('invalidcredential', 'invalid')
            res.redirect('/login')

             }
              else{
                token = await userlogin.generateAuthToken();
                // console.log(token);

            
                res.cookie("jwt",token,{
                    expires:new Date(Date.now()+604800000),
                    httpOnly:true,
                    // loggedin:true
                })

            
            const returnTo = req.session.returnTo || '/';
            delete req.session.returnTo;
            res.redirect(returnTo)
              }

        }
        else{
            req.flash('notexist','email not registered')
            res.redirect('/login')
          
        }

        

    } catch (error) {
        res.render('error.hbs')
    }
    

})


           //  LOGOUT ROUTES           //

           app.get('/logout',auth, async (req,res)=>{
            try{
    
                //          DELETING CURRENT TOKEN FROM DATABSE         ///
    
                req.data.tokens = req.data.tokens.filter((currentToken)=>{
                    return currentToken.token != req.token
                })
    
                //          OR JUST CLEAR COOKIES           //
                res.clearCookie("jwt");
    
    
                await req.data.save();
                res.redirect('/login');
            }
            catch{
                res.status(500).send('error')
            }
        })



        // ============     DELETING ROUTES     =================
  
    app.get('/admin/language/delete/:id',adminauth, async function (req,res){
        const Cs = await C.findByIdAndDelete(req.params.id)
        const Cpps = await Cpp.findByIdAndDelete(req.params.id)
        const Pythons = await Python.findByIdAndDelete(req.params.id)
        const javas = await java.findByIdAndDelete(req.params.id)
        const javascripts = await javascript.findByIdAndDelete(req.params.id)
        res.redirect('/admin/languages')
    })

    app.get('/admin/delete/interview-exp/:id',adminauth, async function (req,res){
        const del_int_exp = await interview_exp.findByIdAndDelete(req.params.id)
        res.redirect('/admin/placement-prepration')

    })

    app.get('/admin/PP/delete/:id', async function (req,res){
        const PPQAs = await PPQA.findByIdAndDelete(req.params.id)
        const PPLRs = await PPLR.findByIdAndDelete(req.params.id)
        const PPenglishs = await PPenglish.findByIdAndDelete(req.params.id)
        const PPcodings = await PPcoding.findByIdAndDelete(req.params.id)
        const PPinterviews = await PPinterview.findByIdAndDelete(req.params.id)
        const int_exp = await interview_exp.findByIdAndDelete(req.params.id)
        res.redirect('/admin/placement-prepration')
    })

    // app.get('/admin/branch-wise/delete/:id', async function (req,res){
    //     const cseits = await cseit.findByIdAndDelete(req.params.id)
    //     const MEs = await ME.findByIdAndDelete(req.params.id)
       
    //     res.redirect('/admin/branch-wise')
    // })

    app.get('/admin/mcq/delete/:id', async function (req,res){
        const CSEITMCQs = await CSEITMCQ.findByIdAndDelete(req.params.id)
        const MEMCQs = await MEMCQ.findByIdAndDelete(req.params.id)
       
        res.redirect('/admin/mcqs')
    })

    app.get('/admin/book/delete/:id', async function (req,res){
        const books = await book.findByIdAndDelete(req.params.id)
       
        res.redirect('/admin/upload-book')
    })
    app.get('/admin/contacts/delete/:id', async function (req,res){
        const contacts = await contact.findByIdAndDelete(req.params.id)
       
        res.redirect('/admin/contacts')
    })
    // JOB UPDATE ROUTES

    app.get('/admin/job-updates',adminauth,async(req,res)=>{

        const recent_post=await job_updates.find({}).limit(15)
    .sort({date:-1})
    
        res.render('./Admin/add-job-updates',{
            recent_post,
        })
    })

    app.post('/admin/add-job-updates',adminauth,(req,res)=>{
        const{title,Company,Experience,Last_date,job_details,Job_profile,job_location,job_type,company_logo,CTC,apply_link}=req.body;
        if(title=="" || job_details=="" || Company =="" || job_type=="" ||apply_link==""){
          return  res.render('./Admin/add-job-updates',{
                notfilled:true
            })
        }
        var job=new job_updates({
            title:title,
            Company:Company,
            Experience:Experience,
            Job_profile:Job_profile,
            Last_date:Last_date,
            job_type:job_type,
            job_location:job_location,
            company_logo:company_logo,
            apply_link:apply_link,
            CTC:CTC,
            job_details:job_details,


        })
        job.save().then(()=>{
            // res.render('./Admin/add-job-updates',{
            //     success:true
            // })
            req.flash('update_saved','saved successfully')
            res.redirect('/admin/job-updates')
        }).catch(()=>{
            // res.render()
            // res.render('./Admin/add-job-updates',{
            //     failed:true
            // })
            req.flash('update_notsaved','not saved')
            res.redirect('/admin/job-updates')
        })
    })


// ======== ADMIN'S SECRET PAGES============
app.get('/admin-login',(req,res)=>{
    res.render('./Admin/admin-login.hbs')

})
app.get('/admin',adminauth,async(req,res)=>{

    const totalusers=await user.countDocuments()
    const totaladminusers=await adminuser.countDocuments()
    const totalcontacts=await contact.countDocuments();
    const totalC =await C.countDocuments()
    const totalCpp=await Cpp.countDocuments()
    const totaljava=await java.countDocuments()
    const totalpython=await Python.countDocuments()
    const totaljs=await javascript.countDocuments()
    const totalbook=await book.countDocuments()
    const totalPPcoding=await PPcoding.countDocuments()
    const totalcontest=await contest.countDocuments()
    const totalupdates=await job_updates.countDocuments()
    const totalPPinterview=await PPinterview.countDocuments()
    const total_Cpp_PPinterview=await PPinterview.countDocuments({'type':'Cpp'})
    const total_Java_PPinterview=await PPinterview.countDocuments({'type':'Java'})
    const total_Python_PPinterview=await PPinterview.countDocuments({'type':'Python'})
    const total_HR_PPinterview=await PPinterview.countDocuments({'type':'HR'})
    const total_DSA_PPinterview=await PPinterview.countDocuments({'type':'HR'})

    var admindata = req.data
    // console.log(admindata)

    res.render('./Admin/admin.hbs',{
        totalusers,totaladminusers,totalcontacts,totalC,totalCpp,totalpython,
        totaljava,totaljs,totalbook,totalPPcoding,totalupdates,totalcontest,totalPPinterview,admindata
        ,total_Cpp_PPinterview,total_Java_PPinterview,total_Python_PPinterview,total_HR_PPinterview,total_DSA_PPinterview
    })
})
app.get('/admin/branch-wise',adminauth,async (req,res)=>{
    const cseits = await cseit.find({})
    const MEs = await ME.find({})
    .sort({date:-1})
    .limit(10)
    res.render('./Admin/branchwise.hbs',{
        cseits,MEs
    })
})

app.get('/admin/language/upload/cpp',(req,res)=>{
    res.render('./Admin/uploadquestion.hbs',{
    cpp:true
})
})

app.get('/admin/language/upload/c',(req,res)=>{
    res.render('./Admin/uploadquestion.hbs',{
    cques:true
})
})

app.get('/admin/language/upload/java',(req,res)=>{
    res.render('./Admin/uploadquestion.hbs',{
    java:true
})
})

app.get('/admin/language/upload/python',(req,res)=>{
    res.render('./Admin/uploadquestion.hbs',{
    python:true
})
})

app.get('/admin/language/upload/javascript',(req,res)=>{
    res.render('./Admin/uploadquestion.hbs',{
    javascript:true
})
})

app.get('/admin/placement-prepration',adminauth,async (req,res)=>{
    const PPQAs = await PPQA.find({})
    .sort({date:-1})
    .limit(15)
    const PPLRs = await PPLR.find({})
    .sort({date:-1})
    .limit(15)
    const PPenglishs = await PPenglish.find({})
    .sort({date:-1})
    .limit(15)

    const PPcodings = await PPcoding.find({})
.sort({date:-1})
    .limit(15)
    const pp_interviews = await PPinterview.find({})
    .sort({date:-1})
    .limit(15)
    const int_exp = await interview_exp.find({})
    .sort({date:-1})
    .limit(15)
    // console.log(ppinterviews/)
    res.render('./Admin/placement-prep.hbs',{
        PPQAs,PPLRs,PPenglishs,PPcodings,pp_interviews,int_exp
    })
})
app.get('/admin/placement-prepration/Quantitave-Aptitude',(req,res)=>{
    res.render('./Admin/uploadquestion.hbs',{
        PPQA:true
    })
})
app.get('/admin/placement-prepration/Logical-reasoning',(req,res)=>{
    res.render('./Admin/uploadquestion.hbs',{
        PPLR:true
    })
})
app.get('/admin/placement-prepration/English',(req,res)=>{
    res.render('./Admin/uploadquestion.hbs',{
        PPenglish:true
    })
})
app.get('/admin/placement-prepration/coding',(req,res)=>{
    res.render('./Admin/uploadquestion.hbs',{
        PPcoding:true
    })
})
app.get('/admin/placement-prepration/interview-quesiton',(req,res)=>{
    res.render('./Admin/uploadquestion.hbs',{
        PPinterview:true
    })
})

app.get('/admin/languages',adminauth,async (req,res)=>{
    const Cs = await C.find({})
    .sort({date:-1})
    .limit(10)
    const cpps = await Cpp.find({})
    .sort({date:-1})
    .limit(10)
    const pythons = await Python.find({})
    .sort({date:-1})
    .limit(10)
    const javas = await java.find({})
    .sort({date:-1})
    .limit(10)
    const javascripts = await javascript.find({})
    .sort({date:-1})
    .limit(10)

    res.render('./Admin/languages.hbs',{
        Cs,cpps,pythons,javas,javascripts
    })
})

// app.get('/admin/contacts',(req,res)=>{
//     res.render('./Admin/showcontacts.hbs')
// })

app.get('/admin/contacts',adminauth, async (req, res) => {
    const contacts = await contact.find({})
    .sort({date:-1})
     res.render('./Admin/showcontacts.hbs',{
         contacts
     })
 });

// // =========    MCQS    ================
app.get('/admin/mcqs',adminauth,async (req,res)=>{
    const CSEITMCQs = await CSEITMCQ.find({})
    .sort({date:-1})
    .limit(30)
    const MEMCQs = await MEMCQ.find({})

    .sort({date:-1})
    .limit(30)
    
    res.render('./Admin/mcq.hbs',{
        CSEITMCQs,MEMCQs
    })
})
app.get('/admin/mcqs/upload-ME',(req,res)=>{
    res.render('./Admin/upload-mcq.hbs',{
        ME:true
    })
})
app.get('/admin/mcqs/upload-CSE-IT',(req,res)=>{
    res.render('./Admin/upload-mcq.hbs',{
        cseit:true
    })
})


//  ========= ROUTE FOR UPLOADING QUESTION==========

app.get('/admin/upload/cse-it',(req,res)=>{
    res.render('./Admin/uploadquestion.hbs',{
    cseit:true
})
})
app.get('/admin/upload/ME',(req,res)=>{
    res.render('./Admin/uploadquestion.hbs',{
    ME:true
})
})


app.get('/admin/users',adminauth, async (req, res) => {
    const users = await user.find({})
    const newsletters = await newsletter.find({})
    var totalusers = await user.countDocuments()
    
    .sort({date:-1})
     res.render('./Admin/users.hbs',{
         users,totalusers,newsletters
     })
 });
// =========== FOR UPLOADING BOOKS PDF ============
app.get('/admin/upload-book',adminauth, async (req,res)=>{

    const recups= await book.find({})
    .sort({date:-1})
    res.render('./Admin/book-upload.hbs',{
        recups
    })
})


// ========== ADMIN CONTEST ROUTES  ==============
const { format } = require('date-fns');
const { userInfo } = require("os");




app.get('/contest',async(req,res)=>{
    const currentDate = new Date();

    // const allcontest= await contest.find({}).sort({date:-1})
    const upcomingContests = await contest.find({ reg_endDate: { $gt: currentDate } }).sort({ date: -1 });
    const activeContests = await contest.find({ reg_endDate: { $lt: currentDate },contest_endDate: { $gt: currentDate } }).sort({ date: -1 });
    const endedContests = await contest.find({ contest_endDate: { $lt: currentDate } }).sort({ date: -1 }).limit(8);
    // console.log(activeContests)


    // console.log(req.data)
let User = null;
const token = req.cookies.jwt;


if (token) {
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    User = await user.findOne({ _id: verifyUser._id, "tokens.token": token });
    
}


  // Format contest dates
  const formattedUpcomingContests = formatContests(upcomingContests);
  const formattedActiveContests = formatContests(activeContests);
  const formattedEndedContests = formatContests(endedContests);
 
//   console.log(User)
    res.render('./contest/contest.hbs',{
        upcomingContests: formattedUpcomingContests,
        activeContests: formattedActiveContests,
        endedContests: formattedEndedContests,
        User:User,
        // Usermail:User.email,
    })



})


function formatContests(contests) {
    return contests.map(contest => {
      const formattedRegistrationStart = formatDate(new Date(contest.reg_startDate));
      const formattedRegistrationEnd = formatDate(new Date(contest.reg_endDate));
      const formattedContestStart = formatDate(new Date(contest.contest_startDate));
      const formattedContestEnd = formatDate(new Date(contest.contest_endDate));
  
      return {
        ...contest._doc,
        formattedRegistrationStart,
        formattedRegistrationEnd,
        formattedContestStart,
        formattedContestEnd,
      
       
      };
    });
  }
  
  function formatDate(date) {
    const formattedDate = format(new Date(date), 'MMM dd yyyy h:mm a');
    return formattedDate;
  }


  app.post('/contest/contest-registration/:id',auth,async(req,res)=>{
    const User = req.data;
    const {fullname,phone,email} = req.body;
 
    try{
        // console.log('hi')
        const reg_contest = await contest.findById(req.params.id);
        const contestId = reg_contest.id

        if (!contest) {
            return res.redirect('/contest')
          }

           // Check if the registration end date has passed
    const currentDate = new Date();

    if (reg_contest.reg_endDate < currentDate) {
    req.flash('reg_ended','Registration has been ended.')
    return res.redirect('/contest')
    }

    // TEST NEEDED
    const participantsCount = reg_contest.participants.length;
   if(participantsCount>= reg_contest.slots){
    req.flash("full","Sorry! The slot is full.")
    return res.redirect("/contest")
   }




    let hasParticipant = false;
  
    reg_contest.participants.forEach(participant => {
        if (participant._id ===User.id) {
          hasParticipant = true;
        }
      });
      if (hasParticipant) {
        req.flash('already_registered','You have already registered')
        return res.redirect('/contest')
      }

//   console.log(hi)

    // Update the contest with the new participant
    const updatedContest = await contest.findOneAndUpdate(
        { _id: contestId },
        {
          $push: {
            participants: {
              _id:User.id,
              username:User.fullname,
              email:email,
              fullname: fullname,
              phone: phone,
              date:Date.now,
            },
          },
        },
        { new: true } // To get the updated contest document
      );
      if (!updatedContest) {
        // Contest not found
        return res.status(404).json({ error: 'Contest not found' });
      }
      req.flash('contest_registered','You have regiterd for contest')
      return res.redirect('/contest')

    }catch(error){
        console.log(error)
    }

  })
app.get('/admin/manage-contest',adminauth, async(req,res)=>{
        const allcontest= await contest.find({}).sort({date:-1})
        // var {up, ac,end} =var 0
        var end=0,up=0,ac=0;

        const totalContests = await contest.countDocuments({});

        
        allcontest.forEach(contest => {
            contest.participantCount = contest.participants.length;

            // console.log(contest.participants)
            const currentDate = new Date();
           
            if(contest.reg_endDate>currentDate) {
                contest.status ='<span class="status bg-warning text-light" >Upcoming</span>';
               up++
            }
            else if(contest.reg_endDate<currentDate && contest.contest_endDate>currentDate){
                contest.status='<span class="status bg-success text-light" >Active</span>'
              ac++;
            }
            else{
                contest.status='<span class="status bg-secondary text-light" >Ended</span>'
                end++;
            }
            // console.log(contest.winners)
            if(contest.winners){
                contest.win='<i class="fa-solid fa-circle-check text-success"></i>'
            }
            else{
                contest.win='<i class="fa-solid fa-circle-xmark text-danger"></i>'
            }
            
            contest.regis_endDate = formatDate(contest.reg_endDate);
            contest.regis_startDate = formatDate(contest.reg_startDate);
            contest.con_startDate = formatDate(contest.contest_startDate);
            contest.con_endDate = formatDate(contest.contest_endDate);
            contest.posted = formatDate(contest.date);
        
           
        });
        
    
    res.render('./Admin/managecontest.hbs',{
        allcontest,up,ac,end ,totalContests
    })
})
const excel = require('exceljs');
app.get('/admin/manage-contest/:id',adminauth,async (req,res)=>{
    try {
    const current_contest = await contest.findById(req.params.id)
    const filename=current_contest.title
    const participants = current_contest.participants;
    if (!contest) {
        return res.redirect('/admin/manage-contest');
      }

       // Create a new workbook and worksheet
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Participants');

    // Add headers to the worksheet
    worksheet.addRow(['ID','Username', 'Email', 'Full Name', 'Phone']);

    // Add participant data to the worksheet
    participants.forEach(participant => {
      worksheet.addRow([participant._id,participant.username, participant.email, participant.fullname, participant.phone]);
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}-participants.xlsx`);

    // Stream the workbook to the response
    workbook.xlsx.write(res).then(() => {
      res.end();
    //   res.redirect('/admin/manage-contest')
    });
    }
    catch{
        req.flash('error','No such Contest Found')
        return  res.redirect("/admin/manage-contest")
    }
   
  
})
app.get('/admin/manage-contest/create-contest',adminauth,(req,res)=>{
    res.render('./Admin/create-contest.hbs')
})
app.get('/admin/manage-contest/delete/:id',adminauth,async(req,res)=>{
    const del_contest = await contest.findByIdAndDelete(req.params.id)
    req.flash('contestdeleted','The contest has been deleted')
    res.redirect('/admin/manage-contest')

})

app.post('/admin/create-contest',(req,res)=>{
    // console.log(req.body)
    // const {title,subheading,contest_type,reg_startDate,reg_endDate,contest_startDate,contest_endDate,slots,total_winners,elgiblity,guidelnies,img,description} = req.body;

     const prizeTitles = req.body.prize_title;
     const prizes = req.body.prize;
  
    const prizeObjects = prizeTitles.map((title, index) => {
        return { key: title, value: prizes[index] };
      });
// console.log(prize_title)
console.log(prizeObjects)
// console.log(prize)
    
    const newcontest = new contest({
        title:req.body.title,
        description : req.body.description,
        subheading : req.body.subheading,
        contest_type : req.body.contest_type,
        reg_startDate : req.body.reg_startDate,
        reg_endDate : req.body.reg_endDate,
        contest_startDate : req.body.contest_startDate,
        contest_endDate : req.body.contest_endDate,
        slots : req.body.slots,
        total_winners : req.body.total_winners,
        schedule : req.body.schedule,
        eligiblity : req.body.eligiblity,
        guidelines : req.body.guidelines,
        img : req.body.img,
        prize:prizeObjects
        
       

      

    })
    console.log('hi')
    newcontest.save().then(()=>{
        // console.log('hi2')
        req.flash("success","Contest Created Successfully")
        return res.redirect("/admin/manage-contest/create-contest");
    }).catch((data)=>{
        // console.log(data)
        req.flash("error","Contest not Created.")
       return res.redirect('/admin/manage-contest/create-contest')
    })
  
   })


   app.post('/admin/manage-contest/update-winners/:id',adminauth,async (req,res)=>{
    try {
        const winners = req.body.winners;
        const update_winner_of = await contest.findOneAndUpdate({ _id: req.params.id }, { $set: { winners: winners } }, { includeResultMetadata: false })
        // console.log(update_winner_of)
            req.flash('updatesuccess','Winners updated')
           return res.redirect('/admin/manage-contest')
    
        
    } catch (error) {
        req.flash('error','Winners not updated')
        return res.redirect('/admin/manage-contest')
    }
    

       

   })
// ========== ROUTE FOR LANGUAGES ============

   
app.get('/language/cpp', async (req, res) => {


    // PAGINATION 
    const {page=1,limit=15}=req.query;
    var nextp=parseInt(page)+1;
    var prevp=parseInt(page)-1;
    if (nextp==2){
        var firstpage=nextp
    }
    var hasnext =1;
    const lastpage=await Cpp.countDocuments()/limit
    if(lastpage>page){
         hasnext=null;
    }
  
    const cpps = await Cpp.find({}).limit(limit * 1).skip((page-1)*limit)
    
    .sort({date:-1})
     res.render('ques-list.hbs', {
        cpps,cppques:true,nextp,prevp,firstpage, hasnext
    
         })
 });
 

     app.get('/Placement-Prepration/interview-prep/java-interview-questions', async (req,res)=>{
                     // PAGINATION 

    const {page=1,limit=15}=req.query;

    var nextp=parseInt(page)+1;
    var prevp=parseInt(page)-1;
    if (nextp==2){
        var firstpage=nextp
    }
    var hasnext =1;
    const lastpage=await PPinterview.find({'type':'Java'}).countDocuments()/limit
    if(lastpage>page){
         hasnext=null;
    }
    console.log(page)
    console.log('this is limit',limit)
    console.log((page-1)*limit)
        const PP_Java_int= await PPinterview.find({'type':'Java'}).limit(limit * 1).skip((page-1)*limit)
.sort({date:1})
        // console.log(PP_Java_int)
   
        res.render('ques-list.hbs',{
            PP_Java_int,prevp,firstpage, hasnext
        })

    })
 app.get('/language/python', async (req, res) => {
     // PAGINATION 
     const {page=1,limit=15}=req.query;
     var nextp=parseInt(page)+1;
     var prevp=parseInt(page)-1;
     if (nextp==2){
         var firstpage=nextp
     }
     var hasnext =1;
     const lastpage=await Python.countDocuments()/limit
     if(lastpage>page){
          hasnext=null;
     }
   
    const Pythons = await Python.find({}).limit(limit * 1).skip((page-1)*limit)
    .sort({date:-1})
    // const collec1 = await Cpp.find({question: /python/i})
    // const collec2 = await java.find({question: /python/i})
    // const collec3 = await javascript.find({question: /python/i})
    // const collec4 = await C.find({question: /python/i})
    // const Pythons = Py.concat(collec1,collec2,collec3,collec4);

    
     res.render('ques-list.hbs', {
        Pythons,python:true,nextp,prevp,firstpage, hasnext
    
         })
 });
 app.get('/language/c', async (req, res) => {
     // PAGINATION 
     const {page=1,limit=15}=req.query;
     var nextp=parseInt(page)+1;
     var prevp=parseInt(page)-1;
     if (nextp==2){
         var firstpage=nextp
     }
     var hasnext =1;
     const lastpage=await C.countDocuments()/limit
     if(lastpage>page){
          hasnext=null;
     }
  
     
    const cs = await C.find({}).limit(limit * 1).skip((page-1)*limit)
    .sort({date:-1})
     res.render('ques-list.hbs', {
        cs,C:true,nextp,prevp,firstpage, hasnext
    
         })
 });
 app.get('/language/java', async (req, res) => {
     // PAGINATION 
     const {page=1,limit=15}=req.query;
     var nextp=parseInt(page)+1;
     var prevp=parseInt(page)-1;
     if (nextp==2){
         var firstpage=nextp
     }
     var hasnext =1;
     const lastpage=await java.countDocuments()/limit
     if(lastpage>page){
          hasnext=null;
     }
   
    const javas = await java.find({}).limit(limit * 1).skip((page-1)*limit)
    .sort({date:-1})
     res.render('ques-list.hbs', {
        javas,java:true,nextp,prevp,firstpage, hasnext
    
         })
 });

 app.get('/language/javascript', async (req, res) => {
     // PAGINATION 
     const {page=1,limit=15}=req.query;
     var nextp=parseInt(page)+1;
     var prevp=parseInt(page)-1;
     if (nextp==2){
         var firstpage=nextp
     }
     var hasnext =1;
     const lastpage=await javascript.countDocuments()/limit
     if(lastpage>page){
          hasnext=null;
     }
   
    const javascripts = await javascript.find({}).limit(limit * 1).skip((page-1)*limit)
    .sort({date:-1})
     res.render('ques-list.hbs', {
        javascripts,javaScript:true,nextp,prevp,firstpage, hasnext
    
         })
 });
//  ========= ROUTE FOR BOOK==============
 app.get('/books', async (req, res) => {
    // PAGINATION 
    const {page=1,limit=10}=req.query;
    var nextp=parseInt(page)+1;
    var prevp=parseInt(page)-1;
    if (nextp==2){
        var firstpage=nextp
    }
    var hasnext =1;
    const lastpage=await book.countDocuments()/limit
    if(lastpage>page){
         hasnext=null;
    }

 
    const books = await book.find({}).limit(limit * 1).skip((page-1)*limit)
    .sort({date:-1})
     res.render('books.hbs',{
         books,nextp,prevp,firstpage,hasnext
     })
    
 });
//  ========= ROUTE FOR QUESTION==============
 app.get('/cse-it/questions', async (req, res) => {
    const cseits = await cseit.find({})
    .sort({date:-1})
     res.render('ques-list.hbs',{
         cseits,cseit:true
     })
 });
   
 app.get('/ME/questions', async (req, res) => {
    const MEs = await ME.find({})
    .sort({date:-1})
     res.render('ques-list.hbs',{
         MEs,ME:true
     })
 });

 app.get('/Placement-Prepration/Quantitative-Aptitude', async (req, res) => {
    const PPQAs = await PPQA.find({})
    .sort({date:-1})
     res.render('ques-list.hbs',{
         PPQAs,PPQA:true
     })
 });
 app.get('/Placement-Prepration/Logical-reasoning', async (req, res) => {
    const PPLRs = await PPLR.find({})
    .sort({date:-1})
     res.render('ques-list.hbs',{
         PPLRs,PPLR:true
     })
 });
 app.get('/Placement-Prepration/English', async (req, res) => {
    const PPenglishs = await PPenglish.find({})
    .sort({date:-1})
     res.render('ques-list.hbs',{
         PPenglishs,PPenglish:true
     })
 });
 app.get('/Placement-Prepration/Coding', async (req, res) => {
    const {page=1,limit=15}=req.query;
    var nextp=parseInt(page)+1;
    var prevp=parseInt(page)-1;
    if (nextp==2){
        var firstpage=nextp
    }
    var hasnext =1;
    const lastpage=await PPcoding.countDocuments()/limit
    if(lastpage>page){
         hasnext=null;
    }

    const PPcodings = await PPcoding.find({}).limit(limit * 1).skip((page-1)*limit)
    .sort({date:-1})
     res.render('ques-list.hbs',{
         PPcodings,PPcoding:true,prevp,firstpage, hasnext,nextp
     })
 });
 app.get('/Placement-Prepration/interview-prep', async (req, res) => {
   
     res.render('interview_prep.hbs',{
        //  PPinterviews,PPinterview:true
     })
 });



// //// ========SHOWING FULL QUESTION ===========////
app.get('/language/cpp/:id/:question', async (req, res) => {
    const cpps = await Cpp.findById(req.params.id)
    const rel_post = await Cpp.find({}).limit(5)

    const lang = "Cpp"
   
    res.render('question.hbs', {
        cpps,rel_post,lang

    })
});


app.get('/language/c/:id/:question', async (req, res) => {
    const Cs = await C.findById(req.params.id)
    const rel_post = await C.find({}).limit(5)

    const lang = "C"
    res.render('question.hbs', {
        Cs,lang,rel_post
    })
});
app.get('/language/java/:id/:question', async (req, res) => {
    const javas = await java.findById(req.params.id)
    const rel_post = await java.find({}).limit(5)
    const lang = "Java"

    res.render('question.hbs', {
        javas,rel_post,lang,
    })
});
app.get('/language/python/:id/:question', async (req, res) => {
    const pythons = await Python.findById(req.params.id)
    const rel_post = await Python.find({}).limit(5)
    const lang = "Python"
    res.render('question.hbs', {
        pythons,rel_post,lang,
    })
});
app.get('/language/javascript/:id/:question', async (req, res) => {
    const javascripts = await javascript.findById(req.params.id)
    const rel_post = await javascript.find({}).limit(5)
    const lang = "Javascript"
    res.render('question.hbs', {
        javascripts,rel_post,lang,
    })
});

app.get('/Placement-Prepration/Quantitative-Aptitude/:id/:question', async (req, res) => {
    const PPQAs = await PPQA.findById(req.params.id)
    res.render('question.hbs', {
        PPQAs
    })
});

app.get('/Placement-Prepration/Logical-reasoning/:id/:question', async (req, res) => {
    const PPLRs = await PPLR.findById(req.params.id)
    res.render('question.hbs', {
        PPLRs
    })
});
app.get('/Placement-Prepration/English/:id/:question', async (req, res) => {
    const PPenglishs = await PPenglish.findById(req.params.id)
    res.render('question.hbs', {
        PPenglishs
    })
});
app.get('/Placement-Prepration/Coding/:id/:question', async (req, res) => {
    const PPcodings = await PPcoding.findById(req.params.id)
    res.render('question.hbs', {
        PPcodings
    })
});
app.get('/Placement-Prepration/interview/:id/:question', async (req, res) => {
    // const PPinterviews = await PPinterview.findById(req.params.id)

    res.render('interview_prep.hbs', {
        // PPinterviews
    })
});

app.get('/cse-it/questions/:id/:question', async (req, res) => {
    const cseits = await cseit.findById(req.params.id)
    res.render('question.hbs', {
        cseits
    })
});
app.get('/ME/questions/:id/:question', async (req, res) => {
    const MEs = await ME.findById(req.params.id)
    res.render('question.hbs', {
        MEs
    })
});


// =============    MCQ ROUTES ================


app.get('/MCQ/ME',(req,res)=>{
    
    res.render('mcqtopics.hbs',{
        ME:true
    })
})
app.get('/MCQ/CSE-IT',(req,res)=>{
    
    res.render('mcqtopics.hbs',{
        cseit:true
    })
})

// app.get('/MCQ/ME/SOM', async (req, res) => {
//     const MEMCQs = await MEMCQ.find({topic:"Strength of Maretial (SOM)"})
//     .sort({date:-1})
//      res.render('mcq_list.hbs',{
//          MEMCQs,MEMCQ:true
//      })
//  });




//  ======== SHOWING OTHER PAGES=============
app.get('/Contact',(req,res)=>{
    res.render('contact.hbs')
})

app.get('/Terms-of-use',(req,res)=>{
    res.render('terms-of-use.hbs')
})

app.get('/Privacy-policy',(req,res)=>{
    res.render('privacy-policy.hbs')
})


app.get('/books/:id/:bookname',auth,async (req,res)=>{
    const books = await book.findById(req.params.id)

    const rel = await book.find({})

    .limit(6)//
    // .skip(2)
    .sort({date:-1})
    res.render('book-download.hbs',{
        books,rel
    })
})

app.get('/latest-updates',async (req,res)=>{

       // PAGINATION 
       const {page=1,limit=10}=req.query;
       var nextp=parseInt(page)+1;
       var prevp=parseInt(page)-1;
       if (nextp==2){
           var firstpage=nextp
       }
       var hasnext =1;
       const lastpage=await job_updates.countDocuments()/limit
       if(lastpage>page){
            hasnext=null;
       }


    const updates=await job_updates.find({}).limit(limit * 1).skip((page-1)*limit)
    .sort({date:-1})
    res.render('job-updates.hbs',{
        updates,nextp,prevp,firstpage, hasnext
    })
})
app.get('/latest-updates/:id/:title',async (req,res)=>{
    // res.render('job-full-view.hbs')
    const job = await job_updates.findById(req.params.id)

    // CHANGING DATE FORMAT
    const dateString = job.date;
    const date = new Date(job.date);
    const dateWithoutTime = date.toDateString(); // "Thu Feb 16 2023"
job.dateWithoutTime=dateWithoutTime


    // RELATED ITEMS
    const rel_job=await job_updates.find({}).limit(6)
    .sort({date:-1})
    
    res.render('job-full-view',{
        job,rel_job,dateWithoutTime
    })
})
app.get('/admin/latest-updates/delete/:id',async (req,res)=>{
    const del_post = await job_updates.findByIdAndDelete(req.params.id);
    res.redirect('/admin/job-updates')
})



// FOR DISPLAYING STATIC FILES

const staticPath = path.join(__dirname,"/public");
app.use(express.static(staticPath));

// ======== POST DATA ROUTES ===============


app.post('/language/upload/cpp',(req,res) => {
    var myData = new Cpp(req.body)
    myData.save().then(() =>{
        // res.send('sucess')
        res.render('./Admin/uploadquestion.hbs',{
            cpp:true,submitted:true
        })
        // ));
    }).catch(() =>{
        // res.send("error")
        res.render('./Admin/uploadquestion.hbs',{
            cpp:true,notsubmitted:true
        })
    });
});

app.post('/language/upload/c',(req,res) => {
    var myData = new C(req.body)
    myData.save().then(() =>{
        // res.send('sucess')
        res.render('./Admin/uploadquestion.hbs',{
            cques:true,submitted:true
        })
        // ));
    }).catch(() =>{
        // res.send("error")
        res.render('./Admin/uploadquestion.hbs',{
            cques:true,notsubmitted:true
        })
    });
});

app.post('/language/upload/python',(req,res) => {
    var myData = new Python(req.body)
    myData.save().then(() =>{
        // res.send('sucess')\
        res.render('./Admin/uploadquestion.hbs',{
            python:true,submitted:true
        })
    }).catch(() =>{
        // res.send("error")
        res.render('./Admin/uploadquestion.hbs',{
            python:true,notsubmitted:true
        })
    });
});

app.post('/language/upload/java',(req,res) => {
    var myData = new java(req.body)
    myData.save().then(() =>{
        // res.send('sucess')
        res.render('./Admin/uploadquestion.hbs',{
            java:true,submitted:true
        })
    
    }).catch(() =>{
        // res.send("error")
        res.render('./Admin/uploadquestion.hbs',{
            java:true,notsubmitted:true
        })
    });
});

app.post('/language/upload/javascript',(req,res) => {
    var myData = new javascript(req.body)
    myData.save().then(() =>{
        // res.send('sucess')
        res.render('./Admin/uploadquestion.hbs',{
            javascript:true,submitted:true
        })
        
    }).catch(() =>{
        // res.send("error")
        res.render('./Admin/uploadquestion.hbs',{
            javascript:true,notsubmitted:true
        })
    });
});

// ========== POST ROUTE FOR BRANCH WISE=================

app.post('/upload/cseit',(req,res) => {
    var myData = new cseit(req.body)
    myData.save().then(() =>{
        // res.send('sucess')
        res.render('./Admin/uploadquestion.hbs',{
            cseit:true,submitted:true
        })
        
    }).catch(() =>{
        // res.send("error")
        res.render('./Admin/uploadquestion.hbs',{
            cseit:true,notsubmitted:true
        })
    });
});
app.post('/upload/ME',(req,res) => {
    var myData = new ME(req.body)
    myData.save().then(() =>{
        // res.send('sucess')
        res.render('./Admin/uploadquestion.hbs',{
            ME:true,submitted:true
        })
        
    }).catch(() =>{
        // res.send("error")
        res.render('./Admin/uploadquestion.hbs',{
            ME:true,notsubmitted:true
        })
    });
});

// ======== POST ROUTE FOR PLACEMENT PREPRATION  ===========

app.post('/upload/Quantitative-aptitude',(req,res) => {
    var myData = new PPQA(req.body)
    myData.save().then(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPQA:true,submitted:true
        })
        
    }).catch(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPQA:true,notsubmitted:true
        })
    });
});

app.post('/upload/Logical-reasoning',(req,res) => {
    var myData = new PPLR(req.body)
    myData.save().then(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPLR:true,submitted:true
        })
        
    }).catch(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPLR:true,notsubmitted:true
        })
    });
});

app.post('/upload/english',(req,res) => {
    var myData = new PPenglish(req.body)
    myData.save().then(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPenglish:true,submitted:true
        })
        
    }).catch(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPenglish:true,notsubmitted:true
        })
    });
});
app.post('/upload/coding',adminauth,(req,res) => {

    const company_name = req.body.company_name
    const parsedCompanyTags = JSON.parse(company_name);
    const parsedtopic_tags = JSON.parse(req.body.topic_tags);

    var myData = new PPcoding({
        question : req.body.question,
        topic:req.body.topic,
        answer:req.body.answer,
        company_tags:parsedCompanyTags ,
        topic:parsedtopic_tags ,
        level:req.body.level,
        
    })
    myData.save().then(() =>{
        res.render('./Admin/uploadquestion.hbs',{
            PPcoding:true,submitted:true
        })
        
    }).catch(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPcoding:true,notsubmitted:true
        })
    });
});

app.post('/upload/interview',(req,res) => {
    var myData = new PPinterview(req.body)
    myData.save().then(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPinterview:true,submitted:true
        })
        
    }).catch(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPinterview:true,notsubmitted:true
        })
    });
});

//////////////////////////
app.post('/upload/mcq-me',(req,res) => {
    var myData = new MEMCQ(req.body)
    myData.save().then(() =>{
        
        res.render('./Admin/upload-mcq.hbs',{
            ME:true,submitted:true
        })
        
    }).catch(() =>{
        
        res.render('./Admin/upload-mcq.hbs',{
            ME:true,notsubmitted:true
        })
    });
});


app.post('/upload/mcq-cseit',(req,res) => {
    var myData = new CSEITMCQ(req.body)
    myData.save().then(() =>{
        
        res.render('./Admin/upload-mcq.hbs',{
           cseit:true,submitted:true
        })
        
    }).catch(() =>{
        
        res.render('./Admin/upload-mcq.hbs',{
            cseit:true,notsubmitted:true
        })
    });
});

app.post('/contact',(req,res) => {
    const {con_name,con_email,subject,message}= req.body;
    if(!con_name|| !con_email|| !subject|| !message){
        res.render('contact.hbs',{
            filldetails:true
        })
    }else{
    var myData = new contact(req.body)
    myData.save().then(() =>{
        // console.log(req.body)
        res.render('contact.hbs',{
           done:true
        })
        
    }).catch(() =>{
        
        res.render('contact.hbs',{
            error:true    
        })
    });
}
});





app.post('/admin/upload-book',upload,(req,res) => {

    var myData = new book({
        bookname:req.body.bookname,
        Auther:req.body.Auther,
        tags:req.body.tags,
        file:req.file.filename,
        
        // coverimg:req.files.filename,
        
    })
    
    myData.save().then(() =>{
        // console.log(req.body);
        res.render('./Admin/book-upload.hbs',{
            submitted:true
           
        })
        
        
    }).catch(() =>{
        res.render('./Admin/book-upload.hbs',{
            notsubmitted:true
        })
    });
});


app.post('/newsletter',(req,res) => {
    const nl_email=req.body.nl_email;
    newsletter.findOne({nl_email:nl_email},function(err, found) {
        if(err){
            res.render("error.hbs")

        }
        if(found){
            res.render('index.hbs',{
                alSubscribed:true
            })
        }
        else{
            var myData = new newsletter(req.body)
            myData.save().then(() =>{
                
                res.render('index.hbs',{
                   Subscribed:true
                })
                
            }).catch(() =>{
                
                res.render('error.hbs')
            });
        }
    })
     
    

   
});








// ////////////////////////////////////////

app.get('/Placement-Prepration/interview-prep/write-interview-experience',auth,(req,res)=>{
       
        if(!req.data){
            res.render('write-int-exp.hbs',{
                notsignedin:true
             }
            )
        }
        else{
            res.render('write-int-exp.hbs',{
                signedin:true
            })

        }
    
})

app.post('/write-interview-experience',auth,(req,res)=>{
 
    const {compname,position,date_of_int,int_exp}=req.body;
    if(compname=="" || position=="" || int_exp==""){
        // res.redirect()
        req.flash('fillform','not filled');
       return res.redirect('/Placement-Prepration/interview-prep/write-interview-experience')

    }
    var mydata = req.data
    // console.log(int_exp)
    // console.log(hi)
var newdata = new interview_exp({
    compname:compname,
    position:position,
    int_exp :int_exp,
    date_of_int :date_of_int,
    // user:req.user._id
    userdata:mydata,
    userid:mydata._id,
    username:mydata.fullname,
})

// console.log(newdata)
newdata.save().then(()=>{
   
    req.flash('success','saved');
    res.redirect('/Placement-Prepration/interview-prep/write-interview-experience')

}).catch(()=>{
    req.flash('error','not saved')
    res.redirect('/Placement-Prepration/interview-prep/write-interview-experience')

})

   
})



app.get('/Placement-Prepration/interview-prep/interview-experience/:id/like',auth,(req,res)=>{
    // console.log(req.currentURL)
    const int_exp_id=req.params.id
     // Check if the int_exp exists
  interview_exp.findById(int_exp_id, (err, int_exp) => {
    if (err) {
    //   console.error('Error finding article:', err);
      return res.status(500).redirect('/Placement-Prepration/interview-prep/interview-experience');
    }
    
    if (!int_exp) {
      return res.status(404).redirect('/Placement-Prepration/interview-prep/interview-experience/');
    }
    
    // Check if the user has already liked the article (optional)
    const userId = req.data._id;
    if (int_exp.likes.includes(userId)) {
                req.flash('alreadyliked','You have already liked this post')

      return res.status(400).redirect('/Placement-Prepration/interview-prep/interview-experience/');
    }
    
    // Increment the like count and save the article
    int_exp.likes.push(userId);
    int_exp.save((err) => {
      if (err) {
        // console.error('Error saving article:', err);
        // req.flash('alreadyliked','You have already liked this post')
        return res.status(500).redirect('/Placement-Prepration/interview-prep/interview-experience/');
      }
      
      req.flash('liked','liked success')
      return res.status(200).redirect('/Placement-Prepration/interview-prep/interview-experience/');
    });
  });
})
//////////////////////////////////////////////////


// 
app.get('/services',(req,res)=>{
    res.render('services.hbs')
})
app.post('/get-in-touch',(req,res)=>{
    var myData = new servicecontact(req.body)
    myData.save().then(() =>{
        // console.log(req.body)
        res.render('services.hbs',{
            formsubmitted:true,
        })
     
        
    }).catch(() =>{
        // console.log('not saved')
        res.render('services.hbs',{
            notsubmitted:true,
        })
      
    });
    // res.render('services.hbs')
})

app.get('/admin/service-contact',adminauth,async(req,res)=>{
    var ser_contacts = await servicecontact.find({})
    .sort({date:-1})
    .limit(15)
    res.render('./Admin/service-contact.hbs',{
        ser_contacts,
    })

})


// =========== BOOK SEARCH  ===================
// app.post('/book-search/',(req,res)=>{

// })



//////////////////////////////////////////////////////////////////////
//              ADMIN ROUTES                    

app.get('/admin-profile',adminauth,(req,res)=>{
    var value= req.data;
  username = req.data.username,
  email = req.data.email,
  role = req.data.role,
    res.render('./Admin/admin-profile.hbs',{
        username,email,role
    })
})
app.get('/admin/members',adminauth,(req,res)=>{
    res.render('./Admin/members.hbs')
})



// const adminauth = async (req,res,next)=>{
//     try{
        


//         const token = req.cookies.adminjwt;
//         // console.log(token)
//         const verifyUser =jwt.verify(token,process.env.ADMINSEC_KEY);
//         // console.log('hi from verify user')

//         const data = await adminuser.findOne({_id:verifyUser._id})
//        req.token = token;
//        req.data = data;
//         next();

//     }
//     catch{
//         res.status(401).render('admin-login.hbs')
//     }
// }





app.post('/admin-register',(req,res) => {
    const {username,email,securitykey,role,password} = req.body;
    if (securitykey != process.env.SIGNUP_KEY){
        return res.render('./Admin/admin-login.hbs',{error:true})
    }
   if(password.length <8){
       return res.render('./Admin/admin-login.hbs',{error:true})
   }


    adminuser.findOne({email:email})
        .then((adminuserExist) => {
            if (adminuserExist){
                return res.status(422).render('./Admin/admin-login.hbs',{error:true});
            }
        

            

    var myData = new adminuser(req.body);
    // console.log(req.body);

    myData.save().then(() =>{
        res.render('./Admin/admin-login.hbs',{
            success:true
        });
        
    }).catch(() =>{
        res.send("error")
    });
}).catch(()=>{
    res.send('findone error')
})



});




app.post('/admin-login',async(req,res)=>{
    try {
        let admintoken;
        const {email , password} = req.body;

        const adminuserlogin = await adminuser.findOne({email:email});
        

      if (adminuserlogin){

            const matched = await bcrypt.compare(password,adminuserlogin.password);
            // console.log(matched)

            if(!matched){
                // console.log('hi from not matched')
            res.status(400).render('./Admin/admin-login.hbs',{
        
                loginerror:true
            })

             }
              else{
                admintoken = await adminuserlogin.generateAuthToken();
                // console.log(token);
                res.cookie("adminjwt",admintoken,{
                    expires:new Date(Date.now()+28800000),
                    httpOnly:true
                })
            res.redirect('/admin')
              }

        }
        else{
            res.render('./Admin/admin-login.hbs',{
                loginerror:true
            })
        }

        

    } catch (error) {
        res.send('login-error')
    }
    

})

        //  LOGOUT ROUTES           //

        app.get('/admin-logout',adminauth, async (req,res)=>{
            try{
    
                //          DELETING CURRENT TOKEN FROM DATABSE         ///
    
                req.data.tokens = req.data.tokens.filter((currentToken)=>{
                    return currentToken.token != req.token
                })
    
                //          OR JUST CLEAR COOKIES           //
                res.clearCookie("adminjwt");
    
    
                await req.data.save();
                res.redirect('/admin');
            }
            catch{
                res.status(500).send('error')
            }
        })







        // app.use(express.text())

app.get('/ads.txt',(req,res)=>{
    res.render('ads.txt')
})
app.get('sitemap.xml',(req,res)=>{
    res.render('/sitemap.xml')
})
app.get('*',(req,res)=>{
    res.render('error.hbs')
})


app.listen(port, ()=>{
    console.log( `the app has started at ${port}` );
});