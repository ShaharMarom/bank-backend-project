import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    created: { type: Date, required: true, default: Date.now },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Transaction", TransactionSchema);