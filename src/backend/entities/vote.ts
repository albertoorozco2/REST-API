import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Users } from "./user";
import { Link } from "./link";

@Entity()
export class Vote {

   @PrimaryGeneratedColumn()
   public id: number;

   @ManyToOne(type => Link, link => link.id)
   public link: Link;
   
   @ManyToOne(type => Users, user => user.id)
   public user: Users;

   @Column()
   public isUpvote: boolean;
   
}