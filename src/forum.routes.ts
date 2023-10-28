import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const forumRouter = express.Router();

const postsPerPage = 30;

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

forumRouter.use(express.json());

forumRouter.get("/", async (_req, res) => {
	try {
		const forums = await collections.forums.find({}).toArray();

		res.status(200).send(forums);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

forumRouter.get("/page/:page", async (req, res) => {
	try {
		const page = Number(req?.params?.page);
		const forums = await collections.forums
			.find({})
			.skip(page * postsPerPage)
			.limit(postsPerPage)
			.toArray();
		await delay(2000);
		res.status(200).send(forums);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

//categories is category name array
forumRouter.get("/tatol/:categoryname", async (req, res) => {
	try {
		const categoryname = req?.params?.categoryname;
		const total = await collections.forums.countDocuments({
			categories: categoryname,
		});
		res.status(200).send({ totalPage: total / postsPerPage });
	} catch (error) {
		res.status(500).send(error.message);
	}
});

forumRouter.get("/categoryname/:categoryname/:page", async (req, res) => {
	try {
		const page = Number(req?.params?.page);
		const categoryname = req?.params?.categoryname;

		console.log("page", page, "categoryname", categoryname);
		let query = {};
		if (
			!categoryname ||
			categoryname === "Home" ||
			categoryname === "All" ||
			categoryname === ""
		) {
			query = {};
		} else {
			query = { categories: categoryname };
		}

		const posts = await collections.forums
			.find(query)
			.sort({ _id: -1 })
			.skip((page - 1) * postsPerPage)
			.limit(postsPerPage)
			.toArray();
		delay(1000);
		res.status(200).send(posts);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

forumRouter.get("/totals", async (_req, res) => {
	try {
		const totals = await collections.forums
			.aggregate([
				{
					$group: {
						_id: "$categoryname",
						total: { $sum: 1 },
					},
				},
			])
			.toArray();

		res.status(200).send(totals);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

forumRouter.get("/total/:categoryname", async (req, res) => {
	try {
		const categoryname = req?.params?.categoryname;
		let query = {};
		if (!categoryname || categoryname === "Home" || categoryname === "") {
			query = {};
		} else {
			query = { categories: categoryname };
		}
		const total = await collections.forums.countDocuments(query);
		res.status(200).send({ totalPages: Math.ceil(total / postsPerPage) });
	} catch (error) {
		res.status(500).send(error.message);
	}
});

forumRouter.get("/id/:id", async (req, res) => {
	try {
		const id = req?.params?.id;
		const query = { _id: new mongodb.ObjectId(id) };
		const forum = await collections.forums.findOne(query);

		if (forum) {
			res.status(200).send(forum);
		} else {
			res.status(404).send(`Failed to find an forum: ID ${id}`);
		}
	} catch (error) {
		res.status(404).send(`Failed to find an forum: ID ${req?.params?.id}`);
	}
});

forumRouter.get("/promptid/:id", async (req, res) => {
	try {
		const id = req?.params?.id;
		console.log("promptid", id);
		const query = { _id: new mongodb.ObjectId(id) };
		const gptPrompt = await collections.gptprompts.findOne(query);
		console.log("gptPrompt", gptPrompt);
		if (gptPrompt) {
			res.status(200).send(gptPrompt);
		} else {
			res.status(404).send(`Failed to find an forum: ID ${id}`);
		}
	} catch (error) {
		res.status(404).send(`Failed to find an forum: ID ${req?.params?.id}`);
	}
});

forumRouter.post("/", async (req, res) => {
	try {
		const forum = req.body;
		const result = await collections.forums.insertOne(forum);

		if (result.acknowledged) {
			res.status(201).send(`Created a new forum: ID ${result.insertedId}.`);
		} else {
			res.status(500).send("Failed to create a new forum.");
		}
	} catch (error) {
		console.error(error);
		res.status(400).send(error.message);
	}
});

forumRouter.put("/:id", async (req, res) => {
	try {
		const id = req?.params?.id;
		const forum = req.body;
		const query = { _id: new mongodb.ObjectId(id) };
		const result = await collections.forums.updateOne(query, { $set: forum });

		if (result && result.matchedCount) {
			res.status(200).send(`Updated an forum: ID ${id}.`);
		} else if (!result.matchedCount) {
			res.status(404).send(`Failed to find an forum: ID ${id}`);
		} else {
			res.status(500).send(`Failed to update an forum: ID ${id}`);
		}
	} catch (error) {
		console.error(error);
		res.status(400).send(error.message);
	}
});

forumRouter.delete("/:id", async (req, res) => {
	try {
		const id = req?.params?.id;
		const query = { _id: new mongodb.ObjectId(id) };
		const result = await collections.forums.deleteOne(query);

		if (result && result.deletedCount) {
			res.status(200).send(`Deleted an forum: ID ${id}.`);
		} else if (!result.deletedCount) {
			res.status(404).send(`Failed to find an forum: ID ${id}`);
		} else {
			res.status(500).send(`Failed to delete an forum: ID ${id}`);
		}
	} catch (error) {
		console.error(error);
		res.status(400).send(error.message);
	}
});
