import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./BarChart.css";

const BarChart = ({ red_wine_dataset, white_wine_dataset }) => {
  const svgRef = useRef();
  const [selectedCharacteristic, setSelectedCharacteristic] = useState('fixed_acidity');
  const [selectedWineType, setSelectedWineType] = useState('red');
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  const mheight = height+margin.bottom+40

  const characteristics = [
    {key: "fixed_acidity", name: "Fixed Acidity"},
    {key: "volatile_acidity", name: "Volatile Acidity"},
    {key: "citric_acid", name: "Citric Acid"},
    {key: "residual_sugar", name: "Residual Sugar"},
    {key: "chlorides", name: "Chlorides"},
    {key: "free_sulfur_dioxide", name: "Free Sulfur Dioxide"},
    {key: "total_sulfur_dioxide", name: "Total Sulfur Dioxide"},
    {key: "density", name: "Density"},
    {key: "pH", name: "Potential of Hydrogen (pH)"},
    {key: "sulphates", name: "Sulphates"},
    {key: "alcohol", name: "Alcohol"},
    {key: "quality", name: "Quality"},
  ];

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
    const processedData = data.map((d) => ({
      characteristic: d[selectedCharacteristic],
      value: +d[selectedCharacteristic],
    }));

    let values_dict = {};
    Object.entries(processedData).forEach(([key, entry])=> {
      if (!values_dict.hasOwnProperty(entry.value)){
        values_dict[entry.value] = 0
      }
      values_dict[entry.value] = values_dict[entry.value]+1
    });

    let values = []
    Object.entries(values_dict).forEach(([k, v]) => {
      values.push({x : k, y: v})
    });

    values.sort(function(a,b) {
      return a.x-b.x
    });

    const xScale = d3
      .scaleBand()
      .domain(values.map((d) => d.x))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(values, (d) => d.y)])
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
      .data(values)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.x))
      .attr("y", (d) => yScale(d.y))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.y))
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
          .attr("x", (d) => xScale(d.x))
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
          // const scaledX = xScale(d);
          // if (scaledX < 0) return xScale.invert(0);
          // if (scaledX > width) return xScale.invert(width);
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
      <div className="chart-title">
        <h2>Wine Attributes</h2>
      </div>
      <div className="dropdown-container">
        <div className="dropdown">
          <label>Wine Type:</label>
          <select value={selectedWineType} onChange={e => setSelectedWineType(e.target.value)} className="custom-dropdown">
            <option value="red">Red</option>
            <option value="white">White</option>
          </select>
        </div>
        <div className="dropdown">
          <label>Characteristic:</label>
          <select value={selectedCharacteristic} onChange={e => setSelectedCharacteristic(e.target.value)} className="custom-dropdown">
            {characteristics.map(char => (
              <option key={char.key} value={char.key}>{char.name}</option>
            ))}
          </select>
        </div>
      </div>
      <svg ref={svgRef} className="" style={{ height: mheight, display: "block", margin: "auto" }}></svg>
      <div className="chart-conclusions pb-4">
        <h2>Conclusions</h2>
      </div>
      <div className="conclusions">
        <p></p>
      </div>
    </div>
  );
};

export default BarChart;
