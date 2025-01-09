import {motion} from "framer-motion"
import {User,Mail,Lock, Loader} from "lucide-react"
import { useState } from "react";
import {Link, Navigate, useNavigate} from "react-router-dom"
import Input from "../component/Input"
import PasswordStrengthMeter from "../component/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore.js";

const SignUpPage = ()=>{
    const [name,setName] = useState("")
    const [password,setPass] = useState("")
    const [email,setEmail] =useState("")
    const {signup,error,isLoading} = useAuthStore();
    const navigate = useNavigate()
    
    const handleSignUp = async(e)=>{
         e.preventDefault();

         try{

           await signup(email,password,name);
           await navigate("/verify-email")

         }catch(error){
            
         };
         
     }

    
    return(
        <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.5}}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-1xl shadow-xl 
        overflow-hidden"
        >
        <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500
        text-transparent bg-clip-text">
            Create Account
        </h2>
        <form onSubmit={handleSignUp}>
            <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
            <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPass(e.target.value)}
            />
            <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
            <PasswordStrengthMeter password={password}/>
            <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white
            font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none
            focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition
            duration-200"
            whileHover={{scale:1.02}}
            whileTap={{scale:0.98}}
            type="submit"
            disabled={isLoading}
            >{isLoading ? <Loader className="animate-spin mx-auto" size={24}/> : "Sign UP"}</motion.button>
        </form>
        </div>
        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link to={"/login"} reloadDocument className="text-green-400 hover:underline">Login</Link>
            </p>
        </div>
            
        </motion.div>
    );
};


export default SignUpPage;