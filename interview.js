const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const PPinterview = require('./modals/ppinterview');
const interview_exp = require('./modals/interview_exp');
const bodyParser = require("body-parser");
const { count } = require('console');



//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())


module.exports = function (app) {
    app.get('/Placement-Prepration/interview-prep/HR-interview',(req,res)=>{
        res.render('intev-ques-list.hbs')
    })
    
app.get('/Placement-Prepration/interview-prep/interview-experience',async (req,res)=>{
    const int_exp=await interview_exp.find({})
    .sort({date:-1})
    const formatted_int_exp = int_exp.map((exp) => {
        const date = new Date(exp.date_of_int);
        const post_date = new Date(exp.date);
        const formattedDate = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
            const formattedPostDate = post_date.toLocaleString('en-US', options);

            const likes= exp.likes.length
            // console.log(likes)
        return {
          ...exp.toObject(),
          date_of_int: formattedDate,
          date:formattedPostDate,
          likes:likes,
        };
      });

      
      
    res.render('interview-exp.hbs',{
        int_exp,  int_exp: formatted_int_exp
    })
})
 

    
    app.get('/Placement-Prepration/interview-prep/HR-interview/HR-questions',async(req,res)=>{
        const PP_HR_int= await PPinterview.find({'type':'HR'}) 

                // PAGINATION 
    const {page=1,limit=15}=req.query;
    var nextp=parseInt(page)+1;
    var prevp=parseInt(page)-1;
    if (nextp==2){
        var firstpage=nextp
    }
    var hasnext =1;
    const lastpage=await PPinterview.find({'type':'HR'}).countDocuments()/limit
    if(lastpage>page){
         hasnext=null;
    }
// console.log(PP_HR_int)
        res.render('ques-list.hbs',{
            PP_HR_int,prevp,firstpage, hasnext

        })
    })
    
    app.get('/Placement-Prepration/interview-prep/DSA-Interview-Questions', async(req,res)=>{
        const PP_DSA_int= await PPinterview.find({'type':'DSA'}) 
        // console.log(PP_DSA_int)
        
          // PAGINATION 
    const {page=1,limit=15}=req.query;
    var nextp=parseInt(page)+1;
    var prevp=parseInt(page)-1;
    if (nextp==2){
        var firstpage=nextp
    }
    var hasnext =1;
    const lastpage=await PPinterview.find({'type':'DSA'}).countDocuments()/limit
    if(lastpage>page){
         hasnext=null;
    }
        res.render('ques-list.hbs',{
            PP_DSA_int,nextp,prevp,firstpage, hasnext
        })

    })
    app.get('/Placement-Prepration/interview-prep/DSA-interview-questions/:id/:question', async(req,res)=>{
        const DSA_int= await PPinterview.findById(req.params.id) 
        const rel_int= await PPinterview.find({'type':'DSA'}) 
        .sort({date:-1})
        .limit(10)
        res.render('question.hbs',{
            DSA_int,rel_int,
        })
     
    })
    app.get('/Placement-Prepration/interview-prep/cpp-interview-questions', async(req,res)=>{
        const PP_Cpp_int= await PPinterview.find({'type':'Cpp'}) 
        
        // console.log(PP_Cpp_int)

                // PAGINATION 
    const {page=1,limit=15}=req.query;
    var nextp=parseInt(page)+1;
    var prevp=parseInt(page)-1;
    if (nextp==2){
        var firstpage=nextp
    }
    var hasnext =1;
    const lastpage=await PPinterview.find({'type':'Cpp'}).countDocuments()/limit
    if(lastpage>page){
         hasnext=null;
    }
        res.render('ques-list.hbs',{
            PP_Cpp_int,prevp,firstpage, hasnext
        })

    })
    app.get('/Placement-Prepration/interview-prep/cpp-interview-questions/:id/:question', async(req,res)=>{
        const Cpp_int= await PPinterview.findById(req.params.id) 
        const rel_int= await PPinterview.find({'type':'Cpp'}) 
        .sort({date:-1})
        .limit(10)
        res.render('question.hbs',{
            Cpp_int,rel_int,
        })
     
    })
    app.get('/Placement-Prepration/interview-prep/java-interview-questions', async(req,res)=>{
        const PP_Java_int= await PPinterview.find({'type':'Java'}) 

        // console.log(PP_Java_int)
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
        res.render('ques-list.hbs',{
            PP_Java_int,prevp,firstpage, hasnext
        })

    })
    app.get('/Placement-Prepration/interview-prep/java-interview-questions/:id/:question', async(req,res)=>{
        const Java_int= await PPinterview.findById(req.params.id) 
        const rel_int= await PPinterview.find({'type':'Java'}) 
        .sort({date:-1})
        .limit(10)
        res.render('question.hbs',{
            Java_int,rel_int
        })
     
    })
    app.get('/Placement-Prepration/interview-prep/python-interview-questions', async(req,res)=>{
        const PP_Python_int= await PPinterview.find({'type':'Python'}) 

                // PAGINATION 
    const {page=1,limit=15}=req.query;
    var nextp=parseInt(page)+1;
    var prevp=parseInt(page)-1;
    if (nextp==2){
        var firstpage=nextp
    }
    var hasnext =1;
    const lastpage=await PPinterview.find({'type':'Python'}).countDocuments()/limit
    if(lastpage>page){
         hasnext=null;
    }
        // console.log(PP_DSA_int)
        res.render('ques-list.hbs',{
            PP_Python_int,prevp,firstpage, hasnext
        })

    })
    app.get('/Placement-Prepration/interview-prep/python-interview-questions/:id/:question', async(req,res)=>{
        const Python_int= await PPinterview.findById(req.params.id) 
        const rel_int= await PPinterview.find({'type':'Python'}) 
        .sort({date:-1})
        .limit(10)
        res.render('question.hbs',{
            Python_int,rel_int
        })
     
    })
    app.get('/Placement-Prepration/interview-prep/HR-interview-questions/:id/:question', async(req,res)=>{
        const HR_int= await PPinterview.findById(req.params.id) 
        const rel_int= await PPinterview.find({'type':'HR'}) 
        .sort({date:-1})
        .limit(10)
        res.render('question.hbs',{
            HR_int,rel_int
        })
     
    })

  
}