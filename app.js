//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
email: String,
password: String
});

var secret = "ThisIsASecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
res.render("home");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/register", function(req, res){

  User.findOne({email: req.body.username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(!foundUser){
        const newUser = new User ({
          email: req.body.username,
          password: req.body.password
        });
        newUser.save(function(err){
          if(err){
            console.log(err);
          }else{
            res.render("secrets");
          }
        })
      }else{
      res.send("You're already registered. Please reach the login page.");
      }
    }
  })
});

app.post("/login", function(req, res){
  const username= req.body.username;
  const password= req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }else{
          res.send("Incorrect Password");
        }
      }else{
        res.send("Please register");
      }
    }
  });
})












app.listen(3000, function(){
  console.log("Successfully running on server 3000");
})
