const mongoose=require('mongoose')

const Schema=mongoose.Schema

const messageSchema=new Schema({
    message: {type: String},
    sentBy: {type: String, required: true},
    sentTo:{type: String, required: true},
    image:{type: String},
    document:{type: String},
    type: {type: String, required: true}
},
{
    timestamps: true
})

const chatRoomSchema=new Schema({
    _id: {type: String, required: true},
    messages: [messageSchema],
    lastMessage:{type: String, required: true}
})

const chatRooms=mongoose.model('chatRooms',chatRoomSchema)
module.exports=chatRooms