const router=require('express').Router()
require('dotenv').config()
const jwt=require('jsonwebtoken')
let Advertisement=require('../models/advertisement.model')
let Advertiser=require('../models/advertiser.model')
const multer=require('multer');
const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./upload/advertisements/')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload=multer({storage})

router.get('/advertisements',async(req,res) =>{
    const advertisements=await Advertisement.find()
    res.json(advertisements)
})

router.post('/newAdvertisement',upload.single('image'),(req,res) =>{
    const {text,postedBy,authorName,authorImage,company,days}=req.body

    const newadvertisement=new Advertisement({
        text: text,
        authorName: authorName,
        authorImage: authorImage,
        postedBy: postedBy,
        image: req.file.filename,
        company: company,
        days: days,
        status: "pending"
    })
    newadvertisement.save()
    .then(()=>
    res.json("Advertisement Published!"))
    .catch(err=>res.status(400).json("Error: "+err))
})

router.post('/signupAdvertiser',upload.single('imageUri'),(req,res) =>{
    const {name,email,password,company}=req.body
    const newadvertiser=new Advertiser({
        name: name,
        email: email,
        password: password,
        company: company,
        imageUri: req.file.filename,
        notifications: []
    })
    newadvertiser.save()
    .then(()=>{
    token=jwt.sign({userId: newadvertiser._id},process.env.jwtKey)
    res.json({token})})
    .catch(err=>res.status(400).json("Error: "+err))
})
router.route('/signinAdvertiser').post(async(req,res) =>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(422).send("Error: Wrong email or password!")
    }
    const advertiser=await Advertiser.findOne({email})
    if(!advertiser){
        return res.status(422).send("Error: Wrong email or password!")
    }
    advertiser.comparePassword(password).then(()=>{
        token=jwt.sign({userId: advertiser._id},process.env.jwtKey)
        res.json({token,advertiser})
    }).catch(()=>res.status(422).send("Error: Wrong email or password!"))
});

module.exports=router;