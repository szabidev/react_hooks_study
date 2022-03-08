import React, { useState, useEffect } from "react";
import axios from "axios";

const Search = () => {
  const [term, setTerm] = useState("programming");
  const [results, setResults] = useState([]);

  // useEffect - first argument is always a function, second argument controlls when the code is executed -empty array, nothing, array with something inside of it. Empty array means - run the code at the initial/first render, No array means - we want to run the function at the first render and after every rerender, Array with value in it - means we want to run the function at the first render and after every rerender IF the data has changed since the last render
  // console.log("I run at every render");

  // console.log(results);
  useEffect(() => {
    // console.log("I run after every render and at initial render");

    // whenever components rerenders and term is changed run the arrow function, also at initial render
    // making axios request here in useEffect() - CANNOT use async and await keywords in useEffect() - there are 3 solutions
    // 1st solution - use an arrow function in useEffect and mark them as async/await - MOSTLY RECOMMENDED
    const search = async () => {
      const { data } = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          origin: "*",
          format: "json",
          // search string
          srsearch: term,
        },
      });
      // updating results state with the data that came back from the api
      setResults(data.query.search);
    };

    // Searching on initial render if term has a default value, checking if there is a term and a result - if not skip the setTimeout function
    // first render
    if (term && !results.length) {
      search();
    } else {
      // Setting a timeout function for search input, so that search will send a get request only when the user stopped typing
      const timeoutId = setTimeout(() => {
        // on first render term is an empty string, this will render without error, checking if there is a search term existing
        if (term) {
          search();
        }
      }, 500);

      // Cancel setTimeout if the users continues to type using useEffect hook - useEffect can only return one thing, a function - cleanup function
      return () => {
        clearTimeout(timeoutId);
      };
    }

    // 2nd solution - IIFE immediatly invoked function expression - just easier readability
    // (async () => {
    //   await axios.get();
    // })();

    // 3rd solution - Promises
    // axios.get().then((response) => {
    //   console.log(response.data);
    // });
  }, [term]);

  // taking results array and mapping through them to make a list
  const renderedResults = results.map((result) => {
    return (
      <div key={result.pageid} className="item">
        <div className="right floated content">
          <a
            href={`https://en.wikipedia.org?curid=${result.pageid}`}
            className="ui button"
            target="_blank"
          >
            Go
          </a>
        </div>
        <div className="content">
          <div className="header">{result.title}</div>
          {/* format text to JSX - this is a hidden feature in React */}
          {/* XXS Attack - Cross site scripting attack - when taking text from a 3rd party ex. API */}
          <span dangerouslySetInnerHTML={{ __html: result.snippet }}></span>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="ui form">
        <div className="field">
          <label>Enter search term</label>
          <input
            className="input"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
      </div>
      {/* rendering a list */}
      <div className="ui celled list">{renderedResults}</div>
    </div>
  );
};

export default Search;
