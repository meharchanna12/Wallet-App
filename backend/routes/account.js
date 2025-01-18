
const express = require("express");

const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const router = express.Router();

router.get('/balance',authMiddleware,async (req,res)=>{
    const account = await Account.findOne({
        userId: req.userId
    })
    res.json({
        balance: account.balance
    })
})

router.post("/transfer",authMiddleware,async (req,res)=>{
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        
        const {amount,to} = req.body;
        //first find the account from which the payment is going to happen
        const account = await Account.findOne({
            userId: req.userId
        }).session(session);
        if(!account){
            await session.abortTransaction();
            return res.status(400).json({
                msg : "Invalid user"
            })
        }
        if(account.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({
                msg : "Insufficient balance"
            })
    
        }
        //now find the account to which we have to pay
        const toAccount = await Account.findOne({
            userId: to
        }).session(session);
    
        if(!toAccount){
            await session.abortTransaction();
            return res.status(400).json({
                msg : "Invalid account"
            })
        }
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
    
        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });
    } catch(err){
        return res.status(400).json({})
    }

})

module.exports= router;