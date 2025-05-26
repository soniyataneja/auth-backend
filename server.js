const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const app = express()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

app.use(cors())

app.use(express.json())
mongoose.connect("mongodb+srv://soniyataneja23:Soneja2303@cluster0.bw5esol.mongodb.net/signup").then(()=> console.log("mongodb connected"))
.catch(err => console.error("mongodb connection error", err))

const User = mongoose.model("users", {
    firstName: String,
    lastName: String,
    email: String,
    password : String,
    username : String
})

app.post('/signup', async function(req,res){
    // console.log("incoming request body", req.body);
    
    
        const {firstName,lastName,username,email,password} = req.body
         if (!firstName || !lastName || !email || !password || !username) {
    return res.status(400).json({ 
        ok: false,
        message: "Missing fields" });
  }
    try{
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                ok: false,
                message: "User already exists"
            })

        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password:hashedPassword
        })
        await newUser.save()
        res.status(201).json({
            ok: true,
            message: " user registered successfully"
        })

    }catch(err){
        console.error("Error during signup" , err)
        res.status(500).json({message: "server error"})
    }
})

app.post('/login', async (req,res) => {
    const{loginUsername, loginPassword} = req.body
    if(!loginUsername || !loginPassword){
        return res.status(400).json({
            message: "missing fields"
        })
    }
    try{
        const existingUser = await User.findOne({username: loginUsername})
        if(!existingUser){
            return res.status(400).json({
                message: "invalid username or password",
                ok: false
            })
        }
        const passwordMatch = await bcrypt.compare(loginPassword,existingUser.password)
        if(!passwordMatch){
            return res.status(400).json({message: " Invalid username or password",
                ok:false
            })
        }

        const token = jwt.sign({username: loginUsername},"123456",{expiresIn: "7d"})

        res.status(200).json({message: "login successful",
            ok:true,
            token:token
        })
    }
    catch(err){
        console.error("login error", err)
        res.status(500).json({message:"Server error"})
    }
})

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
      if(!token) {return res.status(401).json({message: "Token missing"});}

      jwt.verify(token,"123456",(err,user)=>{
        if(err){
            return res.status(400).json({message: "token invalid"})
        }
    
      req.user = user
      })
      next()
      


}

app.get('/dashboard',authenticateToken,async(req,res)=>{
    try{
        const user = await User.findOne({username:req.user.username}).select("-password")
        if(!user){
            return res.status(404).json({
                message: "user not found",
            ok:false})
        }
        res.json({
            ok:true,user})
    }catch(err){
        console.error(err);
        res.status(500).json({message:"server error",err})
    }

})


app.listen(3000)
