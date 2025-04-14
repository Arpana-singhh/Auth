import userModel from '../models/userModels.js'

export const getUserData = async(req, res)=>{
     try{
        // const {userId} = req.body;
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if(!user){
            return res.status(404).json({success:false, message:'User not Found'})
        }

        res.status(200).json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        })
     }
     catch(error){
        res.status(500).json({success:false, message:error.message});
     }
}
