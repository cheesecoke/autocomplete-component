import React, { useEffect, useState } from "react";
import axios from "axios";

interface Result {
  id: number;
  text: string;
}

interface AutoCompleteProps {
  renderResult: (result: Result) => JSX.Element;
  onSelect: (result: Result) => void;
  apiUrl: string;
  debounceDuration?: number;
  minimumQueryLength?: number;
}

const AutoComplete = ({
  renderResult,
  onSelect,
  apiUrl,
  debounceDuration = 300,
  minimumQueryLength = 3,
}: AutoCompleteProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cache, setCache] = useState<{ [key: string]: Result[] }>({});

  const handleInputChange = (e: any) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length >= minimumQueryLength) {
        if (cache[query]) {
          setResults(cache[query]);
          return;
        }

        setIsLoading(true);
        setError("");

        try {
          const response = await axios.get(apiUrl, { params: { query } });
          setResults(response.data);
          setCache((prevCache) => ({ ...prevCache, [query]: response.data }));
        } catch (error: any) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const debounceTimeout = setTimeout(fetchResults, debounceDuration);
    return () => clearTimeout(debounceTimeout);
  }, [query, apiUrl, debounceDuration, cache, minimumQueryLength]);

  return (
    <div className="relative h-10 w-20">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Type something..."
      />
      {isLoading && (
        <div className="absolute left-0 w-full p-2 bg-blue-500">Loading...</div>
      )}
      {error && (
        <div className="absolute left-0 w-full p-2 bg-red-500">
          Error: {error}
        </div>
      )}
      <div className="absolute left-0 w-full p-2">
        <ul className="bg-white rounded-lg w-full">
          {results.map((result: any) => (
            <li
              key={result.id}
              className="p-2 hover:bg-gray-200"
              onClick={() => onSelect(result)}
            >
              {renderResult(result)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AutoComplete;
