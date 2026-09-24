import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import { JsonWebTokenError } from "jsonwebtoken";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required:true,
        uniqe: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required:[true, 'password is required']
    
    },
    fullName: {
        type: String,
        required:true,
    },
    avatar:{
        type: String, //cloudinary url
        required: true,
    },
    coverImage:{
        type: String, //cloudinary url
        required: true,
    },
    watchhistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "video",
        }
    ],
    refreshToken:{
        type: true,
    }

},{timestamps: true})

userSchema.pre("save", async function (next){
    if (this.isModified("password")) return next();

    this.Password = await bcrypt.hash(this.Password, 10)
    next()
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign({
        _id: this.id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)

}

userSchema.methods.generateRefreshToken = function(){
    jwt.sign({
        _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)

}
 


export const User = mongoose.model("User", userSchema)