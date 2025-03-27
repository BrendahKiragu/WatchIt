import React from "react";
import Search from "./components/search";
import Spinner from "./components/spinner";
import MovieCard from "./components/movieCard";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import { SearchUpdate, MostSearchedMovies } from "./components/appwrite";

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
  const [trendingMovies, setTrendingMovies] = useState([]);

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
      console.log("here are your results", data);

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies!");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      // tracks the number of time a movie has been searched
      if (query && data.results.length > 0) {
        await SearchUpdate(query, data.results[0]);
      }
      MostSearchedMovies();

      console.log(data);
    } catch (error) {
      console.error(`Error fetching movies ${error}`);
      setErrorMessage("Error fetching movies. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  // fetches trending movies
  const fetchTrendingMovies = async () => {
    try {
      const movies = await MostSearchedMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies", error);
    }
  };

  // Loads Movies based on search term
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Loads Trending Movies
  useEffect(() => {
    fetchTrendingMovies();
  }, []);

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

          {/* For the Trending Movies */}
          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Loading, error container / movieCard */}
          <section className="all-movies">
            <h2>All movies</h2>
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
