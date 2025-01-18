
const express = require("express");

const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const { Account, Transactions,User } = require("../db");
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
        const transaction = await Transactions.create(
            [{
                amount: amount,
                from: req.userId,
                to: to,
                date: new Date()
            }],
            { session }
        );
        console.log(transaction);
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
router.get("/transactions", authMiddleware, async (req, res) => {
    try {
        // Get all transactions where the user is either the sender (from) or receiver (to)
        const transactions = await Transactions.find({
            $or: [
                { from: req.userId },
                { to: req.userId }
            ]
        })
        .populate('from', 'username firstName lastName') // Populating sender details
        .populate('to', 'username firstName lastName');   // Populating receiver details

        // Split transactions into from (sent) and to (received) for clarity
        const sentTransactions = transactions.filter(transaction => String(transaction.from._id) === String(req.userId));
        const receivedTransactions = transactions.filter(transaction => String(transaction.to._id) === String(req.userId));

        res.json({
            sentTransactions,
            receivedTransactions
        });
    } catch (err) {
        console.error("Error fetching transactions:", err);
        return res.status(500).json({
            msg: "Server error while fetching transactions",
            error: err.message
        });
    }
});
module.exports= router;