import { useEffect, useState } from "react";
//import './styleheets/App.css'
import BookGrid from "./components/BookGrid";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import { Book } from "./hooks/useBooks";
import { Route, Routes } from "react-router-dom";
import SubjectList from "./components/SubjectList";
import BookDetails from "./components/BookDetails";
import Suggestions from "./components/Suggestions";
import LoginForm from "./components/LoginForm";

export interface BookQuery {
  subject: string | null;
  searchInput: string | null;
}

export interface CartItem {
  cartitem_id: number;
  quantity: number;
  book_id: number; 
  book: Book; 
}

function App() {
  //const [bookData, setBookData] = useState([]);
  const [bookQuery, setBookQuery] = useState<BookQuery>({subject: null, searchInput: "latest"});
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  //get cart content from backend

  //const totalCartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  const [totalCartCount, setTotalCartCount] = useState<number>(0);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Recalculate totalCartCount whenever cartItems changes
    const newTotalCartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
    setTotalCartCount(newTotalCartCount);
  }, [cartItems]);

  
  useEffect(() => {
    fetch('http://localhost:3001/cartitems', {      
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
  }, [totalCartCount]);
  
  const handleDelete = (cartItemToDelete: CartItem) => {
    const updatedCartItems = cartItems.filter((cartItem) => cartItem !== cartItemToDelete);
   
      console.log(cartItemToDelete);      

      fetch('http://localhost:3001/delete-from-cart', {        // delete from cart in DB
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //credentials: 'include', 
        body: JSON.stringify({ cartItemToDelete }),
      })
        .then((response) => response.json())
        .then(() => {
          fetch('http://localhost:3001/cartitems', {        //fetch updated cart items from DB
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((response) => response.json())
          .then((updatedCartItems) => {
            setCartItems(updatedCartItems); // Update the state with the new cart items
          })
          .catch((err) => {
            console.error('Error fetching updated cart items:', err);
          });


        // } else {
        //     console.error('Invalid response format from server:', updatedCartItems);
        // }
        })
        .catch((err) => {
          console.error('Error fetching updated cart items:', err);
        });

  };

  const handleQuantityChange = (cartItem: CartItem, i: number) => {   
    fetch('http://localhost:3001/change-cartitem-quantity', {        // change quantity in DB
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItem, i }),
    })
    .then((response) => response.json())
    // .then((data) => {
    //   console.log("hello", data);
    // })
    .then((updatedCartItems) => {
      setCartItems(updatedCartItems);
       // Update the state with the new cart items
    })
      // setCartItems((prevCartItems) => {
      //   const updatedCartItems = prevCartItems.map((item) => {
      //     if (item.cartitem_id === cartItem.cartitem_id) {
      //       // Update the quantity for the specific cart item
      //       return { ...item, quantity: item.quantity + i };
      //     }
      //     return item;
      //   });
      //   return updatedCartItems;
      // });
   
      // fetch('http://localhost:3001/cartitems', {        //fetch updated cart items from DB
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
      // .then((response) => response.json())
      // .then((updatedCartItems) => {
      //   console.log(updatedCartItems);
        
      //   setCartItems(updatedCartItems); // Update the state with the new cart items
      // })
      // } else {
      //     console.error('Invalid response format from server:', updatedCartItems);
      // }
      .catch((err) => {
        console.error('Error updating quantity:', err);
      });
  }

  const handleAddToCart = (bookToAdd: Book) => {
    console.log(bookToAdd); //fetched from API {key , type, title, author_name, cover_i …}
    console.log(cartItems); //fetched from back end {cartItem, quantity, book_id}
    
    const existingCartItemIndex = cartItems.findIndex(
      (item) => item.book?.key === bookToAdd.key
    );
    console.log(existingCartItemIndex);
    
    if (existingCartItemIndex !== -1) {                     // if book exists in cart...
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingCartItemIndex].quantity += 1;// udpate quantity
      setCartItems(updatedCartItems);
      
      fetch('http://localhost:3001/update-cartitems', {     // udpate quantity in DB
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //credentials: 'include', 
        body: JSON.stringify(updatedCartItems[existingCartItemIndex]),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error('Error increasing quantity:', err);
      });

    } else {                                                // if book doesn't exist in cart...
      console.log(bookToAdd);
      // const updatedCartItems = [...cartItems, { book: bookToAdd, quantity: 1}]; 
      // setCartItems(updatedCartItems);                       // add to cart
      fetch('http://localhost:3001/add-to-cart', {        // add to cart in DB
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //credentials: 'include', 
        body: JSON.stringify({ book: bookToAdd }),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      }) 
      .catch((err) => {
        console.error('Error adding to cart:', err);
      });
                                                            // in either case, fetch updated cart items from DB
    fetch('http://localhost:3001/cartitems', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((updatedCartItems) => {
      setCartItems(updatedCartItems);
    })
    .catch((err) => {
      console.error('Error fetching updated cart items:', err);
    });
  }
  
}

  return (
    <>
      <Navbar
        onSearch={(searchInput) => setBookQuery({...bookQuery, searchInput})}
        cartItemsCount={totalCartCount}
        setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={isLoggedIn}
      />
      
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn && bookQuery ? (
              //bookQuery && (
              <>
                <SubjectList onSelectSubject={(subject) => setBookQuery({...bookQuery, subject})}/>
                <BookGrid
                  bookQuery={bookQuery}
                  // onAddToCart={(book) => setCartItems([...cartItems, book])}
                  onAddToCart={handleAddToCart}
                />
              </>
   ) : (
  <LoginForm setIsLoggedIn={setIsLoggedIn} />
   )
}
/>
        {/* <Route
          path="/login"
          element={<LoginForm setIsLoggedIn={setIsLoggedIn} />}
        /> */}
        
        <Route
          path="/cart"
          element={
            <>
              <Cart
              cartItems={cartItems}
              cartItemsCount={totalCartCount}
              onDelete={handleDelete}
              onClear={() => setCartItems([])}
              setCartItems={setCartItems} />
              <Suggestions />
            </>
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
