const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const Schema=mongoose.Schema

const adminSchema=new Schema({
    email: {type: String, required: true,unique: true},
    password:{type: String, required: true},
    approvals: {type: Array}
})

adminSchema.pre('save',function(next){
    const admin=this
    if(!admin.isModified('password')){
        return next()
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
        return next(err)}
        bcrypt.hash(admin.password,salt,(err,hash)=>{
            if(err){
                return next(err)
            }
            admin.password=hash
            next()
        })
    })
    
})

adminSchema.methods.comparePassword=function(canidatePassword){
    const admin=this
    return new Promise((resolve,reject)=>{
        bcrypt.compare(canidatePassword,admin.password,(err,isMatch)=>{
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



const Admin=mongoose.model('Admin',adminSchema)
module.exports=Admin