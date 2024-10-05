'use strict';

// Toggle between Sign In and Sign Up forms
let signinlink = document.getElementById("signinbtn-link");
let signuplink = document.getElementById("signupbtn-link");
let registerForm = document.getElementById("register-form");
let loginForm = document.getElementById("login-form");

// Registration Form Submission
let form_reg = document.getElementById("register-form");

// Event listener for switching to Sign In
signinlink.addEventListener('click', (event) => {
    event.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "flex";
    form_reg.setAttribute("disabled","");
    reg_submit.style.backgroundColor = "#db0028";
});

// Event listener for switching to Sign Up
signuplink.addEventListener('click', (event) => {
    loginForm.style.display = "none";
    registerForm.style.display = "flex";
});

let regstaion_info = localStorage.getItem("reg-info");
regstaion_info = JSON.parse(regstaion_info);
if(regstaion_info == null)
    regstaion_info = [];

let reg_submit = document.getElementById("reg-submit");

let conditions = document.getElementById("conditions");
    conditions.addEventListener("click", ()=>{
        console.log(conditions.checked);
        
        if(conditions.checked){
            reg_submit.removeAttribute("disabled");
            reg_submit.style.backgroundColor = "#db0028";
        }
            
        else {
            reg_submit.setAttribute("disabled","");
            reg_submit.style.backgroundColor = "#d82c4b";

        }
    });
form_reg.addEventListener('submit', (event) => {
    event.preventDefault();  // Prevents form from submitting and reloading the page
    let reg_email = document.getElementById("reg-email").value;
    let reg_pass = document.getElementById("reg-pass").value;
    let reg_name =document.getElementById("reg-name").value;
    
    // Store registration info in an array of objects
    let result = regstaion_info.map(a => a.remail);
    if(!result.includes(reg_email)){
    regstaion_info.push({"rname": reg_name, "remail": reg_email, "rpass": reg_pass});
    
    // Convert the array of objects to JSON string
    let covertregtojson = JSON.stringify(regstaion_info);
    
    // Save to localStorage using the key "reg-info"
    localStorage.setItem("reg-info", covertregtojson);
    alert("You have registerd successfully");
    location.replace("./subscription.html");
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    }
    else {
        alert("you have account already")
    }
});

// Login Form Submission
let loginform = document.getElementById("login-form");
loginform.addEventListener('submit', (event) => {
    event.preventDefault();  // Prevents form from submitting and reloading the page
    
    // Get the email and password from the login form
    let login_email = document.getElementById("login-email").value;
    let login_pass = document.getElementById("login-pass").value;
    
    // Retrieve the registration info from localStorage
    let logininfo = localStorage.getItem("reg-info");  // use the correct key here
    logininfo = JSON.parse(logininfo);
    if(logininfo == null){
        logininfo = [];
    }
    // Check if there's any data stored
    let temp = {
        remail: login_email,
        rpass: login_pass
    }
    if (logininfo.some(obj => obj.remail == login_email && obj.rpass == login_pass)) {
        alert("Logedin successfully");
        location.replace("./home.html")
        
    } else {
        alert("Username and password does not match");
        console.log(logininfo);
        console.log(login_email);
        console.log(login_pass);
        console.log(temp);
    }
     
});
