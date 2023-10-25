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
	await applySchemaValidation(db);
	const categoriesCollection = db.collection<ICategory>("category");
	collections.categrories = categoriesCollection;

	const forumsCollection = db.collection<IForum>("forum");
	collections.forums = forumsCollection;

	const gptpromptsCollection = db.collection<IGPTPrompt>("gptPrompts");
	collections.gptprompts = gptpromptsCollection;
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
	const jsonSchema = {
		$jsonSchema: {
			bsonType: "object",
			required: ["name", "position", "level"],
			additionalProperties: false,
			properties: {
				_id: {},
				name: {
					bsonType: "string",
					description: "'name' is required and is a string",
				},
				position: {
					bsonType: "string",
					description: "'position' is required and is a string",
					minLength: 5,
				},
				level: {
					bsonType: "string",
					description:
						"'level' is required and is one of 'junior', 'mid', or 'senior'",
					enum: ["junior", "mid", "senior"],
				},
			},
		},
	};

	// Try applying the modification to the collection, if the collection doesn't exist, create it
	await db
		.command({
			collMod: "employees",
			validator: jsonSchema,
		})
		.catch(async (error: mongodb.MongoServerError) => {
			if (error.codeName === "NamespaceNotFound") {
				await db.createCollection("employees", { validator: jsonSchema });
			}
		});
}
