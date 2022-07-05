const router=require('express').Router()
require('dotenv').config()
let ChatRoom=require('../models/message.model')
const multer=require('multer')
const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./upload/messages')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload=multer({storage})

router.post('/newMessage',async(req,res) =>{
    const {message,sentBy,sentTo,type,chatRoomId}=req.body
    const firstMessage=await ChatRoom.findById(chatRoomId)
    newChatRoom=firstMessage
    if(!firstMessage){
    newChatRoom=new ChatRoom({
        _id: chatRoomId,
        messages: [],
        lastMessage: message
    })
    }
    await newChatRoom.updateOne({lastMessage: message})
    await newChatRoom.messages.push({
        message: message,
        sentBy: sentBy,
        sentTo:sentTo,
        type: type
    })
    newChatRoom.save()
    .then(()=>{
    res.json("Message Sent")})
    .catch(err=>res.status(400).json("Error: "+err))
})

router.post('/sendImage',upload.single('image'),async(req,res) =>{
    const {message,sentBy,sentTo,type,chatRoomId}=req.body
    const firstMessage=await ChatRoom.findById(chatRoomId)
    newChatRoom=firstMessage
    if(!firstMessage){
    newChatRoom=new ChatRoom({
        _id: chatRoomId,
        messages: [],
        lastMessage: message
    })
    }
    await newChatRoom.updateOne({lastMessage: "Photo"})
    await newChatRoom.messages.push({
        message: message,
        sentBy: sentBy,
        sentTo:sentTo,
        type: type,
        image: req.file.filename
    })
    newChatRoom.save()
    .then(()=>{
    res.json("Message Sent")})
    .catch(err=>res.status(400).json("Error: "+err))
})

router.post('/messages',async(req,res) =>{
    const {chatRoomId}=req.body
    const chatRoom=await ChatRoom.findById(chatRoomId)
    res.json(chatRoom)
})

router.post('/lastMessage',async(req,res) =>{
    const {chatRoomId}=req.body
    const chatRoom=await ChatRoom.findById(chatRoomId)
    if(chatRoom){
    res.json(chatRoom.lastMessage)
    }
})

module.exports=router;