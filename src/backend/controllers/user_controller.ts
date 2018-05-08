import { Router } from "express";
import { getRepository } from "../respositories/user_repository";

const getUserRouter = Router();

getUserRouter.post("/", function (req, res) {  //public
console.log("/api/v1/users POST creates a new user account");
	

(async () => {
const usersRepository = getRepository(); 
	const newUser = req.body;
	const newEmail = req.body.email;
	const newPassword = req.body.password;
	const empty = [];
	if(!newEmail || !newPassword){
		console.log(" 400 Bad Request! ");
		res.status(400).send(`Bad Request! `);
	}else{
	
		await usersRepository.find(newUser).then((users) => { 
			if (JSON.stringify(users)!="[]") {
				console.log(" 400 Bad Request! user already  in the system");
				res.status(400).send(`Bad Request! user already  in the system`);
			}else{

				usersRepository.save(newUser);
				console.log(" New User Added to System ");

				usersRepository.find(newUser).then((users) => { 
					res.json(newUser);
				}).catch((e: Error) => {
					console.log(" 500 Internal Server Error! ");
					res.status(500).send(e.message); 
				});
			};	
		}).catch((e: Error) => {
		console.log(" 500 Internal Server Error! ");
		res.status(500).send(e.message); 
		});
	};
 })();

});
	export { getUserRouter };
