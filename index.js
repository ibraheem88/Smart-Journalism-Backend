const express=require('express')
const cors=require('cors')
require('dotenv').config()
const mongoose=require('mongoose')
const app=express()
const port=process.env.PORT || 5000
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1313334",
  key: "320c6db0db0698904fd9",
  secret: "8e0c21e91f2109f69e5f",
  cluster: "us2",
  useTLS: true
});

//app.use(cors())

app.use(express.json())
app.use(cors())

const uri=process.env.ATLAS_URI
mongoose.connect(uri, {useNewUrlParser: true})

const db=mongoose.connection
db.once('open', ()=>{
    console.log("MongoDB database connection established successfully!")
    const msgcollection=db.collection('chatrooms')
    const changeStream=msgcollection.watch()

    changeStream.on('change',(change)=>{
        if(change.operationType === 'update'){ 
            pusher.trigger('chatrooms','update',{
                id: change.documentKey._id,
                updated: change.updateDescription.updatedFields
            })
        }
        else if(change.operationType === 'insert'){
            pusher.trigger('chatrooms','insert',{
                id: change.fullDocument._id,
                messages: change.fullDocument.messages,
                lastMessage: change.fullDocument.lastMessage
            })
        }
        else{
            console.log("Error triggering pusher!")
        }
    })
})

const userRouter=require('./routes/users')
const postRouter=require('./routes/posts')
const chatRouter=require('./routes/chats')
const adminRouter=require('./routes/admin')
const paymentRouter=require('./routes/payments')
const articleRouter=require('./routes/articles')
const adsRouter=require('./routes/ads')
app.use('/',userRouter)
app.use('/',postRouter)
app.use('/',chatRouter)
app.use('/',adminRouter)
app.use('/',paymentRouter)
app.use('/',articleRouter)
app.use('/',adsRouter)
app.use('/upload',express.static('upload'))

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

