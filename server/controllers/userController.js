import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";


const generateToken = (userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'7d'});
    return token;
}

// controller for user Registration
// POST: /api/users/register
export const registerUser = async(req,res)=>{

    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
         return res.status(400).json({message:"Missing Required fields"});   
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message:"User already Exists"});   
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await User.create({
            name,email,password:hashedPassword
        })

        const token = generateToken(newUser._id);
        newUser.password = undefined;

        return res.status(201).json({message:"User Created Successfully",token,user:newUser})

    } catch (error) {
        return res.status(400).json({message:error.message})        
    }

}

// controller for user Login
// POST: /api/users/login

export const loginUser = async(req,res)=>{

    try {
        const {email,password} = req.body;
        

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid Email or Password"});   
        }

        if(!user.comparePassword(password)){
            return res.status(400).json({message:"Invalid Email or Password"}); 
        }


        const token = generateToken(user._id);
        user.password = undefined;

        return res.status(200).json({message:"Login Successfully",token,user})


    } catch (error) {
        return res.status(400).json({message:error.message})        
    }

}


// controller for getting user by id
// GET: /api/users/data

export const getUserById = async(req,res)=>{

    try {
        
        const userId = req.userId;
        // check is user exixts
        const user = await User.findById(userId);
        if(!user) {
            res.status(400).json({message:"USer Not Found"})

        }

        // return USer
        user.password = undefined;

        return res.status(200).json({user})

    } catch (error) {
        return res.status(400).json({message:error.message})        
    }
}

// controller for getting user resumes
// GET: /api/users/resumes

export const getUserResumes = async (req,res) =>{
    try{
        const userId = req.userId;
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})
    }catch(err){
        return res.status(400).json({message: err.message})
    }
}