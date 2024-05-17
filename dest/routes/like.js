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
router.post('/:tweetId', auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tweetId } = req.params;
    const userId = req.user.id;
    let alreadyLiked = yield prisma.like.findFirst({
        where: {
            userId: userId,
            tweetId: Number(tweetId)
        }
    });
    if (alreadyLiked != null) {
        yield prisma.like.delete({
            where: {
                id: alreadyLiked.id
            }
        });
        yield prisma.tweet.update({
            where: {
                id: Number(tweetId)
            },
            data: {
                likeCount: { decrement: 1 }
            }
        });
        return res.send("Like removed");
    }
    yield prisma.like.create({
        data: {
            tweetId: Number(tweetId),
            userId: userId
        }
    });
    yield prisma.tweet.update({
        where: {
            id: Number(tweetId)
        },
        data: {
            likeCount: { increment: 1 }
        }
    });
    res.send("Liked!");
}));
router.get('/:tweetId', auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tweetId } = req.params;
    let result = yield prisma.like.findFirst({
        where: {
            tweetId: Number(tweetId)
        },
        select: {
            user: {
                select: {
                    username: true
                }
            }
        }
    });
    res.send({ result });
}));
exports.default = router;
