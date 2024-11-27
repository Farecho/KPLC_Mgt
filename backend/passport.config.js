const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
    // Function to authenticate users
    const authenticateUsers = async (email, password, done) => {
        try {
            // Get user by email
            const user = await getUserByEmail(email); // Ensure `getUserByEmail` is a Promise-based function
            if (!user) {
                return done(null, false, { message: "No user found with that email" });
            }
            //Logging values to debug
            console.log("Received password: ", password); // The plain text password
            console.log("Stored password hash: ", user.pwd); // The stored hashed password
    
            // Compare password
            const isMatch = await bcrypt.compare(password, user.pwd);
            if (isMatch) {
                return done(null, user); // Successful authentication
            } else {
                return done(null, false, { message: "Password Incorrect" });
            }
        } catch (e) {
            console.error("Error authenticating user:", e);
            return done(e); // Pass error to Passport
        }
    };

    // Local strategy
    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUsers));

    // Serialize user: Store user ID in session
    passport.serializeUser((user, done) => done(null, user.id));

    // Deserialize user: Retrieve user details using ID
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await getUserById(id); // Ensure `getUserById` is a Promise-based function
            if (!user) {
                return done(new Error("User not found"), null); // Handle missing user
            }
            return done(null, user); // Successfully retrieved user
        } catch (e) {
            console.error("Error deserializing user:", e);
            return done(e, null); // Pass error to Passport
        }
    });
}

module.exports = initialize;
