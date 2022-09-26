import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Upvote } from "./Upvote";

@Entity()
export class Wilder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    city: string;

    @OneToMany(() => Upvote, "wilder")
    upvotes: Upvote[];
}