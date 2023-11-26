import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './BarChart.css';

const BarChart = ({ red_wine_dataset, white_wine_dataset }) => {
  const svgRef = useRef();
  const [selectedCharacteristic, setSelectedCharacteristic] = useState('fixed_acidity');
  const [selectedWineType, setSelectedWineType] = useState('red');
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  const mheight = height+margin.bottom+150

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
    svg.selectAll("*").remove(); // Clear any previous SVG elements

    svg.attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom);

    const chartGroup = svg.append("g")
                          .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = selectedWineType === 'red' ? red_wine_dataset : white_wine_dataset;
    const processedData = data.map(d => ({
      value: d[selectedCharacteristic]
    }));

    let values_dict = {};
    Object.entries(processedData).forEach(([key, entry])=> {
      console.log(entry)
      if (!values_dict.hasOwnProperty(entry.value)){
        values_dict[entry.value] = 0
      }
      values_dict[entry.value] = values_dict[entry.value]+1
    });

    let values = []
    Object.entries(values_dict).forEach(([k, v]) => {
      values.push({x : k, y: v})
    });

    const xScale = d3.scaleBand()
                     .domain(values.map(d => d.x))
                     .range([0, width])
                     .padding(0.1);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(values, d => d.y)])
                     .range([height, 0]);

    chartGroup.selectAll(".bar")
              .data(values)
              .join("rect")
              .attr("class", "bar")
              .attr("x", d => xScale(d.x))
              .attr("y", d => yScale(d.y))
              .attr("width", xScale.bandwidth())
              .attr("height", d => height - yScale(d.y))
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
