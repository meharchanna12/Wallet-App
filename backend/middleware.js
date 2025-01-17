
const JWT_SECRET = "jwtsecret"
const authMiddleware = (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token,JWT_SECRET);
        if(decoded.userId){
            req.userId = decoded.userId;
            next();
        }
        else{
            return res.status(400).json({})
        }
    }catch(err){
        return res.status(403).json({});
    }


}
module.exports = {
    authMiddleware
}