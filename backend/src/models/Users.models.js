import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        fullName : {
            type : String,
            required : true,
            unique: false,
            index: true,
            trim: true,
        },
        email: {
            type: String,
            required : true,
            unique : true,
            trim: true,
        },
        contact: {
            type: Number,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            required : true,
            enum: ['Delegate', 'Executive'],
        }

    }, {timestamps: true}
);

export const User = mongoose.model("User", UserSchema);