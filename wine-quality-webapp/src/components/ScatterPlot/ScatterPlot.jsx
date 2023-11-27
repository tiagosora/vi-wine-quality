import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./ScatterPlot.css";

const ScatterChart = ({ red_wine_dataset, white_wine_dataset }) => {
  const svgRef = useRef();
  const [selectedCharacteristic, setSelectedCharacteristic] =
    useState("fixed_acidity");
  const [selectedWineType, setSelectedWineType] = useState("red");
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  const mheight = height + margin.bottom + 40;

  const characteristics = [
    { key: "fixed_acidity", name: "Fixed Acidity" },
    { key: "volatile_acidity", name: "Volatile Acidity" },
    { key: "citric_acid", name: "Citric Acid" },
    { key: "residual_sugar", name: "Residual Sugar" },
    { key: "chlorides", name: "Chlorides" },
    { key: "free_sulfur_dioxide", name: "Free Sulfur Dioxide" },
    { key: "total_sulfur_dioxide", name: "Total Sulfur Dioxide" },
    { key: "density", name: "Density" },
    { key: "pH", name: "Potential of Hydrogen (pH)" },
    { key: "sulphates", name: "Sulphates" },
    { key: "alcohol", name: "Alcohol" },
  ];

  const conclusions = {
    red: {
      fixed_acidity:
        "The fixed acidity values of the red wine are well distributed, but show big preference on quality 5 and 6.",
      volatile_acidity:
        "The volatile acidity values of the red wine are very well distributed, are mostly distributed in the quality 5 and 6, taking preference on values in range [0.2, 0.8]",
      citric_acid:
        "The citric acid values of the red wine are well distributed.",
      residual_sugar:
        "The residual sugar values of the red wine are not very well distributed, from values such as 0.9 to values like 15, with most o them in the range [1.5, 4] beign almost all of them in the quality 5 and 6.",
      chlorides:
        "The chlorides values of the red wine are not very well distributed, since for many different quality values, the values are very similar, taking preference on values in range [0.05, 0.15].",
      free_sulfur_dioxide:
        "The free sulfur dioxide values of the red wine are almost 50% on the quality 5 and 30% in quality 6.",
      total_sulfur_dioxide:
        "The total sulfur dioxide values of the red wine not are very well distributed, with the most heavy qualities having some pretty high values that are not very common in the other qualities.",
      density:
        "The density values of the red wine to be basicley the same, not meaning much to quality.",
      pH: "The ph values of the red wine seem the be pretty balaced in most of the qualities.",
      sulphates:
        "The sulphates values of the red wine are very well distributed between the qualities 5, 6, 7 and 8.",
      alcohol:
        "The alcohol values of the red wine are very well distributed between the qualities 4, 5, 6, 7 and 8.",
    },
    white: {
      fixed_acidity:
        "The fixed acidity values of the white wine are well distributed, but show big preference on quality 5,6 and 7, having least apearence on quality 3 and 9",
      volatile_acidity:
        "The volatile acidity values of the white wine are very well distributed, having a lot of quality 8 wines, which is good, since it's the one of the best qualities.",
      citric_acid:
        "The citric acid values of the white wine tend to be 5 and 6 in quality, meaning that it is not the most important attribute.",
      residual_sugar:
        "The residual sugar values of the white wine are very well distributed in most qualities.",
      chlorides:
        "The chlorides values of the white wine are very well distributed in most qualities but have a bigger dispertion on the qualities 5 and 6.",
      free_sulfur_dioxide:
        "The free sulfur dioxide values of the white wine are very well distributed in most qualities.",
      total_sulfur_dioxide:
        "The total sulfur dioxide values of the white wine are very well distributed in most qualities but are more common in the qualities 5 and 6.",
      density:
        "The density values of the white wine are a little bit lower than in the red wine, but are very well distributed in most qualities.",
      pH: "The ph values of the white wine are very well distributed and have a lot of wines in the quality 8, beign a good indicator.",
      sulphates:
        "The sulphates values of the white wine are very well distributed from qualities 4 to 8, meaning it is very volatile as quality attribute.",
      alcohol:
        "The alcohol values of the white wine are very well distributed from qualities 4 to 7.",
    },
  };

  useEffect(() => {
    if (!svgRef.current || !red_wine_dataset || !white_wine_dataset) {
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data =
      selectedWineType === "red" ? red_wine_dataset : white_wine_dataset;

    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => +d[selectedCharacteristic]),
        d3.max(data, (d) => +d[selectedCharacteristic]),
      ])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.quality)])
      .range([height, 0]);

    chartGroup
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d[selectedCharacteristic]))
      .attr("cy", (d) => yScale(d.quality))
      .attr("r", 3)
      .attr("fill", "#8F1636")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6)
          .attr("fill", "orange");
        // Tooltip code here
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 3)
          .attr("fill", "#8F1636");
        // Hide tooltip
      });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    chartGroup
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    chartGroup.append("g").call(yAxis);

    // Axis labels
    chartGroup
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .text(selectedCharacteristic);

    chartGroup
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text("Quality");
  }, [
    selectedCharacteristic,
    selectedWineType,
    red_wine_dataset,
    white_wine_dataset,
  ]);

  return (
    <div className="content pl-20 p-4 shadow-lg rounded-lg bg-white overflow-auto">
      <div className="chart-title">
        <h2>Wine Scatter Attributes</h2>
      </div>
      <div className="dropdown-container">
        <div className="dropdown">
          <label>Wine Type:</label>
          <select
            value={selectedWineType}
            onChange={(e) => setSelectedWineType(e.target.value)}
            className="custom-dropdown"
          >
            <option value="red">Red</option>
            <option value="white">White</option>
          </select>
        </div>
        <div className="dropdown">
          <label>Characteristic:</label>
          <select
            value={selectedCharacteristic}
            onChange={(e) => setSelectedCharacteristic(e.target.value)}
            className="custom-dropdown"
          >
            {characteristics.map((char) => (
              <option key={char.key} value={char.key}>
                {char.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <svg
        ref={svgRef}
        className=""
        style={{ height: mheight, display: "block", margin: "auto" }}
      ></svg>
      <div className="chart-conclusions pb-4">
        <h2>Conclusions</h2>
      </div>
      <div className="conclusions">
        <p>{conclusions[selectedWineType][selectedCharacteristic]}</p>
      </div>
    </div>
  );
};

export default ScatterChart;
