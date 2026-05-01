const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password =  req.body.password;

  if(username && password) {
    // check exit
    let user = users.filter(user => user.username == username);
    console.log(user);
    if(user.length == 0) {
        // if not exists , do register.
        users.push({"username": username, "password": password});
        res.send("User successfully registered. Now you can login");
    } else {
        res.send("user is exists!");
    }
  }
  
});

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});*/
public_users.get("/", function (req, res) {
    axios.get("http://localhost:5000/") // call a DIFFERENT endpoint
      .then(res.send(JSON.stringify(books, null, 4)))
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  });

// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn_pr = req.params.isbn;
  let book = books[isbn_pr];
    if(book) {
        res.send(JSON.stringify({[isbn_pr]:book}, null, 4));

    } else {
    res.send("Not found any book!");
  }
 });*/

public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
  
    res.status(200).json("successfull", response.data);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching book",
            error: error.message
        });
    }
});
  
// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const result = Object.keys(books)
                    .filter(isbn => books[isbn].author.toLowerCase() === author)
                    .reduce((acc, isbn) => {
                        acc[isbn] = books[isbn];
                        return acc;
                    }, {});

  if(Object.keys(result).length > 0) {
    res.send(JSON.stringify(result, null, 4));
  } else {
    res.send("Not found any book");
  }
});*/
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;

        const response = await axios.get(`http://localhost:5000/author/${author}`);

        res.status(200).json("successfull", response.data);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching book",
            error: error.message
        });
    }
});

// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const result = Object.keys(books)
                    .filter(isbn => books[isbn].title.toLowerCase() === title.toLowerCase())
                    .reduce((acc, isbn) => {
                        acc[isbn] = books[isbn];
                        return acc;
                    }, {});
                    
  if(Object.keys(result).length > 0) {
    res.send(JSON.stringify(result, null, 4));
  } else {
    res.send("Not found any book");
  }
});*/

public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;

        const response = await axios.get(`http://localhost:5000/title/${title}`);

        res.status(200).json("successfull", response.data);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching book",
            error: error.message
        });
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];
    if(book) {
        //get review list
        let reviews = book["reviews"];
        res.send(JSON.stringify(reviews, null, 4));

    } else {
    res.send("Not found any book!");
  }
});

module.exports.general = public_users;
