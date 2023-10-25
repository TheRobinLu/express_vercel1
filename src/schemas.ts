import * as mongodb from "mongodb";

export interface IForum {
	_id?: mongodb.ObjectId;
	gptPromptId: string;
	topic: string;
	createAt: Date;
	categories: string[];
	reads: number;
}

export interface ICategory {
	_id?: mongodb.ObjectId;
	visited: number;
	order: number;
	desc: string;
	en: string;
	cn: string;
}

export interface IGPTPrompt {
	_id?: mongodb.ObjectId;
	sessionID: string;
	user: string;
	msg: {
		model: string;
		role: string;
		content: string;
		key: number;
	}[];
	status: string;
}
