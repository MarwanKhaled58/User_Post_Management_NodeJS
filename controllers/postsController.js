const APIError = require("./../utils/APIError");
const post=require("./../models/postsModel")

const getAllPosts = async(req,res)=>{
    
    const posts= await post.find();
    const userId= req.user._id;
    if(!posts){
      
      throw new APIError("post not found",404);
    }
  
    const postswihflag=posts.map(post=>{
      return {
        ...post,isownpost:post._id===userId
      }
    })
    res.status(200).json({
        message:"posts fetched successfully",data:{

          postswihflag

        }
    })
};
const getPostById=async (req,res)=>{
    const {id}=req.params;
    const pst= await post.findOne({_id:id});

    if(!pst){
      
        throw new APIError("post not found",404)
    };
    const userId=req.user._id;
    postwithflag={...pst,isownpost:post._id===userId}


    res.status(200).json({
        message:"post fetched successfully",data:{
            postswihflag
        }
    })

};
const createpost=async(req,res)=>{
    
  const post = await post.create({ ...req.body, userId: req.user._id });  

    if (!req.body.title){
        res.status(400).json({message:"title is required"})
    };

     res.status(201).jsonp({message:"post created succesfully",
        data:{
            post
        }
     })
};
const updatePostById=async(req,res)=>{
    const{id}=req.params;
    const payload=req.body;
    
    const updatedPost = await Post.findByIdAndUpdate({_id:req.user._id},payload,{new:true})

    if(!updatedPost){
        return res.status(400).json({
            message:"post not found"
        })
    }

    res.status(201).jsonp({messsage:"post updated succesfully",
        data:{
          updatedPost
        }
     })
};
const deletePostById=async(req,res)=>{
    const{id}=req.params;
    const post = await post.findById(req.user._id);

    if(!post){
        return res.status(400).json({
            message:"post not found"
        })
    }

    await post.findByIdAndDelete(req.user._id);

    res.status(201).jsonp({messsage:"post deleted succesfully",
        
     })
};

module.exports={
    getAllPosts,
    getPostById,
    createpost,
    updatePostById,
    deletePostById
};
 