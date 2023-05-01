const User = require('../model/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { Response , Request } from "express";


const handleNewUser = async (req : Request , res : Response) => {
    const {userName , email , pwd , rPwd} = req.body ;
    if (!userName || !email || !pwd || !rPwd) return res.status(400).json({
        'message' : 'All Fileds Are Required.',
    })

    
    const rgxEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if(!rgxEmail.test(email)) return res.status(409).json({
        'message' : 'Invalied Email'
    })

    const duplicatedemail = await User.findOne({email : email}).exec();

    if(duplicatedemail) return res.status(409).json({'message' : 'Email is Already Registerd'});
    if(pwd !== rPwd) return res.status(409).json({
        'message' : 'Password Must Be same As Repeated Password'
    })

    try{
        const newUser = new User({});

        const hashPassword = await bcrypt.hash(pwd , 10);

        newUser.userName = userName ;
        newUser.email = email ;
        newUser.password = hashPassword;

        
        const result = await newUser.save();
        return res.status(201).json({'success' : `New User ${email} Created`});
        
    }catch (err) {
        console.log(err)
        return res.status(500).json({'message' : `${err}`})
    }

}



const handleLogin = async (req : Request , res : Response) => {
    
    const {email , pwd} = req.body ;
    
    if(!email || !pwd ) return res.status(400).json({"message" : 'Email And Password Are Required'});

    const foundUser = await User.findOne({ email : email}).exec();

    if(!foundUser) return res.status(401).json({"message" : 'Bad Caredials'});

    const match = await bcrypt.compare(pwd , foundUser.password);
    


    try{
        if(match) {
            const accessToken = jwt.sign(
                {"email" : foundUser.email},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn : '50min'}
            )
            const refreshToken = jwt.sign(
                {"email" : foundUser.email},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn : '1d'}
            )
    
            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();
    
           res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' , maxAge: 24 * 60 * 60 * 1000 });
            
            return res.json({ 
                id : result._id,
                userName : result.userName,
                email : result.email,
                accessToken : accessToken
             });
        } else {
            return res.status(401).json({"message" : 'Bad Caredials'})
        }
    }
    catch (err){
        console.log(err)
        return res.sendStatus(500);
    }
}

const handleRefreshToken = async (req : Request , res : Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

   const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err : any , decoded : any) => {
            if(err || foundUser.email !== decoded.email) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { "email" : decoded.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn : '50min'}
            )
            res.json({
                id : foundUser._id,
                email : foundUser.email,
                userName : foundUser.userName,
                accessToken : accessToken,
            })
        }
    )
}

const handleLogout = async (req:Request , res:Response) => {
    const cookies = req.cookies ;

    
    if(!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt ;

    const foundUser = await User.findOne({ refreshToken : refreshToken}).exec() ;
    if(!foundUser) {
        res.clearCookie('jwt' , {
            httpOnly : true,
            sameSite : 'none',
            secure : true
        });
        return res.sendStatus(204);
    }


    foundUser.refreshToken = '' ;
    const result = foundUser.save();

    

    res.clearCookie('jwt' ,{
        httpOnly : true,
        sameSite : 'none',
        secure : true
    });

    res.sendStatus(204);
}


module.exports = {
    handleNewUser,
    handleLogin,
    handleRefreshToken,
    handleLogout
}