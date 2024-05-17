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
router.post('/addComment/:tweetId', auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tweetId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    yield prisma.comment.create({
        data: {
            tweetId: Number(tweetId),
            userId: userId,
            content: content
        }
    });
    yield prisma.tweet.update({
        where: {
            id: Number(tweetId)
        },
        data: {
            commentCount: { increment: 1 }
        }
    });
    res.send("Commented!");
}));
router.get('/:tweetId', auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tweetId } = req.params;
    let result = yield prisma.comment.findFirst({
        where: {
            tweetId: Number(tweetId)
        },
        include: {
            user: {
                select: {
                    username: true
                }
            },
            tweet: {
                select: {
                    title: true,
                    content: true
                }
            }
        }
    });
    res.send({ result });
}));
exports.default = router;
