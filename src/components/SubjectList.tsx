import { Button, GridItem, List, ListItem } from '@chakra-ui/react'
import React from 'react'
import useBooks from '../hooks/useBooks';
import "../stylesheets/SubjectList.scss";

interface SubjectListProps {
    //searchQuery: string;
    onSelectSubject: (subject: string) => void;
  }

const SubjectList = ({onSelectSubject}: SubjectListProps) => {
    const subjects = ["Romance", "Mystery", "Science Fiction", "Fantasy", "Thriller", "Historical Fiction", "Biography", "Self-Help", "Horror", "Educational"]
    //const { books, error, isLoading } = useBooks(searchQuery);

    //for each subject, a list GridItem//when selected update the searchquery
    //https://openlibrary.org/search.json?subject=educational

    return (
        <List className="subject-list">
            {subjects.map((subject) => (
                <ListItem className="subject" key={subject}>
                    <Button className="subject-btn" onClick={()=>onSelectSubject(subject)}>
                        {subject}
                    </Button>
                </ListItem>
            ))}
        </List>
  )
}

export default SubjectList