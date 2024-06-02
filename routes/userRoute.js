const express = require("express");
const user_route = express();
const session = require("express-session");
const nocache = require("nocache");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

user_route.use(express.json());
user_route.use(express.urlencoded({ extended: true }));

user_route.use(nocache());

user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");

user_route.use(express.static("public"));

user_route.use(session({
  secret: process.env.SESSIONSECRET,
  resave: true,
  saveUninitialized:false
}));


user_route.get("/register", auth.isLogout, userController.loadRegister);

user_route.post("/register", userController.insertUser);

user_route.get("/", auth.isLogout, userController.loginLoad);

user_route.get("/login", auth.isLogout, userController.loginLoad);

user_route.post("/login", userController.verifyLogin);

user_route.get("/home", auth.isLogin,userController.loadHome);

user_route.get("/logout", auth.isLogin, userController.userLogout)


module.exports = user_route;
