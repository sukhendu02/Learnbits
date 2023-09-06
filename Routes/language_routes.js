const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const { count } = require('console');
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

app.post('/language/upload/c',adminauth,(req,res) => {
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

app.post('/language/upload/python',adminauth,(req,res) => {
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

app.post('/language/upload/java',adminauth,(req,res) => {
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

app.post('/language/upload/javascript',adminauth,(req,res) => {
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

 


}