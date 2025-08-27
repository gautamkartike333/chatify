import User from "../Models/userModels.js";
import bcryptjs from 'bcryptjs'
import { jwtToken } from "../utils/jwtwebToken.js";


export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;
        const user = await User.findOne({ username, email });
        if (user) { res.status(500).send({ success: false, message: 'user Already Exists!' }) };
        const hashPassword = bcryptjs.hashSync(password, 10);

        const profilepicboy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profilepicgirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;


        const newuser = new User({
            fullname,
            username,
            email,
            gender,
            password: hashPassword,
            profilepic: gender === "Male" ? profilepicboy : profilepicgirl,
        })

        if (newuser) {
            await newuser.save();
            jwtToken(newuser._id, res);
        } else {
            res.status(500).send({ success: false, message: 'Failed to create User, There may be Invalid User data' })
        }
        res.status(201).send({
            id: newuser._id,
            fullname: newuser.fullname,
            username: newuser.username,
            profilepic: newuser.profilepic,
            email: newuser.email
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error })
        console.log(error);
        console.error('=', error)
    }
}



//Login route function:-

export const userLogin = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) return res.status(500).send({ message: "Email doesn't exists! " })
        const comparePasss = bcryptjs.compareSync(password, user.password || "");
        if (!comparePasss) return res.status(500).send({ success: false, message: "Wrong Password!" })

        jwtToken(user._id, res);

        res.status(200).send({
            id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email: user.email,
            message: "Successfully LogIn!"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error",
            error: error

        })
        console.log(error);
    }
}

export const userLogout = async (req, res) => {
    try {
        res.cookie("jwt", '', {
            maxAge: 0
        })
        res.status(200).send({ message: "User LogOut" })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }

}