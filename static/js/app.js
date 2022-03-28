
function init() {

//Needed to bypass CORS restrictions when running the Json file locally
//const sampleData = "http://127.0.0.1:8887/samples.json";
const sampleData = "samples.json";
d3.json(sampleData).then(function(data) {
  let resultini= data.samples;
  let resultname= data.names;
  let resultmeta = data.metadata;

  let selectedId = resultname[0]; 
  barChart(selectedId);
  bubbleChart(selectedId);
  demodata(selectedId);
  gauge(selectedId);

let listOTU = d3.select("#selDataset");

resultname.forEach(function(OTU){
  listOTU.append("option").text(OTU);
})

d3.select("#selDataset").on("change", updatePlotly);


function barChart(selectedId)   {

let result = resultini.filter(sampleID => sampleID.id == selectedId);
let sortedOTU = result.sort((a, b) => parseInt(b.sample_values) - parseInt(a.sample_values));
let slicedOTU = sortedOTU.reverse();

let x1 = slicedOTU.map(val => val.sample_values)[0].slice(0,10);
let y1 = slicedOTU.map(val => val.otu_ids)[0].slice(0,10);
let text1 = slicedOTU.map(val => val.otu_labels)[0].slice(0,10);

let ystr =[]
for (j=0;j<y1.length ;j++) {
ystr.push('OTU'+ y1[j]);
}

let trace1 = [
  {
      y: ystr,
      x: x1,
      text: text1,
      type: "bar",
      orientation: "h"
  }
  ];

  let printbar = {
    title: {font: {size: 22}, text: "Top Ten Bacteria Cultures"},
  marging:
  {
t: 10,
b: 10,
l: 10,
r: 10}
  };

Plotly.newPlot("bar", trace1, printbar);
} 

// This function is called when a dropdown menu item is selected
function updatePlotly() {
  let dropdownMenu = d3.select("#selDataset");
  let dataset = dropdownMenu.property("value");
  barChart(dataset);
  bubbleChart(dataset);
  demodata(dataset);
  gauge(dataset);
}


function bubbleChart(selectedId) {

let result = resultini.filter(sampleID => sampleID.id == selectedId);

let x1 = result.map(val => val.otu_ids)[0];
let y1 = result.map(val => val.sample_values)[0];
let text1 = result.map(val => val.otu_labels)[0];

  var trace1 = {
    x: x1,
    y: y1,
    text: text1,
    mode: 'markers',
    marker: {
      size: y1,
      color:x1,
      sizemode:'area',
      sizeref: .05
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: 'OTU Sample',
    xaxis: {
      title:'OTU IDs',},
    showlegend: false,
    height: 600,
    width: 1200
  };
  
  Plotly.newPlot('bubble', data, layout);

}

function demodata(selectedId) {

  let result= resultmeta.filter(sampleID => sampleID.id == selectedId);
  
  let ethnicity = result.map(val => val.ethnicity)[0];
  let eth = d3.select("#eth").text(ethnicity);
  let gender = result.map(val => val.gender)[0];
  let gen = d3.select("#gen").text(gender);
  let age = result.map(val => val.age)[0];
  let ag = d3.select("#ag").text(age);
  let location = result.map(val => val.location)[0];
  let loc = d3.select("#loc").text(location);
  let wfreq = result.map(val => val.wfreq)[0];
  let wfr = d3.select("#wfr").text(wfreq);
  let bbtype = result.map(val => val.bbtype)[0];
  let bbt= d3.select("#bbt").text(bbtype);
  let sampleID = result.map(val => val.id)[0];
  let samp = d3.select("#sampid").text(sampleID);
}

////////////BONUS/////////////
function gauge(selectedId) {
let result= resultmeta.filter(sampleID => sampleID.id == selectedId);
let wfreq = result.map(val => val.wfreq)[0];


let data = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: wfreq,
    title: "Belly Button Washing Frequency<br>Scrubs per Week",
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: { range: [0,9], dtick: 1, },

      steps: [
       { range: [0, 2], color: "lightgray" },
       { range: [1, 3], color: "lavender" },
       { range: [2, 4], color: "lightgray" },
       { range: [3, 5], color: "lavender" },
       { range: [4, 6], color: "lightgray" },
       { range: [5, 7], color: "lavender" },
       { range: [6, 8], color: "lightgray" },
       { range: [7, 9], color: "lavender" },
       { range: [8, 10], color: "lightgray" }
      ],

    }
  }
];

var layout = { width: 380, height: 300, margin: { t: 0, b: 0 } };
Plotly.newPlot('gauge', data, layout);
}
////////////////////////////////
});
}

init();
