import { Client,sender } from "./mailtrap.config.js";
import { PASSWORD_RESET_SUCCESS_TEMPLETE, PASSWORD_RESET_TEMPLETE, VERIFICATION_EMAIL_TEMPLETE,} from "./emailTemplete.js";

export const sendVerificationEmail = async (email,verificationToken) =>{
    const recipient = [{email}]
    try{
            await Client.send({
            from : sender,
            to : recipient,
            subject : "Verify Your Email",
            html : VERIFICATION_EMAIL_TEMPLETE.replace("{verificationCode}",verificationToken),
            category : "Email Verification"
        })
    
    }catch(error){
        console.log("Error Sending Verification ",error);
    } 
} 


export const sendWelcomeEmail = async (name,email)=>{
   const recipient = [{email}]
   try{
        Client.send({
        from : sender,
        to : recipient,
        template_uuid : "565dfbf2-d803-4efb-bbef-2b393b1a4467",
        template_variables : {
            name : name,
        }
    })
    
   }catch(error){

   }
} 

export const sendPasswordResetEmail = async (email,resetURL)=>{
    const recipient = [{email}]
    try{
        await Client.send({
            from : sender,
            to : recipient,
            subject : "Reset Password",
            html : PASSWORD_RESET_TEMPLETE.replace("{resetURL}",resetURL),
            category : "Password Reset"
        })

    }catch(error){
        console.log("Error Sending Password Reset Email ",error);
        throw new Error(`Error Sending password Reset Email: ${error}`)
    }
}

export const sendResetEmail = async (email)=>{
    const recipient = [{email}]
    try{
       await Client.send({
         from : sender, 
         to : recipient,
         subject : "Password Reset Successfully",
         html : PASSWORD_RESET_SUCCESS_TEMPLETE,   
         category :"Password Reset Email"
       })
    }catch(error){
        throw new Error(`Error Sending password Reset Email: ${error}`)
    }
}     