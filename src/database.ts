import * as mongodb from "mongodb";

import { ICategory, IForum, IGPTPrompt } from "./schemas";

export const collections: {
	categrories?: mongodb.Collection<ICategory>;
	forums?: mongodb.Collection<IForum>;
	gptprompts?: mongodb.Collection<IGPTPrompt>;
} = {};

export async function connectToDatabase(uri: string) {
	const client = new mongodb.MongoClient(uri);
	await client.connect();

	// const db = client.db("ClusterBlog-dev");
	const db = client.db();
	// await applySchemaValidation(db);
	const categoriesCollection = db.collection<ICategory>("category");
	collections.categrories = categoriesCollection;

	const forumsCollection = db.collection<IForum>("forum");
	collections.forums = forumsCollection;

	const gptpromptsCollection = db.collection<IGPTPrompt>("gptPrompts");
	collections.gptprompts = gptpromptsCollection;
}
