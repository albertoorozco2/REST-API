import { getConnection } from "typeorm";
import { Link } from "../entities/link";

export function getRepository() {
    const conn = getConnection();
    return conn.getRepository(Link);
}
