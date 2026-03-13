import express from "express"
import {config} from "dotenv"
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import taskRoutes from "./routes/task.routes.js";
import session from "express-session";

const app = express()

config()

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set true behind HTTPS
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);


app.get("/", (req, res) => res.redirect("/login"));
app.use(authRoutes);
app.use(taskRoutes);
app.use(categoryRoutes);

app.listen(process.env.PORT, () => {
    console.log("Server started on port:", process.env.PORT, "✅");
})