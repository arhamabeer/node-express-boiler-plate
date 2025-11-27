const express = require("express");
const mongoose = require("mongoose");
const mainRoutes = require("./src/routes/index");
const staticRoutes = require("./src/routes/staticRoutes");
const fs = require("fs");
const path = require("path");
require("./src/discordBot");

const app = express();
const PORT = 5000;

//! COMMON NODE JS STRUCTURE WITHOUT EXPRESS
// const server = http.createServer((req, res) => {
//   const logData = `REQUEST TIME: ${new Date().toLocaleDateString()} - REQUEST URL: ${
//     req.url
//   } - Request Received.\n`;
//   if (req.url !== "/favicon.ico") {
//     fs.appendFile("access.log", logData, () => {});
//     switch (req.url) {
//       case "/":
//         res.end("Hello World");
//         break;
//       case "/about":
//         res.end("About Page");
//         break;
//       default:
//         res.end("404 Not Found");
//         break;
//     }
//   }
// });

// fs.writeFile("dummy.js", "New file createde", (err) => {});

// fs.unlink("dummy.txt", () => {});

// fs.appendFile("dummy.txt", "Newfile created \n", () => {});

// fs.readFile("dummy.txt", "utf-8", (err, res) => {
//   if (err) {
//     console.log("file read err: ", err);
//   } else {
//     console.log("file read: ", res);
//   }
// });

//! NODE JS WITH EXPRESS FRAMEWORK
// middleware for handle www-form-urlencoded data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.resolve("./src/views"));
// mongo db connection
mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`Error connecting MongoDB: ${err}`));

// middleware for logs
app.use((req, res, next) => {
  const logData = `REQUEST TIME: ${new Date().toLocaleTimeString()} - REQUEST DATE: ${new Date().toLocaleDateString()} - REQUEST URL: ${
    req.url
  } - Request Received.\n`;
  fs.appendFile("access.log", logData, () => {});
  next();
});

// APIs
// app.get("/api/hello", (req, res) => {
//   console.log(`hello route request haeders: `, req.headers);
//   res.header("X-Arham-Header", "AAA");
//   res.send("Hello from root route");
// });

// router config
app.use("/api", mainRoutes);
app.use("/", staticRoutes);
// app.get("/test", async (req, res) => {
//   try {
//     const urls = await Url.find({});
//     // console.log("All URLs fetched:", urls);
//     return res.render("home", { urlLists: urls });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: `Internal server error: ${error.message}` });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
