import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Skill } from "../entities/Skill";
import { Upvote } from "../entities/Upvote";
import { Wilder } from "../entities/Wilder";
import datasource from "../utils";


@Resolver()
export class UpvotesResolver {


  @Mutation(() => [Upvote], {nullable: true})
  async createUpvotes(
      @Arg('wilderName', () => String) wilderName: string, 
      @Arg('skillIds', () => [ID]) skillIds: number[]
    ): Promise<Upvote[]> {

    const repository = datasource.getRepository(Upvote);
    const wilderUpvote = await datasource.getRepository(Wilder).findOneBy({ name: wilderName });
    const upvotes: Upvote[] = [];

    for (const skillId of skillIds)  {
      const skillUpvote = await datasource.getRepository(Skill).findOneBy({ id: skillId });
      // if(skill !== null) {
        // if (wilder !== null && skill !== null) {
          const existingUpvote = await repository.findOne({
            where: {
              wilder: {name: wilderUpvote?.name},
              skill: {name: skillUpvote?.name},
            },
          });
          if (existingUpvote === null) {
            const newUpvote = await repository.save({
              upvote: 0,
              wilder: {name: wilderUpvote?.name},
              skill: {name: skillUpvote?.name}
            });
            // console.log(newUpvote.wilder.name);
            upvotes.push(newUpvote);          
          } else {
            upvotes.push(existingUpvote);
          }
       // }
      // }
    }
    console.log(upvotes);
    return upvotes;
  }

  @Mutation(() => Upvote, { nullable: true })
  async doUpvote(@Arg("upvoteId") upvoteId: number): Promise<Upvote | null> {
    const repository = datasource.getRepository(Upvote);

    const existingUpvote = await repository.findOne({
      where: {
        id: upvoteId,
      },
    });

    if (existingUpvote !== null) {
      existingUpvote.upvote = existingUpvote.upvote + 1;

      return await repository.save(existingUpvote);
    } else {
      return null;
    }
  }

  @Mutation(() => Upvote, { nullable: true })
  async deleteUpvote(@Arg("id", () => ID) id: number): Promise<Upvote | null> {
    const upvote = await datasource
      .getRepository(Upvote)
      .findOne({ where: { id } });

    if (upvote === null) {
      return null;
    }

    return await datasource.getRepository(Upvote).remove(upvote);
  }

  @Query(() => [Upvote])
  async upvotes(): Promise<Upvote[]> {
    return await datasource
      .getRepository(Upvote)
      .find({ relations: ["skill", "wilder"] });
  }

  @Query(() => Upvote, { nullable: true })
  async upvote(@Arg("id", () => ID) id: number): Promise<Upvote | null> {
    return await datasource
      .getRepository(Upvote)
      .findOne({ where: { id }, relations: ["skill", "wilder"] });
  }

}


// export default {
  // create: async (req: Request, res: Response): Promise<void> => {
  //   // Repo Upvote
  //   const repository = datasource.getRepository(Upvote);
  //   // Wilder
  //   const wilder = await datasource
  //     .getRepository(Wilder)
  //     .findOneBy({ name: req.body.name });

  //   // Tableau de noms des skills 
  //   const skillNames: string[] = req.body.skills;

  //   // Déclaration tableau d'objets skill
  //   const skills: ISkill[] = [];

  //   // Déclaration tableau d'objets upvotes
  //   const newUpvotes: IUpvote[] = [];

  //   // Map tableau des noms 
  //   skillNames.map(async (skillName) => {
  //     // recherche du skill par nom
  //     const skill = await datasource
  //      .getRepository(Skill)
  //      .findOneBy({ name: skillName });
      
  //     if(skill !== null) {
  //       skills.push(skill);
  //     }
  //     if(skills.length === skillNames.length) {
  //       console.log(skills);
  //           skills.map(async(skill) => {
  //               if (wilder !== null && skill !== null) {
  //                 const existingUpvote = await repository.findOne({
  //                   where: {
  //                     wilder: { id: wilder.id },
  //                     skill: { id: skill.id },
  //                   },
  //                 });
  //                 if (existingUpvote !== null) {
  //                   res.json(existingUpvote);
  //                 } else {
  //                   const upvote = {
  //                     upvote: 0,
  //                     wilder: wilder,
  //                     skill: skill,
  //                   };
  //                   console.log(upvote);
  //                   const newUpvote = await repository.save(upvote);
  //                   newUpvotes.push(newUpvote);
  //                 }
  //               }
  //             });
  //     }
  //   });
    
  //   res.json(newUpvotes);


  //   // const skill = await datasource
  //   //   .getRepository(Skill)
  //   //   .findOneBy({ name: req.body.skill });                
  // },
  /*
  upvote: async (req: Request, res: Response) => {
    const repository = datasource.getRepository(Upvote);

    const existingUpvote = await repository.findOne({
      where: {
        id: Number(req.params.upvoteId),
      },
    });

    if (existingUpvote !== null) {
      existingUpvote.upvote += 1;

      await repository.save(existingUpvote);
      res.json(existingUpvote);
    } else {
      throw new Error("Doesn't exist");
    }
  },
};
*/