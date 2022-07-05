const router=require('express').Router()
const fs = require('fs')
require('dotenv').config()
const jwt=require('jsonwebtoken')
const requiretoken=require('../middleware/requireToken')
let User=require('../models/user.model')
const upload=require('../middleware/mutler')
const PUBLISHABLE_KEY = "pk_test_51KrzWmLEJCPE187BH8zHoK2eLvAwYfeSQIJB4iji9VqBsDs0qBYuPfTfTjZ6jaYXgm1E8HaLGZNyh9nUEvgN1Jtv00HXIjVdzg";
const SECRET_KEY = "sk_test_51KrzWmLEJCPE187ByXt3VipJ2wxrDQpOJ36dW4yPCkiDcHXDc6UuXAr4no2HVQsKnLbXeU7sXOTm0s5Hu5Wn0o6S00BWWG5sWW";
const Stripe=require("stripe");

//Confirm the API version from your stripe dashboard
const stripe = Stripe(SECRET_KEY, { apiVersion: "2020-08-27" });

router.route('/currentUser').get(requiretoken,(req,res) =>{
    res.json(req.user)
});

router.route('/updateToken').post(async(req,res) =>{
    const {id,token}=req.body
    const user=await User.findById(id)
    if(user){
    await user.updateOne({token: token})
    }
    res.json("Token Updates")
});

router.route('/follow').post(async(req,res) =>{
    const {_id,following}=req.body
    const user=await User.findById(_id)
    if(user){
    await user.updateOne({following: following})
    }
    res.json("Followed")
});

router.route('/likeNotification').post(async(req,res) =>{
    const {postedBy,_id,userImage,userName,likes,type}=req.body
    if(likes==1){
        body=`${userName} liked your ${type=="article" ? 'article' : 'post'}`
    }
    else{
        body=`${userName} and ${likes-1} ${likes-1==1 ? 'other' : 'others'} liked your ${type=="article" ? 'article' : 'post'}`
    }
    notification={
        body: body,
        currentLike: {name: userName,image: userImage},
        postId: _id,
        type: 'like'
    }
    const user=await User.findById(postedBy)
    if(user){
        notifications=user.notifications.map(n=>{if(n.postId==_id && n.type=='like')
            return notification
            else return n})
        if(!user.notifications.find(n=>n.postId==_id && n.type=='like')){
            notifications.push(notification)
        }
    }
    await user.updateOne({notifications: notifications})
    res.json("Like Notification Sent")
});

router.route('/users').get(requiretoken,async(req,res) =>{
    const users=await User.find()
    res.json(users)
});

router.post('/changeProfile',upload.single('imageUri'),async(req,res) =>{
    const {_id,imageUri}=req.body
    console.log(imageUri)
    const user=await User.findById(_id)
    await user.updateOne({imageUri: req.file.filename})
    res.json("Profile Changed")
});

router.post('/create-payment-intent',async(req,res) =>{
    const {id,days}=req.body
    if(days){
        amount=25000*days
    }
    else{
        amount=100000
    }
    try {
        const paymentIntent = await stripe.paymentIntents.create({                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 id,
          amount: amount, //lowest denomination of particular currency
          currency: "pkr",
          payment_method_types: ["card"], //by default
        });
    
        const clientSecret = paymentIntent.client_secret;
    
        res.json({
          clientSecret: clientSecret,
        });
      } catch (e) {
        console.log(e.message);
        res.json({ error: e.message });
      }
});


router.post('/signup',upload.single('imageUri'),(req,res) =>{
    const {name,email,password,type,education}=req.body
    const newuser=new User({
        name: name,
        email: email,
        password: password,
        education: education,
        imageUri: req.file.filename,
        type: type,
        following: [],
        notifications: []
    })
    newuser.save()
    .then(()=>{
    token=jwt.sign({userId: newuser._id},process.env.jwtKey)
    res.json({token})})
    .catch(err=>res.status(400).json("Error: "+err))
})

router.route('/signin').post(async(req,res) =>{
    const users=await User.find()
    const {email,password}=req.body
    if(!email || !password){
        return res.status(422).send("Error: Wrong email or password!")
    }
    const user=await User.findOne({email})
    console.log(user)
    if(!user){
        return res.status(422).send("Error: Wrong email or password!")
    }
    user.comparePassword(password).then(()=>{
        token=jwt.sign({userId: user._id},process.env.jwtKey)
        res.json({token,user,users})
    }).catch(()=>res.status(422).send("Error: Wrong email or password!"))
});

module.exports=router;