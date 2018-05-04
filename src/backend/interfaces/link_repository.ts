import Link from "./link";

export default interface linkRepository {
    readAll(): Link[];
    readById(id: number): Link|null;
}
