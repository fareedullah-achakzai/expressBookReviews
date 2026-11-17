const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (isValid(username)) {
    return res.status(409).json({message: "User already exists"});
  }

  users.push({"username": username, "password": password});
  return res.status(200).json({message: "User successfully registered"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/`);
    return res.json(response.data[isbn]);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get('http://localhost:5000/');
    const filteredBooks = Object.values(response.data).filter(
      book => book.author.toLowerCase() === author.toLowerCase()
    );
    return res.json(filteredBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get('http://localhost:5000/');
    const filteredBooks = Object.values(response.data).filter(
      book => book.title.toLowerCase() === title.toLowerCase()
    );
    return res.json(filteredBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

//  Get book review



module.exports.general = public_users;
