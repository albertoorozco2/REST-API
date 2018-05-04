import { Router, Request, Response } from "express";
import { getRepository } from "../respositories/user_repository";
import { Repository } from "typeorm";
import { Users } from "../entities/user";
import * as jwt from "jsonwebtoken";

export function getHandlers(_userRepository: Repository<Users>) {
    
    const getTokenHandler = (req: Request, res: Response) => {
        (async () => {
            const body = req.body;
            const email = body.email;
            const password = body.password;
            //console.log(body);
            if (!email || !password) {
                console.log(" 400 Bad Request!");
                res.status(400).send("Bad Request!");
            } else {
                console.log(" user "+email);
                const user = await _userRepository.findOne({
                    where: {
                        email: email,
                        password: password
                    }
                });
                if (!user) {
                    console.log("  401 Unathorized");
                    res.status(401).send("Unathorized!");
                } else {
                    const payload = { id: user.id };
                    //const secret = process.env.AUTH_SECRET;
                    process.env.AUTH_SECRET = user.password;
                    const secret = process.env.AUTH_SECRET;

                    if (typeof secret === "string") {
                        const token = jwt.sign(payload, secret);
                        console.log("  Token generated and sent!");
                        res.json({ token: token });
                    } else {
                        console.log("  500 Internal Server Error!");
                        res.status(500).send("Internal Server Error!");
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
