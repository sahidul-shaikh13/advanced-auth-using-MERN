import { User } from "../models/user.models.js";
import bcryptjs from "bcryptjs"
import crypto from "crypto"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../email/email.js";
import { sendWelcomeEmail } from "../email/email.js";
import { sendPasswordResetEmail } from "../email/email.js";
import { sendResetEmail } from "../email/email.js";


export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {

        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }
        const userAllreadyExists = await User.findOne({ email });
        console.log("userAll", userAllreadyExists);

        if (userAllreadyExists) {
            return res.status(400).json({ "success": "true", "message": "user already exists" });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        })
        await user.save()
        generateTokenAndSetCookie(res, user._id);
        await sendVerificationEmail(user.email, user.verificationToken)


        res.status(201).json({
            "success": "true",
            "message": "user created successfully",
            user: {
                ...user._doc,
                password: undefined
            }

        })


    } catch (error) {
        res.status(400).json({ "success": "false", "message": error.message })
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({ "success": "false", "message": "Invalid or Expired Verification code" })
        }
        user.isVerified = true;
        user.verificationToken = undefined,
            user.verificationTokenExpiresAt = undefined,
            await user.save()
        await sendWelcomeEmail(user.name, user.email)
        return res.status(200).json({
            success: true,
            message: "Email verified Successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {

    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                "success": "false",
                "message": "Invalid Credentials"
            })
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                "success": "false",
                "message": "Invalid Credentials"
            })
        }
        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        return res.status(200).json({
            "success": "true",
            "message": "Logged in Successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })


    } catch (error) {
        console.log("Erron in Login", error);
        return res.status(400).json({
            "success": "False",
            "message": error.message
        })

    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        "success": "true",
        "message": "logout successfully"
    })
}       

export const forgetPassword = async (req,res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                "success":"false",
                "message":"User Not Found"  
            })
        }
        //generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 *1000
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();
        await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        return res.status(200).json({"success":"true","message":"Successfully Sent"})
        
    }catch(error){

    };
}    

export const resetPassword = async (req,res)=>{
    const {token} = req.params;
    const {password} = req.body; 
   
    try{
    
    const user = await User.findOne({
        resetPasswordToken:token,
        resetPasswordExpiresAt:{$gt:Date.now()}
    })
    if(!user){
        return res.status(400).json({
            "success":"false",
            "message":"Invalid or expires token"
        })
    }
    //update password
    const updatePassword = await bcryptjs.hash(password,10);
    user.password=updatePassword;
    user.resetPasswordToken = undefined
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await sendResetEmail(user.email)
    return res.status(200).json({"success":"true","message":"updated password"});
   
}catch(error){

    }   

}      

export const checkAuth = async(req,res)=>{
    try{
        const user = await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(400).json({"success":"false","message":"User not found"})
        }
        return res.status(200).json({"success":"true","user":{
            ...user._doc,
            password:undefined,

        }})
    }catch(error){
        console.log("Error in checkAuth ",error);
        res.status(400).json({"success":"false","message":error.message})
    }
}