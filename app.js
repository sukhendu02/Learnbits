const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");


const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

const port = process.env.PORT || process.env.PORT;
var fs = require('fs');
const hbs = require('hbs');
const nodemon=require("nodemon")

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer  = require('multer')

const excel = require('exceljs');
// const mongoose =require('mongoose')



// IMPORTING MONGOOOSE SCHEMAS
const newsletter = require('./modals/newsletter')
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
const user = require('./modals/user')




const localtunnel = require('localtunnel');

// (async () => {
//   const tunnel = await localtunnel({ port: 80 });

//   // the assigned public url for your tunnel
//   // i.e. https://abcdefgjhij.localtunnel.me
//   tunnel.url;
//   console.log(tunnel.url)

//   tunnel.on('close', () => {
//     // tunnels are closed
    
//   });
// })();

// const socialLinkSchema = require("./modals/socialLinks");

// IMPORT EMAILS
// const reset_pass=require('./Email/reset-password')
const contest_register=require('./Email/contest_register')



// ===== OTHER DEPENDENCIES AND MODULES ===========

// REQUIRE SESSION
const session = require('express-session');
app.use(session({
    secret: process.env.SESSIONFLASH,
    resave: false,
    saveUninitialized: true
}));


// REQUIRE FLASH
const flash = require('express-flash');
app.use(flash());

// PASSWORD VALIDATOR
var passwordValidator = require('password-validator');
// Create a schema
var schema = new passwordValidator();



// ENVIRONMENT VARIABLES (DOT ENVE)


// COOKIES PARSER
//----------COOKIE PARSER-----------//
const cookieParser = require('cookie-parser')
app.use(cookieParser());











// CONNECTION TO DATA-BASE OR MONGODB THROUGH MONGOOSE
const mongoose = require("mongoose");
const { EFAULT } = require("constants");
const { error, Console } = require("console");
mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser:true, useUnifiedTopology:true})
 .then( () => console.log("successful"))
 .catch((err) => console.log(err));




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

// const uploadfile = multer({
//     storage: storage
// }).single('file');


//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())


const adminauth = require('./middleware/adminauth')
const auth = require('./middleware/auth')


// IMPORTING ROUTES
// var mcq = require('./mcq')(app);
// var interview = require('./interview')(intev);
// const contest=require('./contest')(app)
const interview=require('./Routes/interview')(app)
const admin=require('./admin')(app)
const forgot_pass = require('./Routes/forgot_pass')(app)
const admin_routes = require('./Routes/admin_routes')(app)
const profile_routes = require('./Routes/profile_routes')(app)
const language_routes = require('./Routes/language_routes')(app)
const pp_routes = require('./Routes/pp_routes')(app)
const contest_routes = require('./Routes/contest_routes')(app)
const other_routes = require('./Routes/other_routes')(app)

















const isLoggedIn = require('./middleware/isLoggedIn');






//  SCHEMA FOR USER REGEISTRATION 
// const userSchema = new mongoose.Schema({
   
//     fullname: String,
//     email: String,
//     // phone: Number,
//     password:String,
//     cpassword:String,
    
//     //NEW EDITS 
//     firstName:String,
//     lastName:String,
//     phone:String,
//     bio:String,
//     title:String,


//     currentEduStatus:String,

//    schoolDetails: {
//     schoolName: String,
//     grade: String,
// },

// collegeDetails: {
//     collegeName: String,
//     degree: String,
//     specialization: String,
//     passingYear: Number,
// },


// workDetails: {
//     companyName: String,
//     position: String,
// },
//  // Links
// socialLinks:{
//     LinkedinLink:String,
//     InstagramLink:String,
//     GithubLink:String,
//     myLink:String,
// },
  
  

//     // CUSTOM
//     Date:{ type:Date,
//         default:Date.now
//     },
//     tokens:[
//         {
//             token:{
//                 type:String,
//                 required:true
//             }
//         }
//     ]

    

// })

// userSchema.pre('save', async function (next) {
  
//     if(this.isModified('password')){
//         this.password = await bcrypt.hash(this.password,12)
       
//     }
// next();
    
// })
// userSchema.methods.generateAuthToken = async function(){
//     try{
//         let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY)
//        this.tokens = this.tokens.concat({token:token})
       
