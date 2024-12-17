const { check, validationResult } = require("express-validator");

const signupValidation = [
    check("name", "Name cannot be empty").notEmpty(),
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Password must be at least 8 characters long").isLength({ min: 8 }),
    check("confirmPassword", "Passwords do not match").custom((value, { req }) => value === req.body.password),
    check("phoneNumber", "Phone number must be 10 digits").matches(/^\d{10}$/),
    check("terms", "You must accept the terms and conditions").equals("on"),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    console.log("Validation Errors:", errors.array()); // Log detected errors
    if (!errors.isEmpty()) {
        req.flash(
            "error",
            errors.array().map(err => err.msg)
        );
        return res.redirect("/signup");
    }
    next(); // Continue if no validation errors
};


module.exports = { signupValidation, handleValidationErrors };
