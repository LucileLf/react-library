// import { GameQuery } from '../App';
// import useData from './useData';

import { useEffect, useState } from "react";

export interface Book {
    key: string;
    title: string;
    cover_i: string;
    author_name: string;
    ratings_average: number, 
    ratings_count: number
  }

// interface FetchResponse<Book> {
//     num_found: number;
//     docs: Book[]
// }

const useBooks = (searchQuery: string) => {
    const [books, setBooks] = useState(null);
    const [ error, setError] = useState('');
    const [ isLoading, setLoading ] = useState(false);
    
    useEffect(() => {
        setLoading(true);
        fetch(`https://openlibrary.org/search.json?q=${searchQuery}&limit=10`)
        .then((response) => response.json())
        .then((books) => {
            setBooks(books.docs.slice(0, 10));
            setLoading(false);
        })
        .catch(err => {
            if (err.name === 'AbortError') return;
            setError(err.message)
            setLoading(false)
        })
    }, [searchQuery])
    return { books, error, isLoading}
}

export default useBooks
