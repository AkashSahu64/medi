// src/config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.model.js';

// Debug logging
console.log('GOOGLE_CLIENT_ID from env:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET from env:', process.env.GOOGLE_CLIENT_SECRET ? '***SET***' : 'NOT SET');

// Check if Google credentials exist
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️ Google OAuth credentials missing. Google login disabled.');
} else {
  passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 1. First check by email
        let user = await User.findOne({ email });

        if (user) {
          // 2. If user exists but googleId missing → link account
          if (!user.googleId) {
            user.googleId = profile.id;
            user.isVerified = true;
            await user.save();
          }
        } else {
          // 3. Create new user only if not exists
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email,
            avatar: profile.photos[0].value,
            isVerified: true,
            password: Math.random().toString(36), // dummy
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;