import { SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import useBooks, { Book } from "../hooks/useBooks";
import "../stylesheets/BookGrid.scss";
import BookCard from "./BookCard";
import BookCardSkeleton from "./BookCardSkeleton";
import GameCardContainer from "./GameCardContainer";
import { BookQuery } from "../App";
import { Link } from "react-router-dom";

interface BookGridProps {
  bookQuery: BookQuery;
  onAddToCart: (book: Book) => void;
}

//destructuring BookGridProps
function BookGrid({ bookQuery, onAddToCart }: BookGridProps) {
  const { books, error, isLoading } = useBooks(bookQuery, [bookQuery]);
  const array = [1, 2, 3, 4, 5, 6];

  //if (searchQuery==="") return <Text>Effectuez une recherche.</Text>;
  if (error) return <Text>Une erreur s'est produite. Réessayez.</Text>;

  return (
    <SimpleGrid
      columns={{
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
      }}
      padding="10px"
      spacing={6}
    >
      {/* {isLoading && <Spinner/>} */}
      {isLoading &&
        array.map((skeleton) => (
          // <GameCardContainer>
            <BookCardSkeleton key={skeleton}/>
          // </GameCardContainer>
        ))}
        
      {books &&
        (books as Book[]).map((book) => (
          // <GameCardContainer>
          //<Link to={'/books' + book.key} key={book.key}>
            <BookCard key={book.key} book={book} onAddToCart={onAddToCart} />
          //</Link>
          // </GameCardContainer>
        ))}
    </SimpleGrid>
  );
}

export default BookGrid;
