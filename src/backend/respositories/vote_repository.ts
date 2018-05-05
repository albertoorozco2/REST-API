import { getConnection } from "typeorm";
import { Vote } from "../entities/vote";

export function getRepositoryVote() {
    const conn = getConnection();
    return conn.getRepository(Vote);
}
