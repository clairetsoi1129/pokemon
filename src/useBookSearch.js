import {useEffect, useState} from 'react';
import axios from 'axios';

const UseBookSearch = (query, pageNumber) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        setLoading(true)
        setError(false)

        const abortController = new AbortController();
        const signal = abortController.signal;

        axios({
            method: 'GET',
            url: 'http://openlibrary.org/search.json',
            params: {q: query, page: pageNumber},
            signal: signal
        }).then(res => {
            setBooks(prevBooks => {
                return [...new Set([...prevBooks, res.data.docs.map(b => b.title)])]
            })
            setHasMore(res.data.docs.length > 0)
            setLoading(false)

            console.log(res.data)
        }).catch(err => {
            if (axios.isCancel(err)) {
                console.log('Request canceled', err.message);
            } else {
                // handle error
                setError(true)
                console.log('Request I dont know', err.message);
            }
        });
        return () => {
            abortController.abort();
          }

    }, [query, pageNumber])

    return {loading, error, books, hasMore};
}

export default UseBookSearch;
