import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./BarChart.css";

const BarChart = ({ red_wine_dataset, white_wine_dataset }) => {
  const svgRef = useRef();
  const [selectedCharacteristic, setSelectedCharacteristic] =
    useState("fixed_acidity");
  const [selectedWineType, setSelectedWineType] = useState("red");

  const characteristics = [
    "fixed_acidity",
    "volatile_acidity",
    "citric_acid",
    "residual_sugar",
    "chlorides",
    "free_sulfur_dioxide",
    "total_sulfur_dioxide",
    "density",
    "pH",
    "sulphates",
    "alcohol",
    "quality",
  ];

  useEffect(() => {
    if (!svgRef.current || !red_wine_dataset || !white_wine_dataset) {
      return;
    }

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

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
    const processedData = data.map((d) => ({
      characteristic: d[selectedCharacteristic],
      value: +d[selectedCharacteristic],
    }));

    const xScale = d3
      .scaleBand()
      .domain(processedData.map((d) => d.characteristic))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(processedData, (d) => d.value)])
      .range([height, 0]);

    // Define a clipping path
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "chart-area")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    // Group for bars with clipping path applied
    const barsGroup = chartGroup
      .append("g")
      .attr("clip-path", "url(#chart-area)");

    barsGroup
      .selectAll(".bar")
      .data(processedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.characteristic))
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.value))
      .attr("fill", "#69b3a2");

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // X-axis label
    const xAxisLabel = chartGroup
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .text("Characteristic");

    // Y-axis label
    const yAxisLabel = chartGroup
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Value");

    const gX = chartGroup
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    chartGroup.append("g").call(yAxis);

    // Inside your useEffect
    const zoom = d3
      .zoom()
      .scaleExtent([1, 20])
      .extent([
        [0, 0],
        [width, height],
      ])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (event) => {
        var t = event.transform;
        xScale.range([0, width].map((d) => t.applyX(d)));
        chartGroup
          .selectAll(".bar")
          .attr("x", (d) => xScale(d.characteristic))
          .attr("width", xScale.bandwidth());
        gX.call(xAxis.scale(xScale));

        // Update x-axis label rotation based on the zoom level
        const zoomLevel = event.transform.k;
        if (zoomLevel <= 2) {
          xAxisLabel.attr("transform", null); // Reset rotation
        } else {
          xAxisLabel.attr(
            "transform",
            `translate(${width / 2},${height + margin.bottom - 10}) rotate(-45)`
          );
        }

        // Check if X-axis goes out of bounds and adjust the domain
        const xDomain = xScale.domain().map((d) => {
          const scaledX = xScale(d);
          if (scaledX < 0) return xScale.invert(0);
          if (scaledX > width) return xScale.invert(width);
          return d;
        });

        xScale.domain(xDomain);
        gX.call(xAxis.scale(xScale));
      });

    svg.call(zoom);

    return () => {
      svg.on(".zoom", null);
    };
  }, [
    selectedCharacteristic,
    selectedWineType,
    red_wine_dataset,
    white_wine_dataset,
  ]);

  return (
    <div className="content pl-20 p-4 shadow-lg rounded-lg bg-white overflow-auto">
      <div>
        <label>Characteristic:</label>
        <select
          value={selectedCharacteristic}
          onChange={(e) => setSelectedCharacteristic(e.target.value)}
        >
          {characteristics.map((char) => (
            <option key={char} value={char}>
              {char.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Wine Type:</label>
        <select
          value={selectedWineType}
          onChange={(e) => setSelectedWineType(e.target.value)}
        >
          <option value="red">Red</option>
          <option value="white">White</option>
        </select>
      </div>
      <svg ref={svgRef} style={{ display: "block", margin: "auto" }}></svg>
    </div>
  );
};

export default BarChart;
