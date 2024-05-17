import express from "express";
import { PrismaClient } from '@prisma/client'
import { verifyToken } from "../utils/auth";
const prisma = new PrismaClient()
const router = express.Router();


router.post('/', verifyToken, async (req, res)=>{
    const {title, content} = req.body;
    const userId = req.user.id;

    let tweet = await prisma.tweet.create({
        data: {
            title,
            content,
            userId
        }
    })

    res.send({tweet})
})

router.get('/', async (req, res)=>{
    let tweets = await prisma.tweet.findMany();

    res.send({tweets});
})

router.delete('/:id' ,verifyToken, async (req, res)=>{
    const { id } = req.body;
    if (id != req.user.id) return res.send("Not a valid request");
    let result = await prisma.tweet.delete({
        where: {
            id
        }
    })
    res.send("user deleted");
})

router.get('/:id', async (req, res)=>{

    const { id } = req.params;
    console.log(id)
    console.log(req.user.id)
    console.log(id==req.user.id)

    if(id != req.user.id) return res.send("Not a valid request");

    let result = await prisma.tweet.findUnique({
        where: {
            id : Number(id)
        }
    })

    res.send({result})
})


export default router;