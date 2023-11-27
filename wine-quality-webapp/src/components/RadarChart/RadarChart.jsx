// RadarChart.jsx
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./RadarChart.css";

const RadarChart = ({ red_wine_dataset, white_wine_dataset }) => {
  const svgRef = useRef();
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState("All");

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    setSelectedValues(
      isChecked
        ? [...selectedValues, value]
        : selectedValues.filter((val) => val !== value)
    );
  };

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
    "All": "With all the qualities selected, we can see that the red wine has higher mean stats than the white wine, in every stat but Residual Sugar, Citric Acid, Alcohol and Free/Total Sulfur Dioxide.",
    3: "In wines with quality 3, the evidencies show that the mean pH and density for the read wine are basicly double of the white wine and for the volatile acidity it is an absurd difference.",
    4: "In wines with qualtiy 4, the same evidencies are shown in quality 3.",
    5: "In wines with qualtiy 5, the same evidencies are shown in quality 3 and 4.",
    6: "In wines with qualtiy 6, the same evidencies are shown, but we can see the sulfur values beign a lot different from the two wines, with the white wine having the bigger values.",
    7: "In wines with qualtiy 7, the same evidencies are shown and we can se that the red wine plot seems half a circle, meaning that the values are very similar in terms of % to the biggest registred.",
    8: "In wines with qualtiy 8, the same evidencies are shown in quality 5 and residual sugar shows as a atributte with stronger values in the white wine.",
    9: "In wines with qualtiy 9, we only have white wine, so we can't compare the two.",
  };

  const combinedQualityValues = Array.from(
    new Set(
      [...red_wine_dataset, ...white_wine_dataset].map((wine) => wine.quality)
    )
  ).sort();

  useEffect(() => {
    const width = 500;
    const height = 400;

    // console.log(selectedValues);
    const extractedRedWineData = extractAttributes(
      red_wine_dataset,
      selectedValues,
      selectedValue
    );
    const extractedWhiteWineData = extractAttributes(
      white_wine_dataset,
      selectedValues,
      selectedValue
    );

    console.log(extractedRedWineData);
    console.log(extractedWhiteWineData);

    const attributes = Object.keys(extractedWhiteWineData[0]);
    const maxValueByAttribute = {};
    const minValueByAttribute = {};

    attributes.forEach((attr) => {
      // Combine red and white wine data for each attribute and find the maximum
      maxValueByAttribute[attr] = d3.max([
        ...extractedRedWineData.map((wine) => wine[attr]),
        ...extractedWhiteWineData.map((wine) => wine[attr]),
      ]);
    });

    attributes.forEach((attr) => {
      // Combine red and white wine data for each attribute and find the maximum
      minValueByAttribute[attr] = d3.min([
        ...extractedRedWineData.map((wine) => wine[attr]),
        ...extractedWhiteWineData.map((wine) => wine[attr]),
      ]);
    });

    console.log(maxValueByAttribute);
    console.log(minValueByAttribute);

    const svg = d3.select(svgRef.current);

    // Calculate the mean values for red and white wines separately
    const meanRedWine = {};
    const meanWhiteWine = {};

    selectedValues.forEach((attr) => {
      meanRedWine[attr] = d3.mean(extractedRedWineData, (wine) => wine[attr]);

      meanWhiteWine[attr] = d3.mean(
        extractedWhiteWineData,
        (wine) => wine[attr]
      );
    });

    console.log(meanRedWine);
    console.log(meanWhiteWine);

    if (selectedValues.length > 2) {
      renderRadarChart(
        svg,
        meanRedWine,
        meanWhiteWine,
        maxValueByAttribute,
        minValueByAttribute,
        width,
        height
      );
    } else {
      svg.selectAll("*").remove();
    }
  }, [selectedValues, selectedValue, red_wine_dataset, white_wine_dataset]);

  return (
    <div className="content p-4 shadow-lg rounded-lg bg-white overflow-auto">
      <div className="chart-title">
        <h2>Wine Attributes Comparison</h2>
      </div>
      <div className="dropdown-container">
        <div className="dropdown">
          <label>Quality Value</label>
          <select
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            className="custom-dropdown"
          >
            <option value="All">All</option>
            {combinedQualityValues.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="legend-item">
        <div className="legend-color red-legend"></div>
        <span className="red-text">Red Wine</span>
      </div>
      <div className="legend-item">
        <div className="legend-color white-legend"></div>
        <span className="white-text">White Wine</span>
      </div>
      <div className="chart-container">
        <div className="chart">
          <svg ref={svgRef} className="chart-svg"></svg>
        </div>
        <div className="checkbox-container">
          {characteristics.map((value) => (
            <label key={value.name}>
              <input
                type="checkbox"
                value={value.key}
                checked={selectedValues.includes(value.key)}
                onChange={handleCheckboxChange}
              />
              {value.name}
            </label>
          ))}
          Select at least 3 attributes
        </div>
      </div>
      <div className="chart-conclusions">
        <h2>Conclusions</h2>
      </div>
      <div className="conclusions">
        <div>{conclusions[selectedValue]}</div>
      </div>
    </div>
  );
};

