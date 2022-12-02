const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 80;
var fs = require('fs');
const hbs = require('hbs');
// const url = require('url');
const multer  = require('multer')
// const mongoose =require('mongoose')
const newsletter = require('./modals/newsletter')
const MEMCQ =require('./modals/MEMCQ')
const CSEITMCQ = require('./modals/CSEITMCQ')
const adminuser= require('./modals/adminuser')
const nodemon=require("nodemon")



const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const cookieParser = require('cookie-parser')

var mcq = require('./mcq')(app);
// module.exports = app;
// require('./memcq')


//----------COOKIE PARSER-----------//
app.use(cookieParser());



// CONNECTION TO DATA-BASE OR MONGODB THROUGH MONGOOSE
const mongoose = require("mongoose");
const { EFAULT } = require("constants");
const { error } = require("console");
mongoose.connect("mongodb://localhost:27017/edu-app",{useNewUrlParser:true, useUnifiedTopology:true})
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
        default:Date.now()},
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
        this.cpassword = await bcrypt.hash(this.cpassword,12)

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
        res.status(401).render('login.hbs')
    }
}



// =========== AUTH FOR ADMINUSER


const adminauth = async (req,res,next)=>{
    try{
        
        const token = req.cookies.adminjwt;
        // console.log(token)
        const verifyUser =jwt.verify(token,process.env.ADMINSEC_KEY);
        // console.log('hi from verify user')

        const data = await adminuser.findOne({_id:verifyUser._id})
       req.token = token;
       req.data = data;
        next();

    }
    catch{
        res.status(401).render('./Admin/admin-login.hbs')
    }
}



    

//============     SCHEMA FOR LANGUAGE QUEASTIONS  =================

const CSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now()
    }
    
  })

 const C = mongoose.model('C', CSchema);
 module.exports=C;



 const CppSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now()
    }
    
  })

 const Cpp = mongoose.model('Cpp', CppSchema);
 module.exports=Cpp;



 const PythonSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now()
    }
    
  })

 const Python = mongoose.model('Python', PythonSchema);
 module.exports=Python;

 const javaSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now()
    }
    
  })

 const java = mongoose.model('java', javaSchema);
 module.exports=java;

 const javascriptSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now()
    }
    
  })

 const javascript = mongoose.model('javascript', javascriptSchema);
 module.exports=javascript;


//  ======SCHEMA FOR PP============

const PPQASchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now()
    }
    
  })

 const PPQA= mongoose.model('PPQA', PPQASchema);
 module.exports=PPQA;

 const PPLRSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now()
    }
    
  })

 const PPLR = mongoose.model('PPLR', PPLRSchema);
 module.exports=PPLR;

 const PPenglishSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now()
    }
    
  })

 const PPenglish = mongoose.model('PPenglish', PPenglishSchema);
 module.exports=PPenglish;

 const PPcodingSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now()
    }
    
  })

 const PPcoding = mongoose.model('PPcoding', PPcodingSchema);
 module.exports=PPcoding;

 const PPinterviewSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now()
    }
    
  })

 const PPinterview = mongoose.model('PPinterview', PPinterviewSchema);
 module.exports=PPinterview;


 const bookSchema = new mongoose.Schema({
    bookname: String,
    Auther: String,
    tags: String,
    file:String,
    // coverimg:String,
    date:{type:Date,default:Date.now()
    }
    
  })

 const book = mongoose.model('book',bookSchema);
 module.exports=book;
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
  
    date:{type:Date,default:Date.now()
    }
    
  })

 const cseit = mongoose.model('cseit', cseitSchema);
 module.exports=cseit;

 const MESchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
  
    date:{type:Date,default:Date.now()
    }
    
  })

 const ME = mongoose.model('ME', MESchema);
 module.exports=ME;


 const contactSchema = new mongoose.Schema({
    con_name: String,
    con_email: String,
    subject: String,
    message:String,
  
    date:{type:Date,default:Date.now()
    }
    
  })

 const contact = mongoose.model('contact', contactSchema);
 module.exports=contact;


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

app.get('/register',(req,res)=>{
    if(req.cookies.jwt){
        res.redirect('/')
    }else
    res.render('register.hbs')
})
app.get('/profile',auth,(req,res)=>{
  var value= req.data;
  fullname = req.data.fullname,
  email = req.data.email,
    res.render('profile.hbs',{
        fullname,email
    })
   
    
})
app.get('/About-us',(req,res)=>{
    res.render('about.hbs')
})





// ===========  REGISTRATION ROUTE   -==============       //

