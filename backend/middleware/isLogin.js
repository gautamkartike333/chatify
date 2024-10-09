import jwt from 'jsonwebtoken'
import User from '../Models/userModels.js'

const isLogin = async (req,res,next)=>{
    try {
        const token =req.cookies.jwt
        // console.log(token);
        
        if(!token)return res.status(500).send({success: false, message:"User Unauthorize"})
            const decode = jwt.verify(token, process.env.JWT_SECRET);
        if(!decode)return res.status(500).send({success: false, message:"User Unauthorize-Invalid token"})
            const user = await User.findById(decode.userId).select("-password");
        if(!user){return res.status(500).send({success: false, message:"Incorrect Password!"})}
        req.user = user
        next()
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}

export default isLogin