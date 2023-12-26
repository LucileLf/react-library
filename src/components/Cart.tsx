import {
  Stack,
  Divider,
  Text,
  Button,
  Image,
  Spacer,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { Book } from "../hooks/useBooks";
import { MdCancel } from "react-icons/md";
import noImage from '../assets/no-image-placeholder.webp'
import '../stylesheets/variables.scss';
import { Fragment } from "react";

interface CartProps {
  cartItems: Book[] | null;
  onDelete: (book: Book)=>void;
  onClear: () => void;
}

const Cart = ({ cartItems, onDelete, onClear }: CartProps) => {
  return (
    <>
      <Heading>Panier</Heading>
      {cartItems && cartItems.length > 0 ? (
        cartItems.map((book) => (
          <Fragment key={book.key}>
            <Divider orientation="horizontal" />
            <Stack direction="row" h="100px" p={4} alignItems='center'>
              <Image
                src={
                  book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}.jpg`
                    : noImage
                }
                height="100%"
                objectFit="contain"
              ></Image>
              <Text>
                {book.title} de {book.author_name}
              </Text>
              <IconButton
                aria-label='Supprimer'
                isRound={true}
                variant="transparent"
                fontSize="30px"
                icon={<MdCancel style={{ color: '$blue' }}
                onClick={()=> onDelete(book)}
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
