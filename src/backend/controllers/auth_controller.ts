import { Router, Request, Response } from "express";
import { getRepository } from "../respositories/user_repository";
import { Repository } from "typeorm";
import { Users } from "../entities/user";
import * as jwt from "jsonwebtoken";

export function getHandlers(_userRepository: Repository<Users>) {
    
    const getTokenHandler = (req: Request, res: Response) => {
        (async () => {
            console.log(" body received");

            const body = req.body;
            const email = body.email;
            const password = body.password;
            //console.log(body);
            if (!email || !password) {
                console.log(" no password or nor email recived");
                console.log(" 400");
                res.status(400).send();
            } else {
                console.log(" find user: ");
                console.log(email);
                const user = await _userRepository.findOne({
                    where: {
                        email: email,
                        password: password
                    }
                });
                if (!user) {
                    console.log("  user NO in system! ");
                    console.log("  401");
                    res.status(401).send();
                } else {
                    console.log("  user in system! ");

                    const payload = { id: user.id };
                    //const secret = process.env.AUTH_SECRET;
                    process.env.AUTH_SECRET = user.password;
                    const secret = process.env.AUTH_SECRET;
                    //console.log(payload);
                  //  console.log(secret);
                  //  console.log(typeof(secret));
                    if (typeof secret === "string") {
                       console.log("  generate token in system! ");

                        const token = jwt.sign(payload, secret);
                        res.json({ token: token });
                         console.log("  token sent! ");

                    } else {
                        console.log("  secret password no string error ");

                        console.log("  500");
                        res.status(500).send();
                    }
                    
                }
            }
        })();
    };

    return {
        getTokenHandler
    };

}

export function getAuthRouter() {
    const handlers = getHandlers(getRepository());
    const authRouter = Router();
    authRouter.post("/", handlers.getTokenHandler);
    return authRouter;
}
