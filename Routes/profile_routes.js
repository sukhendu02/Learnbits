const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const { count } = require('console');
const session = require('express-session');
const transaction = require('../modals/transaction')

// const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const cookieParser = require('cookie-parser')

app.use(cookieParser());

const auth = require('../middleware/auth')
const user = require('../modals/user')
const interview_exp = require('../modals/interview_exp')
const contest = require('../modals/contest')


//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())


const { format } = require('date-fns');
const { userInfo } = require("os");

module.exports = function (app) {
    app.get('/profile2',auth, async(req,res)=>{
        var value= req.data;
        const mydata = req.data
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
              fullname,email,contributions,myContests,mydata
          })
         
          
      })
    app.get('/profile',auth, async(req,res)=>{
        var value= req.data;
        const my_data= req.data;
        // console.log(my_data)
        const my_int_exp = await interview_exp.find({userid:value._id}).sort({date:-1})
        const tot_my_int_exp = my_int_exp.length
          // Find contests where the user has participated
          const myContests = await contest.find({ 'participants._id': req.data.id }).sort({ date: -1 });
    
           myContests.forEach(contest => {
                contest.participantCount = contest.participants.length;
               
               
            });
         const tot_contest =  myContests.length
    
        // console.log(contributions)
        fullname = req.data.fullname;
        email = req.data.email;
    
       
          res.render('profile2.hbs',{
              fullname,email,
              my_int_exp,
              myContests,
              tot_my_int_exp,my_data,tot_contest
          })
         
          
      })
      app.get('/profile/contest',auth,async(req,res)=>{
        const my_data = req.data;
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
            fullname = req.data.fullname,
            email = req.data.email,
            
        res.render('./profile/p_contest.hbs',{
            fullname,email,myContests,my_data
    
        })
      })
    
      app.get('/profile/my-wallet',auth,async(req,res)=>{
        const my_data = req.data;
        fullname = req.data.fullname,
            email = req.data.email
            const myTransactions = await transaction.find({ user: my_data._id }).sort({ createdAt: -1 });
            console.log(myTransactions)
            res.render('./profile/wallet.hbs',{
                fullname,email,my_data,myTransactions
            })
      })
      app.get('/profile/contributions',auth,async(req,res)=>{
        var value= req.data;
        const my_data= req.data
    
        const my_int_exp = await interview_exp.find({userid:value._id}).sort({date:-1})
        const tot_my_int_exp = my_int_exp.length
       
    
        fullname = req.data.fullname,
        email = req.data.email,
        res.render('./profile/contribution.hbs',{
            my_int_exp,tot_my_int_exp,fullname,email,my_data
        })
      })
    
      app.get('/profile/edit',auth,async(req,res)=>{
        const my_data = req.data;
        fullname = req.data.fullname;
            email = req.data.email;
        
        res.render('./profile/edit_profile.hbs',{
            my_data,fullname,email,
        })
      })
      app.post('/profile/edit/basic-details',auth, async(req,res)=>{
        try {
            const userId = req.data._id; 
        const {firstName,lastName,phone,bio,customTitle}  = req.body;
            let title =req.body.title
        if (title === 'other') {
            title = customTitle;
        }
           // Update user data
           const updatedUser = await user.findByIdAndUpdate(userId, {
            firstName,
            lastName,
            phone,
            bio,
            title,
        }, { new: true });
    
        // Send back updated user data as a response
        // res.status(200).json({ user: updatedUser });
        req.flash('editSuccess','Changes Saved')
        res.redirect('/profile/edit')
        }
        catch (error) {
            // console.log(error)
            // res.status(500).json({ error: 'An error occurred while updating the profile.' });
            req.flash('editError','There is some problem')
            res.redirect('/profile/edit')
        }
    
      })
    
      app.post('/profile/edit/current-status',auth, async(req,res)=>{
        
        try {
            const userId = req.data._id; 
           const updatedUser = await user.findById(userId)
           updatedUser.currentEduStatus =req.body.currentEduStatus
           updatedUser.save()
        req.flash('editSuccess','Changes Saved')
            res.redirect('/profile/edit')
        }
        catch (error) {
            // console.log(error)
            // res.status(500).json({ error: 'An error occurred while updating the profile.' });
            req.flash('editError','There is some problem')
            res.redirect('/profile/edit')
        }
    })
      app.post('/profile/edit/school-acadmic-details',auth, async(req,res)=>{
        
        try {
            const userId = req.data._id; 
           const updatedUser = await user.findById(userId)
        //    updatedUser.currentEduStatus = req.body.currentEduStatus
           updatedUser.schoolDetails =({
            schoolName:req.body.schoolName,
            grade:req.body.grade
           })
           updatedUser.save()
        // res.status(200).json({ user: updatedUser });
        req.flash('editSuccess','Changes Saved')
        res.redirect('/profile/edit')
        }
        catch (error) {
            // console.log(error)
            // res.status(500).json({ error: 'An error occurred while updating the profile.' });
            req.flash('editError','There is some problem')
            res.redirect('/profile/edit')
        }
    })
      app.post('/profile/edit/college-acadmic-details',auth, async(req,res)=>{
        
        try {
            const userId = req.data._id; 
           const updatedUser = await user.findById(userId)
           updatedUser.collegeDetails =({
            collegeName:req.body.collegeName,
            degree:req.body.degree,
            specialization:req.body.specialization,
            passingYear:req.body.passingYear,
           })
           updatedUser.save()
        // res.status(200).json({ user: updatedUser });
        req.flash('editSuccess','Changes Saved')
        res.redirect('/profile/edit')
        }
        catch (error) {
            // console.log(error)
            // res.status(500).json({ error: 'An error occurred while updating the profile.' });
            req.flash('editError','There is some problem')
            res.redirect('/profile/edit')
        }
    })
      app.post('/profile/edit/work-details',auth, async(req,res)=>{
        
        try {
            const userId = req.data._id; 
           const updatedUser = await user.findById(userId)
           updatedUser.workDetails =({
            companyName:req.body.companyName,
            position:req.body.position
           })
           updatedUser.save()
        // res.status(200).json({ user: updatedUser });
        req.flash('editSuccess','Changes Saved')
        res.redirect('/profile/edit')
        }
        catch (error) {
            // console.log(error)
            // res.status(500).json({ error: 'An error occurred while updating the profile.' });
            req.flash('editError','There is some problem')
            res.redirect('/profile/edit')
        }
    })
      app.post('/profile/edit/update-links',auth, async(req,res)=>{
        
        try {
            const userId = req.data._id; 
            const { LinkedinLink,GithubLink,myLink,InstagramLink } = req.body;
            const updatedUser = await user.findById(userId)
    
            updatedUser.socialLinks =({
           
                LinkedinLink,
                GithubLink,
                myLink,
                InstagramLink,
               })
               updatedUser.save()
          
    
        // Send back updated user data as a response
        // res.status(200).json({ user: updatedUser });
        req.flash('editSuccess','Changes Saved')
        res.redirect('/profile/edit')
        }
        catch (error) {
            // console.log(error)
            // res.status(500).json({ error: 'An error occurred while updating the profile.' });
            req.flash('editError','There is some problem')
            res.redirect('/profile/edit')
        }
    })





function formatDate(date) {
    const formattedDate = format(new Date(date), 'MMM dd yyyy h:mm a');
    return formattedDate;
  }

}
