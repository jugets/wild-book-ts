import { Request, Response } from "express";
import { Skill } from "../entities/Skill";
import datasource from "../utils";

export default {
    create: (req: Request, res: Response): void => {
        datasource
            .getRepository(Skill)
            .save(req.body)
            .then(
                (data) => {
                    res.json(data);
            },
            (err) => {
                console.error('Error :', err);
                res.json({ success: false });
            }
        );
    },
    findAll: async (req: Request, res: Response): Promise<void> => {
      const repository = datasource.getRepository(Skill);
  
      const skills = await repository.find({
        relations: ["upvotes", "upvotes.wilder"],
      });
      
      res.json(skills);
    },
    find: (req: Request, res: Response): void => {
      const skillId = req.params.skillId;
      const repository = datasource.getRepository(Skill);
  
      // find 1 wilder by its ID
      repository.findOneBy({ id: Number(skillId) }).then(
        (data) => {
          res.json(data);
        },
        (err) => {
          console.error("Error: ", err);
          res.json({ success: false });
        }
      );
    },
    update: async (req: Request, res: Response): Promise<void> => {
      try {
        const skillId = req.params.skillId;
        const repository = datasource.getRepository(Skill);
  
        const skill = await repository.findOne({
          where: { id: Number(skillId) }
        });
        
        if (skill !== null) {
          skill.name = req.body.skillName;
          void repository.save(skill, { reload: true });
          res.json(skill);
        }
      } catch (err) {
        console.error("Error when saving: ", err);
        res.json({ success: false });
      }
    },
    delete: async (req: Request, res: Response): Promise<void> => {
      try {
        const skillId = req.params.skillId;
        const repository = datasource.getRepository(Skill);

        const skill = await repository.findOne({
          where: { id: Number(skillId) }
        });
        
        if (skill !== null) {
          try {
            await repository.remove(skill);
          res.json({success: true});
          } catch (err) {
            console.error("Error when removing: ", err);
            res.json({ success: false });
          }
        }
      } catch (err) {
        console.error("Error when finding: ", err);
        res.json({ success: false });
      }
    },
};