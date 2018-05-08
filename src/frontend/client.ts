
 import fetch = require("node-fetch");

let newUser = { email: Math.random().toString(36).substring(7)+"@gmail.com", password: "secret" };
let defaultUser = { email: "albertoorozco7@gmail.com", password: "secret" };
//web client 
console.log("\nWEB CLIENTE");
  // create a new user by /api/v1/users POST create a new User
async function createUser(){
	console.log("\nhttp://127.0.0.1:3000/api/v1/users POST create a new User");
	console.log("   Create a user :"+ JSON.stringify(newUser.email));
	console.log("   send request");
	try{
		const response = await fetch(
			"http://127.0.0.1:3000/api/v1/users", 
		{
    body: JSON.stringify(newUser), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
 });
		return await response.json();
	} catch (error){
		console.log(error);
	}

}


  // auth users by /api/v1/auth/login POST authentificate a User
async function authUser(){
	console.log("\nhttp://127.0.0.1:3000/api/v1/auth/login POST authentificate a User");
	console.log("   authentificating of default user :"+ JSON.stringify(defaultUser.email));
	console.log("   send request");
	try{
		const response = await fetch(
			"http://127.0.0.1:3000/api/v1/auth/login", 
		{
    body: JSON.stringify(defaultUser), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
 });
		return await response.json();
	} catch (error){
		console.log(error);
	}

}

(async ()=>{
  // execute the create user function with a random email
await createUser()
.then(function(result) {
   console.log("JSON response:") 
   console.log(result)
})


  // execute the auth user function with the default user
await authUser()
.then(function(result) {
   console.log("   JSON response:") 
   console.log(result) 
})
})();
