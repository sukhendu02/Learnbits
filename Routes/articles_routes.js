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
    app.get('/articles',(req,res)=>{
        res.render("articles.hbs");
    })

    
    // WRTIE ARTICLE PAGE 
    app.get("/write/article",  (req,res)=> {
        res.render('./Articles/write-article.hbs')
        // let userId= req.user._id;
//         console.log(userId);
//         PPinterview.findOne({UserID : userId},(err,data)=>{
// if(!data){
//             return res.redirect('/profile?msg=Please Fill Your Profile First!')
// }else{
//         res.render("writeArticle.hbs",{data});
//        }
//       });    
    });
  
   
    
    // Get all articles from the database and send
    app.get("/api/articles", async (req, res) => {
        try{
            let articleList = await PPinterview.find()
            .sort([["date","descending"]]);
            
            if(!articleList){
                return console.log("No articles found!");       
            } else{
                res.status(200).send(articleList);
            }    
        } catch(err){
            console.error(err.message);
            res.status(500).send(err.message + " Error getting data.");
        }
        
    })


}