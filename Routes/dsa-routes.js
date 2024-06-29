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

const PPinterview = require('../modals/ppinterview.js')
const PPQA = require('../modals/PP/PPQA')
const PPLR = require('../modals/PP/PPLR')
const PPenglish = require('../modals/PP/PPenglish')
const DSA = require('../modals/dsa')


module.exports = function (app) {
   

 
    app.get('/Data-Structure-and-algorithms',(req,res)=>{
        res.render('./Data-Structue/dsa-main.hbs')
    })
    app.get('/Data-Structure-and-algorithms/array',(req,res)=>{
        res.render('./Data-Structue/dsa-arr.hbs')
    })
    app.get('/Data-Structure-and-algorithms/linked-list',(req,res)=>{
        res.render('./Data-Structue/dsa-linked-list.hbs')
    })
    app.get('/Data-Structure-and-algorithms/stack',(req,res)=>{
        res.render('./Data-Structue/dsa-stack.hbs')
    })
    app.get('/Data-Structure-and-algorithms/queue',(req,res)=>{
        res.render('./Data-Structue/dsa-queue.hbs')
    })
    app.get('/Data-Structure-and-algorithms/hashmap',(req,res)=>{
        res.render('./Data-Structue/dsa-hashmap.hbs')
    })
    app.get('/Data-Structure-and-algorithms/trees',(req,res)=>{
        res.render('./Data-Structue/dsa-trees.hbs')
    })
    app.get('/Data-Structure-and-algorithms/graphs',(req,res)=>{
        res.render('./Data-Structue/dsa-graphs.hbs')
    })


  
    
  
    // app.get('/Data-Structure-and-algorithms/questions/array', async (req, res) => {
    //     const {page=1,limit=15}=req.query;
    //     var nextp=parseInt(page)+1;
    //     var prevp=parseInt(page)-1;
    //     if (nextp==2){
    //         var firstpage=nextp
    //     }
    //     var hasnext =1;
    //     const lastpage=await DSA.countDocuments()/limit
    //     if(lastpage>page){
    //          hasnext=null;
    //     }
    
    //     const DSAs = await DSA.find({topic:'array'}).limit(limit * 1).skip((page-1)*limit)
    //     .sort({date:-1})
    
       
    //      res.render('ques-list.hbs',{
    //          DSAs,DSA:true,prevp,firstpage, hasnext,nextp,
    //      })
    //  });
    
    

    app.get('/Data-Structure-and-algorithms/array/questions', async (req, res) => {
        const {page=1,limit=15}=req.query;
        var nextp=parseInt(page)+1;
        var prevp=parseInt(page)-1;
        if (nextp==2){
            var firstpage=nextp
        }
        var hasnext =1;
        const lastpage=await DSA.countDocuments()/limit
        if(lastpage>page){
             hasnext=null;
        }
    
        const DSAs = await DSA.find({'topic':'array'}).limit(limit * 1).skip((page-1)*limit)
        .sort({date:-1})
    
       
         res.render('ques-list.hbs',{
             DSAs,DSA:true,prevp,firstpage, hasnext,nextp,
         })
     });
    app.get('/Data-Structure-and-algorithms/linked-list/questions', async (req, res) => {
        const {page=1,limit=15}=req.query;
        var nextp=parseInt(page)+1;
        var prevp=parseInt(page)-1;
        if (nextp==2){
            var firstpage=nextp
        }
        var hasnext =1;
        const lastpage=await DSA.countDocuments()/limit
        if(lastpage>page){
             hasnext=null;
        }
    
        const DSAs = await DSA.find({'topic':'Linked List'}).limit(limit * 1).skip((page-1)*limit)
        .sort({date:-1})
    
       
         res.render('ques-list.hbs',{
             DSAs,DSA:true,prevp,firstpage, hasnext,nextp,
         })
     });
    app.get('/Data-Structure-and-algorithms/stack/questions', async (req, res) => {
        const {page=1,limit=15}=req.query;
        var nextp=parseInt(page)+1;
        var prevp=parseInt(page)-1;
        if (nextp==2){
            var firstpage=nextp
        }
        var hasnext =1;
        const lastpage=await DSA.countDocuments()/limit
        if(lastpage>page){
             hasnext=null;
        }
    
        const DSAs = await DSA.find({'topic':'stack'}).limit(limit * 1).skip((page-1)*limit)
        .sort({date:-1})
    
       
         res.render('ques-list.hbs',{
             DSAs,DSA:true,prevp,firstpage, hasnext,nextp,
         })
     });
    app.get('/Data-Structure-and-algorithms/queue/questions', async (req, res) => {
        const {page=1,limit=15}=req.query;
        var nextp=parseInt(page)+1;
        var prevp=parseInt(page)-1;
        if (nextp==2){
            var firstpage=nextp
        }
        var hasnext =1;
        const lastpage=await DSA.countDocuments()/limit
        if(lastpage>page){
             hasnext=null;
        }
    
        const DSAs = await DSA.find({'topic':'queue'}).limit(limit * 1).skip((page-1)*limit)
        .sort({date:-1})
    
       
         res.render('ques-list.hbs',{
             DSAs,DSA:true,prevp,firstpage, hasnext,nextp,
         })
     });
    app.get('/Data-Structure-and-algorithms/hashmap/questions', async (req, res) => {
        const {page=1,limit=15}=req.query;
        var nextp=parseInt(page)+1;
        var prevp=parseInt(page)-1;
        if (nextp==2){
            var firstpage=nextp
        }
        var hasnext =1;
        const lastpage=await DSA.countDocuments()/limit
        if(lastpage>page){
             hasnext=null;
        }
    
        const DSAs = await DSA.find({'topic':'hashmap'}).limit(limit * 1).skip((page-1)*limit)
        .sort({date:-1})
    
       
         res.render('ques-list.hbs',{
             DSAs,DSA:true,prevp,firstpage, hasnext,nextp,
         })
     });
    app.get('/Data-Structure-and-algorithms/trees/questions', async (req, res) => {
        const {page=1,limit=15}=req.query;
        var nextp=parseInt(page)+1;
        var prevp=parseInt(page)-1;
        if (nextp==2){
            var firstpage=nextp
        }
        var hasnext =1;
        const lastpage=await DSA.countDocuments()/limit
        if(lastpage>page){
             hasnext=null;
        }
    
        const DSAs = await DSA.find({'topic':'trees'}).limit(limit * 1).skip((page-1)*limit)
        .sort({date:-1})
    
       
         res.render('ques-list.hbs',{
             DSAs,DSA:true,prevp,firstpage, hasnext,nextp,
         })
     });
    app.get('/Data-Structure-and-algorithms/graphs/questions', async (req, res) => {
        const {page=1,limit=15}=req.query;
        var nextp=parseInt(page)+1;
        var prevp=parseInt(page)-1;
        if (nextp==2){
            var firstpage=nextp
        }
        var hasnext =1;
        const lastpage=await DSA.countDocuments()/limit
        if(lastpage>page){
             hasnext=null;
        }
    
        const DSAs = await DSA.find({'topic':'graphs'}).limit(limit * 1).skip((page-1)*limit)
        .sort({date:-1})
    
       
         res.render('ques-list.hbs',{
             DSAs,DSA:true,prevp,firstpage, hasnext,nextp,
         })
     });

    




}