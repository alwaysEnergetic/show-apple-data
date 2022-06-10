import logo from "./logo.svg";
import "./App.css";
import { useCallback, useEffect, useState } from "react";

const defaultWords = ["A", "B", "C", "D", "E"];

function App() {
  const [words, setWords] = useState(defaultWords);

  useEffect(() => {
    const timer = setInterval(() => {
      const tempWords = [...words];
      const popWord = tempWords.shift();
      if (words.length <= 5) tempWords.push(popWord);
      setWords(tempWords);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  });

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const fetchWords = async (input) => {
    if (!!input) {
      fetch(`https://itunes.apple.com/search?term=${input}`)
        .then((response) => response.json())
        .then((response) => {
          const filteredWords = response.results
            .map((el) => el.collectionName)
            .sort()
            .slice(0, 5);
          setWords([...words, ...filteredWords]);
        });
    } else {
      setWords(defaultWords);
    }
  };

  const handleChange = useCallback(debounce(fetchWords));

  return (
    <div className="Container">
      <input
        type="text"
        placeholder="Search Band"
        onChange={(e) => handleChange(e.target.value)}
      />
      <div className="Words">
        {words.slice(0, 5).map((word, index) => (
          <p key={index}>{word}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
