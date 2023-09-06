const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const session = require('express-session');

// const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const cookieParser = require('cookie-parser')

app.use(cookieParser());



// IMPORTING MONGOOOSE SCHEMAS
const newsletter = require('../modals/newsletter')
const PPinterview = require('../modals/ppinterview.js')
const adminuser= require('../modals/adminuser')
const job_updates= require('../modals/job_up')
const servicecontact= require('../modals/servicecontact')
const interview_exp = require('../modals/interview_exp');
const contest = require('../modals/contest')
const C =require('../modals/C')
const Cpp =require('../modals/Cpp')
const Python =require('../modals/Python')
const java =require('../modals/java')
const javascript =require('../modals/javascript')
const contact =require('../modals/contact')
const PPQA = require('../modals/PP/PPQA')
const PPLR = require('../modals/PP/PPLR')
const PPenglish = require('../modals/PP/PPenglish')
const PPcoding = require('../modals/PP/PPcoding')
const book = require('../modals/book')
const user = require('../modals/user')

//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())


const adminauth = require('../middleware/adminauth.js')

module.exports = function (app) {

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
            totalusers,
            totaladminusers,totalcontacts,totalC,totalCpp,totalpython,
            totaljava,totaljs,totalbook,totalPPcoding,totalupdates,totalcontest,totalPPinterview,admindata
            ,total_Cpp_PPinterview,total_Java_PPinterview,total_Python_PPinterview,total_HR_PPinterview,total_DSA_PPinterview
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

    // ==== ADMIN LANGUAGE GET  ROUTES ====

    
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
    
    app.get('/admin/language/upload/cpp',adminauth,(req,res)=>{
        res.render('./Admin/uploadquestion.hbs',{
        cpp:true
    })
    })
    
    app.get('/admin/language/upload/c',adminauth,(req,res)=>{
        res.render('./Admin/uploadquestion.hbs',{
        cques:true
    })
    })
    
    app.get('/admin/language/upload/java',adminauth,(req,res)=>{
        res.render('./Admin/uploadquestion.hbs',{
        java:true
    })
    })
    
    app.get('/admin/language/upload/python',adminauth,(req,res)=>{
        res.render('./Admin/uploadquestion.hbs',{
        python:true
    })
    })
    
    app.get('/admin/language/upload/javascript',adminauth,(req,res)=>{
        res.render('./Admin/uploadquestion.hbs',{
        javascript:true
    })
    })


    // ==== ADMIN PLACEMENT PREPRATION  ====

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

    app.get('/admin/placement-prepration/Quantitave-Aptitude',adminauth,(req,res)=>{
        res.render('./Admin/uploadquestion.hbs',{
            PPQA:true
        })
    })
    app.get('/admin/placement-prepration/Logical-reasoning',adminauth,(req,res)=>{
        res.render('./Admin/uploadquestion.hbs',{
            PPLR:true
        })
    })
    app.get('/admin/placement-prepration/English',adminauth,(req,res)=>{
        res.render('./Admin/uploadquestion.hbs',{
            PPenglish:true
        })
    })
    app.get('/admin/placement-prepration/coding',adminauth,(req,res)=>{
        res.render('./Admin/uploadquestion.hbs',{
            PPcoding:true
        })
    })
    app.get('/admin/placement-prepration/interview-quesiton',adminauth,(req,res)=>{
        res.render('./Admin/uploadquestion.hbs',{
            PPinterview:true
        })
    })




    // 
    app.get('/admin/manage-contest/create-contest',adminauth,(req,res)=>{
        res.render('./Admin/create-contest.hbs')
    })



  // ADIMIN JOB UPDATE ROUTES

  app.get('/admin/job-updates',adminauth,async(req,res)=>{

    const recent_post=await job_updates.find({}).limit(15)
.sort({date:-1})

    res.render('./Admin/add-job-updates',{
        recent_post,
    })
})


app.get('/admin/latest-updates/delete/:id',async (req,res)=>{
    const del_post = await job_updates.findByIdAndDelete(req.params.id);
    res.redirect('/admin/job-updates')
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



        app.get('/admin/book/delete/:id', async function (req,res){
            const books = await book.findByIdAndDelete(req.params.id)
           
            res.redirect('/admin/upload-book')
        })

  app.get('/admin/contacts/delete/:id', async function (req,res){
        const contacts = await contact.findByIdAndDelete(req.params.id)
       
        res.redirect('/admin/contacts')
    })


    // OTHER PAGES 
    app.get('/admin/service-contact',adminauth,async(req,res)=>{
        var ser_contacts = await servicecontact.find({})
        .sort({date:-1})
        .limit(15)
        res.render('./Admin/service-contact.hbs',{
            ser_contacts,
        })
    
    })
// book routes
    app.get('/admin/upload-book',adminauth, async (req,res)=>{

        const recups= await book.find({})
        .sort({date:-1})
        res.render('./Admin/book-upload.hbs',{
            recups
        })
    })

    // ADMIN PROFILE PAGE 
    app.get('/admin-profile',adminauth,(req,res)=>{
        var value= req.data;
      username = req.data.username,
      email = req.data.email,
      role = req.data.role,
        res.render('./Admin/admin-profile.hbs',{
            username,email,role
        })
    })

    // SHOW ALL MEMBERS PAGE
    app.get('/admin/members',adminauth,(req,res)=>{
        res.render('./Admin/members.hbs')
    })
    // SHOW ALL CONTACTS

    app.get('/admin/contacts',adminauth, async (req, res) => {
        const contacts = await contact.find({})
        .sort({date:-1})
         res.render('./Admin/showcontacts.hbs',{
             contacts
         })
     });












    //  CURRENTLY NOT IN USE ROUTES 

     // // =========    MCQS    ================
// app.get('/admin/mcqs',adminauth,async (req,res)=>{
//     const CSEITMCQs = await CSEITMCQ.find({})
//     .sort({date:-1})
//     .limit(30)
//     const MEMCQs = await MEMCQ.find({})

//     .sort({date:-1})
//     .limit(30)
    
//     res.render('./Admin/mcq.hbs',{
//         CSEITMCQs,MEMCQs
//     })
// })
// app.get('/admin/mcqs/upload-ME',(req,res)=>{
//     res.render('./Admin/upload-mcq.hbs',{
//         ME:true
//     })
// })
// app.get('/admin/mcqs/upload-CSE-IT',(req,res)=>{
//     res.render('./Admin/upload-mcq.hbs',{
//         cseit:true
//     })
// })


//  ========= ROUTE FOR UPLOADING QUESTION==========

// app.get('/admin/upload/cse-it',(req,res)=>{
//     res.render('./Admin/uploadquestion.hbs',{
//     cseit:true
// })
// })
// app.get('/admin/upload/ME',(req,res)=>{
//     res.render('./Admin/uploadquestion.hbs',{
//     ME:true
// })
// })


}