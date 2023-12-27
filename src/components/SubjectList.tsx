import { Button, GridItem, List, ListItem } from '@chakra-ui/react'
import React, { useState } from 'react'
import useBooks from '../hooks/useBooks';
import "../stylesheets/SubjectList.scss";

interface SubjectListProps {
    //searchQuery: string;
    onSelectSubject: (subject: string) => void;
  }

const SubjectList = ({onSelectSubject}: SubjectListProps) => {
    const subjects = ["Romance", "Mystery", "Science Fiction", "Fantasy", "Thriller", "Historical Fiction", "Biography", "Self-Help", "Horror", "Educational"]
    const [selectedSubject, setSelectedSubject] = useState('');

    return (
        <List className="subject-list">
            {subjects.map((subject) => (
                <ListItem className="subject" 
                key={subject}>
                    <Button className={selectedSubject === subject ? 'subject-btn-selected' : 'subject-btn'} 
                    onClick={(e)=>{
                        setSelectedSubject(subject);
                        onSelectSubject(subject);
                        }}>
                        {subject}
                    </Button>
                </ListItem>
            ))}
        </List>
  )
}

export default SubjectList