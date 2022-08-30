function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samplesArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = filteredSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = result.otu_ids;
    var otuLabel = result.otu_labels;
    var sampleValues = result.sample_values;

    // create a variable to hold washing frequency
    var washing = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var wfreq = parseFloat(washing[0].wfreq);

    // find the average wfreq
    var sum = 0;
    var count = 0;
    data.metadata.forEach((person) => {
      sum += person.wfreq;
      count += 1;
    });
    var washAvg = (sum/count).toFixed(2);
    console.log(washAvg);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuId.slice(0,10).map(name => ("OTU" + " " + name)).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      type: "bar",
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      orientation: "h",
      text: otuLabel.slice(0,10).reverse(),
      marker: {
        color: "#4F7942"
      }
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      font: {
        family: "Serif",
        color: "292F18"
      }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    //insert reactive text to describe the bar chart
    var barPara = "This bar chart displays the 10 most populous bacteria strains in Subject " + sample + "'s belly button.  In this case, the most "
    + "common strain was " + yticks[9] + ", with a sample value of " + sampleValues[0] + ".  Here OTU stands for Operational Taxonomical Unit, and it"
    + " refers to a group of closely related individuals, though individual bacteria found may vary.";
    d3.select(".desc-bar").text(barPara);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
        x: otuId,
        y: sampleValues,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuId
        },
        text: otuLabel
      }
    ];
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "<b>Bacteria Cultures Per Sample</b>",
        xaxis: {title: "OTU ID"},
        font: {
          family: "Serif",
          color: "292F18"
        }
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    var bubblePara = "The bubble chart above shows the distribution of bacteria strains in Subject " + sample + "'s belly button."
    + "  The size of the circle corresponds to the sample values, while the color is a simple gradient based on OTU.";
    d3.select(".desc-bubble").text(bubblePara);

     // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x: [0, 1], y: [0, 1]},
      value: wfreq,
      title: {
        text: "<b>Belly Button Washing Frequency</b></br></br>Scrubs per Week"
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null,10], tickwidth: 1},
        bar: {color: "black"},
        steps: [
          {range: [0,2], color: "#CD5C5C"},
          {range: [2,4], color: "#FFCC99"},
          {range: [4,6], color: "#FDFD96"},
          {range:[6,8], color: "#B2EC5D"},
          {range: [8,10], color: "#4F7942"}
        ]
      }
    }];
  
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: {
        b: 10,
        l: 40,
        r: 40, 
        t: 10
      },
      font: {
        family: "Serif",
        color: "292F18"
      }
    };

    var washDif = parseFloat(wfreq) - parseFloat(washAvg);
    var more = " more ";
    if (washDif < 0) {
      washDif = washDif * (-1);
      more = " fewer ";
    }

    var gaugePara = "This gauge displays the frequency with which our test subject washed their belly button.  This subject scrubs their belly "
    + "button " + wfreq + " times a week, on average.  The average frequency amongst all test subjects was " + washAvg 
    + " times, putting Subject " + sample + " at " + washDif.toFixed(2) + more + "washes than average.";
    d3.select(".desc-gauge").text(gaugePara);

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
