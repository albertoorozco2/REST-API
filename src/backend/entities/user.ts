import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    public id: number;
    @Column()
    public email: string;
    @Column()
    public password: string;
}
