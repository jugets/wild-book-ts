import { Request, Response } from "express";
import { Wilder } from "../entities/Wilder";
import datasource from "../utils";

export default {
  create: async (req: Request, res: Response): Promise<void> => {
    const repository = datasource.getRepository(Wilder);
    const wilder = {name: req.body.name, city: req.body.city}
    const newWilder = await repository.save(wilder);
    res.json(newWilder);
  },
  findAll: async (req: Request, res: Response): Promise<void> => {
    const repository = datasource.getRepository(Wilder);

    const wilders = await repository.find({
      relations: ["upvotes", "upvotes.skill"],
    });
    
    res.json(wilders);
  },
  find: async (req: Request, res: Response): Promise<void> => {
    try {
      const wilderId = req.params.wilderId;
      // const wilderName = req.body.name;
      const repository = datasource.getRepository(Wilder);

      const data = await repository.findOneBy({ id: Number(wilderId) });
      // const data = await repository.findOneBy({ name: wilderName });

      res.json(data);
    } catch (err) {
      console.log(err);
      res.json({ success: false });
    }
  },
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const wilderId = req.params.wilderId;
      const repository = datasource.getRepository(Wilder);

      const wilder = await repository.findOne({
        where: { id: Number(wilderId) }
      });

      // await Object.assign(wilder, req.body);
      if (wilder !== null) {
        wilder.name = req.body.name;
        wilder.city = req.body.city;

        const updatedWilder = await repository.save(wilder, { reload: true });
        res.json(updatedWilder);
      }
    } catch (err) {
      console.error("Error when saving: ", err);
      res.json({ success: false });
    }
  },
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const wilderId = await req.params.wilderId;
      const repository = await datasource.getRepository("Wilder");
      const wilder = await repository.findOneBy({ id: wilderId });
      if (wilder !== null) {
        await repository.remove(wilder);
        res.json({ success: true });
      }
    } catch (err) {
      console.error("Error when deleting: ", err);
      res.json({ success: false });
    }
  },
  /*
  addSkill: async (req: Request, res: Response): Promise<void> => {
    const wilderId = req.params.wilderId;
    const wilderRepository = datasource.getRepository(Wilder);

    const skillId = Number(req.body.skillId);
    const skillRepository = datasource.getRepository(Skill);

    const wilderToUpdate = await wilderRepository.findOneBy({ id: Number(wilderId) });
    const skillToAdd = await skillRepository.findOneBy({ id: skillId });

    if(wilderToUpdate !== null && skillToAdd !== null) {
      wilderToUpdate.skills.push(skillToAdd);
      const updatedWilder = wilderRepository.save(wilderToUpdate);
      res.json(updatedWilder);
    }
  },
  addSkills: async (req: Request, res: Response): Promise<void> => {
    const wilderId = req.params.wilderId;
    const skillsIds = req.body.skillsIds;
    const repository = datasource.getRepository(Wilder);

    const wilder = await repository.findOneByOrFail({ id: Number(wilderId) });
    const skills = await datasource
      .getRepository(Skill)
      .find({ where: { id: In(skillsIds) } });

    wilder.skills = skills;

    const updatedWilder = await repository.save(wilder);
    res.json(updatedWilder);
  },
  */
};
