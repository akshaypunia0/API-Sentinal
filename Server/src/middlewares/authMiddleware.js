import dotenv from 'dotenv';
dotenv.config();

import { prisma } from '../config/db.js'
import jwt from 'jsonwebtoken';


const authMiddleware = async(req, res, next) => {
    
    let token;
    
    if(req.headers?.authorization && req.headers?.authorization.startsWith('Bearer')){
        token = req.headers?.authorization.split(' ')[1]
    }
    else if(req.cookies?.token){
        token = req.cookies?.token
    }

    if(!token) {
        return res.status(400).json({message: 'Unauthorize request: No token provided'})
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: {id: decodedToken.id}
        })

        if(!user) {
            return res.status(401).json({message: 'user no longer exist'})
        }

        req.user = user;
        

        next();


    } catch (error) {
        return res.status(500).json({message: 'unauthorized, no token provided'})
    }


}

export default authMiddleware;