import express from "express";
import mysql from "mysql";
import cors from 'cors';

const app = express();
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "MySQL3901!",
    database: "library"
});

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

app.use(express.json({ limit: '10mb' }));
app.use(cors());



app.get("/", (req, res) => {
    res.json("hello this is the backend");
});


            /* USER AUTHENTICATION - TESTING ONLY */
            app.get("/users", (req, res) => {
                console.log("fetching users")
                const q = "SELECT * from users";
                db.query(q, (err, data) => {
                    if (err) return res.json(err);
                    return res.json(data);
                })
            });

            app.post("/add-user", async (req, res) => {      //bcrypt requires async
                console.log(req.body.email)
                console.log(req.body.password)
                const salt = await bcrypt.genSalt()
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                console.log(hashedPassword)
                const q = "INSERT INTO `library`.`users` (`email`, `password`) VALUES (?, ?)";
                const uservalues = [req.body.email, hashedPassword];
                db.query(q, uservalues, (err, newuser) => {
                    if (err) return res.json(err);
                    return res.json(newuser);
                })
            });

            app.post('/users/login', async (req, res) => {
                // console.log('user', req.body)
                // console.log('email', req.body.email)
                // console.log('password', req.body.password)
                try {
                    const response = await fetch('http://localhost:3001/users', {
                        method: 'GET',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                    });

                    if(!response.ok) {
                        return res.status(400).send('Failed to fetch users');
                    }

                    const users = await response.json();
                    console.log(users);
                    const user = users.find(user => user.email === req.body.email )  //find in db the user that has the email
                    if (user == null) {
                        return res.status(400).send("Cannot find user")
                    }
                    try{
                        //console.log("found matching user", user)
                        //compare password:
                        console.log(req.body.password)
                        console.log(user.password)
                        if(await bcrypt.compare(req.body.password, user.password)){
                            return res.json('success');
                        } else {
                            return res.json('not allowed')
                        }
                    } catch {
                        return res.status(500).send()
                    }
                } catch(err) {
                    console.error('Error adding to cart:', err); 
                    return res.status(500).send('Internal Server Error');
                }
            });


