import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './BarChart.css';

const BarChart = ({ red_wine_dataset, white_wine_dataset }) => {
  const svgRef = useRef();
  const [selectedCharacteristic, setSelectedCharacteristic] = useState('fixed_acidity');
  const [selectedWineType, setSelectedWineType] = useState('red');

  const characteristics = ["fixed_acidity", "volatile_acidity", "citric_acid", "residual_sugar", "chlorides", "free_sulfur_dioxide", "total_sulfur_dioxide", "density", "pH", "sulphates", "alcohol", "quality"];

  useEffect(() => {
    if (!svgRef.current || !red_wine_dataset || !white_wine_dataset) {
      return;
    }

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear any previous SVG elements

    svg.attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom);

    const chartGroup = svg.append("g")
                          .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = selectedWineType === 'red' ? red_wine_dataset : white_wine_dataset;
    const processedData = data.map(d => ({
      characteristic: d[selectedCharacteristic],
      value: +d[selectedCharacteristic]
    }));

    const xScale = d3.scaleBand()
                     .domain(processedData.map(d => d.characteristic))
                     .range([0, width])
                     .padding(0.1);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(processedData, d => d.value)])
                     .range([height, 0]);

    chartGroup.selectAll(".bar")
              .data(processedData)
              .join("rect")
              .attr("class", "bar")
              .attr("x", d => xScale(d.characteristic))
              .attr("y", d => yScale(d.value))
              .attr("width", xScale.bandwidth())
              .attr("height", d => height - yScale(d.value))
              .attr("fill", "#69b3a2");

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
              .attr("transform", `translate(0, ${height})`)
              .call(xAxis);

    chartGroup.append("g")
              .call(yAxis);
  }, [selectedCharacteristic, selectedWineType, red_wine_dataset, white_wine_dataset]);

  return (
    <div className="content pl-20 p-4 shadow-lg rounded-lg bg-white overflow-auto">
      <div>
        <label>Characteristic:</label>
        <select value={selectedCharacteristic} onChange={e => setSelectedCharacteristic(e.target.value)}>
          {characteristics.map(char => (
            <option key={char} value={char}>{char.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Wine Type:</label>
        <select value={selectedWineType} onChange={e => setSelectedWineType(e.target.value)}>
          <option value="red">Red</option>
          <option value="white">White</option>
        </select>
      </div>
      <svg ref={svgRef} style={{ display: "block", margin: "auto" }}></svg>
    </div>
  );
};

export default BarChart;
