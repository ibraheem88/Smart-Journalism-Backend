const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const Schema=mongoose.Schema

const advertiserSchema=new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true,unique: true},
    company:{type: String},
    password:{type: String, required: true},
    imageUri: {type: String, required: true},
    token: {type: String},
    notifications: {type: Array}
},
{
    timestamps: true
})

advertiserSchema.pre('save',function(next){
    const user=this
    if(!user.isModified('password')){
        return next()
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
        return next(err)}
        bcrypt.hash(user.password,salt,(err,hash)=>{
            if(err){
                return next(err)
            }
            user.password=hash
            next()
        })
    })
    
})

advertiserSchema.methods.comparePassword=function(canidatePassword){
    const user=this
    return new Promise((resolve,reject)=>{
        bcrypt.compare(canidatePassword,user.password,(err,isMatch)=>{
            if(err){
                return reject(err)
            }
            if(!isMatch){
                return reject(err)
            }
            resolve(true)
        })
    })
}

const Advertisers=mongoose.model('Advertisers',advertiserSchema)
module.exports=Advertisers