import express from 'express';
import cookieParser from "cookie-parser";
import userRoute from './routes/user';
import userLogin from './routes/login';
import tweetRoute from './routes/tweet';
import likeRoute from './routes/like';
import CommentRoute from './routes/comment';
import retweetRoute from './routes/retweet';
import CORS from 'cors';


const app = express();
app.use(CORS());
app.use(cookieParser());
const PORT = 5432;

app.use(express.json());
app.get('/' , (req, res)=>{
    res.send("<h1>Twitter Clone</h1>");
})

//Routes
app.use("/user", userRoute);
app.use("/login", userLogin);
app.use("/tweet", tweetRoute);
app.use("/like", likeRoute);
app.use("/comment", CommentRoute);
app.use("/retweet", retweetRoute);


app.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`);
})
