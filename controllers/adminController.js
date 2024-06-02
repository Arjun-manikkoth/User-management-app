const User = require("../models/userModel");
const bcrypt = require("bcrypt");
 
const loadLogin = async (req,res) => {
  try {
    res.render("login");
  }
  catch (error) {
    console.log(error.message);
  }
}

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    
    const adminData = await User.findOne({ email: email });
    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      
      if (passwordMatch) {
        if (adminData.is_admin == 1) {

          req.session.admin_id = adminData._id;
          res.redirect("/admin/home");
        } else {
          res.render("login",{message:"Invalid Credentials"})
        }
        
      } else {
        res.render("login", { message: "incorrect Username/Password" });
      }
    } else {
      res.render("login", { message: "incorrect Username/Password" });
    }
  } catch (error) {
    console.log(error.message); 
  }
};

const adminDashboard = async (req, res) => {
  try {
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }
    const userdata = await User.find({
      is_admin: 0,
      $or: [
        { name: { $regex: ".*" +search+ ".*" ,$options:"i"} },
        { email: { $regex: ".*" +search+ ".*",$options:"i" } },
        { mobile: { $regex: ".*" +search+ ".*",$options:"i" } }
      ]
    });
    
    res.render("home",{user:userdata});
  } catch (error) {
    console.log(error.message);
  }
};

const adminLogout = async (req,res) => {

  try {
    req.session.destroy();
    res.redirect("/admin");
  }
  catch (error) {
    console.log(error.message)
  }
}

const newUserload = async (req, res) => {
  try {
    res.render("add_user");
  }
  catch (error)
  {
    console.log(error.message);
  }

}

const editUserLoads = async (req, res) => {
  try {
    const id = req.query.id;
    const userdata = await User.findById({ _id: id })
    if (userdata) {
      res.render("edit-user", { user: userdata });
    }
    else {
      res.redirect("/admin/home")
    }
  }
  catch (error) {
    console.log(error.message);
  }
}
 
const updateUser = async (req,res) => {
  try {
    
    const userdata = await User.findByIdAndUpdate({ _id: req.body.id },{$set:{
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile
    }
    })

    res.redirect("/admin/home");
  }
  catch (error) {
    console.log(error.message);
  }
}
const deleteUser = async (req, res) =>
{
  try {
    const id = req.query.id;
    await User.deleteOne({ _id: id });
    res.redirect("/admin/home");
  }
  catch (error) {
    console.log(error.message);
  }
  }
  
  const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
};
  
  const insertAdmin = async (req, res) => {
    try {
      const spassword = await securePassword(req.body.password);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: spassword,
        is_admin: 0,
      });
  
      const userData = await user.save();
      if (userData) {
        res.render("add_user", { message: "Registration Successfull" });
      } else res.render("add_user", { message: "Registration failed" });
    } catch (error) {
      console.log(error.message);
    }
  };



module.exports = {
  loadLogin,
  verifyLogin,
  adminDashboard,
  adminLogout,
  newUserload,
  insertAdmin,
  editUserLoads,
  updateUser,
  deleteUser
}