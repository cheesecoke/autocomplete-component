import React from "react";
import "./App.css";
import AutoComplete from "./components/AutoComplete";

const handleSelect = (result: any) => {
  alert(result.text);
};

const renderResult = (result: any) => {
  return <div>{result.text}</div>;
};

function App() {
  return (
    <div className="App">
      <main>
        <AutoComplete
          renderResult={renderResult}
          onSelect={handleSelect}
          apiUrl="/api/search"
        />
      </main>
    </div>
  );
}

export default App;
