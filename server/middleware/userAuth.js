import jwt from "jsonwebtoken";

const userAuth = async(req, res, next)=>{
    const {token} = req.cookies;
    console.log(" Token from cookie:", token); 

    if(!token){
        return res.json({success:false, message:' Not Authorized'})
    }

    try{
      const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔓 Token Decoded:", tokenDecode); 
      if(tokenDecode.id){
        
        req.userId =tokenDecode.id;
        
      }else{
        return res.json({success:false, message:'Not Authorized .Login Again'});
      }
      next();
    }
    catch(error){
        res.json({success:false, message:error.message});
    }
}

export default userAuth;




// req.body.userId =tokenDecode.id;