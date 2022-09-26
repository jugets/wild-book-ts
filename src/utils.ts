import { DataSource} from "typeorm";
import { Skill } from "./entities/Skill";
import { Upvote } from "./entities/Upvote";
import { Wilder } from "./entities/Wilder";

const datasource = new DataSource({
    type: "sqlite",
    database: "./wildersdb.sqlite",
    synchronize: true,
    entities: [Wilder, Skill, Upvote],
    logging: ["query", "error"]
});

export default datasource;