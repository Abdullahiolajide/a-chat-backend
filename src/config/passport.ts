import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"], 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await User.findOne({ googleId: profile.id });
        console.log(profile)
        if (!user) {
          user = await User.findOne({ email: profile.emails?.[0].value });

          if (user) {
            // Existing email/password user → link Google
            user.googleId = profile.id;
            user.displayName = profile.displayName
            await user.save();
        } else {
            // New user
            user = await User.create({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails?.[0].value,
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user into session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;