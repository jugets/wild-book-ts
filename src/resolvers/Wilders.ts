import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Wilder } from "../entities/Wilder";
import datasource from "../utils";

@Resolver()
export class WildersResolver {
  @Mutation(() => Wilder)
  async createWilder(@Arg('name') name: string, @Arg('city') city: string): Promise<Wilder> {
    return await datasource.getRepository(Wilder).save({name, city});
  }

  @Mutation(() => Wilder, { nullable: true })
  async updateWilder(
      @Arg('id', () => ID) id: number, 
      @Arg('name', { nullable: true }) name: string, 
      @Arg('city', { nullable: true }) city: string
    ): Promise<Wilder | null> {
      
    const wilder = await datasource.getRepository(Wilder).findOne({where: {id}});
    if (wilder === null) {
      return null;
    }

    if (name != null) {
      wilder.name = name;
    }

    if (city !== null) {
      wilder.city = city;
    }

    return await datasource.getRepository(Wilder).save(wilder);
  }

  @Mutation(() => Wilder)
  async deleteWilder(@Arg('id', () => ID) id: number): Promise<Wilder | null> {
    const wilder = await datasource.getRepository(Wilder).findOne({where: {id}});
    if (wilder === null) {
      return null;
    }
    return await datasource.getRepository(Wilder).remove(wilder);
  }

  @Query(() => [Wilder])
  async wilders(): Promise<Wilder[]> {
    console.log(datasource.getRepository(Wilder).find({relations: ['upvotes', 'upvotes.skill']}));
    return await datasource.getRepository(Wilder).find({relations: ['upvotes', 'upvotes.skill']});
  }

  @Query(() => Wilder)
  async wilder(@Arg('id', () => ID) id: number): Promise<Wilder | null> {
    return await datasource.getRepository(Wilder).findOne({where: {id}, relations: ['upvotes', 'upvotes.skill']});
  }
}