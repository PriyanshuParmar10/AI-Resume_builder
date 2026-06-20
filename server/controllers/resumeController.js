import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from 'fs';



// POST: /api/resume/create




export const createResume = async (req,res) =>{
    try{
        const userId = req.userId;
        const {title} = req.body;

        // create new resume
        const newResume = await Resume.create({userId, title});
        // RETURN SUCCESS MESG
        return res.status(201).json({message: 'Resume Created Successfully',resume:newResume})
    }catch(err){
        return res.status(400).json({message: err.message})
    }
}

// POST: /api/resume/delete
export const deleteResume = async (req,res) =>{
    try{
        const userId = req.userId;
        const {resumeId} = req.params;

        await Resume.findOneAndDelete({userId,_id:resumeId})

        // return success msg
        
        return res.status(200).json({message: 'Resume deleted Successfully'})
    }catch(err){
        return res.status(400).json({message: err.message})
    }
}

// GET : /api/resumes/get
export const getResumeById = async (req,res) =>{
    try{
        const userId = req.userId;
        const {resumeId} = req.params;

        const resume = await Resume.findOne({userId,_id:resumeId})

        if(!resume){
            return res.status(404).json({message: 'Resume not Found'})
        }
        

        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        
        return res.status(200).json({resume})
    }catch(err){
        return res.status(400).json({message: err.message})
    }
}

// get Resume By id : public
// GET: /api/resumes/public
export const getPublicResumeById = async (req,res)=>{
    try{
        const {resumeId} = req.params;
        const resume = await Resume.findOne({public:true,_id:resumeId})

        if(!resume){
            return res.status(404).json({message: 'Resume not Found'})
        }
        return res.status(200).json({resume})
    }catch(err){
        return res.status(400).json({message: err.message})
    }
}

// updating
// GET: /api/resumes/update

export const updateResume = async (req,res) =>{
    try {
        const userId = req.userId;
        const {resumeId,resumeData,removeBackground} = req.body;
        const image = req.file;

        let resumeDataCopy ;
        if(typeof resumeData === 'string'){
            resumeDataCopy = await JSON.parse(resumeData)
        }else{
            resumeDataCopy = structuredClone(resumeData)
        }
        if(image){

            const imageBufferData = fs.createReadStream(image.path);

            const response = await imagekit.files.upload({
                            file: imageBufferData,
                            fileName: 'resume.png',
                            folder:'user-resumes',
                            transformation :{
                                pre : 'w-300,h-300,fo-face,z-0.75'+ (removeBackground?',e-bgremove':'')
                            }
                            });

        resumeDataCopy.personal_info.image = response.url
        }

        

        const resume = await Resume.findOneAndUpdate({userId, _id:resumeId},{$set: resumeDataCopy},{new:true})
        return res.status(200).json({message:'Saved Successfully', resume});
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}