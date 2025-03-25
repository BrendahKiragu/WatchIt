import React from "react";
import Search from "./components/search";
import Spinner from "./components/spinner";
import MovieCard from "./components/movieCard";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./components/appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_MOVIE_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export default function App() {
  // states
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // A debouncer to reduce API requests
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  //  fetches movies from tmdb
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies!");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      updateSearchCount();

      console.log(data);
    } catch (error) {
      console.error(`Error fetching movies ${error}`);
      setErrorMessage("Error fetching movies. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  // show movies on page load
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern">
        {/* hero page */}
        <div className="wrapper">
          <header>
            <h2 className="text-gradient text-center">
              <a href="#search">WatchIt®</a>
            </h2>
            <img src="./hero.png" alt="Hero background" />
            <h1>
              Find <span className="text-gradient">Movies </span>you will Enjoy
              Without the Hassle
            </h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {/* Loading, error container / movieCard */}
          <section className="all-movies">
            <h2 className="mt-[40px]">All movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
        {/* footer section */}
        <footer>
          <p className="text-gradient text-center">
            Made with love by Brendah K {new Date().getFullYear()} &copy;
          </p>
        </footer>{" "}
      </div>
    </main>
  );
}
