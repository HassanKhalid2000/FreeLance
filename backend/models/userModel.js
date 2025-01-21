import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String },
    address: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    theJob: { type: String },
    jobDescription: { type: String },
    communicationLink: { type: String },
    pdf: { type: String },
    image: { type: String },
    accountType: { 
        type: String, 
        enum: [ "Admin","Freelancer","Company"], 
        required: true ,
        default:"User"
    },
    accountStatus: { 
        type: String, 
        enum: [ "Pending","Accepted", "Regected"], 
        required: true,
        default:"Pending" 
    },
});

export const userModel = mongoose.model("Users", userSchema);
