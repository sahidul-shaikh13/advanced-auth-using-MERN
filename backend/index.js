import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {db} from "./db/connectDB.js"
import router from  "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import path from "path"

 
  
dotenv.config()
const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve()

app.use(cors({origin: "http://localhost:5173", credentials:true}))
 
app.use(express.json())
app.use(cookieParser()) 
app.use("/api/auth",router);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"/frontend/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
    });
};
 
             
app.listen(PORT,()=> {   
    db();  
    console.log(`server connected at ${PORT}`)}  
)

       