const router=require('express').Router()
const fs = require('fs')
require('dotenv').config()
let Post=require('../models/post.model')
let Report=require('../models/report.model')
const {spawn} = require('child_process');

const multer=require('multer');
const { json } = require('express');
const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./upload/posts/')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload=multer({storage})

router.post('/newPost',upload.single('media'),(req,res) =>{
    const {text,postedBy,authorName,authorImage,headline}=req.body

    if(req.file.mimetype.includes('video')){
        image="null"
        video=req.file.filename
    }
    else{
        video="null"
        image=req.file.filename
    }
    const newpost=new Post({
        text: text,
        authorName: authorName,
        authorImage: authorImage,
        likes: 0,
        postedBy: postedBy,
        image: image,
        video: video,
        likedBy: []
    })
    newpost.save()
    .then(()=>{
    res.json("Post Published")})
    .catch(err=>res.status(400).json("Error: "+err))
})

router.get('/posts',async(req,res) =>{
    const posts=await Post.find()
    res.json(posts)
})

router.get('/reports',async(req,res) =>{
    const reports=await Report.find()
    res.json(reports)
})

router.post('/deletePost',async(req,res) =>{
    const {_id,image}=req.body
    const post=await Post.findByIdAndDelete(_id)
    .then(()=>{
        res.json("Post Deleted")
        const path = './upload/posts/'+image
        try {
            fs.unlinkSync(path)
        } catch(err) {
            console.error(err)}
        })
    .catch(err=>res.status(400).json("Error: "+err))
})



router.post('/newComment',async(req,res) =>{
    const {text,postedBy,authorImage,authorName,postId}=req.body
    const post=await Post.findById(postId)
    const newcomment={
        text: text,
        authorName: authorName,
        authorImage: authorImage,
        likes: 0,
        postedBy: postedBy,
        likedBy: []
    }
    await post.comments.push(newcomment)
    await post.save()
    .then(()=>{
        res.json("Comment Added")})
    .catch(err=>res.status(400).json("Error: "+err))
})

router.post('/newReport',async(req,res) =>{
    const {image,reportedBy,postId,forgery}=req.body
    const newreport= new Report({
        image: image,
        reportedBy: reportedBy,
        postId: postId,
        forgery: forgery
    })
    await newreport.save()
    .then(()=>{
        res.json("Report Added")})
    .catch(err=>res.status(400).json("Error: "+err))
})

router.post('/like',async(req,res) =>{
    const {_id,likedBy}=req.body
    const post=await Post.findById(_id)
    if(post){
        await post.updateOne({likedBy: likedBy})
    }
    res.json("Post Liked")
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

router.post('/imageForgery',async(req,res) =>{
    const {image}=req.body  
        var dataToSend;
     // spawn new child process to call the python script
     const python = spawn('python', ['image_forgery.py']);
     // collect data from script
     python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      dataToSend = data.toString();
     });
     python.stderr.on('data', function (data) {
        console.error(`error: ${data}`)
       });
    
    python.stdin.write(JSON.stringify(image));
    python.stdin.end();
    
     // in close event we are sure that stream from child process is closed
     python.on('close', (code) => {
     console.log(`child process close all stdio with code ${code}`);
     // send data to browser
     res.json(dataToSend)
     });
    })

module.exports=router;