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

function App() {
  //const [bookData, setBookData] = useState([]);
  const [bookQuery, setBookQuery] = useState<BookQuery>({subject: null, searchInput: "latest"});
  // à modifier
  const [cartItems, setCartItems] = useState<Book[]>([]);

  const handleDelete = (bookToDelete: Book) => {
    const updatedCartItems = cartItems.filter((book) => book !== bookToDelete);
    setCartItems(updatedCartItems);
  };

  return (
    <>
      <Navbar
        onSearch={(searchInput) => setBookQuery({...bookQuery, searchInput})}
        cartItemsCount={cartItems.length}
      />
      <SubjectList onSelectSubject={(subject) => setBookQuery({...bookQuery, subject})}/>
      <Routes>
        <Route
          path="/"
          element={
            bookQuery && (
              <BookGrid
                bookQuery={bookQuery}
                onAddToCart={(book) => setCartItems([...cartItems, book])}
              />
            )
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              onDelete={handleDelete}
              onClear={() => setCartItems([])}
            />
          }
        />
        <Route
          //path={`/works/${book}`}
          path="/books/works/:id"
          element={
            <BookDetails onAddToCart={(book) => setCartItems([...cartItems, book])} />
          }
        />

      </Routes>
    </>
  );
}

export default App;
