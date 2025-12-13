/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { EIsActive, ERole } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async(email: string, password: string, done) => {
      try {
        const existedUser = await User.findOne({email});

        if(!existedUser){
          return done(null, false, {message: "User does not exist."});
        }

        if(existedUser.isActive === EIsActive.INACTIVE || existedUser.isActive === EIsActive.BLOCKED){
          return done(`User is ${existedUser.isActive}`)
        }

        if(existedUser.isDeleted){
          return done("User is deleted");
        }

        const isGoogleAuthenticated = existedUser.auths.some(authObject => authObject.provider === "google");

        if(isGoogleAuthenticated && !existedUser.password){
          return done(null, false, {message: "You have authenticated through google login. If you want to login with credentials, at first you have to login with google and set your password, then you can login with email and password."});
        }

        const isPasswordMatched = await bcryptjs.compare(password, existedUser.password as string);

        if(!isPasswordMatched){
          return done(null, false, {message: "Your password is incorrect."})
        }

        return done(null, existedUser);

      } catch (error) {
        console.log("error from local strategy", error)
        done(error);
      }

    }

  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "No email Found." });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            avatar: profile.photos?.[0].value,
            isVerified: true,
            role: ERole.USER,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        console.log("google strategy error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser(
  (user: any, done: (error: any, id?: unknown) => void) => {
    done(null, user._id);
  }
);

passport.deserializeUser(
  async(id: any, done: any) => {
    try {
      const user = await User.findById(id);
      done(null, user)
    } catch (error) {
      console.log(error)
      done(error)
    }
  }
);