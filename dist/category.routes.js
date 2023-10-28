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
exports.categoryRouter = void 0;
const express = __importStar(require("express"));
const mongodb = __importStar(require("mongodb"));
const database_1 = require("./database");
function delay(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, ms));
    });
}
exports.categoryRouter = express.Router();
exports.categoryRouter.use(express.json());
exports.categoryRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield database_1.collections.categrories
            .find({})
            .sort({ order: 1 })
            .toArray();
        yield delay(2000);
        res.status(200).send(categories);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.categoryRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const category = yield database_1.collections.categrories.findOne(query);
        if (category) {
            res.status(200).send(category);
        }
        else {
            res.status(404).send(`Failed to find an category: ID ${id}`);
        }
    }
    catch (error) {
        res.status(404).send(`Failed to find an category: ID ${(_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id}`);
    }
}));
exports.categoryRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = req.body;
        const result = yield database_1.collections.categrories.insertOne(category);
        if (result.acknowledged) {
            res.status(201).send(`Created a new category: ID ${result.insertedId}.`);
        }
        else {
            res.status(500).send("Failed to create a new category.");
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}));
exports.categoryRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const id = (_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.id;
        const category = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = yield database_1.collections.categrories.updateOne(query, {
            $set: category,
        });
        if (result && result.matchedCount) {
            res.status(200).send(`Updated an category: ID ${id}.`);
        }
        else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an category: ID ${id}`);
        }
        else {
            res.status(304).send(`Failed to update an category: ID ${id}`);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
exports.categoryRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const id = (_d = req === null || req === void 0 ? void 0 : req.params) === null || _d === void 0 ? void 0 : _d.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = yield database_1.collections.categrories.deleteOne(query);
        if (result && result.deletedCount) {
            res.status(202).send(`Removed an category: ID ${id}`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove an category: ID ${id}`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an category: ID ${id}`);
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
}));
//# sourceMappingURL=category.routes.js.map