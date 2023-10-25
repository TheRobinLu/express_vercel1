import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const gptpromptRouter = express.Router();
gptpromptRouter.use(express.json());

gptpromptRouter.get("/", async (_req, res) => {
	try {
		const gptprompts = await collections.gptprompts.find({}).toArray();
		res.status(200).send(gptprompts);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

gptpromptRouter.get("/:id", async (req, res) => {
	try {
		const id = req?.params?.id;
		const query = { _id: new mongodb.ObjectId(id) };
		const gptprompt = await collections.gptprompts.findOne(query);

		if (gptprompt) {
			res.status(200).send(gptprompt);
		} else {
			res.status(404).send(`Failed to find an gptprompt: ID ${id}`);
		}
	} catch (error) {
		res.status(404).send(`Failed to find an gptprompt: ID ${req?.params?.id}`);
	}
});

gptpromptRouter.post("/", async (req, res) => {
	try {
		const gptprompt = req.body;
		const result = await collections.gptprompts.insertOne(gptprompt);

		if (result.acknowledged) {
			res.status(201).send(`Created a new gptprompt: ID ${result.insertedId}.`);
		} else {
			res.status(500).send("Failed to create a new gptprompt.");
		}
	} catch (error) {
		console.error(error);
		res.status(400).send(error.message);
	}
});

gptpromptRouter.put("/:id", async (req, res) => {
	try {
		const id = req?.params?.id;
		const gptprompt = req.body;
		const query = { _id: new mongodb.ObjectId(id) };
		const result = await collections.gptprompts.updateOne(query, {
			$set: gptprompt,
		});

		if (result && result.matchedCount !== undefined) {
			if (result.matchedCount) {
				res.status(200).send(`Updated an gptprompt: ID ${id}.`);
			} else {
				res.status(404).send(`Failed to find an gptprompt: ID ${id}`);
			}
		} else {
			res.status(500).send(`Failed to update an gptprompt: ID ${id}`);
		}
	} catch (error) {
		res.status(400).send(error.message);
	}
});

gptpromptRouter.delete("/:id", async (req, res) => {
	try {
		const id = req?.params?.id;
		const query = { _id: new mongodb.ObjectId(id) };
		const result = await collections.gptprompts.deleteOne(query);

		if (result && result.deletedCount !== undefined) {
			if (result.deletedCount) {
				res.status(200).send(`Deleted an gptprompt: ID ${id}.`);
			} else {
				res.status(404).send(`Failed to find an gptprompt: ID ${id}`);
			}
		} else {
			res.status(500).send(`Failed to delete an gptprompt: ID ${id}`);
		}
	} catch (error) {
		res.status(400).send(error.message);
	}
});
