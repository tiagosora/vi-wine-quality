import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./components/Home/Home";
import Correlogram from "./components/Correlogram/Correlogram";
import BarChart from "./components/BarChart/BarChart";
import RadarChart from "./components/RadarChart/RadarChart";
import "./App.css";
import papaparse from "papaparse";
import ScatterChart from "./components/ScatterPlot/ScatterPlot";

function App() {
  const [selectedView, setSelectedView] = useState("1");
  const [red_wine_dataset, setRedWine] = useState(null);
  const [white_wine_dataset, setWhiteWine] = useState(null);
  const [correlation_red_wine_dataset, setCorrelationRedWine] = useState(null);
  const [correlation_white_wine_dataset, setCorrelationWhiteWine] =
    useState(null);

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
      let correlation_red_values = [];
      papaparse.parse("../data/correlation_red_wine_dataset.csv", {
        download: true,
        complete: function (input) {
          let parameters = [
            "fixed acidity",
            "volatile acidity",
            "citric acid",
            "residual sugar",
            "chlorides",
            "free sulfur dioxide",
            "total sulfur dioxide",
            "density",
            "pH",
            "sulphates",
            "alcohol",
            "quality",
          ];
          for (let i = 0; i < input.data.length; i++) {
            if (i !== 0) {
              let x = input.data[i][0];
              for (let j = 1; j < input.data[i].length; j++) {
                correlation_red_values.push({
                  x: x,
                  y: parameters[j - 1],
                  value: input.data[i][j],
                });
              }
            }
          }
          setCorrelationRedWine(correlation_red_values);
        },
      });
      let correlation_white_values = [];
      papaparse.parse("../data/correlation_white_wine_dataset.csv", {
        download: true,
        complete: function (input) {
          let parameters = [
            "fixed acidity",
            "volatile acidity",
            "citric acid",
            "residual sugar",
            "chlorides",
            "free sulfur dioxide",
            "total sulfur dioxide",
            "density",
            "pH",
            "sulphates",
            "alcohol",
            "quality",
          ];
          for (let i = 0; i < input.data.length; i++) {
            if (i !== 0) {
              let x = input.data[i][0];
              for (let j = 1; j < input.data[i].length; j++) {
                correlation_white_values.push({
                  x: x,
                  y: parameters[j - 1],
                  value: input.data[i][j],
                });
              }
            }
          }
          setCorrelationWhiteWine(correlation_white_values);
        },
      });
    }
  });

  // console.log(correlation_red_wine_dataset)

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
          <ScatterChart
            white_wine_dataset={white_wine_dataset}
            red_wine_dataset={red_wine_dataset}
          ></ScatterChart>
        )}
        {selectedView === "4" && (
          <Correlogram
            correlation_red_wine_dataset={correlation_red_wine_dataset}
            correlation_white_wine_dataset={correlation_white_wine_dataset}
          />
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
