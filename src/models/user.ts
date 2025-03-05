import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    created: { type: Date, required: true, default: Date.now },
    lastLogin: { type: Date , default: Date.now},
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
    balance: { type: Number, default: 0 }
})

module.exports = mongoose.model("User", UserSchema);