"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = __importDefault(require("./routes/user"));
const login_1 = __importDefault(require("./routes/login"));
const tweet_1 = __importDefault(require("./routes/tweet"));
const like_1 = __importDefault(require("./routes/like"));
const comment_1 = __importDefault(require("./routes/comment"));
const retweet_1 = __importDefault(require("./routes/retweet"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
const PORT = 5432;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send("<h1>Twitter Clone</h1>");
});
//Routes
app.use("/user", user_1.default);
app.use("/login", login_1.default);
app.use("/tweet", tweet_1.default);
app.use("/like", like_1.default);
app.use("/comment", comment_1.default);
app.use("/retweet", retweet_1.default);
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
