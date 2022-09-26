import { Request, Response } from "express";
import { Skill } from "../entities/Skill";
import { Upvote } from "../entities/Upvote";
import { Wilder } from "../entities/Wilder";
import datasource from "../utils";

interface ISkill {
  id: number;
  name: string;
  upvotes: Upvote[];
}

interface IUpvote {
  upvote: number;
  wilder: Wilder;
  skill: Skill;
}

export default {
  create: async (req: Request, res: Response): Promise<void> => {
    // Repo Upvote
    const repository = datasource.getRepository(Upvote);
    // Wilder
    const wilder = await datasource
      .getRepository(Wilder)
      .findOneBy({ name: req.body.name });
    // Tableau de noms des skills 
    const skillNames: string[] = req.body.skills;
    // Déclaration tableau d'objets skill
    const skills: ISkill[] = [];
    // Déclaration tableau d'objets upvotes
    const newUpvotes: IUpvote[] = [];
    // Map tableau des noms 
    skillNames.map(async (skillName) => {
      // recherche du skill par nom
      const skill = await datasource
       .getRepository(Skill)
       .findOneBy({ name: skillName });
      
      if(skill !== null) {
        skills.push(skill);
      }
      if(skills.length === skillNames.length) {
        console.log(skills);
            skills.map(async(skill) => {
                if (wilder !== null && skill !== null) {
                  const existingUpvote = await repository.findOne({
                    where: {
                      wilder: { id: wilder.id },
                      skill: { id: skill.id },
                    },
                  });
                  if (existingUpvote !== null) {
                    res.json(existingUpvote);
                  } else {
                    const upvote = {
                      upvote: 0,
                      wilder: wilder,
                      skill: skill,
                    };
                    console.log(upvote);
                    const newUpvote = await repository.save(upvote);
                    newUpvotes.push(newUpvote);
                  }
                }
              });
      }
    });
    
    res.json(newUpvotes);


    // const skill = await datasource
    //   .getRepository(Skill)
    //   .findOneBy({ name: req.body.skill });                
  },
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
