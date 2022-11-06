import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skill } from "./Skill";
import { Wilder } from "./Wilder";

@ObjectType()
@Entity()
export class Upvote {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;
    
    @Field()
    @Column()
    upvote: number

    @Field(() => Skill)
    @ManyToOne(() => Skill, 'upvotes')
    skill: Skill;

    @Field(() => Wilder)
    @ManyToOne(() => Wilder, 'upvotes')
    wilder: Wilder;
}