const express = require("express");
const mongoose = require("mongoose");
const parser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
app.set("view engine", "ejs");
app.use(parser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(session({ secret: "mysecret" }));
////////////////////////////////////////////////////////
// DB connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("DB connection successeded");
  })
  .catch((e) => {
    console.Console.log(e.message);
  });
const User = require("./models/User");
const Blog = require("./models/Blog");
const Tag = require("./models/Tag");
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
// app.get("/createProfileWithUser", (req, res) => {
//   User.findById("645b4dba967cb6de825edbd3").then((user) => {
//     const p = new Profile({
//       bio: "mmmmm",
//       workExp: "1234",
//       userProfile: user._id,
//     });

//     p.save().then(() => {
//       res.send(p);
//     });
//   });
// });
// add blogs
app.get("/addBlog", (req, res) => {
  Tag.find().then((foundTags) => {
    res.render("addBlog.ejs", { allTags: foundTags });
  });
});

app.post("/addBlog", (req, res) => {
  const selectedTag = req.body.selectedTags;
  const blog = new Blog({
    title: req.body.title,
    body: req.body.content,
    tags: selectedTag,
  });
  blog
    .save()
    .then((savedBlog) => {
      console.log(typeof selectedTag);
      if (typeof selectedTag === "object") {
        selectedTag.forEach((tag) => {
          Tag.findById(tag).then((tagId) => {
            tagId.blogs.push(savedBlog._id);
            console.log(tagId);
            tagId.save();
          });
        });
      } else if (typeof selectedTag === "string") {
        Tag.findById(selectedTag).then((tagId) => {
          tagId.blogs.push(savedBlog._id);
          console.log(tagId);
          tagId.save();
        });
      } else {
        console.log("not an object or array");
      }
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

// user -> blog(many to many)
app.get("/createBlogWithUser/:userId", (req, res) => {
  const userId = req.params.userId;
  User.findById(userId).then((foundUser) => {
    // query params:
    const bodyParams = req.query.body;
    const titleParams = req.query.title;
    const blog = new Blog({
      title: titleParams,
      body: bodyParams,
      user: foundUser,
    });
    blog.save().then((savedBlog) => {
      foundUser.blogs.push(savedBlog);
      foundUser.save().then(() => {
        res.send("blog added");
      });
    });
  });
});
// reg
app.get("/reg", (req, res) => {
  let username = req.query.username;
  let email = req.query.email;
  let pass = req.query.pass;
  const u = new User({
    username: username,
    password: pass,
    email: email,
  });
  u.save().then(() => {
    res.send("user saved");
  });
});
// login
app.get("/login", (req, res) => {
  const username = req.query.username;
  const pass = req.query.pass;
  User.findOne({ username: username, password: pass }).then((foundUser) => {
    // res.send(username + " " + pass);
    if (foundUser) {
      res.send(foundUser);
    } else {
    }
  });
});
// sessions
app.get("/session", (req, res) => {
  res.send("listening to session");
});

app.get("/secret", (req, res) => {
  res.send("jjjj");
});
app.get("addToCart", (req, res) => {
  req.session.numberOfItems = 1;
  res.send("done");
});
//
app.listen(process.env.PORT, () => {
  console.log("Connected on Port 5500");
});
