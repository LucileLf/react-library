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
import { MdCancel } from "react-icons/md";
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

      
const Cart = ({ cartItems, cartItemsCount, onDelete, onClear, setCartItems }: CartProps) => {
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
}, []);

  console.log(cartItems);

  return (
    <>
      <Heading>Panier ({cartItemsCount})</Heading>
      {cartItems && cartItems.length > 0 ? (
        cartItems.map((cartItem) => (
          <Fragment key={cartItem.cartitem_id}>
            <Divider orientation="horizontal" />
            <Stack direction="row" h="100px" p={4} alignItems='center'>
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
            <Divider orientation="horizontal" />
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
