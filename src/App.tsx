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
  // à modifier
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const totalCartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);

  const handleDelete = (bookToDelete: Book) => {
    const updatedCartItems = cartItems.filter((cartItem) => cartItem.book !== bookToDelete);
    setCartItems(updatedCartItems);
  };

  const handleAddToCart = (bookToAdd: Book) => {
    const existingCartItemIndex = cartItems.findIndex(
      (item) => item.book.key === bookToAdd.key
    );
    if (existingCartItemIndex !== -1) { //if book exists in cart
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingCartItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      const updatedCartItems = [...cartItems, { book: bookToAdd, quantity: 1}]; 
      setCartItems(updatedCartItems);
    }
  }

  return (
    <>
      <Navbar
        onSearch={(searchInput) => setBookQuery({...bookQuery, searchInput})}
        cartItemsCount={totalCartCount}
      />
      <SubjectList onSelectSubject={(subject) => setBookQuery({...bookQuery, subject})}/>
      <Routes>
        <Route
          path="/"
          element={
            bookQuery && (
              <BookGrid
                bookQuery={bookQuery}
                // onAddToCart={(book) => setCartItems([...cartItems, book])}
                onAddToCart={handleAddToCart}
              />
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
