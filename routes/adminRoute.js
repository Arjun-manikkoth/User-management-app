const express = require("express");
const admin_route = express();
const session = require("express-session");
const nocache = require("nocache");
const auth = require("../middleware/adminauth");
const admin= require("../controllers/adminController");


admin_route.use(express.json());

admin_route.use(express.urlencoded({ extended: true }));

admin_route.use(nocache());

admin_route.use(express.static("public"));

admin_route.set("view engine", "ejs");

admin_route.set("views", "./views/admin");

admin_route.use(session({
  secret: process.env.SESSIONSECRET,
  resave: true,
  saveUninitialized: false
}));


admin_route.get("/", auth.isLogout, admin.loadLogin);

admin_route.post("/", admin.verifyLogin);

admin_route.get("/home",auth.isLogin, admin.adminDashboard);

admin_route.get("/logout", auth.isLogin, admin.adminLogout);

admin_route.get("/adduser", auth.isLogin, admin.newUserload);

admin_route.get("/edit-user", auth.isLogin,admin.editUserLoads);

admin_route.post("/add-user", admin.insertAdmin);

admin_route.post("/edit-user", admin.updateUser);

admin_route.get("/delete-user", admin.deleteUser);

//Invalid routes
admin_route.get("*", (req, res) => {

  res.redirect("/admin");

})

module.exports = admin_route;