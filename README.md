# simpleTwitter.REST-API
REST API for a for a simplified version of the website Twitter. User will be able to create an account/ login and publish tweets. Other users will then be able to like and retweet the tweets.

## Installation
you are going to need to install Node.js, TypeScript and ts-node. You will also need to create a package.json file and a tsconfig.json file. 

$ npm init --y
$ tsc --init

You are going to need to change the default configuration in the tsconfig.json file to the following:

{  
 "compilerOptions": {  
   "target": "es5",  
   "module": "commonjs",  
   "lib": ["es2015"],  
   "strict": false,  
   "experimentalDecorators": true,  
   "emitDecoratorMetadata": true  
 }  
}  



Directory architecture:

├───node_modules  
│   └─── ...  
├───package.json  
├───tsconfig.json  
├───app.ts  
├───index.ts  
├───db.ts  
│   ├───backend  
│   │   ├───controllers  
│   │   ├───entities  
│   │   ├───middleware  
│   │   └───repositories  
│   └───frontend  
│       └─── client.ts  
└───test  
└───controllers




## Usage
End points and Descriptions

+----------------------------+-----------+------------------------------------------+--------+
| HTTP                       | MethodURL | Description                              | public |
+----------------------------+-----------+------------------------------------------+--------+
| /api/v1/tweets             | GET       | Return all tweet                         | yes    |
+----------------------------+-----------+------------------------------------------+--------+
| /api/v1/tweets             | POST      | Creates a new tweet                      | no     |
+----------------------------+-----------+------------------------------------------+--------+
| /api/v1/tweets/:id         | DELETE    | Deletes a tweet                          | no     |
+----------------------------+-----------+------------------------------------------+--------+
| /api/v1/tweets/:id/like    | POST      | Upvotes tweet                            | no     |
+----------------------------+-----------+------------------------------------------+--------+
| /api/v1/tweets/:id/retweet | POST      | Retweet tweet                            | no     |
+----------------------------+-----------+------------------------------------------+--------+
| /api/v1/auth/login         | POST      | Returns an auth token                    | yes    |
+----------------------------+-----------+------------------------------------------+--------+
| /api/v1/users              | POST      | Creates a new user account               | yes    |
+----------------------------+-----------+------------------------------------------+--------+
| /api/v1/user/tweets        | GET       | Returns all tweet created by logged user | yes    |
+----------------------------+-----------+------------------------------------------+--------+


* user authentication using JWT tokens and middleware.
* an invalid input place an error HTTP 400 (Bad Request) 
* an exception takes place an error HTTP 500 (Internal Server Error)  
* user doesn't have permissions to perform an operation, an error HTTP 403 (Forbidden)
* request tries to access a private endpoint without a known identity, an error HTTP 401 (Unauthorized)


## Contributing
Alberto Orozco.

## License
[MIT](https://choosealicense.com/licenses/mit/)
