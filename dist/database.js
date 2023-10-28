"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.collections = void 0;
const mongodb = __importStar(require("mongodb"));
exports.collections = {};
function connectToDatabase(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new mongodb.MongoClient(uri);
        yield client.connect();
        // const db = client.db("ClusterBlog-dev");
        const db = client.db();
        // await applySchemaValidation(db);
        const categoriesCollection = db.collection("category");
        exports.collections.categrories = categoriesCollection;
        const forumsCollection = db.collection("forum");
        exports.collections.forums = forumsCollection;
        const gptpromptsCollection = db.collection("gptPrompts");
        exports.collections.gptprompts = gptpromptsCollection;
    });
}
exports.connectToDatabase = connectToDatabase;
// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
// async function applySchemaValidation(db: mongodb.Db) {
// 	const jsonSchema = {
// 		$jsonSchema: {
// 			bsonType: "object",
// 			required: ["name", "position", "level"],
// 			additionalProperties: false,
// 			properties: {
// 				_id: {},
// 				name: {
// 					bsonType: "string",
// 					description: "'name' is required and is a string",
// 				},
// 				position: {
// 					bsonType: "string",
// 					description: "'position' is required and is a string",
// 					minLength: 5,
// 				},
// 				level: {
// 					bsonType: "string",
// 					description:
// 						"'level' is required and is one of 'junior', 'mid', or 'senior'",
// 					enum: ["junior", "mid", "senior"],
// 				},
// 			},
// 		},
// 	};
// Try applying the modification to the collection, if the collection doesn't exist, create it
// await db
// 	.command({
// 		collMod: "employees",
// 		validator: jsonSchema,
// 	})
// 	.catch(async (error: mongodb.MongoServerError) => {
// 		if (error.codeName === "NamespaceNotFound") {
// 			await db.createCollection("employees", { validator: jsonSchema });
// 		}
// 	});
// }
//# sourceMappingURL=database.js.map