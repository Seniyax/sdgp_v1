
//const GoogleStrategy = require('passport-google-auth20').Strategy;
//const FacebookStrategy = require('passport-facebook').Strategy;
//const AppleStrategy = require('passport-apple').Strategy;

//passport.use(new GoogleStrategy)({
   // clientID:process.env.GOOGLE_CLIENT_ID,
    //clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    //callbackURL:"/api/auth/google/callback"

  /** },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ 
        'google.id': profile.id 
      });

      if (!user) {
        // Create new user
        user = await User.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          google: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
);
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ 
        'facebook.id': profile.id 
      });

      if (!user) {
        user = await User.create({
          email: profile.emails[0].value,
          name: `${profile.name.givenName} ${profile.name.familyName}`,
          facebook: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));



passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    callbackURL: "/api/auth/apple/callback",
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ 
        'apple.id': profile.id 
      });

      if (!user) {
        user = await User.create({
          email: profile.email,
          name: profile.name || 'Apple User',
          apple: {
            id: profile.id,
            email: profile.email
          }
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));**/


