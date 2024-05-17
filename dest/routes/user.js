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
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { firstName, lastName, email, username, password } = req.body;
    let user = yield prisma.user.create({
        data: {
            firstName, lastName, email, username, password
        }
    });
    //     "firstName" : "Aklaus",
    //     "lastName" : "Michaelson",
    //    "email" : "klausmichaelson@gmail.com",
    //    "username" : "aklausx1550",
    //    "password" : "123456"
    // // Create a JWT token
    // const token = createJwtToken(user);
    // // Set the token in cookies
    // res.cookie("token", token, {
    //     httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    // });
    console.log(user);
    res.send("user added");
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let users = yield prisma.user.findMany();
    res.send({ users });
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let user = yield prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if (user == null)
        res.send("User does not exist!");
    res.send({ user });
}));
router.get("/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    let users = yield prisma.user.findMany({
        where: {
            OR: [
                {
                    firstName: {
                        contains: username
                    },
                    lastName: {
                        contains: username
                    }
                }
            ]
        }
    });
    console.log({ users });
}));
router.delete("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    console.log(req.user.id);
    console.log(id == req.user.id);
    if (id != req.user.id)
        return res.send("not a valid request");
    let result = yield prisma.user.delete({
        where: {
            id: parseInt(id)
        }
    });
    res.send("user deleted");
}));
router.put("/:id", auth_1.verifyToken, (req, res) => {
});
exports.default = router;
