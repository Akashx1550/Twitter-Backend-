import express from "express";
import { PrismaClient, user } from '@prisma/client'
import { verifyToken } from "../utils/auth";
const prisma = new PrismaClient()
const router = express.Router();

router.post("/:tweetid", verifyToken, async (req, res) => {

    const { tweetid } = req.params;
    const userid = req.user.id;

    let retweet = await prisma.retweet.findFirst({

        where: {
            tweetId: Number(tweetid),
            userId: userid
        }
    })

    if (retweet != null) {

        // already retweet

        return res.send({ alreadyRetweet: true, data: retweet })
    }



    let addRetweet = await prisma.retweet.create({

        data: {

            tweetId: Number(tweetid),
            userId: userid
        }

    })

    await prisma.tweet.update({

        where: {

            id: Number(tweetid)
        },
        data: {

            retweetCount: { increment: 1 }
        }


    })


    res.send({ alreadyRetweet: true, data: addRetweet });

})

router.delete("/:id", async (req, res) => {

    const { id } = req.params;

    const tweetId = await prisma.retweet.findUnique({

        where: {

            id: Number(id)
        },
        select: {

            tweetId: true
        }
    })
    const userid = req.user.id;

    await prisma.retweet.delete({

        where: {
            id: Number(id),

        }
    })

    await prisma.tweet.update({

        where: {
            id: Number(tweetId),
        },

        data: {
            retweetCount: { decrement: 1 }
        }
    })


})

router.get("/", verifyToken, async (req, res) => {

    const userid = req.user.id;

    let allretweet = await prisma.retweet.findMany({

        where: {

            userId : userid
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
    })

    res.send({ allretweet });
})



export default router;