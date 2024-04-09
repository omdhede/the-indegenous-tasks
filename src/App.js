import React, { useState } from 'react';
import axios from 'axios';

const ResearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [isAcademic, setIsAcademic] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    let data = JSON.stringify({
      "keyword": keyword,
      "limit": "10"
    });

    let config = {
      method: 'post',
      url: 'https://api.gyanibooks.com/search_publication/',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      if (Array.isArray(response.data.data)) {
        const processedResults = [];
        for (let i = 0; i < response.data.data.length; i++) {
          let paper = response.data.data[i];
          let authors = paper.authors.map(author => author.name).join(', ');
          let year = '';
          let bibtex = paper.citationStyles?.bibtex;
          if (bibtex) {
            let yearMatch = bibtex.match(/year = {(\d{4})}/);
            year = yearMatch ? yearMatch[1] : 'Year not available';
          }
          processedResults.push({
            paperId: paper.paperId,
            title: paper.title,
            authors,
            year
          });
        }
        setResults(processedResults);
      }
    } catch (error) {
      setError('Failed to fetch results');
      console.error(error);
    }
  };

  return (
    <div className="research-bar">
      <div className="search-area">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search for research..."
        />
        <button onClick={handleSearch}>Search</button>
        <label>
          <input
            type="checkbox"
            checked={isAcademic}
            onChange={(e) => setIsAcademic(e.target.checked)}
          />
          Academic
        </label>
      </div>
      <div className="results-area">
        {results.length > 0 && results.map((result, index) => (
          <div key={result.paperId || index} className="result-item">
            <h3>{result.title}</h3>
            <p>{result.authors}</p>
            <p>Year: {result.year}</p>
          </div>
        ))}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ResearchBar;
