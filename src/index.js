import express from "express";
import favicon from "serve-favicon";
import compression from "compression";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
// import cron from "node-cron";
import Tweet from "./model/tweet";
import TargetWord from "./model/targetWord";
// import { searchCronJob } from "./cron";
import { getTargetWords } from "./targetWord";

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/pluto-ADSR", {
  user: "TOPGUN",
  pass: "pluto8219*",
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  app.set("views", path.resolve(__dirname, "../", "views"));
  app.set("view engine", "pug");
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.resolve(__dirname, "../", "public")));
  app.use(favicon(path.resolve(__dirname, "../", "public", "favicon.ico")));
  app.use(compression());

  app.get("/", async (_req, res) => {
    const targetWords = await getTargetWords();
    const q = Tweet.find({}, null, {
      limit: 10,
      sort: { originCreatedAt: -1 }
    });
    const recentTweets = await q.exec();

    res.render("index", { targetWords, recentTweets });
  });

  app.post("/words/new", async (req, res) => {
    if (req.body && req.body.word) {
      const word = new TargetWord({ word: req.body.word, monitoring: true });
      await word.save();
    }
    res.redirect("back");
  });

  app.put("/words/:id", (req, res) => {
    if (req.params.id) {
      TargetWord.findById(req.params.id, (err, word) => {
        if (!err) {
          TargetWord.updateOne(
            { _id: req.params.id },
            { monitoring: !word.monitoring },
            (err, _result) => {
              if (!err) {
                res.json({ success: true });
              } else {
                res.json({ fail: true, error: err.messgae });
              }
            }
          );
        }
      });
    }
  });

  app.delete("/words/:id", (req, res) => {
    if (req.params.id) {
      TargetWord.deleteOne({ _id: req.params.id }, err => {
        if (err) {
          res.json({ fail: true, error: err.message });
        } else {
          res.json({ success: true });
        }
      });
    }
  });

  app.listen(port, () => console.log(`Web-server started at ${port}!`));

  // cron.schedule("* * * * *", () => {
  //   searchCronJob();
  // });
});
