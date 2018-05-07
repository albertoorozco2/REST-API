import express from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    try {
        console.log("Authorization authMiddleware");
        // Read token from request headers
        const token = req.headers["authorization"];
        //console.log(req.headers);
       // console.log(req.headers["authorization"]);
        // If no token not a string, it is an invalid request
        if (token === undefined || Array.isArray(token)) {
            console.log(" 400 Bad request!");
            res.status(400).send("Bad request!");
        } else {
            // Read secret from environment variables
            const secret = process.env.AUTH_SECRET;
            // If secret is undefined, there is an internal server error
            if (!secret) {
                console.log(" 500 Internal Server Error!");
                res.status(500).send("Internal Server Error!");
            } else {
                let decoded: any;
                try {
                    // Decode token and get user id
                    decoded = jwt.verify(token, secret) as any;
                    ////////////////////////////////////////////////////////////////////
                    if(token=== secret){};
                } catch(e) {
                    // If cannot decode token, the user is unauthorized
                    console.log("403 Forbidden!");
                    res.status(403).send("Forbidden!");
                }
                // Attach current user to request objs
                // Note that we don't need to do additional db queries
                (req as any).body.userId = decoded.id;
                console.log(" User authorized!");

                // Invoke next handler
                console.log(" next");
                next();
            }
        }
    } catch (e) {
        res.status(500).send();
    }
}