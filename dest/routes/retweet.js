"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../utils/auth");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/:tweetid", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tweetid } = req.params;
    const userid = req.user.id;
    let retweet = yield prisma.retweet.findFirst({
        where: {
            tweetId: Number(tweetid),
            userId: userid
        }
    });
    if (retweet != null) {
        // already retweet
        return res.send({ alreadyRetweet: true, data: retweet });
    }
    let addRetweet = yield prisma.retweet.create({
        data: {
            tweetId: Number(tweetid),
            userId: userid
        }
    });
    yield prisma.tweet.update({
        where: {
            id: Number(tweetid)
        },
        data: {
            retweetCount: { increment: 1 }
        }
    });
    res.send({ alreadyRetweet: true, data: addRetweet });
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const tweetId = yield prisma.retweet.findUnique({
        where: {
            id: Number(id)
        },
        select: {
            tweetId: true
        }
    });
    const userid = req.user.id;
    yield prisma.retweet.delete({
        where: {
            id: Number(id),
        }
    });
    yield prisma.tweet.update({
        where: {
            id: Number(tweetId),
        },
        data: {
            retweetCount: { decrement: 1 }
        }
    });
}));
router.get("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.id;
    let allretweet = yield prisma.retweet.findMany({
        where: {
            userId: userid
        },
        select: {
            tweet: {
                select: {
                    title: true,
                    content: true,
                    user: {
                        select: {
                            username: true
                        }
                    }
                }
            }
        }
    });
    res.send({ allretweet });
}));
exports.default = router;
