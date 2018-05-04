// import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// @Entity()
// export class Link {
//     @PrimaryGeneratedColumn()
//     public id: number;
//     @Column()
//     public title: string;
// }

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Users } from "./user";

@Entity()
export class Link {

   @PrimaryGeneratedColumn()
   public id: number;

   @ManyToOne(type => Users, user => user.id)
   public user: Users;

   @Column()
   public url: string;

   @Column()
   public title: string;
   
}