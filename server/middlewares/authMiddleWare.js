import jwt from "jsonwebtoken";

const protect = async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    
    console.log('Auth Middleware - Headers:', req.headers);
    console.log('Auth Middleware - Authorization header:', authHeader);
    
    if(!authHeader){
        return res.status(401).json({message:"Unauthorized - No token provided"});
    }
    
    try {
        // Extract token from "Bearer <token>" format
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;
        
        console.log('Auth Middleware - Token:', token ? 'Present' : 'Missing');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        console.log('Auth Middleware - User ID:', req.userId);
        next();
    } catch (error) {
        console.error('Auth Middleware - JWT Error:', error.message);
        return res.status(401).json({message:"Unauthorized - Invalid token"});       
    }
}
export default protect;