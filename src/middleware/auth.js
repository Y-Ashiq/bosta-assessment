import jwt from 'jsonwebtoken'


const userAuth = (req,res,next) => {
    let token = jwt.verify(req.headers.token ,'mySecretToken');

    if(token.role == "admin"){
        next()
    }else{
        res.json({meassge:"you are not allowed in this section"})
    }

    
}
export default userAuth