//        await this.save();
//        return token;
//     }
//     catch{
//         res.render('error.hbs')
//     }
// }

// const user = mongoose.model('user', userSchema);
// module.exports = user;


//              AUTHENTICATING USER SIGNED IN OR NOT            ///

// const auth = async (req,res,next)=>{
//     try{
        
//         const token = req.cookies.jwt;
//         // console.log(token)
//         const verifyUser =jwt.verify(token,process.env.SECRET_KEY);
//         // console.log(verifyUser)
        

//         const data = await user.findOne({_id:verifyUser._id,"tokens.token":token})
//        req.token = token;
//        req.data = data;
//     //    console.log(data.email)
       
       
//         next();

//     }
//     catch{
//         req.session.returnTo = req.originalUrl; 

//         res.status(401).render('login.hbs')
//     }
// }



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

// const auth = require('./middleware/auth')

    



//  FOR TEMPLETE ENGINE (HANDALBAR)
app.set("view engine","hbs");
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

// Define a custom equality helper
hbs.registerHelper('isEqual', function (value1, value2, options) {
    return value1 === value2 ? options.fn(this) : options.inverse(this);
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



var RSS = require('rss');
// =======  RSS FEED        ============





// Function to generate the RSS feed
 async function generateRSSFeed() {
    const feed = new RSS({
      title: 'Learnbits',
    //   description: 'Latest articles from my website',
      feed_url:`https://${process.env.DOMAIN_NAME}/rss`, // URL of your RSS feed
      site_url:`https://${process.env.DOMAIN_NAME}`, // URL of your website
    });
  

    const articles = await job_updates.find({})
    // console.log(articles)
    // Add articles to the feed
    articles.forEach((article) => {
        feed.item({
            title: article.title,
            // description: article.job_details,
            url:`http://${process.env.DOMAIN_NAME}/latest-updates/${article._id}/${article.title}`,
        date: article.date,
      });

    });
//   console.log(feed)
    return feed.xml({ indent: true }); // Return the XML content
  }
  




// Serve the RSS feed at /rss

  

app.get('/rss', async (req, res) => {
    try {
      const xml = await generateRSSFeed(); // Wait for the asynchronous operation to complete
      res.type('application/xml');
      res.send(xml);
    //   console.log(xml);
    } catch (error) {
      console.error('Error generating RSS feed:', error);
      // Handle the error appropriately, e.g., by sending an error response
      res.status(500).send('Error generating RSS feed');
    }
  });
  



 











   








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
        
    }).catch((err) =>{
        console.log(err)

        res.render('error.hbs')
    });
}).catch((err)=>{
    console.log(err)
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







  

 
  
  
// ======== ADMIN'S  PAGES============
app.get('/admin-login',(req,res)=>{
    res.render('./Admin/admin-login.hbs')

})
// app.get('/admin',adminauth,async(req,res)=>{

//     const totalusers=await user.countDocuments()
//     const totaladminusers=await adminuser.countDocuments()
//     const totalcontacts=await contact.countDocuments();
//     const totalC =await C.countDocuments()
//     const totalCpp=await Cpp.countDocuments()
//     const totaljava=await java.countDocuments()
//     const totalpython=await Python.countDocuments()
//     const totaljs=await javascript.countDocuments()
//     const totalbook=await book.countDocuments()
//     const totalPPcoding=await PPcoding.countDocuments()
//     const totalcontest=await contest.countDocuments()
//     const totalupdates=await job_updates.countDocuments()
//     const totalPPinterview=await PPinterview.countDocuments()
//     const total_Cpp_PPinterview=await PPinterview.countDocuments({'type':'Cpp'})
//     const total_Java_PPinterview=await PPinterview.countDocuments({'type':'Java'})
//     const total_Python_PPinterview=await PPinterview.countDocuments({'type':'Python'})
//     const total_HR_PPinterview=await PPinterview.countDocuments({'type':'HR'})
//     const total_DSA_PPinterview=await PPinterview.countDocuments({'type':'HR'})

//     var admindata = req.data
//     // console.log(admindata)

//     res.render('./Admin/admin.hbs',{
//         totalusers,totaladminusers,totalcontacts,totalC,totalCpp,totalpython,
//         totaljava,totaljs,totalbook,totalPPcoding,totalupdates,totalcontest,totalPPinterview,admindata
//         ,total_Cpp_PPinterview,total_Java_PPinterview,total_Python_PPinterview,total_HR_PPinterview,total_DSA_PPinterview
//     })
// })
// 

// app.get('/admin/language/upload/cpp',(req,res)=>{
//     res.render('./Admin/uploadquestion.hbs',{
//     cpp:true
// })
// })

// app.get('/admin/language/upload/c',(req,res)=>{
//     res.render('./Admin/uploadquestion.hbs',{
//     cques:true
// })
// })

// app.get('/admin/language/upload/java',(req,res)=>{
//     res.render('./Admin/uploadquestion.hbs',{
//     java:true
// })
// })

// app.get('/admin/language/upload/python',(req,res)=>{
//     res.render('./Admin/uploadquestion.hbs',{
//     python:true
// })
// })

// app.get('/admin/language/upload/javascript',(req,res)=>{
//     res.render('./Admin/uploadquestion.hbs',{
//     javascript:true
// })
// })

// app.get('/admin/placement-prepration',adminauth,async (req,res)=>{
//     const PPQAs = await PPQA.find({})
//     .sort({date:-1})
//     .limit(15)
//     const PPLRs = await PPLR.find({})
//     .sort({date:-1})
//     .limit(15)
//     const PPenglishs = await PPenglish.find({})
//     .sort({date:-1})
//     .limit(15)

//     const PPcodings = await PPcoding.find({})
// .sort({date:-1})
//     .limit(15)
//     const pp_interviews = await PPinterview.find({})
//     .sort({date:-1})
//     .limit(15)
//     const int_exp = await interview_exp.find({})
//     .sort({date:-1})
//     .limit(15)
//     // console.log(ppinterviews/)
//     res.render('./Admin/placement-prep.hbs',{
//         PPQAs,PPLRs,PPenglishs,PPcodings,pp_interviews,int_exp
//     })
// })
// app.get('/admin/placement-prepration/Quantitave-Aptitude',(req,res)=>{
//     res.render('./Admin/uploadquestion.hbs',{
//         PPQA:true
//     })
// })
// app.get('/admin/placement-prepration/Logical-reasoning',(req,res)=>{
//     res.render('./Admin/uploadquestion.hbs',{
//         PPLR:true
//     })
// })
// app.get('/admin/placement-prepration/English',(req,res)=>{
//     res.render('./Admin/uploadquestion.hbs',{
//         PPenglish:true
//     })
// })
// app.get('/admin/placement-prepration/coding',(req,res)=>{
//     res.render('./Admin/uploadquestion.hbs',{
//         PPcoding:true
//     })
// })
// app.get('/admin/placement-prepration/interview-quesiton',(req,res)=>{
//     res.render('./Admin/uploadquestion.hbs',{
//         PPinterview:true
//     })
// })

// app.get('/admin/languages',adminauth,async (req,res)=>{
//     const Cs = await C.find({})
//     .sort({date:-1})
//     .limit(10)
//     const cpps = await Cpp.find({})
//     .sort({date:-1})
//     .limit(10)
//     const pythons = await Python.find({})
//     .sort({date:-1})
//     .limit(10)
//     const javas = await java.find({})
//     .sort({date:-1})
//     .limit(10)
//     const javascripts = await javascript.find({})
//     .sort({date:-1})
//     .limit(10)

//     res.render('./Admin/languages.hbs',{
//         Cs,cpps,pythons,javas,javascripts
//     })
// })

// app.get('/admin/contacts',(req,res)=>{
//     res.render('./Admin/showcontacts.hbs')
// })






// ========== ADMIN CONTEST ROUTES  ==============
const { format } = require('date-fns');
const { userInfo } = require("os");


function formatDate(date) {
    const formattedDate = format(new Date(date), 'MMM dd yyyy h:mm a');
    return formattedDate;
  }

//  ========= ROUTE FOR BOOK==============

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









// FOR DISPLAYING STATIC FILES

const staticPath = path.join(__dirname,"/public");
app.use(express.static(staticPath));











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




//////////////////////////////////////////////////////////////////////
//              ADMIN ROUTES                    





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