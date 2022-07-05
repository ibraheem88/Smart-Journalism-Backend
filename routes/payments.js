const router=require('express').Router()
let Payment=require('../models/payment.model')

router.post('/paymentDetails',async(req,res) =>{
    const {id,currency,amount,card,status,type}=req.body
    const newpayment=new Payment({
        userId: id,
        card: card,
        currency: currency,
        amount: amount,
        status: status,
        type: type
    })
    newpayment.save()
    .then((id)=>{
    res.json("Payment Details Added")})
    .catch(err=>res.status(400).json("Error: "+err))
})

router.route('/payments').get(async(req,res) =>{
    const payments=await Payment.find()
    res.json(payments)
});

module.exports=router;