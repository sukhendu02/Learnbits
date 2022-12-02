const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require('mongoose')

const MEMCQ =require('./modals/MEMCQ')
const CSEITMCQ = require('./modals/CSEITMCQ')


module.exports = function (app) {
  
    app.get('/MCQ/ME/SOM', async (req, res) => {
        const {page=1,limit=1}=req.query;
    var nextp=parseInt(page)+1;
    var prevp=parseInt(page)-1;
    if (nextp==2){
        var firstpage=nextp
    }
   
        
    const MEMCQs = await MEMCQ.find({topic:"Strength of Maretial (SOM)"}).limit(limit * 1).skip((page-1)*limit)
    .sort({date:-1})
    // .countDocumnets()
    
    // var lastpage=MEMCQ.countDocument({topic:"Strength of Maretial (SOM)"})/
    // console.log(tot)
    // .limit(1)
     res.render('mcq_list.hbs',{
         MEMCQs,MEMCQ:true,SOM:true,nextp,prevp,firstpage
     })
 });


 app.get('/MCQ/ME/Thermodynamics', async (req, res) => {
    const MEMCQs = await MEMCQ.find({topic:"Thermodynamics"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         MEMCQs,MEMCQ:true,THMD:true
     })
 });
 app.get('/MCQ/ME/Manufacturing-Technology', async (req, res) => {
    const MEMCQs = await MEMCQ.find({topic:"Manufacturing Technology"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         MEMCQs,MEMCQ:true,MT:true
     })
 });

 app.get('/MCQ/ME/Manufacturing-Process', async (req, res) => {
    const MEMCQs = await MEMCQ.find({topic:"Manufacturing Process"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         MEMCQs,MEMCQ:true,MP:true
     })
 });

 app.get('/MCQ/ME/Instrumental-Control', async (req, res) => {
    const MEMCQs = await MEMCQ.find({topic:"Instrumental & Control"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         MEMCQs,MEMCQ:true,IC:true
     })
 });

 app.get('/MCQ/ME/Theory-of-Machine', async (req, res) => {
    const MEMCQs = await MEMCQ.find({topic:"Theory of Machine (TOM)"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         MEMCQs,MEMCQ:true,TOM:true
     })
 });

 app.get('/MCQ/ME/Fluid-Mechanics', async (req, res) => {
    const MEMCQs = await MEMCQ.find({topic:"Fluid Mechanics"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         MEMCQs,MEMCQ:true,FM:true
     })
 });

 app.get('/MCQ/ME/IC-Engine', async (req, res) => {
    const MEMCQs = await MEMCQ.find({topic:"IC Engine"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         MEMCQs,MEMCQ:true,ICEN:true
     })
 });

 app.get('/MCQ/ME/Mechanical-Vibration', async (req, res) => {
    const MEMCQs = await MEMCQ.find({topic:"Mechanical Vibration"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         MEMCQs,MEMCQ:true,MEV:true
     })
 });

 app.get('/MCQ/ME/Dynamics-of-Machine', async (req, res) => {
    const MEMCQs = await MEMCQ.find({topic:"Dynamics of Machine (DOM)"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         MEMCQs,MEMCQ:true,DOM:true
     })
 });

 app.get('/MCQ/ME/Thermal-Engineering-and-Gas-Dynamics', async (req, res) => {
    const MEMCQs = await MEMCQ.find({topic:"Thermal Engineering and Gas Dynamics"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         MEMCQs,MEMCQ:true,TEGD:true
     })
 });

 app.get('/MCQ/ME/Heat-and-Mass-Transfer', async (req, res) => {
    const MEMCQs = await MEMCQ.find({topic:"Heat and Mass Transfer"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         MEMCQs,MEMCQ:true,HEMT:true
     })
 });

//  ============ END OF ME - MCQS=======================

// =================== START OF CSE-IT MCQS=================

app.get('/MCQ/CSE-IT/Data-Structure-Algorithm', async (req, res) => {
    const CSEITMCQs = await CSEITMCQ.find({topic:"Data Structure & Algorithm"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         CSEITMCQs,CSEITMCQ:true,DSA:true
     })
 });

 app.get('/MCQ/CSE-IT/Operation-System', async (req, res) => {
    const CSEITMCQs = await CSEITMCQ.find({topic:"Operation System"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         CSEITMCQs,CSEITMCQ:true,OS:true
     })
 });

 app.get('/MCQ/CSE-IT/Computer-Architecture', async (req, res) => {
    const CSEITMCQs = await CSEITMCQ.find({topic:"Computer Architecture"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         CSEITMCQs,CSEITMCQ:true,CA:true
     })
 });

 app.get('/MCQ/CSE-IT/Software-Engineering', async (req, res) => {
    const CSEITMCQs = await CSEITMCQ.find({topic:"Software Engineering"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         CSEITMCQs,CSEITMCQ:true,SOFE:true
     })
 });

 app.get('/MCQ/CSE-IT/Computer-Networks', async (req, res) => {
    const CSEITMCQs = await CSEITMCQ.find({topic:"Computer Networks"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         CSEITMCQs,CSEITMCQ:true,COMNET:true
     })
 });

 app.get('/MCQ/CSE-IT/Microproccessor', async (req, res) => {
    const CSEITMCQs = await CSEITMCQ.find({topic:"Microproccessor"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         CSEITMCQs,CSEITMCQ:true,MICP:true
     })
 });
 app.get('/MCQ/CSE-IT/Microcontroller', async (req, res) => {
    const CSEITMCQs = await CSEITMCQ.find({topic:"Microcontroller"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         CSEITMCQs,CSEITMCQ:true,MICC:true
     })
 });
 app.get('/MCQ/CSE-IT/Database-Management-System', async (req, res) => {
    const CSEITMCQs = await CSEITMCQ.find({topic:"Database Management System"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         CSEITMCQs,CSEITMCQ:true,DBMS:true
     })
 });
 app.get('/MCQ/CSE-IT/Object-Oriented-Programming', async (req, res) => {
    const CSEITMCQs = await CSEITMCQ.find({topic:"Object Oriented Programming"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         CSEITMCQs,CSEITMCQ:true,OOPS:true
     })
 });

 app.get('/MCQ/CSE-IT/Computer-Fundamentals', async (req, res) => {
    const CSEITMCQs = await CSEITMCQ.find({topic:"Computer Fundamentals"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         CSEITMCQs,CSEITMCQ:true,CF:true
     })
 });

 app.get('/MCQ/CSE-IT/Therory-of-Computation', async (req, res) => {
    const CSEITMCQs = await CSEITMCQ.find({topic:"Therory of Computation"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         CSEITMCQs,CSEITMCQ:true,TOC:true
     })
 });

 app.get('/MCQ/CSE-IT/RDBMS', async (req, res) => {
    const CSEITMCQs = await CSEITMCQ.find({topic:"RDBMS"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         CSEITMCQs,CSEITMCQ:true,RDBMS:true
     })
 });

 app.get('/MCQ/CSE-IT/Discrete-Mathematics', async (req, res) => {
    const CSEITMCQs = await CSEITMCQ.find({topic:"Discrete Mathematics"})
    .sort({date:-1})
     res.render('mcq_list.hbs',{
         CSEITMCQs,CSEITMCQ:true,DISM:true
     })
 });

// window.addEventListener('Scroll',()=>{
//     const {scrollHeight, scrollTop, clientHeight}=document.documentElement;
//     if (scrollTop+clientHeight>= scrollHeight){
//         shwodata();
//     }
// })


}



