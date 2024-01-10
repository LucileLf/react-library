import {
  Stack,
  Divider,
  Text,
  Button,
  Image,
  Spacer,
  Heading,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { Book } from "../hooks/useBooks";
import { MdArrowDownward, MdArrowUpward, MdCancel } from "react-icons/md";
import noImage from '../assets/no-image-placeholder.webp'
import '../stylesheets/variables.scss';
import { Fragment, useEffect, useState } from "react";
import { CartItem } from "../App";

interface CartProps {
  cartItems: CartItem[] | null;
  cartItemsCount: number;
  onDelete: (cartItem: CartItem)=>void;
  onClear: () => void;
  setCartItems: (cartItems: CartItem[])=>void;
  //onChangeQuantity: (cartItem: CartItem, i: number)=>void;
}

// const fetchBookDetails = async (bookId: number) => {
//   try {
//     const response = await fetch(`http://localhost:5173/book-details/${bookId}`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch book details');
//     }

//     const bookDetails = await response.json();
//     return bookDetails;
//   } catch (error) {
//     console.error('Error fetching book details:', error);
//     throw error;
//   }
// };

      
const Cart = ({ cartItems, cartItemsCount, onDelete, onClear, setCartItems /*, onChangeQuantity */}: CartProps) => {
  if (!cartItems) return <Text>Votre panier est vide</Text>;
  
  //fetch book info from database
  // useEffect(() => {
    const fetchBookDetails = async (cartItem: CartItem) => {
      console.log(`fetching details for book with id ${cartItem.book_id}`)
      try {   
        const response = await fetch(`http://localhost:3001/book-details/${cartItem.book_id}`, {  
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      // .then((response) => response.json())
      // .then((data) => {
      //   console.log(data); // book
      //   cartItem.book = data; //setCartItems(...cartItems, data)
      //   console.log(cartItem);
      // })
      // .catch((err) => {
      //   console.error('Error finding details of book', err);
      // });
    // })
  // }, [cartItems]);

      if (!response.ok) {
        throw new Error(`Failed to fetch details for book with id ${cartItem.book_id}`);
      }

      const data = await response.json();
      console.log(data);   //book details
      return data;
    } catch (error) {
      console.error('Error finding details of book', error);
      throw error;
    }
  };

  const handleQuantityChange = (cartItem: CartItem, i: number) => {   
    
    
    const updatedCartItems = cartItems.map((item) => {
      if (item === cartItem) {
        const updatedQuantity = item.quantity + i;
        if (updatedQuantity < 1) {
          onDelete(item);
        }
        return { ...item, quantity: Math.max(updatedQuantity, 1) }; // Ensure quantity is not less than 1
      }
      return item;
    });

    setCartItems(updatedCartItems);
    
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
    .then((data) => {
      console.log(data);
    })
    // .then((updatedCartItems) => {
    //   setCartItems(updatedCartItems);
    //    // Update the state with the new cart items
    // })
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

  const updateCartItemsWithDetails = async () => {
    try {
      const updatedCartItems = await Promise.all(cartItems.map(async (cartItem) => {
        const bookDetails = await fetchBookDetails(cartItem);
        return { ...cartItem, book: bookDetails };
      }));

      console.log(updatedCartItems);
      // Update the state with the new cart items
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Error updating cart items with details:', error);
    }
  };

  useEffect(() => {
  updateCartItemsWithDetails();
}, [cartItems.length]);

  console.log(cartItems);

  return (
    <>
      <Heading>Panier ({cartItemsCount})</Heading>
      {cartItems && cartItems.length > 0 ? (
        cartItems.map((cartItem) => (
          <Fragment key={cartItem.cartitem_id}>
            <Divider orientation="horizontal" w="50vw"/>
            <Stack direction="row" h="100px" w="50vw" p={4} alignItems='center'>
              <Image
                src={
                  cartItem.book?.cover_i
                    ? `https://covers.openlibrary.org/b/id/${cartItem.book.cover_i}.jpg`
                    : noImage
                }
                height="100%"
                objectFit="contain"
              ></Image>
              <Stack>
                <Text>
                  {cartItem.book?.title} de {cartItem.book?.author_name}
                </Text>
                <Text>
                  Quantité: {cartItem.quantity}
                </Text>
              </Stack>

              <Spacer />

               <Flex alignItems="center">
                  <IconButton
                    aria-label="Diminuer la quantité"
                    isRound={true}
                    variant="transparent"
                    fontSize="20px"
                    icon={<MdArrowDownward />}
                    onClick={() => handleQuantityChange(cartItem, -1)}//onChangeQuantity(cartItem, -1)}
                  />
                  <Text mx={2}>{cartItem.quantity}</Text>
                  <IconButton
                    aria-label="Augmenter la quantité"
                    isRound={true}
                    variant="transparent"
                    fontSize="20px"
                    icon={<MdArrowUpward />}
                    onClick={() => handleQuantityChange(cartItem, 1)}//{() => onChangeQuantity(cartItem, 1)}
                  />
                </Flex>


              <IconButton
                aria-label='Supprimer'
                isRound={true}
                variant="transparent"
                fontSize="30px"
                icon={<MdCancel style={{ color: '$blue' }}
                onClick={()=> onDelete(cartItem)}
                />}
              />
            </Stack>
            <Divider orientation="horizontal" w="50vw"/>
          </Fragment>
        ))
      ) : (
        <Text>Votre panier est vide</Text>
      )}
      <Spacer />
      {cartItems && cartItems.length > 0 && (
        <Button onClick={onClear}> Vider </Button>
      )}
    </>
  );
};

export default Cart;
