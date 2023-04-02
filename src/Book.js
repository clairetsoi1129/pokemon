import React, {useState, useEffect, useRef, useCallback} from 'react';
import useBookSearch from './useBookSearch';

const Book = () => {
    const [query, setQuery] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const {
        books, hasMore, loading, error
    } = useBookSearch(query, pageNumber);


    const observer = useRef()
    const lastBookElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore){
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    // if (loading) return "Loading...";

    function handleSearch(e){
        setQuery(e.target.value);
        setPageNumber(1);
    }
    return (
        <div>
            <input type="text" value={query} onChange={handleSearch}></input>
            {books.map((book, index) => {
                if (books.length === index + 1){
                    return <div ref={lastBookElementRef} key={book}>{book}<br/></div>
                } else {
                    return <div key={book}>{book}<br/></div>
                }
            })}
            <div>{loading && 'Loading...'}</div>
            <div>{error && 'Error'}</div>
            
        </div>
    );
}

export default Book;
