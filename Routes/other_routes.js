const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const { count } = require('console');
const session = require('express-session');
const bodyParser = require("body-parser");
const fs = require("fs");

const { format } = require('date-fns');
// const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

const cookieParser = require('cookie-parser')
app.use(cookieParser());

const job_updates = require('../modals/job_up')
const book = require('../modals/book')
const user = require('../modals/user')
const auth = require('../middleware/auth')
const adminauth = require('../middleware/adminauth')


//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())



const multer  = require('multer')


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


module.exports = function (app) {


    // JOB UPDATES ROUTES 
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



//  BOOK ROUTES
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



// =========    NEWS LETTER ============
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






// ===========   SERVICES PAGES     =========
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



// ====================================================


// =======  BLOGS   ================
app.get('/blogs',(req,res)=>{
    res.render('blog.hbs')
})
app.get('/blogs/top-10-technology-to-learn-in-2023',(req,res)=>{
    res.render('./Blogs/tech_in_23.hbs')
})
app.get('/blogs/Google-interview-Warmup-best-tool-for-interview-prepration',(req,res)=>{
    res.render('./Blogs/interview_warmup.hbs')
})
app.get('/blogs/15-ChatGPT-Promts-to-get-started-increase-productivity-and-make-100%-use-of-it',(req,res)=>{
    res.render('./Blogs/ChatGPT_promts.hbs')
})
app.get('/blogs/Getting-started-with-react',(req,res)=>{
    res.render('./Blogs/react.hbs')
})
app.get('/blogs/Python-Primer-A-Beginner-Step-by-Step-Introduction',(req,res)=>{
    res.render('./Blogs/python.hbs')
})
app.get('/blogs/What-is-undifined-and-null',(req,res)=>{
    res.render('./Blogs/unvsnull.hbs')
})
app.get('/blogs/Explore-the-world-of-web-development',(req,res)=>{
    res.render('./Blogs/web_dev.hbs')
})
app.get('/blogs/5-Best-books-to-get-started-with-your-programming-journey',(req,res)=>{
    res.render('./Blogs/book_tut.hbs')
})
app.get('/blogs/10-Best-AI-tools-for-students-and-developer',(req,res)=>{
    res.render('./Blogs/ai_tools.hbs')
})



}