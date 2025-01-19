const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcryptjs");
const { User, Account } = require("../db");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");
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
            const userId = newUser._id;
            await Account.create({
                userId,
                balance: 1+Math.random()*10000
            })
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
            userId : currentUser._id,
            token : token,
            firstName : currentUser.firstName
        })
    } catch(err){
        return res.status(400).json({
            msg : "Error"
        })
    }

})

const updateSchema = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
})
router.put('/update', authMiddleware, async (req, res) => {
    const { password, firstName, lastName } = req.body;

    try {
        // Prepare the update object
        const updateFields = {};
        if (password) {
            updateFields.password = bcrypt.hashSync(password, salt);
        }
        if (firstName) {
            updateFields.firstName = firstName;
        }
        if (lastName) {
            updateFields.lastName = lastName;
        }

        // Update user only with provided fields
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.userId },
            updateFields,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                msg: "User not found",
            });
        }

        return res.status(200).json({
            msg: "User updated successfully",
            user: updatedUser,
        });

    } catch (err) {
        return res.status(500).json({
            msg: "Internal server error",
            error: err.message,
        });
    }
});



router.get('/bulk', authMiddleware, async (req, res) => {
    try {
        const filter = req.query.filter || "";
        console.log("Filter received:", filter);

        const users = await User.find({
            $or: [
                { firstName: { $regex: filter, $options: "i" } },
                { lastName: { $regex: filter, $options: "i" } }
            ]
        });

        console.log("Filtered users:", users);

        res.json({
            users: users.map((user) => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
