import { Router } from "express";
import { getMe, googleCallback, googleLogout} from "../controllers/auth";
import requireAuth from "../middlewares/authMiddleWare";
import passport from "passport";
const router = Router()

router.get('/me', getMe)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), googleCallback);
router.use(requireAuth)
router.get("/logout", googleLogout);


export default router