export default RadarChart;

function extractAttributes(dataset, attributes, selectedValue) {
  return dataset
    .filter((wine) => wine.quality === selectedValue || selectedValue === "All")
    .map((wine) => {
      const extractedAttributes = {};
      attributes.forEach((attr) => {
        extractedAttributes[attr] = Number(wine[attr]);
      });
      return extractedAttributes;
    });
}

function renderRadarChart(
  svg,
  red_data,
  white_data,
  maxValueByAttribute,
  minValueByAttribute,
  width,
  height
) {
  // Define chart parameters
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Clear any existing content
  svg.selectAll("*").remove();

  // Translate the svg to center the radar chart
  const chart = svg
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // Combine red_data and white_data
  const attributes = Object.keys(red_data); // assuming red_data and white_data have the same keys
  const combinedData = [red_data, white_data].map((dataset) =>
    attributes.map((key) => ({ axis: key, value: dataset[key] }))
  );
  console.log(combinedData);
  const angleSlice = (Math.PI * 2) / attributes.length;

  // Create individual scales for each attribute
  const radiusScales = attributes.reduce((scales, attr) => {
    scales[attr] = d3
      .scaleLinear()
      .domain([minValueByAttribute[attr], maxValueByAttribute[attr]])
      .range([0, Math.min(chartWidth, chartHeight) / 2]);
    return scales;
  }, {});

  // Radar Line function
  const radarLine = d3
    .lineRadial()
    .radius((d) => radiusScales[d.axis](d.value))
    .angle((d, i) => i * angleSlice)
    .curve(d3.curveLinearClosed);

  // Draw the radar blobs
  const colors = ["red", "green"]; // colors for each dataset
  combinedData.forEach((data, i) => {
    chart
      .append("path")
      .datum(data)
      .attr("d", radarLine)
      .style("fill", colors[i])
      .style("fill-opacity", 0.3)
      .style("stroke", colors[i])
      .style("stroke-width", 2);
  });

  // Draw grid lines and axes
  const levels = 5; // Number of grid levels
  for (let level = 0; level <= levels; level++) {
    const radius = radiusScales[attributes[0]](
      (maxValueByAttribute[attributes[0]] * level) / levels
    );
    chart
      .selectAll(`.grid-circle-${level}`)
      .data(attributes)
      .enter()
      .append("circle")
      .attr("class", `grid-circle-${level}`)
      .attr("r", radius)
      .style("fill", "none")
      .style("stroke", "#ccc")
      .style("stroke-opacity", 0.5)
      .style("stroke-dasharray", "2,2");
  }

  attributes.forEach((attr, index) => {
    const angle = angleSlice * index - Math.PI / 2;
    const labelRadius = radiusScales[attr](maxValueByAttribute[attr]) + 10; // Add some padding

    chart
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr(
        "x2",
        radiusScales[attr](maxValueByAttribute[attr]) *
          Math.cos(angleSlice * index - Math.PI / 2)
      )
      .attr(
        "y2",
        radiusScales[attr](maxValueByAttribute[attr]) *
          Math.sin(angleSlice * index - Math.PI / 2)
      )
      .style("stroke", "#888")
      .style("stroke-width", "1px");

    chart
      .append("text")
      .attr("class", "radar-chart-label")
      .attr("x", labelRadius * Math.cos(angle))
      .attr("y", labelRadius * Math.sin(angle))
      .attr("dy", "0.35em") // Vertical alignment
      .style(
        "text-anchor",
        angle > Math.PI / 2 && angle < (3 * Math.PI) / 2 ? "end" : null
      ) // Align text
      .style("font-size", "10px") // Set the font size to a smaller value
      .text(attr); // Here the attribute name is set as the text of the SVG text element
  });
}
