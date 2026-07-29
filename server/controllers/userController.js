import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//Register User:/api/user/register
export const register = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.json({success: false, message: "All fields are required"});
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({name,email,password: hashedPassword});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,  // JS can't access the cookie
            secure: process.env.NODE_ENV === 'production', // cookie only works in https
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // cross-site cookie, csrf protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        } )

        return res.json({success: true, user: {name: user.name, email: user.email}})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


//Login User: /api/user/login
export const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.json({success: false, message: "email and password are required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.json({success: false, message: "User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success: false, message: "Incorrect password"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
         res.cookie('token', token, {
            httpOnly: true,  // JS can't access the cookie
            secure: process.env.NODE_ENV === 'production', // cookie only works in https
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // cross-site cookie, csrf protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        } )

        return res.json({success: true, user: {name: user.name, email: user.email}})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Check Auth: /api/user/is-auth
export const isAuth = async(req,res)=>{
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).select('-password');
        return res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Logout User: /api/user/logout
export const logout = async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly: true,  // JS can't access the cookie
            secure: process.env.NODE_ENV === 'production', // cookie only works in https
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // cross-site cookie, csrf protection
        });
        return res.json({success: true, message: "Logged out successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}



