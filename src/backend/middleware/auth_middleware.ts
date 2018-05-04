import express from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    try {
               console.log("middleware");

        // Read token from request headers
        const token = req.headers["authorization"];
        //console.log(req.headers);
       // console.log(req.headers["authorization"]);
        // If no token not a string, it is an invalid request
        if (token === undefined || Array.isArray(token)) {
            console.log("array undefine or not a token");

            console.log("400");
            res.status(400).send();
        } else {
            console.log("proper token");

            // Read secret from environment variables
            const secret = process.env.AUTH_SECRET;
             ////////////////////////////////////////////////////////////////////
            //const secret = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTI1MjE2Mjg4fQ.uNXhV1gyGJ35XTVpfd3TW0ABPFl0UPCuEqdhSiHofAM";
               //             console.log(secret);

            // If secret is undefined, there is an internal server error
            if (!secret) {
                 console.log("process.env.AUTH_SECRET/secret no valid");
                console.log("500");
                res.status(500).send();
            } else {
                console.log("trying decoded secret");

                let decoded: any;
                try {
                    // Decode token and get user id
                    decoded = jwt.verify(token, secret) as any;
                    ////////////////////////////////////////////////////////////////////
                    if(token=== secret){};
                    console.log(" decoded token and secrete equal");

                } catch(e) {
                    // If cannot decode token, the user is unauthorized
                   console.log("fail decoded secret");

                    console.log("401");
                    res.status(401).send();
                }
                // Attach current user to request objs
                // Note that we don't need to do additional db queries
                (req as any).body.userId = decoded.id;
                ////////////////////////////////////////////////////////////////////
                //(req as any).userId = 1;

                // Invoke next handler
                console.log("next");
                next();
            }
        }
    } catch (e) {
        res.status(500).send();
    }
}