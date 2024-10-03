'use strict';

// Toggle between Sign In and Sign Up forms
let signinlink = document.getElementById("signinbtn-link");
let signuplink = document.getElementById("signupbtn-link");
let registerForm = document.getElementById("register-form");
let loginForm = document.getElementById("login-form");

// Event listener for switching to Sign In
signinlink.addEventListener('click', (event) => {
    event.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "flex";
});

// Event listener for switching to Sign Up
signuplink.addEventListener('click', (event) => {
    event.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "flex";
});

// Registration Form Submission
let form_reg = document.getElementById("register-form");
form_reg.addEventListener('submit', (event) => {
    event.preventDefault();  // Prevents form from submitting and reloading the page
    let reg_email = document.getElementById("reg-email").value;
    let reg_pass = document.getElementById("reg-pass").value;
    
    // Store registration info in an array of objects
    let regstaion_info = [{"remail": reg_email}, {"rpass": reg_pass}];
    
    // Convert the array of objects to JSON string
    let covertregtojson = JSON.stringify(regstaion_info);
    
    // Save to localStorage using the key "reg-info"
    localStorage.setItem("reg-info", covertregtojson);
    console.log("Registration info saved:", reg_email, reg_pass);
});

// Login Form Submission
let loginform = document.getElementById("login-form");
loginform.addEventListener('submit', (event) => {
    event.preventDefault();  // Prevents form from submitting and reloading the page
    
    // Retrieve the registration info from localStorage
    let logininfo = localStorage.getItem("reg-info");  // use the correct key here
    
    // Check if there's any data stored
    if (logininfo) {
        // Convert the JSON string back to an array of objects
        let covertregtoobject = JSON.parse(logininfo);
        
        // Extract the stored email and password
        let stored_email = covertregtoobject[0].remail;
        let stored_pass = covertregtoobject[1].rpass;
        
        // Get the email and password from the login form
        let login_email = document.getElementById("login-email").value;
        let login_pass = document.getElementById("login-pass").value;
        
        // Compare the login values with the stored registration values
        if (login_email === stored_email && login_pass === stored_pass) {
            console.log("Great");  // Print "Great" if the email and password match
        } else {
            console.log("Login credentials do not match.");
        }
    } else {
        console.log("No registration info found in localStorage.");
    }
});
