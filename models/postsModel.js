const mongoose=require("mongoose")


const postSchema = new mongoose.Schema({
    title: {type:String,required:[true],minlength:[5] ,maxlength:[40]},
    content: {type:String, minlength:[10] },
    email: {type: String,match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']},userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
  },{timestamps:true});

  postSchema.index({email:1},{unique:true})

  const post=mongoose.model("postss",postSchema);

  module.exports=post;