app.post('/register',(req,res) => {
    const {fullname,email,phone,password,cpassword} = req.body;

    user.findOne({email:email})
        .then((userExist) => {
            if (userExist){
                return res.status(422).render('register.hbs',{exist:true});
            }

            if (password != cpassword){
                return res.render('register.hbs',{passnotmatch:true})
            }
           if(password.length <8){
               return res.render('register.hbs',{min8:true})
           }
        

    var myData = new user(req.body);
    // console.log(req.body);

    myData.save().then(() =>{
        res.render('login.hbs',{
            success:true
        });
        
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
            res.status(400).render('login.hbs',{
        
                invalidcredential:true
            })

             }
              else{
                token = await userlogin.generateAuthToken();
                // console.log(token);

            
                res.cookie("jwt",token,{
                    expires:new Date(Date.now()+604800000),
                    httpOnly:true,
                    // loggedin:true
                })
            res.redirect('/')
              }

        }
        else{
            res.render('login.hbs',{
                notexist:true
            })
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
  
    app.get('/admin/language/delete/:id', async function (req,res){
        const Cs = await C.findByIdAndDelete(req.params.id)
        const Cpps = await Cpp.findByIdAndDelete(req.params.id)
        const Pythons = await Python.findByIdAndDelete(req.params.id)
        const javas = await java.findByIdAndDelete(req.params.id)
        const javascripts = await javascript.findByIdAndDelete(req.params.id)
        res.redirect('/admin/languages')
    })

    app.get('/admin/PP/delete/:id', async function (req,res){
        const PPQAs = await PPQA.findByIdAndDelete(req.params.id)
        const PPLRs = await PPLR.findByIdAndDelete(req.params.id)
        const PPenglishs = await PPenglish.findByIdAndDelete(req.params.id)
        const PPcodings = await PPcoding.findByIdAndDelete(req.params.id)
        const PPinterviews = await PPinterview.findByIdAndDelete(req.params.id)
        res.redirect('/admin/placement-prepration')
    })

    app.get('/admin/branch-wise/delete/:id', async function (req,res){
        const cseits = await cseit.findByIdAndDelete(req.params.id)
        const MEs = await ME.findByIdAndDelete(req.params.id)
       
        res.redirect('/admin/branch-wise')
    })

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
    


// ======== ADMIN'S SECRET PAGES============
app.get('/admin-login',(req,res)=>{
    res.render('./Admin/admin-login.hbs')

})
app.get('/admin',adminauth,(req,res)=>{
    res.render('./Admin/admin.hbs')
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
    const PPinterviews = await PPinterview.find({})
    .sort({date:-1})
    .limit(15)
    res.render('./Admin/placement-prep.hbs',{
        PPQAs,PPLRs,PPenglishs,PPcodings,PPinterviews
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
    const cpps = await Cpp.find({})
    const pythons = await Python.find({})
    const javas = await java.find({})
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
// ========== ROUTE FOR LANGUAGES ============

   
app.get('/language/cpp', async (req, res) => {
    const cpps = await Cpp.find({})
    
    .sort({date:-1})
     res.render('ques-list.hbs', {
        cpps,cppques:true
    
         })
 });
 
 app.get('/language/python', async (req, res) => {
    const Pythons = await Python.find({})
    .sort({date:-1})
     res.render('ques-list.hbs', {
        Pythons,python:true
    
         })
 });
 app.get('/language/c', async (req, res) => {
    const cs = await C.find({})
    .sort({date:-1})
     res.render('ques-list.hbs', {
        cs,C:true
    
         })
 });
 app.get('/language/java', async (req, res) => {
    const javas = await java.find({})
    .sort({date:-1})
     res.render('ques-list.hbs', {
        javas,java:true
    
         })
 });

 app.get('/language/javascript', async (req, res) => {
    const javascripts = await javascript.find({})
    .sort({date:-1})
     res.render('ques-list.hbs', {
        javascripts,javaScript:true
    
         })
 });
//  ========= ROUTE FOR BOOK==============
 app.get('/books', async (req, res) => {
    const {page=1,limit=2}=req.query;
    var nextp=parseInt(page)+1;
    var prevp=parseInt(page)-1;
    if (nextp==2){
        var firstpage=nextp
    }
    var lastpage=book.countDocuments()/limit

     
    const books = await book.find({}).limit(limit * 1).skip((page-1)*limit)
    .sort({date:-1})
     res.render('books.hbs',{
         books,nextp,prevp,firstpage,lastpage
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
    const PPcodings = await PPcoding.find({})
    .sort({date:-1})
     res.render('ques-list.hbs',{
         PPcodings,PPcoding:true
     })
 });
 app.get('/Placement-Prepration/interview-questions', async (req, res) => {
    const PPinterviews = await PPinterview.find({})
    .sort({date:-1})
     res.render('ques-list.hbs',{
         PPinterviews,PPinterview:true
     })
 });



// //// ========SHOWING FULL QUESTION ===========////
app.get('/language/cpp/:id/:question', async (req, res) => {
    const cpps = await Cpp.findById(req.params.id)
    res.render('question.hbs', {
        cpps,
    })
});

app.get('/language/c/:id/:question', async (req, res) => {
    const Cs = await C.findById(req.params.id)
    res.render('question.hbs', {
        Cs
    })
});
app.get('/language/java/:id/:question', async (req, res) => {
    const javas = await java.findById(req.params.id)
    res.render('question.hbs', {
        javas
    })
});
app.get('/language/python/:id/:question', async (req, res) => {
    const pythons = await Python.findById(req.params.id)
    res.render('question.hbs', {
        pythons
    })
});
app.get('/language/javascript/:id/:question', async (req, res) => {
    const javascripts = await javascript.findById(req.params.id)
    res.render('question.hbs', {
        javascripts
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
    const PPinterviews = await PPinterview.findById(req.params.id)
    res.render('question.hbs', {
        PPinterviews
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
    .skip(2)
    .sort({date:-1})
    res.render('book-download.hbs',{
        books,rel
    })
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
app.post('/upload/coding',(req,res) => {
    var myData = new PPcoding(req.body)
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
    var myData = new newsletter(req.body)
    myData.save().then(() =>{
        
        res.render('index.hbs',{
           Subscribed:true
        })
        
    }).catch(() =>{
        
        res.render('error.hbs')
    });
});

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

app.get('*',(req,res)=>{
    res.render('error.hbs')
})


app.listen(port, ()=>{
    console.log( `the app has started at ${port}` );
});