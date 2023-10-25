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
exports.forumRouter = void 0;
const express = __importStar(require("express"));
const mongodb = __importStar(require("mongodb"));
const database_1 = require("./database");
exports.forumRouter = express.Router();
const postsPerPage = 30;
exports.forumRouter.use(express.json());
exports.forumRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const forums = yield database_1.collections.forums.find({}).toArray();
        res.status(200).send(forums);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.forumRouter.get("/page/:page", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = Number((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.page);
        const forums = yield database_1.collections.forums
            .find({})
            .skip(page * postsPerPage)
            .limit(postsPerPage)
            .toArray();
        res.status(200).send(forums);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
//categories is category name array
exports.forumRouter.get("/tatol/:categoryname", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const categoryname = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.categoryname;
        const total = yield database_1.collections.forums.countDocuments({
            categories: categoryname,
        });
        res.status(200).send({ totalPage: total / postsPerPage });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.forumRouter.get("/categoryname/:categoryname/:page", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const page = Number((_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.page);
        const categoryname = (_d = req === null || req === void 0 ? void 0 : req.params) === null || _d === void 0 ? void 0 : _d.categoryname;
        console.log("page", page, "categoryname", categoryname);
        let query = {};
        if (!categoryname || categoryname === "Home" || categoryname === "") {
            query = {};
        }
        else {
            query = { categories: categoryname };
        }
        const posts = yield database_1.collections.forums
            .find(query)
            .sort({ _id: -1 })
            .skip((page - 1) * postsPerPage)
            .limit(postsPerPage)
            .toArray();
        res.status(200).send(posts);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.forumRouter.get("/totals", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totals = yield database_1.collections.forums
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
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.forumRouter.get("/total/:categoryname", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const categoryname = (_e = req === null || req === void 0 ? void 0 : req.params) === null || _e === void 0 ? void 0 : _e.categoryname;
        let query = {};
        if (!categoryname || categoryname === "Home" || categoryname === "") {
            query = {};
        }
        else {
            query = { categories: categoryname };
        }
        const total = yield database_1.collections.forums.countDocuments(query);
        res.status(200).send({ totalPages: Math.ceil(total / postsPerPage) });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.forumRouter.get("/id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    try {
        const id = (_f = req === null || req === void 0 ? void 0 : req.params) === null || _f === void 0 ? void 0 : _f.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const forum = yield database_1.collections.forums.findOne(query);
        if (forum) {
            res.status(200).send(forum);
        }
        else {
            res.status(404).send(`Failed to find an forum: ID ${id}`);
        }
    }
    catch (error) {
        res.status(404).send(`Failed to find an forum: ID ${(_g = req === null || req === void 0 ? void 0 : req.params) === null || _g === void 0 ? void 0 : _g.id}`);
    }
}));
exports.forumRouter.get("/promptid/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j;
    try {
        const id = (_h = req === null || req === void 0 ? void 0 : req.params) === null || _h === void 0 ? void 0 : _h.id;
        console.log("promptid", id);
        const query = { _id: new mongodb.ObjectId(id) };
        const gptPrompt = yield database_1.collections.gptprompts.findOne(query);
        console.log("gptPrompt", gptPrompt);
        if (gptPrompt) {
            res.status(200).send(gptPrompt);
        }
        else {
            res.status(404).send(`Failed to find an forum: ID ${id}`);
        }
    }
    catch (error) {
        res.status(404).send(`Failed to find an forum: ID ${(_j = req === null || req === void 0 ? void 0 : req.params) === null || _j === void 0 ? void 0 : _j.id}`);
    }
}));
exports.forumRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const forum = req.body;
        const result = yield database_1.collections.forums.insertOne(forum);
        if (result.acknowledged) {
            res.status(201).send(`Created a new forum: ID ${result.insertedId}.`);
        }
        else {
            res.status(500).send("Failed to create a new forum.");
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}));
exports.forumRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    try {
        const id = (_k = req === null || req === void 0 ? void 0 : req.params) === null || _k === void 0 ? void 0 : _k.id;
        const forum = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = yield database_1.collections.forums.updateOne(query, { $set: forum });
        if (result && result.matchedCount) {
            res.status(200).send(`Updated an forum: ID ${id}.`);
        }
        else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an forum: ID ${id}`);
        }
        else {
            res.status(500).send(`Failed to update an forum: ID ${id}`);
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}));
exports.forumRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    try {
        const id = (_l = req === null || req === void 0 ? void 0 : req.params) === null || _l === void 0 ? void 0 : _l.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = yield database_1.collections.forums.deleteOne(query);
        if (result && result.deletedCount) {
            res.status(200).send(`Deleted an forum: ID ${id}.`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an forum: ID ${id}`);
        }
        else {
            res.status(500).send(`Failed to delete an forum: ID ${id}`);
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}));
//# sourceMappingURL=forum.routes.js.map