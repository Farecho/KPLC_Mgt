if (process.env.NODE_ENV !== "production"){
  require("dotenv").config()
}

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mysql = require("mysql2");
const cors = require("cors");
const path = require('path');
const bcrypt = require("bcrypt");
const initializePassport = require("./passport.config")
const flash = require("express-flash")
const session = require("express-session")
const passport = require('passport');
//const registerRouter = require("./signup.config");
const { signupValidation, handleValidationErrors } = require("./signup.config");
const nodemailer = require("nodemailer");
const {authorizeRolePermission} = require("./roleModule");

//Configuring the email transporter using environment variables for sensitive data
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // TSL
  secure: false, // Use SSL (true for port 465, false for port 587)
  auth: {
    user: process.env.EMAIL_USER, //email address
    pass: process.env.EMAIL_PASS // app password
  },
  connectionTimeout: 10000
})


initializePassport(passport, getUserByEmail, getUserById);

app.use(express.json());
app.use(cors());
dotenv.config();

//Connecting to the Database 
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
});

module.exports = db;

//testing the connection
db.connect((err) => {
  if (err) {
      console.log("Error connecting to the Database: ", err);
      process.exit(1);
  }
  console.log("Successfully connected to MySQL: ", db.threadId);

  // Test query
  db.query("SELECT 1", (err, results) => {
      if (err) {
          console.error("Database test query failed:", err);
      } else {
          console.log("Database test query succeeded:", results);
      }
  });
});

//Function to get user by email
async function getUserByEmail(email){
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => { 
      if(err){
        reject(err);
      }
      else{
        resolve(results[0]);
      }
    })
  })
}
// Function to get user by ID
async  function getUserById(id){
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
      if(err){
        reject(err);
      }else{
        resolve(results[0]);
      }
    })
  })
}
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, //We wont resave session variable if nothing has changed
  saveUninitialized: false,
  cookie: {
    maxAge: null,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}))
app.use(passport.initialize())
app.use(passport.session())
//app.use("/", registerRouter); // This makes `/signup` the active route for the form


app.post(
  "/signup",
  signupValidation, // Apply validation rules
  handleValidationErrors, // Handle validation errors
  async (req, res) => {
      const { name, email, password, phoneNumber } = req.body;

      try {
          // Check if the email already exists in the database
          const [existingUser] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
          if (existingUser.length > 0) {
              req.flash("error", "Email is already registered.");
              return res.redirect("/signup");
          }

          // Hash the password before saving it
          const hashedPassword = await bcrypt.hash(password, 10);

           // Assign the Customer role_id ( the ID for 'Customer' role is 4)
          const [role] = await db.query("SELECT id FROM roles WHERE role_name = 'Customer'");
          const roleId = role.id;
          // Insert the new user into the database
          try {
              // Insert the new user into the database
              const [result] = await db.promise().query(
                  "INSERT INTO users (username, email, pwd, phone_number, role_id) VALUES (?, ?, ?, ?, ?)",
                  [name, email, hashedPassword, phoneNumber, roleId]
              );
          
              // Log query result for debugging purposes only
              console.log("User inserted with ID:", result.insertId);
              console.log("Insert Result:", result); // Log the result of the insertion
          
              // Redirect to login page on success
              return res.redirect("/login"); // Return to stop further execution
          } catch (error) {
              console.error("Error during database insertion:", error);
              req.flash("error", "An error occurred during registration. Please try again.");
              return res.redirect("/signup"); // Return to stop further execution
          }
          
      } catch (error) {
          console.error("Error during signup:", error);
          req.flash("error", "An error occurred during registration. Please try again.");
          return res.redirect("/signup"); // Return to stop further execution
      }
  }
);


// app.post("/login", passport.authenticate("local", {
//   successRedirect: "/home",
//   failureRedirect: "/login",
//   failureFlash: true
// }))

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if(err) return next(err);//Handles errors
    if(!user){
      req.flash("error", info.message);
      return res.redirect("/login"); //Redirect on failure

    }

    req.logIn(user, (err) => {
      if (err) return next(err); //Handle login errors

      //Code to check if "Remeber Me" is checked
      if (req.body.remember){
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; //30days in milliseconds
      }
      else{
        req.session.cookie.expires = false;//Session ends when browser is closed
     }
     return res.redirect("/home"); //Redirect on successful login
    })
  })
  (req, res, next);
})

//Handle form submission to send reset email
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await getUserByEmail(email);
    if (!user) {
      req.flash('error', 'No user found with that email.');
      return res.redirect('/forgot-password');
    }

    // Generate a secure token and expiry time
    const token = require('crypto').randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store the token and expiry in the database
    await db.promise().query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [token, expiry, email]
    );

    // Send the reset email
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset. Click the link to reset your password:</p><a href="${resetLink}">Reset Password</a>`
    });

    req.flash('success', 'A Password reset link has been sent to your email.');
    res.redirect('/forgot-password');

  } catch (error) {
    console.error('Error during password reset:', error);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/forgot-password');
  }
});

//Submission of the new password
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Validate token
    const [user] = await db.promise().query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?",
      [token, new Date()]
    );

    if (!user) {
      req.flash('error', 'Invalid or expired token.');
      return res.redirect('/forgot-password');
    }
    // Ensure newPassword is provided
    if (!newPassword) {
      req.flash('error', 'Password is required.');
      return res.redirect(`/reset-password?token=${token}`);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database and clear the token
    await db.promise().query(
      "UPDATE users SET pwd = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?",
      [hashedPassword, token]
    );

    req.flash('success', 'Your password has been reset successfully.');
    res.redirect('/login');

  } catch (error) {
    console.error('Error resetting password:', error);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect(`/reset-password?token=${token}`);
  }
});

// Routes
app.get('/login', (req, res) => {
  res.render("login.ejs", { messages: req.flash() });
});


app.get('/signup', (req, res) => {
  const flashMessages = req.flash("error");
  console.log("Flash Messages Passed to View:", flashMessages); // Log the messages passed to signup.ejs
  res.render("signup.ejs", { messages: { error: flashMessages } });
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect("/login");
}

app.get('/home', checkAuthenticated, (req, res) => {
  res.render("home.ejs");
});

// Route to render the forgot password form
app.get('/forgot-password', (req, res) => {
  res.render('forgot-password.ejs', { messages: req.flash() });
});

app.get('/reset-password', async (req, res) => {
  const token = req.query.token;

  // Check if the token is valid and not expired
  const [result] = await db.promise().query(
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?",
    [token, new Date()]
  );

  if (result.length === 0) {
    req.flash('error', 'Invalid or expired token.');
    return res.redirect('/forgot-password');
  }

  res.render('reset-password.ejs', { token }); // Render a form to reset password
});
//  An Example Route accessible only to users with 'view_dashboard' permission
app.get('/dashboard', authorizeRolePermission('view_dashboard'), (req,res) => {
  res.render('dashboard.ejs', {user: req.user});
});
 
// I'll add routes here once all the files for all user roles are added. These will be for managing  access control based on permissions.



// listening to the port
const PORT = 3300;
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:${PORT}')
});