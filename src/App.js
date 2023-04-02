import React, {useState, useEffect} from 'react';
import PokemonList from './PokemonList';
import axios from 'axios';
import Pagination from './Pagination';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);

    function newAbortSignal(timeoutMs) {
      const abortController = new AbortController();
      setTimeout(() => abortController.abort(), timeoutMs || 0);
    
      return abortController.signal;
    }

    axios.get(currentPageUrl, {
      signal: newAbortSignal(5000)
    }).then(res => {
      setLoading(false);
      setNextPageUrl(res.data.next);
      setPrevPageUrl(res.data.previous);
      setPokemon(res.data.results.map(p => p.name))
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      } else {
        // handle error
        console.log('Request I dont know', thrown.message);
      }
    });
  }, [currentPageUrl])

  function gotoNextPage(){
    setCurrentPageUrl(nextPageUrl);
  }

  function gotoPrevPage(){
    setCurrentPageUrl(prevPageUrl);
  }

  if (loading) return "Loading...";

  return (
    <>
      <PokemonList pokemon={pokemon}/>
      <Pagination 
        gotoNextPage={nextPageUrl ? gotoNextPage: null} 
        gotoPrevPage={prevPageUrl ? gotoPrevPage: null} />
    </>
  );
}

export default App;
