const mongoose=require('mongoose')

const Schema=mongoose.Schema

const commentSchema=new Schema({
    text: {type: String, required: true},
    postedBy: {type: String, required: true},
    authorName: {type: String, required: true},
    authorImage: {type: String, required: true},
    likedBy: {type: Array}
},
{
    timestamps: true
})

const postSchema=new Schema({
    text: {type: String},
    postedBy: {type: String, required: true},
    authorName: {type: String, required: true},
    authorImage: {type: String, required: true},
    image: {type: String},
    video: {type: String},
    location: {type: String},
    likedBy: {type: Array},
    coordinates: {type: Object},
    comments: [commentSchema]
},
{
    timestamps: true
})


const Posts=mongoose.model('posts',postSchema)
module.exports=Posts