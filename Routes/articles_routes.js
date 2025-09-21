const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const PPinterview = require('../modals/ppinterview');
const blog = require('../modals/blog');
const bodyParser = require("body-parser");
const { count } = require('console');
const {rewardUser,redeemCoins} = require("../Utils/reward")


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


    app.get('/contribute/write-blog',auth, (req,res)=>{

        const myData=req.data
        // if(myData.firstName=="" ||myData.lastName==""){
            // return res.redirect('/contribute/write-blog?msg=Please Fill Your Profile First!')
        // }
       
    res.render('./Blogs/write-blog.hbs',{
        myData
    })
})

app.post('/contribute/submit-blog',auth, async(req,res)=>{


    try {
        
    
    const {blog_title,blog_brief,blog_category,blog_tags,blog_post} = req.body;

if(!blog_title || !blog_brief || !blog_category||!blog_post){
    req.flash("notFilled","Please Field all the details.")
    return res.redirect('/contribute/write-blog')
}

         const tags = req.body.blog_tags
      ? req.body.blog_tags.split(',').map(tag => tag.trim())
      : [];


       const author=req.data._id
        console.log(author)
   const newBlog = new blog({
      blog_title,blog_brief,blog_category,blog_tags:tags,blog_post,
        author,
        status: "in-review",
      });
    //   console.log(hi)
  await newBlog.save();

  console.log(newBlog)
  req.flash("posted","Your blog post is in review")
      res.redirect("/contribute/write-blog"); // or wherever you want to redirect

      } catch (error) {

         console.error("Blog submit error:", error);
         req.flash("notPosted","Blog post failed. Please try again later")
      res.status(500).redirect("/contribute/write-blog")

        
    }
   

})

app.get('/blogs',async(req,res)=>{
    let allBlogs= await blog.find({"status":"approved"}).populate('author', 'fullname')
    .sort({createdAt:-1})
    // console.log(allBlogs)
       // Ensure blog_tags is always an array
    
    
    res.render('blog.hbs',{
        allBlogs
    })
})

app.get('/blogs/:id/:title',async(req,res)=>{
    const id=req.params.id
    const title=req.params.title
    const myblog=await blog.findById(id).populate('author','fullname')
  
    // Fetch related posts (same category or similar tags)
    const relatedBlogs = await blog.find({
      _id: { $ne: blog._id },
      $or: [
        { blog_category: myblog.blog_category },
        { blog_tags: { $in: myblog.blog_tags } }
      ]
    })
    .limit(4)
    .sort({ createdAt: -1 });
    // console.log(relatedBlogs)
    res.render('./Blogs/viewblog.hbs',{
        myblog,relatedBlogs
        })
})


// PUT /admin/blog/:id/status
app.put('/admin/blog/update-status/:id', async (req, res) => {
    // console.log("I ran")
    const { id } = req.params;
    const { status, feedback } = req.body;
    // console.log(id,status,feedback)
   

  // Basic validation
  if (!['approved', 'rejected', 'needs-improvement'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

//   if ((status === 'rejected' || status === 'needs-improvement') && !feedback) {
//     return res.status(400).json({ message: 'Feedback required' });
//   }

  try {
    const updatedBlog = await blog.findByIdAndUpdate(
      id,
      { status, feedback: feedback || '' },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    // req.flash("failed", "blog not found")
      return res.status(404).redirect('/admin/manage-blog')
    }
// console.log("updated")
    // req.flash("sucess", "Blog post status Updated")
    // res.redirect('/blog')
  
    res.json({ message: 'Blog status updated', blog: updatedBlog });
    if(updatedBlog.status=="approved"){

        rewardUser(updatedBlog.author,10,"Blog post approved")
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
    // console.log(err)
    // req.flash("failed","Server Error")
    // res.redirect("/admin/manage-blog")
  }
});

app.get("/add-coins",auth,async(req,res)=>{

  await rewardUser(req.data._id, 10, 'Signup reward', 'signup');
  res.send({ message: 'Account created and 10 coins awarded!' });
})
app.get("/redeem-coins",auth,async(req,res)=>{

  await redeemCoins(req.data._id, 2, 'Redeem  reward', 'signup');
  res.send({ message: 'Account created and 10 coins awarded!' });
})




}