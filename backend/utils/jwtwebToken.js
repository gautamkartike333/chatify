import jwt from "jsonwebtoken"


export const jwtToken = async (userId,res)=>{

   const token = jwt.sign({userId} , process.env.JWT_SECRET);

   res.cookie('jwt' , token , {
    maxAge: 30*24*60*60*1000,
    httpOnly:true,
    sameSite:"strict",
    secure: true

})
}