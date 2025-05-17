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

const contest = require('../modals/contest')
const user = require('../modals/user')
const auth = require('../middleware/auth')
const adminauth = require('../middleware/adminauth')

const contest_register=require('../Email/contest_register')


const ExcelJS = require('exceljs');


//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())



module.exports = function (app) {
    
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
                  rdate:currentDate,
                },
              },
            },
            { new: true } // To get the updated contest document
          );
          if (!updatedContest) {
            // Contest not found
            return res.status(404).json({ error: 'Contest not found' });
          }
          
          contest_register(fullname,email,reg_contest.title,reg_contest.contest_type,reg_contest.contest_startDate,reg_contest.contest_endDate,reg_contest.contest_link)
          req.flash('contest_registered','You have regiterd for contest')
          return res.redirect('/contest')
          
    
        }catch(error){
            console.log(error)
        }
    
      })
     
 













    //   /////////
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

app.get('/admin/manage-contest/participants/:id',adminauth,async (req,res)=>{
    try {
      
    const current_contest = await contest.findById(req.params.id)
    const filename=current_contest.title
    const participants = current_contest.participants;
    if (!contest) {
        return res.redirect('/admin/manage-contest');
       
      }
      // console.log("Im here")
       // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Participants');
    // console.log("Im here 2")
    // Add headers to the worksheet
    worksheet.addRow(['ID','Username', 'Email', 'Full Name', 'Phone']);

    // console.log("Im here 3")
    // Add participant data to the worksheet
    participants.forEach(participant => {
      worksheet.addRow([participant._id,participant.username, participant.email, participant.fullname, participant.phone]);
    });
    // console.log(participants)
    // console.log("Im here 4")
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}-participants.xlsx`);
    // console.log("Im here 5")
    // Stream the workbook to the response
    workbook.xlsx.write(res).then(() => {
      res.end();
      // console.log("Im here 6")
    //  return res.redirect('/admin/manage-contest')
    });
   
    }
    catch{
        req.flash('error','No such Contest Found')
        return  res.redirect("/admin/manage-contest")
    }
   
  
})
    app.post('/admin/create-contest',(req,res)=>{
        // console.log(req.body)
        // const {title,subheading,contest_type,reg_startDate,reg_endDate,contest_startDate,contest_endDate,slots,total_winners,elgiblity,guidelnies,img,description} = req.body;
    
         const prizeTitles = req.body.prize_title;
         const prizes = req.body.prize;
      


        

    // Ensure prizeTitles and prizes are arrays
const prizeTitlesArray = Array.isArray(prizeTitles) ? prizeTitles : [prizeTitles];
const prizesArray = Array.isArray(prizes) ? prizes : [prizes];

// Create prize objects
const prizeObjects = prizeTitlesArray.map((title, index) => {
    return { key: title, value: prizesArray[index] };
});

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
            // schedule : req.body.schedule,
            contest_link : req.body.contest_link,
            eligiblity : req.body.eligiblity,
            guidelines : req.body.guidelines,
            img : req.body.img,
            prize:prizeObjects
            
           
    
          
    
        })
        // console.log('hi')
        newcontest.save().then(()=>{
            // console.log('hi2')
            req.flash("success","Contest Created Successfully")
            return res.redirect("/admin/manage-contest/create-contest");
        }).catch((data)=>{
            console.log(data)
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


       app.get('/admin/manage-contest/delete/:id',adminauth,async(req,res)=>{
        const del_contest = await contest.findByIdAndDelete(req.params.id)
        req.flash('contestdeleted','The contest has been deleted')
        res.redirect('/admin/manage-contest')
    
    })



       function formatDate(date) {
        const formattedDate = format(new Date(date), 'MMM dd yyyy h:mm a');
        return formattedDate;
      }
}