import {useEffect, useState} from 'react';
import axios from 'axios';
import PokemonList from './PokemonList';
import Pagination from './Pagination';

const Pokemon = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [pokemon, setPokemon] = useState([]);
    const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon");
    const [nextPageUrl, setNextPageUrl] = useState();
    const [prevPageUrl, setPrevPageUrl] = useState();

    useEffect(() => {
        setLoading(true)
        setError(false)

        const abortController = new AbortController();
        const signal = abortController.signal;

        axios({
            method: 'GET',
            url: currentPageUrl,
            signal: signal
        }).then(res => {
            setNextPageUrl(res.data.next);
            setPrevPageUrl(res.data.previous);
            setPokemon(res.data.results.map(p => p.name));
            setLoading(false);

            console.log(res.data);
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

    }, [currentPageUrl])

    function gotoNextPage(){
        setCurrentPageUrl(nextPageUrl);
    }

    function gotoPrevPage(){
        setCurrentPageUrl(prevPageUrl);
    }

    return (
        <>
          <div>{loading && 'Loading...'}</div>
          <div>{error && 'Error'}</div>
          <PokemonList pokemon={pokemon}/>
          <Pagination 
            gotoNextPage={nextPageUrl ? gotoNextPage : null} 
            gotoPrevPage={prevPageUrl ? gotoPrevPage : null} />
        </>
      );
}

export default Pokemon;
