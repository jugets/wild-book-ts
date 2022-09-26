import express, {Request, Response} from "express";
import cors from "cors";
import datasource from "./utils";

import wildersController from "./controllers/Wilders";
import skillsController from "./controllers/Skills";
import upvotesController from "./controllers/Upvotes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req, res) => {
    res.send("hello you!");
  });

// High order function = function that returns a function
 type Controller = (req: Request, res: Response) => void;
const asyncHandler = (
  controller: Controller): Controller => {
  return async function (req: Request, res: Response): Promise<void> {
    try {
      await controller(req, res);
    } catch (err: any) {
      console.error("Error: ", err);
      res.status(500).json({ error: err.message });
    }
  };
};

/**
 * Wilders Routes
 */
app.post("/api/wilders", asyncHandler(wildersController.create));
app.get("/api/wilders", asyncHandler(wildersController.findAll));
app.get("/api/wilders/:wilderId", asyncHandler(wildersController.find));
app.put("/api/wilders/:wilderId", asyncHandler(wildersController.update));
app.delete("/api/wilders/:wilderId", asyncHandler(wildersController.delete));

/**
 * Skills Routes
 */
app.post("/api/skills", asyncHandler(skillsController.create ));
app.get("/api/skills", skillsController.findAll);
app.get("/api/skills/:skillId", skillsController.find);
app.put("/api/skills/:skillId", skillsController.update);
app.delete("/api/skills/:skillId", skillsController.delete);

/**
 * Upvotes Routes
 */
app.post("/api/upvotes", asyncHandler(upvotesController.create));
app.put("/api/upvotes/:upvoteId/upvote",asyncHandler(upvotesController.upvote));

app.listen(5000, async () => {
  console.log("Server started on 5000");

  try {
    await datasource.initialize();
    console.log("I'm connected!");
  } catch (err) {
    console.log("Dommage");
    console.error(err);
  }
});
