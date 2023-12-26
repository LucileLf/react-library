import { Flex, List, ListItem } from '@chakra-ui/react'

const GenreList = () => {
  const subjects = ["love", "adventure", "fantasy", "poetry", "adventure"]
  //get /subjects/{subject}
  return (
    <List display="flex" flexDirection="row" gap={3} justifyContent="space-evenly">
        {subjects.map((subject)=> 
            <ListItem borderRadius={2} textAlign='center' fontSize='xl' backgroundColor='rgba(88, 109, 121, 0.69)' width='100%'>{subject}</ListItem>
        )}
    </List>
  )
}

export default GenreList