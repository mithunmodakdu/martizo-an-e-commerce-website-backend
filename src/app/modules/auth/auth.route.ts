import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { ERole } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/new-token-with-refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.patch("/reset-password", checkAuth(...Object.values(ERole)), AuthControllers.resetPassword);

router.get("/google", async(req: Request, res: Response, next: NextFunction) => {
  const redirect = req.query.redirect || "/";
  passport.authenticate("google", {scope: ["profile", "email"], state: redirect as string})(req, res, next)
});
router.get("/google/callback", passport.authenticate("google", {failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issue with your Account. Please contact with our support team.`}), AuthControllers.googleCallback);

router.patch("/set-password", checkAuth(...Object.values(ERole)), AuthControllers.setPassword);
router.post("/forgot-password", AuthControllers.forgotPassword);
router.patch("/forgot-password-reset", checkAuth(...Object.values(ERole)), AuthControllers.forgotPasswordReset);

export const AuthRoutes = router; 