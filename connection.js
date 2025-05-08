const mongoose=require('mongoose')

const connection=mongoose.connect(`mongodb://127.0.0.1/prototype`)


module.exports=connection;