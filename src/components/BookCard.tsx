import { Badge, Button, Card, CardBody, Heading, Image, Text, Box, HStack, Flex } from "@chakra-ui/react";
import "../stylesheets/BookCard.scss";
import { Book } from "../hooks/useBooks";
import noImage from '../assets/no-image-placeholder.webp'
import { MdAddShoppingCart } from "react-icons/md";


interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
}

function BookCard({ book, onAddToCart }: BookCardProps) {
  return (
  <Card width="300px">
    <CardBody display='flex' flexDirection='column' alignItems='center' borderRadius={10} height="40vh" width="100%">
      <Image src={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}.jpg` : noImage } height='80%'></Image>
      <Heading fontSize="2xl" whiteSpace='normal'>{book.title}</Heading>
      <Flex flexDirection="column" alignItems="center" width="100%">
          <Text fontSize="2xl" whiteSpace="normal" textAlign="left">
            de {book.author_name}
          </Text>
      </Flex>
      <HStack justifyContent="space-between" width="100%">
        <Box>
          <Badge colorScheme='green'>
            {book.ratings_average}
          </Badge>
          {book.ratings_average ? `(${book.ratings_count} avis)` : "Soyez le premier à laisser votre avis"}
        </Box>
        <Button colorScheme='teal' size='sm' onClick={()=>onAddToCart(book)}> <MdAddShoppingCart /> </Button>
      </HStack>
    </CardBody>
  </Card>
  );
}

export default BookCard;
