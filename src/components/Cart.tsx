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
import { Fragment } from "react";
import { CartItem } from "../App";

interface CartProps {
  cartItems: CartItem[] | null;
  cartItemsCount: number;
  onDelete: (book: Book)=>void;
  onClear: () => void;
}

const Cart = ({ cartItems, cartItemsCount, onDelete, onClear }: CartProps) => {
  return (
    <>
      <Heading>Panier ({cartItemsCount})</Heading>
      {cartItems && cartItems.length > 0 ? (
        cartItems.map((cartItem) => (
          <Fragment key={cartItem.book.key}>
            <Divider orientation="horizontal" />
            <Stack direction="row" h="100px" p={4} alignItems='center'>
              <Image
                src={
                  cartItem.book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${cartItem.book.cover_i}.jpg`
                    : noImage
                }
                height="100%"
                objectFit="contain"
              ></Image>
              <Stack>
                <Text>
                  {cartItem.book.title} de {cartItem.book.author_name}
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
                onClick={()=> onDelete(cartItem.book)}
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
