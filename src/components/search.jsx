import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const targetSection = document.getElementById("all-movie");
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // For the search image
  const handleClick = (e) => {
    e.preventDefault();
    const targetSection = document.getElementById("all-movies");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="search">
      <div>
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          id="search"
        />
        <img src="./search.svg" alt="Search icon" onClick={handleClick} />
      </div>
    </div>
  );
};

export default Search;
