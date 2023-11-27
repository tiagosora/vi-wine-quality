import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./components/Home/Home";
import BarChart from "./components/BarChart/BarChart";
import RadarChart from "./components/RadarChart/RadarChart";
import "./App.css";
import papaparse from "papaparse";

function App() {
  const [selectedView, setSelectedView] = useState("2");
  const [red_wine_dataset, setRedWine] = useState(null);
  const [white_wine_dataset, setWhiteWine] = useState(null);

  useEffect(() => {
    if (red_wine_dataset == null && white_wine_dataset == null) {
      let red_values = [];
      papaparse.parse("../data/winequality-red.csv", {
        download: true,
        complete: function (input) {
          for (let i = 0; i < input.data.length; i++) {
            if (i !== 0) {
              red_values.push({
                fixed_acidity: input.data[i][0],
                volatile_acidity: input.data[i][1],
                citric_acid: input.data[i][2],
                residual_sugar: input.data[i][3],
                chlorides: input.data[i][4],
                free_sulfur_dioxide: input.data[i][6],
                total_sulfur_dioxide: input.data[i][7],
                density: input.data[i][7],
                pH: input.data[i][8],
                sulphates: input.data[i][9],
                alcohol: input.data[i][10],
                quality: input.data[i][11],
              });
            }
          }
          setRedWine(red_values);
        },
      });
      let white_values = [];
      papaparse.parse("../data/winequality-white.csv", {
        download: true,
        complete: function (input) {
          for (let i = 0; i < input.data.length; i++) {
            if (i !== 0) {
              white_values.push({
                fixed_acidity: input.data[i][0],
                volatile_acidity: input.data[i][1],
                citric_acid: input.data[i][2],
                residual_sugar: input.data[i][3],
                chlorides: input.data[i][4],
                free_sulfur_dioxide: input.data[i][6],
                total_sulfur_dioxide: input.data[i][7],
                density: input.data[i][7],
                pH: input.data[i][8],
                sulphates: input.data[i][9],
                alcohol: input.data[i][10],
                quality: input.data[i][11],
              });
            }
          }
          setWhiteWine(white_values);
        },
      });
    }
  });

  console.log(white_wine_dataset);

  const handleSelectView = (view) => {
    setSelectedView(view);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={handleSelectView} />
      <div className="content flex-grow p-8 bg-gray-100 overflow-auto">
        {selectedView === "1" && <Home />}
        {selectedView === "2" && (
          <BarChart
            white_wine_dataset={white_wine_dataset}
            red_wine_dataset={red_wine_dataset}
          />
        )}
        {selectedView === "3" && (
          <div className="p-4 shadow-lg rounded-lg bg-white">
            Content for View 3
          </div>
        )}
        {selectedView === "4" && (
          <div className="p-4 shadow-lg rounded-lg bg-white">
            Content for View 4
          </div>
        )}
        {selectedView === "5" && (
          <RadarChart
            white_wine_dataset={white_wine_dataset}
            red_wine_dataset={red_wine_dataset}
          />
        )}
      </div>
    </div>
  );
}

export default App;
