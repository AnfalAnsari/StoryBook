const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const exphbs = require("express-handlebars");
const { mongo } = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Loading configuration file
dotenv.config({ path: "./config/config.env" });

// passport config
require("./config/passport")(passport);

//Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

connectDB();

// session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// passport middleware

app.use(passport.initialize());
app.use(passport.session());

// enviornment variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//HandleBars helper
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helper/hbs");

//HandleBars
app.engine(
  ".hbs",
  exphbs.engine({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayour: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//Static folder
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT} `
  )
);
