import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./database";
import { categoryRouter } from "./category.routes";
import { forumRouter } from "./forum.routes";
import { gptpromptRouter } from "./gptprompt.routes";

dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
	console.error(
		"No ATLAS_URI environment variable has been defined in config.env"
	);
	process.exit(1);
}

connectToDatabase(ATLAS_URI);

const app = express();
const port = process.env.PORT || 5200;

connectToDatabase(ATLAS_URI)
	.then(() => {
		app.use(cors());
		app.use("/categories", categoryRouter);
		app.use("/forums", forumRouter);
		app.use("/gptprompts", gptpromptRouter);
	})
	.catch((error) => console.error(error));

app.get("/", (_req: Request, res: Response) => {
	return res.send("Express Typescript on Vercel");
});

app.get("/ping", (_req: Request, res: Response) => {
	return res.send("pong 🏓");
});

app.listen(port, () => {
	return console.log(`Server is listening on ${port}`);
});
