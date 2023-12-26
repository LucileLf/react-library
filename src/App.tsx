import { useEffect, useState } from "react";
//import './styleheets/App.css'
import BookGrid from "./components/BookGrid";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import { Book } from "./hooks/useBooks";
import { Route, Routes } from "react-router-dom";
import SubjectList from "./components/SubjectList";


function App() {
  //const [bookData, setBookData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("Harry Potter");
  // à modifier
  const [cartItems, setCartItems] = useState<Book[]>([]);

  const handleDelete = (bookToDelete: Book) => {
    const updatedCartItems = cartItems.filter((book) => book !== bookToDelete);
    setCartItems(updatedCartItems);
  };

  return (
    <>
      <Navbar
        onSearch={(searchQuery) => setSearchQuery(searchQuery)}
        cartItemsCount={cartItems.length}
      />
      <SubjectList onSelectSubject={(searchQuery) => setSearchQuery(searchQuery)}/>
      <Routes>
        <Route
          path="/"
          element={
            searchQuery && (
              <BookGrid
                searchQuery={searchQuery}
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
      </Routes>
    </>
  );
}

export default App;
