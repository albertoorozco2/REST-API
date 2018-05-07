import { createConnection } from "typeorm";
import { Link } from "./src/backend/entities/link";
import { Users } from "./src/backend/entities/user";
import { Vote } from "./src/backend/entities/vote";

export async function connecToDatabase() {

    const DATABASE_HOST = process.env.DATABASE_HOST || "localhost";
    const DATABASE_USER = process.env.DATABASE_USER || "A1";
    const DATABASE_PORT = 5432;
    const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "";
    const DATABASE_DB = "demo";

    const entities = [
        Link,
        Users,
        Vote
    ];

    const conn = await createConnection({
        type: "postgres",
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        username: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_DB,
        entities: entities,
        synchronize: true
    });
    const userRepository = conn.getRepository(Users);
      const userOne = await userRepository.findOne({
        id: 1
        });
      //console.log(userOne);
      if (userOne==undefined) {
        await userRepository.save({
         email: "albertoorozco7@gmail.com",
         password:"secret",
         }); 
     
          }
    return conn; 

}
