const mongoose=require('mongoose')

const Schema=mongoose.Schema

const reportSchema=new Schema({
    postId: {type: String,required: true},
    reportedBy: {type: String, required: true},
    image: {type: String,required: true},
    forgery: {type: String,required: true}
},
{
    timestamps: true
})


const Reports=mongoose.model('reports',reportSchema)
module.exports=Reports