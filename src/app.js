import express from "express";
import cookieParse from "cookie-parse";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static('public'))
app.use(cookieParse())

//import routes
import userRouters from "./routes/user.routes.js"

//route declaration
app.use("/api/v1/users", userRouter)


//http://localhost:8000/users



export {app};