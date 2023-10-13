const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const PPinterview = require('../modals/ppinterview');
const interview_exp = require('../modals/interview_exp');
const bodyParser = require("body-parser");
const { count } = require('console');



//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

const auth = require('../middleware/auth')

module.exports = function (app) {
    app.get('/interview-prep/HR-interview',(req,res)=>{
        res.render('intev-ques-list.hbs')
    })
    
app.get('/interview-prep/interview-experience',async (req,res)=>{
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
 

    
    app.get('/interview-prep/HR-interview/HR-questions',async(req,res)=>{
        
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
        const PP_HR_int= await PPinterview.find({'type':'HR'}).limit(limit * 1).skip((page-1)*limit)
        res.render('ques-list.hbs',{
            PP_HR_int,prevp,firstpage, hasnext,nextp

        })
    })
    
    app.get('/interview-prep/DSA-Interview-Questions', async(req,res)=>{
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
        const PP_DSA_int= await PPinterview.find({'type':'DSA'}).limit(limit * 1).skip((page-1)*limit) 
        res.render('ques-list.hbs',{
            PP_DSA_int,nextp,prevp,firstpage, hasnext,nextp
        })

    })
    app.get('/interview-prep/DSA-interview-questions/:id/:question', async(req,res)=>{
        const DSA_int= await PPinterview.findById(req.params.id) 
        const rel_int= await PPinterview.find({'type':'DSA'}) 
        .sort({date:-1})
        .limit(10)

        const nextques = await PPinterview.findOne({ _id: { $gt: DSA_int },'type':'DSA' }).sort({ _id: 1 }).limit(1);
        const prevques = await PPinterview.findOne({ _id: { $lt: DSA_int },'type':'DSA' }).sort({ _id: -1 }).limit(1);

        res.render('question.hbs',{
            DSA_int,rel_int,nextques,prevques
        })
     
    })
    app.get('/interview-prep/cpp-interview-questions', async(req,res)=>{
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
        const PP_Cpp_int= await PPinterview.find({'type':'Cpp'}).limit(limit * 1).skip((page-1)*limit)
        res.render('ques-list.hbs',{
            PP_Cpp_int,prevp,firstpage, hasnext,nextp
        })

    })
    app.get('/interview-prep/cpp-interview-questions/:id/:question', async(req,res)=>{
        const Cpp_int= await PPinterview.findById(req.params.id) 
        const rel_int= await PPinterview.find({'type':'Cpp'}) 
        .sort({date:-1})
        .limit(10)
        const nextques = await PPinterview.findOne({ _id: { $gt: Cpp_int },'type':'Cpp' }).sort({ _id: 1 }).limit(1);
        const prevques = await PPinterview.findOne({ _id: { $lt: Cpp_int },'type':'Cpp' }).sort({ _id: -1 }).limit(1);

        res.render('question.hbs',{
            Cpp_int,rel_int,nextques,prevques,
        })
     
    })
    app.get('/interview-prep/java-interview-questions', async (req,res)=>{
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
    // console.log('This is page',page)
    // console.log('this is limit',limit)
    // console.log((page-1)*limit)
        const PP_Java_int= await w.find({'type':'Java'}).limit(limit * 1).skip((page-1)*limit)
.sort({date:1})
        // console.log(PP_Java_int)
   
        res.render('ques-list.hbs',{
            PP_Java_int,prevp,firstpage, hasnext,nextp
        })

    })
    app.get('/interview-prep/java-interview-questions/:id/:question', async(req,res)=>{
        const Java_int= await PPinterview.findById(req.params.id) 
        const rel_int= await PPinterview.find({'type':'Java'}) 
        .sort({date:-1})
        .limit(10)

        const nextques = await PPinterview.findOne({ _id: { $gt: Java_int },'type':'Java' }).sort({ _id: 1 }).limit(1);
        const prevques = await PPinterview.findOne({ _id: { $lt: Java_int },'type':'Java' }).sort({ _id: -1 }).limit(1);

        res.render('question.hbs',{
            Java_int,rel_int,nextques,prevques
        })
     
    })
    app.get('/interview-prep/python-interview-questions', async(req,res)=>{
        
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
        const PP_Python_int= await PPinterview.find({'type':'Python'}).limit(limit * 1).skip((page-1)*limit)
        res.render('ques-list.hbs',{
            PP_Python_int,prevp,firstpage, hasnext,nextp
        })

    })
    app.get('/interview-prep/python-interview-questions/:id/:question', async(req,res)=>{
        const Python_int= await PPinterview.findById(req.params.id) 
        const rel_int= await PPinterview.find({'type':'Python'}) 
        .sort({date:-1})
        .limit(10)

        const nextques = await PPinterview.findOne({ _id: { $gt: Python_int },'type':'Python' }).sort({ _id: 1 }).limit(1);
        const prevques = await PPinterview.findOne({ _id: { $lt: Python_int },'type':'Python' }).sort({ _id: -1 }).limit(1);

        res.render('question.hbs',{
            Python_int,rel_int,nextques,prevques,
        })
     
    })
    app.get('/interview-prep/HR-interview-questions/:id/:question', async(req,res)=>{
        const HR_int= await PPinterview.findById(req.params.id) 
        const rel_int= await PPinterview.find({'type':'HR'}) 
        .sort({date:-1})
        .limit(10)

        const nextques = await PPinterview.findOne({ _id: { $gt: HR_int },'type':'HR' }).sort({ _id: 1 }).limit(1);
        const prevques = await PPinterview.findOne({ _id: { $lt: HR_int },'type':'HR' }).sort({ _id: -1 }).limit(1);


        res.render('question.hbs',{
            HR_int,rel_int,nextques,prevques
        })
     
    })


    ////////////
    ////  SHOW ALL INTERVIEW EXPERIENCE ////


    

    app.get('/interview-prep/interview-experience/:id/like',auth,(req,res)=>{
        // console.log(req.currentURL)
        const int_exp_id=req.params.id
         // Check if the int_exp exists
      interview_exp.findById(int_exp_id, (err, int_exp) => {
        if (err) {
        //   console.error('Error finding article:', err);
          return res.status(500).redirect('/interview-prep/interview-experience');
        }
        
        if (!int_exp) {
          return res.status(404).redirect('/interview-prep/interview-experience/');
        }
        
        // Check if the user has already liked the article (optional)
        const userId = req.data._id;
        if (int_exp.likes.includes(userId)) {
                    req.flash('alreadyliked','You have already liked this post')
    
          return res.status(400).redirect('/interview-prep/interview-experience/');
        }
        
        // Increment the like count and save the article
        int_exp.likes.push(userId);
        int_exp.save((err) => {
          if (err) {
            // console.error('Error saving article:', err);
            // req.flash('alreadyliked','You have already liked this post')
            return res.status(500).redirect('/interview-prep/interview-experience/');
          }
          
          req.flash('liked','liked success')
          return res.status(200).redirect('/interview-prep/interview-experience/');
        });
      });
    })
    

    app.get('/delete-interview-experience/:id',auth,async (req,res)=>{
        // const exp = 
        const exp = await interview_exp.findById(req.params.id)
        if(req.data._id!=exp.userid){
            res.redirect('/profile/contributions')
        }
        const del_exp= await interview_exp.findByIdAndDelete(exp._id)
        req.flash('itemdeleted','Item has been deleted')
        res.redirect('/profile/contributions')
    
      })



    //   =======    WRTIE INTERVIEW EXPERTIENCE     =========
    app.get('/interview-prep/write-interview-experience',auth,(req,res)=>{
       
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
       return res.redirect('/interview-prep/write-interview-experience')

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
    res.redirect('/interview-prep/write-interview-experience')

}).catch(()=>{
    req.flash('error','not saved')
    res.redirect('/interview-prep/write-interview-experience')

})

   
})
  
}