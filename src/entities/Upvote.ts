import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skill } from "./Skill";
import { Wilder } from "./Wilder";

@Entity()
export class Upvote {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    upvote: number

    @ManyToOne(() => Skill, 'upvotes')
    skill: Skill;

    @ManyToOne(() => Wilder, 'upvotes')
    wilder: Wilder;
}