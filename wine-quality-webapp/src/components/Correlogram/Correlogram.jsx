import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./Correlogram.css";

const Correlogram = ({
  correlation_red_wine_dataset,
  correlation_white_wine_dataset,
}) => {
  const svgRef = useRef();
  const [selectedWineType, setSelectedWineType] = useState("red");
  const datasets = {
    red: correlation_red_wine_dataset,
    white: correlation_white_wine_dataset,
  };
  const attributeAbbreviations = {
    "fixed acidity": "FA",
    "volatile acidity": "VA",
    "citric acid": "CA",
    "residual sugar": "RS",
    chlorides: "C",
    "free sulfur dioxide": "FSD",
    "total sulfur dioxide": "TSD",
    density: "D",
    pH: "pH",
    sulphates: "S",
    alcohol: "A",
    quality: "Q",
  };
  
  const conclusions = {
    "red": "In red wine, the Alcool and the Sulphates are the attributes that have the highest correlation with the quality of the wine. The higher the Alcool and the Sulphates, the higher the quality of the wine. On the other hand, the Volatile Acidity and the Free/Total Sulfur Dioxide are the attributes that have the lowest correlation with the quality of the wine. The higher the Volatile Acidity and the Free/Total Sulfur Dioxide, the lower the quality of the wine.",
    "white":
      "In the white wine, the Alcool is the only attribute that have the high correlation with the quality of the wine. The higher the Alcool, the higher the quality of the wine. On the other hand, the Density, the Chlorides, Volatile Acidity and the Total Sulfur Dioxide are the attributes that have the lowest correlation with the quality of the wine. The higher they are, the lower the quality of the wine.",
  };

  useEffect(() => {
    const data = datasets[selectedWineType];
    if (!data) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 10, right: 50, bottom: 10, left: 20 };
    const size = 800;
    const svgSize = size + margin.left + margin.right;
    const cellSize = size / Math.sqrt(data.length);

    const svg = d3
      .select(svgRef.current)
      .attr("width", svgSize)
      .attr("height", svgSize)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg
      .append("rect")
      .attr("width", size)
      .attr("height", size)
      .style("fill", "#F3F4F6");

    const attributes = Array.from(new Set(data.map((d) => d.x)));
    const xScale = d3
      .scalePoint()
      .range([0, size - margin.left - margin.right])
      .domain(attributes)
      .padding(1);

    const colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([-1, 1]);

    svg
      .selectAll(".correlation")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "correlation")
      .attr("transform", (d) => `translate(${xScale(d.x)},${xScale(d.y)})`)
      .each(function (d, i) {
        const group = d3.select(this);
        if (d.x !== d.y) {
          group
            .append("circle")
            .attr("cx", cellSize / 2)
            .attr("cy", cellSize / 2)
            .attr("r", cellSize / 4)
            .style("fill", colorScale(-d.value));
          group
            .append("text")
            .attr("x", cellSize / 2)
            .attr("y", (3 * cellSize) / 6)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("font-size", 12)
            .text(parseFloat(d.value).toFixed(2));
        } else {
          group
            .append("text")
            .attr("x", cellSize / 2)
            .attr("y", cellSize / 2)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(attributeAbbreviations[d.x]);
        }
      });

    // Color Bar
    const defs = svg.append("defs");
    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "linear-gradient");

    linearGradient
      .selectAll("stop")
      .data(
        colorScale
          .ticks()
          .map((t, i, n) => ({
            offset: `${(100 * i) / n.length}%`,
            color: colorScale(-t),
          }))
      )
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    svg
      .append("rect")
      .attr("width", size)
      .attr("height", 20)
      .attr("y", size + 5)
      .style("fill", "url(#linear-gradient)");
  }, [selectedWineType, datasets]);

  return (
    <div className="content p-4 shadow-lg rounded-lg bg-white overflow-auto">
      <div className="correlogram-chart-title">
        <h2>Wine Attributes Correlation</h2>
      </div>
      <div className="correlogram-dropdown-container">
        <div className="correlogram-dropdown">
          <label>Wine Type:</label>
          <select
            value={selectedWineType}
            onChange={(e) => setSelectedWineType(e.target.value)}
            className="correlogram-custom-dropdown"
          >
            <option value="red">Red Wine</option>
            <option value="white">White Wine</option>
          </select>
        </div>
      </div>
      <div className="flex">
        <svg ref={svgRef} style={{}}/>
        <div
          className="flex mt-2 bg-gray-100 p-10 h-96"
          style={{ "border-radius": "5px" }}
        >
          <div
            className="legend pr-10"
            style={{ "text-align": "center", "border-radius": "5px" }}
          >
            <p>FA</p>
            <p>VA</p>
            <p>CA</p>
            <p>RS</p>
            <p>C</p>
            <p>FSD</p>
            <p>TSD</p>
            <p>D</p>
            <p>pH</p>
            <p>S</p>
            <p>A</p>
            <p>Q</p>
          </div>
          <div className="legend">
            <p>Fixed Acidity</p>
            <p>Volatile Acidity</p>
            <p>Citric Acid</p>
            <p>Residual Sugar</p>
            <p>Chlorides</p>
            <p>Free Sulfur Dioxide</p>
            <p>Total Sulfur Dioxide</p>
            <p>Density</p>
            <p>Potential of Hydrogen</p>
            <p>Sulphates</p>
            <p>Alcohol</p>
            <p>Quality</p>
          </div>
        </div>
      </div>
      <div className="chart-conclusions pb-4">
        <h2>Conclusions</h2>
      </div>
      <div className="conclusions">
        <p>{String(conclusions[selectedWineType])}</p>
      </div>
    </div>
  );
};

export default Correlogram;
