import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils.ApiError.js"
import { User } from "../modles/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    // res.status(200).json({
    //     message: "ok"
    // })
    const {username, fullName, email, password}= req.body
    console.log("email", email)
    //validation
    if(
        [fullName, username, email, password ].some((field) => field.trim() ==="")
    ){
        throw new ApiError(400, "All fields are rquired")
    }
    const existedUser = User.findOne({
        $or:[{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(avatarLocalPath){
        throw new ApiError(400,"Avater file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(avatar){
        throw new ApiError(400, "Avater file is required")
    }

    User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "_password _refreshToken"
    )

    if(createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }

    res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
})

export {registerUser}