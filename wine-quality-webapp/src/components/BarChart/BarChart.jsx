import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./BarChart.css";

const BarChart = ({ red_wine_dataset, white_wine_dataset }) => {
  const svgRef = useRef();
  const [selectedAttribute, setSelectedAttribute] = useState('fixed_acidity');
  const [selectedWineType, setSelectedWineType] = useState('red');
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  const mheight = height+margin.bottom+40

  const attributes = [
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

  const conclusions = {
    "red": {
      "fixed_acidity": "The fixed acidity values of the red wine are well distributed, from values such as 4.6 to values like 15.9, taking preference on values in range [6.6, 8.3] and reaching it's peak on 7.2 with a count of 67 wine regists.",
      "volatile_acidity": "The volatile acidity values of the red wine are very well distributed, from values such as 0.12 to values like 1.52, taking preference on values in range [0.31, 0.69] and reaching it's peak on 0.6 with a count of 46 wine regists.",
      "citric_acid": "The citric acid values of the red wine are not that well distributed, from values such as 0 to values like 0.79, taking preference on values in range [0, 0.25] and reaching it's peak on 0 with a count of 132 wine regists.",
      "residual_sugar": "The residual sugar values of the red wine are not very well distributed, from values such as 0.9 to values like 15, taking preference on values in range [1.4, 2.8] and reaching it's peak on 2 with a count of 156 wine regists.",
      "chlorides": "The chlorides values of the red wine are very well distributed, from values such as 0.012 to values like 0.611, taking preference on values in range [0.062, 0.095] and reaching it's peak on 0.08 with a count of 66 wine regists.",
      "free_sulfur_dioxide": "The free sulfur dioxide values of the red wine are very well distributed, from values such as 1 to values like 72, taking preference on values in range [5, 15] and reaching it's peak on 6 with a count of 138 wine regists.",
      "total_sulfur_dioxide": "The total sulfur dioxide values of the red wine are very well distributed, from values such as 6 to values like 289, taking preference on values in range [0.996, 0.9994] and reaching it's peak on 28 with a count of 43 wine regists.",
      "density": "The density values of the red wine are very well distributed, from values such as 0.99007 to values like 1.00369, taking preference on values in range [10, 38] and reaching it's peak on 0.9972 with a count of 36 wine regists.",
      "pH": "The ph values of the red wine are very well distributed, from values such as 2.74 to values like 4.01, taking preference on values in range [3.15, 3.42] and reaching it's peak on 7.2 with a count of 67 wine regists.",
      "sulphates": "The sulphates values of the red wine are very well distributed, from values such as 0.33 to values like 2, taking preference on values in range [0.52, 0.63] and reaching it's peak on 0.6 with a count of 69 wine regists.",
      "alcohol": "The alcohol values of the red wine are very well distributed, from values such as 8.4 to values like 14.9, taking preference on values in range [9.2, 11] and reaching it's peak on 9.5 with a count of 139 wine regists.",
      "quality": "The quality values of the red wine are very well distributed, from values like 3 to 8, taking preference on the values 5 and 6 and reaching it's peak on 5 with a count of 681 wine regists.",
    },
    "white": {
      "fixed_acidity": "The fixed acidity values of the white wine are well distributed, from values such as 0 to values like 14.2, taking preference on values in range [6.0, 7.4] and reaching it's peak on 6.8 with a count of 308 wine regists.",
      "volatile_acidity": "The volatile acidity values of the white wine are very well distributed, from values such as 0.08 to values like 1.1, taking preference on values in range [0.16, 0.32] and reaching it's peak on 0.28 with a count of 263 wine regists.",
      "citric_acid": "The citric acid values of the white wine are not that well distributed, from values such as 0 to values like 1.66, taking preference on values in range [0.24, 0.49] and reaching it's peak on 0.3 with a count of 307 wine regists.",
      "residual_sugar": "The residual sugar values of the white wine are not very well distributed, from values such as 0.6 to values like 65.8, taking preference on values in range [1.0, 2.0] and reaching it's peak on 1.2 with a count of 187 wine regists.",
      "chlorides": "The chlorides values of the white wine are very well distributed, from values such as 0.009 to values like 0.346, taking preference on values in range [0.03, 0.056] and reaching it's peak on 0.44 with a count of 182 wine regists.",
      "free_sulfur_dioxide": "The free sulfur dioxide values of the white wine are very well distributed, from values such as 2 to values like 289, taking preference on values in range [17, 45] and reaching it's peak on 29 with a count of 160 wine regists.",
      "total_sulfur_dioxide": "The total sulfur dioxide values of the white wine are very well distributed, from values such as 9 to values like 440, taking preference on values in range [87, 189] and reaching it's peak on 11 with a count of 69 wine regists.",
      "density": "The density values of the white wine are very well distributed, from values such as 0.98711 to values like 1.00369, taking no preference on values and reaching it's peak on 0.992 with a count of 64 wine regists.",
      "pH": "The ph values of the white wine are very well distributed, from values such as 2.72 to values like 3.82, taking preference on values in range [3.04, 3.3] and reaching it's peak on 3.14 with a count of 172 wine regists.",
      "sulphates": "The sulphates values of the white wine are very well distributed, from values such as 0.22 to values like 1.08, taking preference on values in range [0.37, 0.54] and reaching it's peak on 0.5 with a count of 249 wine regists.",
      "alcohol": "The alcohol values of the white wine are very well distributed, from values such as 8 to values like 14.2, taking preference on values in range [9, 10.5] and reaching it's peak on 9.4 with a count of 229 wine regists.",
      "quality": "The quality values of the white wine are very well distributed, from values like 3 to 9, taking preference on the values 5 and 6 and reaching it's peak on 6 with a count of 2198 wine regists.",
    }
  }

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
      attribute: d[selectedAttribute],
      value: +d[selectedAttribute],
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

    console.log(values)

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
      .attr("fill", "#8F1636");

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // X-axis label
    chartGroup
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom)
      .style("text-anchor", "middle")
      .text("Attribute");

    // Y-axis label
    chartGroup
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
      .scaleExtent([1, 40])
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

        const xDomain = xScale.domain().map((d) => {
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
    selectedAttribute,
    selectedWineType,
    red_wine_dataset,
    white_wine_dataset,
  ]);

  return (
    <div className="content pl-20 p-4 shadow-lg rounded-lg bg-white overflow-auto">
      <div className="chart-title">
        <h2>Wine Attribute Distribution</h2>
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
          <label>Attribute:</label>
          <select value={selectedAttribute} onChange={e => setSelectedAttribute(e.target.value)} className="custom-dropdown">
            {attributes.map(char => (
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
        <p>{conclusions[selectedWineType][selectedAttribute]}</p>
      </div>
    </div>
  );
};

export default BarChart;
