import React from "react";
import Search from "./components/search";
import { useState, useEffect } from "react";

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero background"/>
            <h1>
              Find <span className="text-gradient">Movies </span>you will Enjoy
              Without the Hassle
            </h1>
          </header>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          <h1 className="text-white">{searchTerm}</h1>
        </div>
      </div>
      <p>Search</p>
    </main>
  );
}
