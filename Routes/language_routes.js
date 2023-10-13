const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const { count, error } = require('console');
const session = require('express-session');

// const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const cookieParser = require('cookie-parser')

app.use(cookieParser());

const auth = require('../middleware/auth')
const adminauth = require('../middleware/adminauth')

//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())







const C =require('../modals/C')
const Cpp =require('../modals/Cpp')
const Python =require('../modals/Python')
const java =require('../modals/java')
const javascript =require('../modals/javascript')









module.exports = function (app) {
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






// ======== POST DATA ROUTES ===============


app.post('/language/upload/cpp',adminauth,(req,res) => {
    const parsedTopic = req.body.topic ? JSON.parse(req.body.topic) : [];

    var myData = new Cpp({
        question: req.body.question,
  topic: parsedTopic,
  answer: req.body.answer,
  level: req.body.level,
    })
    myData.save().then(() =>{
        // res.send('sucess')
        res.render('./Admin/uploadquestion.hbs',{
            cpp:true,submitted:true
        })
        // ));
    }).catch((error) =>{
        // res.send("error")
        console.log(error)
        res.render('./Admin/uploadquestion.hbs',{
            cpp:true,notsubmitted:true
        })
    });
});

app.post('/language/upload/c',adminauth,(req,res) => {
    const parsedTopic = req.body.topic ? JSON.parse(req.body.topic) : [];

    var myData = new C(
        {
            question: req.body.question,
            topic: parsedTopic,
            answer: req.body.answer,
            level: req.body.level,
        }
    )
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

app.post('/language/upload/python',adminauth,(req,res) => {
    const parsedTopic = req.body.topic ? JSON.parse(req.body.topic) : [];

    var myData = new Python({
        question: req.body.question,
        topic: parsedTopic,
        answer: req.body.answer,
        level: req.body.level,
    }
    )
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

app.post('/language/upload/java',adminauth,(req,res) => {
    const parsedTopic = req.body.topic ? JSON.parse(req.body.topic) : [];

    var myData = new java({
        question: req.body.question,
        topic: parsedTopic,
        answer: req.body.answer,
        level: req.body.level,
    })
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

app.post('/language/upload/javascript',adminauth,(req,res) => {
    const parsedTopic = req.body.topic ? JSON.parse(req.body.topic) : [];

    var myData = new javascript(
        {
            question: req.body.question,
            topic: parsedTopic,
            answer: req.body.answer,
            level: req.body.level,
        }
    )
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

 





// ==== UPDATE ROUTES   ====
// app.get('/admin/languages/update/c/:id',adminauth,async(req,res)=>{

//     try
//     {

   
//     var ques_id = req.params.id
//     const ques_details = await C.findById(ques_id)
    
//     res.render('./Admin/updatequestion.hbs',{
//         cques:true,ques_details,
//     })

// }
// catch(error){
//     console.log(error)
// }
// })

// ==== UPDATE ROUTES ====
app.get('/admin/languages/update/c/:id', adminauth, async (req, res) => {
    const ques_id = req.params.id;
  
    try {
      const ques_details = await C.findById(ques_id);
  
      if (!ques_details) {
        // Handle the case where the document with the provided ID was not found
        return res.status(404).send('Question not found');
      }
  




      res.render('./Admin/updatequestion.hbs', {
        cques: true,
        ques_details,
      });
    } catch (error) {
      // Handle any other errors that might occur during the database query
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
app.post('/language/update/c/:id',adminauth,async(req,res) => {
    try {
        const ques_id = req.params._id; 
    const {question,answer,level}  = req.body;
 
       // Update user data
       const updatedC = await C.findByIdAndUpdate(userId, {
        question,
    answer,
        level,
      
    }, { new: true });

    // Send back updated user data as a response
    // res.status(200).json({ user: updatedUser });
    req.flash('editSuccess','Changes Saved')
    res.redirect('/admin')
    }
    catch (error) {
        // console.log(error)
        // res.status(500).json({ error: 'An error occurred while updating the profile.' });
        req.flash('editError','There is some problem')
        res.redirect('/admin')
    }
});


}