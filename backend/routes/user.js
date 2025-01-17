const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcryptjs");
const { User } = require("../db");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const JWT_SECRET = "jwtsecret"
const registerSchema = z.object({
    username: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string(),
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName } = req.body;
        const { success } = registerSchema.safeParse(req.body);
        
        if (!success) {
            return res.status(401).json({
                msg: "Email already taken / Incorrect inputs",
            });
        }

        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(500).json({
                msg: "Email already taken",
            });
        } else {
            const newUser = await User.create({
                username,
                firstName,
                lastName,
                password: bcrypt.hashSync(password, salt),
            });
            return res.status(200).json({
                msg: "User created",
                user : newUser
            });
        }
    } catch (err) {
        return res.status(500).json({
            msg: "Internal server error",
            error: err.message, 
        });
    }
});
const loginSchema = z.object({
    username:z.string().email(),
    password: z.string()
})
router.post('/login', async (req,res)=>{

    try{
        const {username,password} = req.body;
        const { success } = loginSchema.safeParse(req.body)
        if(!success){
            return res.status(400).json({
                msg : "Invalid inputs"
            })
        }
        const currentUser = await User.findOne({username});
        if(!currentUser){
            return res.status(404).json({
                msg: "User not found",
            });
        }
        const passCheck = bcrypt.compareSync(password,currentUser.password);
        if(!passCheck){
            return res.status(500).json({
                msg : "Invalid password",
            })
        }
        const token = jwt.sign({
            userId : currentUser._id,
            username: currentUser.username
        },JWT_SECRET);
        return res.status(200).json({
            msg: "Logged in successfully",
            token : token
        })
    } catch(err){
        return res.status(400).json({
            msg : "Error"
        })
    }
    


})

module.exports = router;
