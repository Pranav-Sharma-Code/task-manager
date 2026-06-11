import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please Enter Name'],
            trim: true,
        },

        email: {
            type: String,
            required: [true, 'Please Enter Email'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Please Enter Password"],
            minlength: [6, 'Minimun 6 character allowed'],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('User', userSchema);