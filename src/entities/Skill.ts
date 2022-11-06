import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Upvote } from "./Upvote";

@ObjectType()
@Entity()
export class Skill {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field(() => [Upvote])
    @OneToMany(() => Upvote, 'skill')
    upvotes: Upvote[];
}
