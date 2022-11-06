import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Skill } from "../entities/Skill";
import datasource from "../utils";

@Resolver()
export class SkillsResolver {
  @Mutation(() => Skill)
  async createSkill(@Arg('name') name: string): Promise<Skill> {
    return await datasource.getRepository(Skill).save({name});
  }

  @Mutation(() => Skill, { nullable: true })
  async updateSkill(
    @Arg("id", () => ID) id: number,
    @Arg("name", () => String) name: string | null
  ): Promise<Skill | null> {
    const skill = await datasource
      .getRepository(Skill)
      .findOne({ where: { id } });

    if (skill === null) {
      return null;
    }

    if (name != null) {
      skill.name = name;
    }

    return await datasource.getRepository(Skill).save(skill);
  }

  @Mutation(() => Skill, { nullable: true })
  async deleteSkill(@Arg("id", () => ID) id: number): Promise<Skill | null> {
    const skill = await datasource
      .getRepository(Skill)
      .findOne({ where: { id } });

    if (skill === null) {
      return null;
    }

    return await datasource.getRepository(Skill).remove(skill);
  }


  @Query(() => [Skill])
  async skills(): Promise<Skill[]> {
    return await datasource.getRepository(Skill).find({relations: ['upvotes', 'upvotes.wilder']});
  }

  @Query(() => Skill)
  async skill(@Arg('id', () => ID) id: number): Promise<Skill | null> {
    return await datasource.getRepository(Skill).findOne({where: {id}, relations: ['upvotes', 'upvotes.wilder']});
  }
}