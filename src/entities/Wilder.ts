import { Length } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Upvote } from "./Upvote";

@ObjectType()
@Entity()
export class Wilder {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    city: string;

    @Field(() => [Upvote])
    @OneToMany(() => Upvote, "wilder")
    upvotes: Upvote[];
}

@InputType()
export class WilderInput {
  @Field()
  @Length(2, 50)
  name: string;

  @Field()
  city: string;

  @Field({ nullable: true })
  age: number;
}