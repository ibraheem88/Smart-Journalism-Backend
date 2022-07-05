const mongoose=require('mongoose')
const Schema=mongoose.Schema

const paymentSchema=new Schema({
    userId: {type: String, required: true},
    amount: {type: String, required: true},
    currency:{type: String, required: true},
    card: {type: String, required: true},
    status: {type: String, required: true},
    type: {type: String, required: true}
},
{
    timestamps: true
})

const Payments=mongoose.model('payments',paymentSchema)
module.exports=Payments