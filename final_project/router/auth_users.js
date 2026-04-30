const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session')
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Filter the users array for any user with the same username and password
    let validusers  = users.filter((user) => {
    return (user.username === username && user.password === password);
    });
    if(validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(404).json({message:"Error logging in"});
  }
  // authenticate user
  if(authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
        data:password
    }, 'access', {expiresIn: 4 * 60 * 60});

    // Store access token and username in session
    req.session.authorization = {accessToken, username};
    req.session.save(() => {
        console.log(req.session);
        return res.status(200).send("User successfully logged in");
      });
  } else {
    return res.status(208).send("Invalid Login. Check username and password");
  }


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review_param = req.query.review;
  const username = req.session.username;
  const isbn = req.params.isbn;
  
  let book = books[isbn];
    if(book) {
        //get review list
        let reviews = Object.values(book["reviews"]);
        if(reviews.length > 0) {
            let update_flg = false;
            reviews.forEach(review => {
                if(review["user"] === username) {
                    // update review of customer logging
                    review["comment"] = review_param;
                    update_flg = true;   
                }
            });

            if(!update_flg) {
                // push new review
                reviews.push({"user": username, "comment": review_param});
                return res.status(200).send("Review added sucessfull!");
            } else {
                return res.status(200).send("Review exists, and updated with new review param!");
            }
        }
    } else {
        return res.status(404).send("Not found any book!");
    }
  
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
