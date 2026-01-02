import { Request, Response } from "express";
import User from "../models/User";
import passport from "passport";
import frontendUrl from '../global'

const getMe = (req:Request, res:Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  res.json({ user: req.user });
}

const googleCallback = (req:Request, res:Response) => {
        res.redirect(`${frontendUrl}/dashboard`); 
  }


const googleLogout = (req:Request, res:Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });
}


// const registerUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body as RegisterCredentials;

//     // Check 
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already in use" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = await User.create({
//       email,
//       password: hashedPassword,
//     });

//     // AUTO-LOGIN
//     (req.session as any).user = {
//       id: user._id.toString(),
//       email: user.email,
//     };

//     res.status(201).json({
//       message: "User registered and logged in successfully",
//       data: {
//         id: user._id.toString(),
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const loginUser = async(req:Request, res:Response)=>{
//     try{
//         const {email, password} = req.body
//         const user = await User.findOne({ email})

//         if (!user) return res.status(401).json({message:"Invalid credentials"})

//         if (!user.password) return 
//         const isVlaid = await bcrypt.compare(password, user.password)

//         if (!isVlaid) {
//             return res.status(401).json({message: "Invalid Credentials"})
//         }

//         (req.session as any).user = {
//             id:user._id.toString(), 
//             email: user.email
//         }

//         res.status(200).json({message:"user logged in successfully", data: {id:user._id.toString(), email: user.email}})

//     }catch(err){
//         console.log(err)
//         res.status(500).json({message: "Login: Server error"})
//     }
// }

export {getMe, googleCallback, googleLogout}