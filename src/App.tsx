import { useEffect, useState } from "react";
//import './styleheets/App.css'
import BookGrid from "./components/BookGrid";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import { Book } from "./hooks/useBooks";
import { Route, Routes } from "react-router-dom";
import SubjectList from "./components/SubjectList";
import BookDetails from "./components/BookDetails";

export interface BookQuery {
  subject: string | null;
  searchInput: string | null;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

function App() {
  //const [bookData, setBookData] = useState([]);
  const [bookQuery, setBookQuery] = useState<BookQuery>({subject: null, searchInput: "latest"});
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  //get cart content from backend
  useEffect(() => {
    fetch('http://localhost:3001/api/cart', {      
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((cartItems) => {
      console.log(cartItems);
      setCartItems(cartItems) // update the state
    })
    .catch((err) => {
    console.error('Error adding to cart:', err);
    }); 
  }, []);

  const totalCartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);

  const handleDelete = (bookToDelete: Book) => {
    const updatedCartItems = cartItems.filter((cartItem) => cartItem.book !== bookToDelete);
    setCartItems(updatedCartItems);
  };

  const handleAddToCart = (bookToAdd: Book) => {
    //console.log(bookToAdd);
    
    const existingCartItemIndex = cartItems.findIndex(
      (item) => item.book.key === bookToAdd.key
    );
    if (existingCartItemIndex !== -1) {                     // if book exists in cart
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingCartItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      const updatedCartItems = [...cartItems, { book: bookToAdd, quantity: 1}]; 
      setCartItems(updatedCartItems);                       // add to cart
      fetch('http://localhost:3001/api/add-to-cart', {      // send to backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //credentials: 'include', 
        body: JSON.stringify({ book: bookToAdd }),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message); // Log the response from the server
      })
      .catch((err) => {
        console.error('Error adding to cart:', err);
      });
    }
  }

  return (
    <>
      <Navbar
        onSearch={(searchInput) => setBookQuery({...bookQuery, searchInput})}
        cartItemsCount={totalCartCount}
      />
      
      <Routes>
        <Route
          path="/"
          element={
            bookQuery && (
              <>
              <SubjectList onSelectSubject={(subject) => setBookQuery({...bookQuery, subject})}/>
              <BookGrid
                bookQuery={bookQuery}
                // onAddToCart={(book) => setCartItems([...cartItems, book])}
                onAddToCart={handleAddToCart}
              />
              </>
            )
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              cartItemsCount={totalCartCount}
              onDelete={handleDelete}
              onClear={() => setCartItems([])}
            />
          }
        />
        <Route
          //path={`/works/${book}`}
          path="/books/works/:id"
          element={
            <BookDetails onAddToCart={handleAddToCart} />
          }
        />

      </Routes>
    </>
  );
}

export default App;
