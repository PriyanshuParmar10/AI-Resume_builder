import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

const handleAiError = (error, res) => {
    let errorMessage = error.message || "An unknown error occurred.";
    if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = "AI Service quota exceeded. Please check your API key billing or try again later.";
    } else {
        errorMessage = "An error occurred while communicating with the AI service.";
        console.error("AI Error:", error.message);
    }
    return res.status(400).json({ message: errorMessage });
}

// enhancing professional summary
// /api/ai/enhance-pro-sum

export const enhanceProfessionalSummary = async(req,res) =>{
    try{
        const {userContent} =  req.body;

        if(!userContent){
            return res.status(400).json({message:'Missing Required Field'});
        }

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: userContent,
            config: {
                systemInstruction: "You are an expert in resume writing . Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills,experience,and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else."
            }
        });

        const enhancedContent = response.text;
        return res.status(200).json({enhancedContent})

    }catch(error){
        return handleAiError(error, res);
    }
}


// enhancing job description
// /api/ai/enhance-job-desc

export const enhanceJobDescription = async(req,res) =>{
    try{
        const {userContent} =  req.body;

        if(!userContent){
            return res.status(400).json({message:'Missing Required Field'});
        }

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: userContent,
            config: {
                systemInstruction: "You are an expert in resume writing . Your task is to enhance the job description of a resume . The job description should be only 1-2 sentence also highlighting key responsibilities and achievements. Use actions verbs and quantifiable results where possible . Make it ATS-friendly. and only return text no options or anything else."
            }
        });

        const enhancedContent = response.text;
        return res.status(200).json({enhancedContent})

    }catch(error){
        return handleAiError(error, res);
    }
}


// resume to the database
// /api/ai/upload-resume
export const uploadResume = async(req,res) =>{
    try{
        
        const {resumeText , title} = req.body;
        const userId = req.userId;

        if(!resumeText){
            return res.status(400).json({message:'Missing required field'});
        }

        const systemPrompt = "You are an expert AI Agent to extract data from resume."

        const userPrompt = `extract data from this resume: ${resumeText} 
        
        Provide data in the following JSON format with no additional text before or after:

        {
        professional_summary: {type:String, default:''},
        skills: [{type:String}],
        personal_info:{
            image: {type:String, default:''},
            full_name: {type:String, default:''},
            profession: {type:String, default:''},
            email: {type:String, default:''},
            phone: {type:String, default:''},        
            location: {type:String, default:''},        
            linkedin: {type:String, default:''},        
            website: {type:String, default:''},        

        },
        experience: [
            {
                company: {type:String},
                position: {type:String},
                start_date: {type:String},
                end_date: {type:String},
                description: {type:String},
                is_current: {type:Boolean},
            }

        ],
        project: [
            {
                name: {type:String},
                type: {type:String},
                description: {type:String},
                
            }

        ],
        education: [
            {
                institution: {type:String},
                degree: {type:String},
                field: {type:String},
                graduation_date: {type:String},
                gpa: {type:String},
            }

        ],
        }
        
        `;

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: userPrompt,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
            }
        });

        const extractedData = response.text;
        const parsedData = JSON.parse(extractedData);
        const newResume = await Resume.create({userId,title,...parsedData});

        res.json({resumeId : newResume._id})

    }catch(error){
        return handleAiError(error, res);
    }
}
