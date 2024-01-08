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

app.use(express.json({ limit: '10mb' }));
app.use(cors());

app.get("/", (req, res) => {
    res.json("hello this is the backend");
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

app.post("/delete-from-cart", (req, res) => {
    console.log('Received request to /delete-from-cart');
    const { cartItemToDelete } = req.body;
    console.log(cartItemToDelete)
               
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
