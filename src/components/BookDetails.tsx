import React from "react";
import useBooks, { Book } from "../hooks/useBooks";
import { useParams } from "react-router-dom";
import { BookQuery } from "../App";
import { Card, CardBody, Image, Heading, Flex, Text, Badge, Button } from "@chakra-ui/react";
import noImage from '../assets/no-image-placeholder.webp'
import { MdAddShoppingCart } from "react-icons/md";

interface BookDetailsProps {
    onAddToCart: (book: Book) => void;
  }

const BookDetails = ({onAddToCart}: BookDetailsProps) => {
    const {id} = useParams();
  
    const { books, error, isLoading } = useBooks({subject:"", searchInput: id || ""});

    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Une erreur s'est produite. Réessayez.</Text>;
    if (!books ) return <Text>Une erreur s'est produite. Réessayez.</Text>;
    
    const book: Book = books[0];

    return (
//<Image src={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}.jpg` : noImage } height='80%'></Image>
        <Card width="70vw" margin="auto">
          <CardBody display='flex' flexDirection='row' alignItems='center' borderRadius={10} height="40vh" width="100%">
            <Image flex="1" src={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}.jpg` : noImage }></Image>
            <Flex flexDirection="column" width="45%" marginX="5%" justifyContent="space-between" >
                <Heading fontSize="3xl" whiteSpace='normal' >{book.title}</Heading>
                <Text fontSize="2xl" whiteSpace="normal" textAlign="left">
                  Auteur: {book.author_name}
                </Text>
                <Text fontSize="xl" whiteSpace="normal" textAlign="left">
                  Date: {book.first_publish_year}
                </Text>
                <Flex>  
                    <Badge  fontSize="l" colorScheme='green'>
                    Note: {book.ratings_average}
                    </Badge>
                    {book.ratings_average ? `(${book.ratings_count} avis)` : "Soyez le premier à laisser votre avis"}
                </Flex>
                <Button fontSize="l" marginTop="2vh" width="fit-content" colorScheme='teal' size='sm' onClick={()=>onAddToCart(book)}> <MdAddShoppingCart />  Ajouter au panier</Button>
            
            </Flex>
          </CardBody>
        </Card>
        );
};  

export default BookDetails;
