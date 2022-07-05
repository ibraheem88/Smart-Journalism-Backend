const mongoose=require('mongoose')

const Schema=mongoose.Schema

const advertisementSchema=new Schema({
    text: {type: String},
    postedBy: {type: String, required: true},
    authorName: {type: String, required: true},
    authorImage: {type: String, required: true},
    image: {type: String},
    days: {type: String},
    status: {type: String},
    company: {type: String}
},
{
    timestamps: true
})


const Advertisements=mongoose.model('advertisements',advertisementSchema)
module.exports=Advertisements