import express from "express";
import { PrismaClient } from '@prisma/client'
import { verifyToken } from "../utils/auth";
const prisma = new PrismaClient()
const router = express.Router();


router.post('/:tweetId', verifyToken, async (req, res)=>{

    const {tweetId} = req.params;

    const userId = req.user.id;

    let alreadyLiked = await prisma.like.findFirst({
        where: {
            userId : userId,
            tweetId : Number(tweetId)
        }
    })

    if(alreadyLiked != null){
        await prisma.like.delete({
            where: {
                id : alreadyLiked.id
            }
        })

        await prisma.tweet.update({
            where : {
                id : Number(tweetId)
            },

            data :{
                likeCount : {decrement: 1}
            }
        })

        return res.send("Like removed")
    }

    await prisma.like.create({
        data :{
            tweetId : Number(tweetId),
            userId : userId
        }
    })

    await prisma.tweet.update({
        where : {
            id : Number(tweetId)
        },

        data :{
            likeCount : {increment:1}
        }
    })

    res.send("Liked!")

})

router.get('/:tweetId' , verifyToken, async (req, res)=>{
    const{tweetId} = req.params;

    let result = await prisma.like.findFirst({
        where :{
            tweetId : Number(tweetId)
        },

        select:{
            user:{
                select:{
                    username : true
                }
            }
        }
    })

    res.send({result})
})


export default router;