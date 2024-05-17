import express from "express";
import { PrismaClient } from '@prisma/client'
import { verifyToken } from "../utils/auth";
const prisma = new PrismaClient()
const router = express.Router();


router.post('/addComment/:tweetId', verifyToken, async (req, res)=>{

    const {tweetId} = req.params
    const {content} = req.body;

    const userId = req.user.id;

    await prisma.comment.create({
        data :{
            tweetId : Number(tweetId),
            userId : userId,
            content : content
        }
    })

    await prisma.tweet.update({
        where : {
            id : Number(tweetId)
        },

        data :{
            commentCount : {increment:1}
        }
    })

    res.send("Commented!")

})


router.get('/:tweetId' , verifyToken, async (req, res)=>{
    const{tweetId} = req.params;

    let result = await prisma.comment.findFirst({
        where :{
            tweetId : Number(tweetId)
        },

        include:{
            user:{
                select:{
                    username : true
                }
            },
            tweet:{
                select:{
                    title : true,
                    content : true
                }
            }

        }
    })

    res.send({result})
})

export default router