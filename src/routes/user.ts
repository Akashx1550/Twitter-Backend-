import express from "express";
import { PrismaClient } from '@prisma/client'
import { verifyToken, createJwtToken} from "../utils/auth";
const prisma = new PrismaClient()
const router = express.Router();


router.post("/", async (req, res) => {
    console.log(req.body);
    const { firstName, lastName, email, username,password } = req.body;
    let user = await prisma.user.create({
        data: {
            firstName, lastName, email, username,password
        }
    })

    console.log(user);
    res.send("user added");

})
router.get("/", async (req, res) => {
    let users = await prisma.user.findMany();
    res.send({ users });
})
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    let user = await prisma.user.findUnique({
        where: {
            id : parseInt(id)
        }
    })

    if(user == null) res.send("User does not exist!");

    res.send({ user });
})
router.get("/:username", async (req, res) => {
    const { username } = req.params;
    let users = await prisma.user.findMany({
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

    })
    console.log({ users });
})
router.delete("/:id",verifyToken, async (req, res) => {
    const { id } = req.params;
    console.log(id)
    console.log(req.user.id)
    console.log(id==req.user.id)
    if (id != req.user.id) return res.send("not a valid request");
    let result = await prisma.user.delete({
        where: {
            id : parseInt(id)
        }
    })
    res.send("user deleted");
})
router.put("/:id", verifyToken, (req, res) => {

})

export default router;