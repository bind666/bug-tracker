import express from "express"
import dbConnect from "./db/dbConnect.js"
import config from "./config/config.js"
import errorHandler from "./middleware/errorHandler.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { userRouter } from "./routes/userRoutes.js"
import { projectRouter } from "./routes/projectRoutes.js";
import { ticketRouter } from "./routes/ticketRoutes.js";

const app = express();
app.use(express.json({ limit: "1MB" }));
app.use(express.urlencoded({ limit: "1MB", extended: true }));
app.use(cookieParser())
// app.use(cors());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
}))


app.use("/api/user", userRouter)
app.use("/api/projects", projectRouter);
app.use("/api/tickets", ticketRouter);

app.use("/", (req, res) => {
    res.status(200).json({
        message: "Api is working"
    })
})

app.use(errorHandler)

dbConnect().then(() => {
    const PORT = config.PORT
    app.listen(PORT, () => {
        console.log(`app is listening at port`, PORT);
    })
}).catch((error) => {
    console.log(`mongodb error!!`, error);
})

