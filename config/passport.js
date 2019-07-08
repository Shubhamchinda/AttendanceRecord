// load all the things we need
import { Strategy as LocalStrategy } from "passport-local";

// load up the user model
import User from "../app/models/user";

export default passport => {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser((user, done) => done(null, user.id));

  // used to deserialize the user
  passport.deserializeUser((id, done) =>
    User.findById(id, (err, user) => done(err, user))
  );

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        if (email) {
          email = email.toLowerCase();
          console.log(email); // eslint-disable-line
        }

        // asynchronous
        process.nextTick(function() {
          User.findOne({ email: email }, function(err, user) {
            if (err) {
              return done(err);
            }

            if (!user) {
              return done(
                null,
                false,
                req.flash("loginMessage", "No user found.")
              );
            }

            if (!user.validPassword(password)) {
              return done(
                null,
                false,
                req.flash("loginMessage", "Oops! Wrong password.")
              );
            }

            return done(null, user);
          });
        });
      }
    )
  );

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        process.nextTick(function() {
          // if the user is not already logged in:
          if (!req.user) {
            User.findOne({ email: email }, function(err, user) {
              // if there are any errors, return the error
              if (err) {
                return done(err);
              }

              if (user) {
                return done(
                  null,
                  false,
                  req.flash("signupMessage", "That email is already taken.")
                );
              }

              let newUser = new User();
              console.log(newUser);
              //   User.createUser(newUser, function(err, user) {
              //     if (err) throw err;
              //   });

              newUser.email = email;
              newUser.password = newUser.generateHash(password);

              newUser.save(e => {
                if (e) {
                  return done(e);
                }
                return done(null, newUser);
              });
            });
            // if the user is logged in but has no local account...
          } else if (!req.user.email) {
            User.findOne({ email: email }, function(err, user) {
              if (err) {
                return done(err);
              }

              if (user) {
                // eslint-disable-line
                return done(
                  null,
                  false,
                  req.flash("loginMessage", "That email is already taken.")
                );
              }

              let newloginUser = req.user;
              newloginUser.email = email;
              newloginUser.password = newloginUser.generateHash(password);
              newloginUser.save(function(e) {
                if (e) {
                  return done(err);
                }
                return done(null, newloginUser);
              });
            });
          } else {
            return done(null, req.user);
          }
        });
      }
    )
  );
};
