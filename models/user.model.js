const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const Schema=mongoose.Schema

const userSchema=new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true,unique: true},
    password:{type: String, required: true},
    imageUri: {type: String, required: true},
    type: {type: String, required: true},
    token: {type: String},
    following: {type: Array},
    approved: {type: Boolean},
    education: {type: Object},
    subscription: {type: String},
    notifications: {type: Array}
},
{
    timestamps: true
})

userSchema.pre('save',function(next){
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

userSchema.methods.comparePassword=function(canidatePassword){
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

const Users=mongoose.model('Users',userSchema)
module.exports=Users