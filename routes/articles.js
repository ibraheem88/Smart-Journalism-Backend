const router=require('express').Router()
const fs = require('fs')
require('dotenv').config()
let Article=require('../models/article.model')
const {spawn} = require('child_process');

const multer=require('multer');
const { json } = require('express');
const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./upload/articles/')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload=multer({storage})

router.post('/newArticle',upload.single('image'),(req,res) =>{
    const {text,postedBy,authorName,authorImage,headline}=req.body

    const newarticle=new Article({
        text: text,
        authorName: authorName,
        authorImage: authorImage,
        likes: 0,
        postedBy: postedBy,
        image: req.file.filename,
        likedBy: [],
        headline: headline
    })
    newarticle.save()
    .then(()=>{
    res.json("Article Published!")})
    .catch(err=>res.status(400).json("Error: "+err))
})

router.get('/articles',async(req,res) =>{
    const articles=await Article.find()
    res.json(articles)
})

router.post('/deleteArticle',async(req,res) =>{
    const {_id,image}=req.body
    const article=await Article.findByIdAndDelete(_id)
    .then(()=>{
        res.json("Article Deleted")
        const path = './upload/articles/'+image
        try {
            fs.unlinkSync(path)
        } catch(err) {
            console.error(err)}
        })
    .catch(err=>res.status(400).json("Error: "+err))
})



router.post('/articleNewComment',async(req,res) =>{
    const {text,postedBy,authorImage,authorName,articleId}=req.body
    const article=await Article.findById(articleId)
    const newcomment={
        text: text,
        authorName: authorName,
        authorImage: authorImage,
        likes: 0,
        postedBy: postedBy,
        likedBy: []
    }
    await article.comments.push(newcomment)
    await article.save()
    .then(()=>{
        res.json("Comment Added")})
    .catch(err=>res.status(400).json("Error: "+err))
})

router.post('/likeArticle',async(req,res) =>{
    const {_id,likedBy}=req.body
    const article=await Article.findById(_id)
    if(article){
        await article.updateOne({likedBy: likedBy})
    }
    res.json("Article Liked")
})

router.post('/sentiment',async(req,res) =>{
const {comments}=req.body  
    var dataToSend;
 // spawn new child process to call the python script
 const python = spawn('python', ['sentiment.py']);
 // collect data from script
 python.stdout.on('data', function (data) {
  console.log('Pipe data from python script ...');
  dataToSend = data.toString();
 });
 python.stderr.on('data', function (data) {
    console.error(`error: ${data}`)
   });

python.stdin.write(JSON.stringify(comments));
python.stdin.end();

 // in close event we are sure that stream from child process is closed
 python.on('close', (code) => {
 console.log(`child process close all stdio with code ${code}`);
 // send data to browser
 res.json(dataToSend)
 });
})

module.exports=router;