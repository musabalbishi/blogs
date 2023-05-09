const express = require("express");
const mongoose = require("mongoose");
const parser = require("body-parser");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.use(parser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
////////////////////////////////////////////////////////
// DB connection
mongoose
  .connect("mongodb://0.0.0.0:27017/blogs")
  .then(() => {
    console.log("DB connection successeded");
  })
  .catch((e) => {
    console.Console.log(e.message);
  });
const User = require("./models/User");
const Blog = require("./models/Blog");
//
app.get("/", (req, res) => {
  Blog.find().then((blog) => {
    res.render("main.ejs", { blog: blog });
  });
});
// sign up
app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});
app.post("/signup", (req, res) => {
  const user = new User({
    username: req.body.name,
    password: req.body.password,
    email: req.body.email,
    role: req.body.role,
  });
  user
    .save()
    .then(() => {
      console.log("record inserted");
    })
    .catch((e) => {
      console.log(e.message);
    });
  res.redirect("/");
});
// add blogs
app.get("/addBlog", (req, res) => {
  res.render("addBlog.ejs");
});
app.post("/addBlog", (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    body: req.body.content,
  });
  blog
    .save()
    .then(() => {
      console.log("record inserted");
    })
    .catch((e) => {
      console.log(e.message);
    });
  res.redirect("/");
});
// blog details
app.get("/article/:id", (req, res) => {
  Blog.findById(req.params.id)
    .then((foundBlog) => {
      res.render("blogDetails.ejs", { foundBlog: foundBlog });
    })
    .catch((error) => {
      res.send(error.message);
    });
});
// delete
app.get("/deleteBlog/:id", (req, res) => {
  Blog.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect("/");
    })
    .catch((e) => {
      console.log(e.message);
    });
});
// update
app.get("/updateBlog/:id", (req, res) => {
  Blog.findByIdAndUpdate(req.params.id)
    .then((foundBlog) => {
      res.render("updateBlog.ejs", { foundBlog: foundBlog });
    })
    .catch((e) => {
      console.log(e.message);
    });
});
app.post("/updateBlog/:id", (req, res) => {
  let Utitle = req.body.title;
  let Ubody = req.body.body;
  Blog.findById(req.params.id).then((foundBlog) => {
    foundBlog.title = Utitle;
    foundBlog.body = Ubody;
    foundBlog
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch((e) => {
        console.log(e.message);
      });
  });
});
app.listen(5500, () => {
  console.log("Connected on Port 5500");
});
