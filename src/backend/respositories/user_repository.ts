import { getConnection } from "typeorm";
import { Users } from "../entities/user";

export function getRepository() {
    const conn = getConnection();
    return conn.getRepository(Users);
}
