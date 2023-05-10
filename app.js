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
  .connect(
    "mongodb+srv://musab:musab123m@cluster0.tcmbhbd.mongodb.net/?retryWrites=true&w=majority"
    // "mongodb://0.0.0.0:27017/blogs"
  )
  .then(() => {
    console.log("DB connection successeded");
  })
  .catch((e) => {
    console.Console.log(e.message);
  });
const User = require("./models/User");
const Blog = require("./models/Blog");
const ProfileModule = require("./models/Profile");
const Profile = ProfileModule.Profile;
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
// add profile
app.get("/profiles", (req, res) => {
  const p = new Profile({
    bio: "dd",
    workExp: "dd",
  });
  p.save()
    .then(() => {
      console.log("good");
    })
    .catch((e) => {
      console.log(e.message);
    });
});
// find profile by id --> not working
app.get("/findUserProfile", (req, res) => {
  User.findById("645b4f1125279e68253dc4f4")
    .populate("userProfile")
    .then((user) => {
      res.send(user);
    });
});
// create
app.get("/createUserWithProfile", (req, res) => {
  Profile.findById("645b4f1125279e68253dc4f4").then((profile) => {
    const u = new User({
      username: "dddd",
      password: "1234",
      email: "dddd@ddd.com",
      userProfile: profile._id,
    });

    u.save().then(() => {
      res.send(u);
    });
  });
});
//
app.get("/createProfileWithUser", (req, res) => {
  User.findById("645b4dba967cb6de825edbd3").then((user) => {
    const p = new Profile({
      bio: "mmmmm",
      workExp: "1234",
      userProfile: user._id,
    });

    p.save().then(() => {
      res.send(p);
    });
  });
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
  let Ubody = req.body.content;
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
