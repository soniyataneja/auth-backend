document.addEventListener("DOMContentLoaded" ,function(){
const signupForm = document.getElementById("signupForm")
if(signupForm){
signupForm.addEventListener("submit",async function(event){
    event.preventDefault()
    const firstName = document.getElementById("signupFirstName").value
    const lastName = document.getElementById("signupLastName").value
    const email = document.getElementById("signupEmail").value
    const password = document.getElementById("signupPassword").value
    const username = document.getElementById("signupUsername").value

          if (!firstName) {
        alert("First name is required");
        return;
      }
      if (!lastName) {
        alert("Last name is required");
        return;
      }
      if (!username) {
        alert("Username is required");
        return;
      }
      if (!email) {
        alert("Email is required");
        return;
      }
      if (!validateEmail(email)) {
        alert("Please enter a valid email");
        return;
      }
      if (!password) {
        alert("Password is required");
        return;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
      }


    const response = await fetch("http://localhost:3000/signup",{
    method: "POST",
    headers:{
         "Content-Type": "application/json"
    },
    body: JSON.stringify({firstName,lastName, username, email, password}),
  });

   const result = await response.json();

   if(!result.ok){
    alert(result.message)
   }
   else{
    alert("signup successful! Redirecting to login page")
    window.location.href = "login.html"
   }
})
};


const loginForm = document.getElementById("loginForm")
if(loginForm){
loginForm.addEventListener("submit",async function(event){
    event.preventDefault()
    const loginUsername = document.getElementById("loginUsername").value
    const loginPassword = document.getElementById("loginPassword").value
if (!loginUsername) {
        alert("Username is required");
        return;
      }
      if (!loginPassword) {
        alert("Password is required");
        return;
      }

    const loginResponse  = await fetch("http://localhost:3000/login",{
        method: "POST",
        headers: {
            "content-type" : "application/json"
        },
        body: JSON.stringify({loginUsername,loginPassword})
    })
    const loginResult = await loginResponse.json()
    if(!loginResult.ok){
        alert(loginResult.message)
    }else{
        localStorage.setItem("token",loginResult.token)
        alert("login successful, redirecting to your dashboard")
        window.location.href = "dashboard.html"
    }

})
}

const dashboard = document.getElementById("dashboard")
if(dashboard){
dashboard.addEventListener("click",async function(){
   
    const token = localStorage.getItem("token")
    if(!token){
        alert("you are not logged in")
    }
    const dashboardResponse = await fetch("http://localhost:3000/dashboard",{
        method:"GET",
        headers:{ "Authorization":`Bearer ${token}`},
        "Content-type": "application/json"
        
})
const data =  await dashboardResponse.json();
if(!dashboardResponse.ok){
    alert(data.message)
}
else{
    const userDeatils = document.getElementById("userDetails")
    userDeatils.textContent = JSON.stringify(data.user,null,2)
}

})
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }
})




 