app.get("/books", (req, res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/book-details/:bookId", (req, res) => {
    const bookId = req.params.bookId;
    console.log(`Received request to /book-details/:bookId for book ${bookId}`);
  
    const getBookDetailsQuery = 'SELECT * FROM books WHERE book_id = ?';
  
    db.query(getBookDetailsQuery, [bookId], (err, results) => {
        console.log(results)
        if (err) {
        console.error('Error fetching book details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }
  
      const bookDetails = results[0];
      res.json(bookDetails);
    });
  });


app.get("/cartitems", (req, res) => {
    console.log("fetching content from cart")
    const q = "SELECT * FROM cartitems";
    db.query(q, (err, data) =>  {
        console.log(data)
        if (err) return res.json(err);
        return res.json(data);
    }) 
})

app.post("/add-to-cart", (req, res) => {
    console.log('Received request to /add-to-cart');
    const { book } = req.body;

    let bookId;
    // Check if the book is already in the database
    const checkQuery = 'SELECT * FROM `books` WHERE `bookkey` = ?';
    db.query(checkQuery, [book.key], (err, results) => {
        if (err) {
            console.error('Error checking book:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        // if book not in database
        if (results.length === 0) {
            //add book to books
            const insertBookQuery = 'INSERT INTO `books` (bookkey, title, author, cover) VALUES (?, ?, ?, ?)';
            const bookValues = [
                book.key,
                book.title,
                book.author_name,
                book.cover_i,
                // book.ratings_average,
                // book.ratings_count,
                // book.first_publish_year,
            ];
            db.query(insertBookQuery, bookValues, (insertErr, newBook) => {
                if (insertErr) {
                    console.error('Error adding book:', insertErr);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                console.log('Book added to database');
            });
            //get bookId
            bookId = newBook.insertId;
            console.log("new book id", bookId);
        } 
        else {//get book id
            bookId = results[0].book_id;
        }

        //INSERT CART ITEM
        //TODO: if cartitem with same user id and same book id exists, change quantity 
        const checkCartItemQuery = 'SELECT * FROM `cartitems` WHERE `book_id` = ?'; //AND `user_id` = ?';
        db.query(checkCartItemQuery, [bookId], (checkErr, cartResults) => {
            if (checkErr) {
                console.error('Error checking cart item:', checkErr);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (cartResults.length > 0) {
                const updateCartItemQuery = 'UPDATE `cartitems` SET `quantity` = `quantity` + 1 WHERE `book_id` = ?'; // AND `user_id` = ? 
                const updateCartItemValues = [bookId];

                db.query(updateCartItemQuery, updateCartItemValues, (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating cart item quantity:', updateErr);
                        res.status(500).json({ error: 'Internal Server Error' });
                        return;
                    }
                    console.log('Cart item quantity updated in database');
                });

            } else {
                const insertCartItemQuery = 'INSERT INTO `cartitems` (quantity, book_id) VALUES (?, ?)';
                const cartItemValues = [
                    1,
                    bookId
                    // user_id
                ];

                db.query(insertCartItemQuery, cartItemValues, (insertErr) => {
                    if (insertErr) {
                        console.error('Error adding cart item:', insertErr);
                        res.status(500).json({ error: 'Internal Server Error' });
                        return;
                    }
                    console.log('Cart item added to database');
                });
            }
        });
    });
});

app.post("/change-cartitem-quantity", (req, res) => {
    console.log("received request from /change-cartitem-quantity")
    console.log(req.body.i);
    console.log(req.body.cartItem);
    //if req.body.cartItem.quantity === 1 and i === -1, delete cartItem
        //'SELECT * FROM `cartitems` WHERE `book_id` = ?'; //AND `user_id` = ?';
    //else change quantity
    const changeCartItemQuantityQuery = 'UPDATE `cartitems` SET `quantity` = ? WHERE `book_id` = ?'; // AND `user_id` = ?
    db.query(changeCartItemQuantityQuery, [(req.body.cartItem.quantity + req.body.i), req.body.cartItem.book_id], (updateErr, res) => {
        if (updateErr) {
            console.error('Error updating quantity', updateErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log(res);
        console.log('Quantity changed in database');
    })

    // db.query(checkCartItemQuery, [bookId], (checkErr, cartResults) => {
    //     if (checkErr) {
    //         console.error('Error checking cart item:', checkErr);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //         return;
    //     }
    //     if (cartResults.length > 0) {
    //         const updateCartItemQuery = 'UPDATE `cartitems` SET `quantity` = `quantity` + 1 WHERE `book_id` = ?'; // AND `user_id` = ? 
    //         const updateCartItemValues = [bookId];

    //         db.query(updateCartItemQuery, updateCartItemValues, (updateErr) => {
    //             if (updateErr) {
    //                 console.error('Error updating cart item quantity:', updateErr);
    //                 res.status(500).json({ error: 'Internal Server Error' });
    //                 return;
    //             }
    //             console.log('Cart item quantity updated in database');
    //         });
})

app.post("/delete-from-cart", (req, res) => {
    console.log('Received request to /delete-from-cart');
    const { cartItemToDelete } = req.body;
    console.log(cartItemToDelete)
        
        //if (cartItemToDelete.quantity === 1) { //if only one in cart
            const deleteCartItemQuery = 'DELETE FROM `cartitems` WHERE `cartitem_id` = ?';
            db.query(deleteCartItemQuery, [cartItemToDelete.cartitem_id], (deleteErr) => {
                if (deleteErr) {
                    console.error('Error deleting cart item:', deleteErr);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                console.log('Cart item deleted from database');
                res.status(200).json({ message: 'Cart item deleted successfully' });
            });  
        //} else {
            // const deleteCartItemQuery = 'UPDATE `cartitems` SET `quantity` = ? WHERE `cartitem_id` = ?);'
            // db.query(deleteCartItemQuery, [(cartItemToDelete.quantity - 1), cartItemToDelete.book_id], (deleteErr) => {
            //     if (deleteErr) {
            //         console.error('Error deleting cart item:', deleteErr);
            //         res.status(500).json({ error: 'Internal Server Error' });
            //         return;
            //     }
            //     console.log('Cart item quantity lowered in database');
            //     res.status(200).json({ message: 'Cart item deleted successfully' });
            // }) 
        //}

        // // fetch the updated cart items from the database
        // const fetchUpdatedCartItemsQuery = 'SELECT * FROM cartitems'; 

        // db.query(fetchUpdatedCartItemsQuery, [], (fetchErr, updatedCartItems) => {
        //     if (fetchErr) {
        //         console.error('Error fetching updated cart items:', fetchErr);
        //         res.status(500).json({ error: 'Internal Server Error' });
        //         return;
        //     }

        //     // Send the updated cart items in the response
        //     res.status(200).json(updatedCartItems);
        // });
});

app.listen(3001, () => {
    console.log("Connected to backend");
});
