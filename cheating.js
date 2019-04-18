var data = d3.json("classData.json");
data.then(function(data){
  makeRectangles(data);
},
function(err){

});

margins = {
  top:50,
  bottom:50,
  right:50,
  left:175
}

var makeRectangles = function(penguins)
{
  var width = 800;
  var height = 600;
  var body = d3.select("body");
  var svg  = body.append("svg")
              .attr("width",width)
              .attr("height",height)
              .classed("svg",true);
  var body = d3.select("body");


  var plotWidth = width-margins.left-margins.right;
  var plotHeight = height-margins.top-margins.bottom;

  var yScale = d3.scaleLinear()
              .range([plotHeight,0])
              .domain([0,23]);

  var xScale = d3.scaleLinear()
              .range([0,plotWidth])
              .domain([0,23]);



  var rectWidth = plotWidth/penguins.length;
  var rectHeight = plotHeight/penguins.length;
  penguins.forEach(function(penguin1,i1){
    penguins.forEach(function(penguin2,i2){
      var corr = 0;
      if (penguin1.picture == penguin2.picture)
      {
        corr=1;
      }
      else {
        var peng1HW = getHWArray(penguin1);
        var peng2HW = getHWArray(penguin2);
        corr = calculateCorrelation(peng1HW,peng2HW);
      }
      svg.append("rect")
         .datum(corr)
         .attr("width",rectWidth)
         .attr("height",rectHeight)
         .attr("x",i2*rectWidth+margins.left)
         .attr("y",i1*rectHeight+margins.top)
         .attr("fill",d3.interpolateRdBu((corr+1)/2));



    })
    // make y axis label

    svg.append("text")
    .attr("x",25)
    .attr("y",yScale(i1)+45)
    .text(function(){return penguin1.picture.slice(0,-10)});

    ///make x axis label
  })



}

var getNames = function(penguins)
{
  var names = penguins.map(function(d){
    return d.picture.slice(0,-10);
  })
return names;
}



var calculateCorrelation = function(peng1HW,peng2HW)
{
  meanPeng1 = d3.mean(peng1HW);
  meanPeng2 = d3.mean(peng2HW);
  var devPeng1 = d3.deviation(peng1HW);
  var devPeng2 = d3.deviation(peng2HW);

  var ourSum = peng1HW.reduce(function(total,d,i)
  {
    return (d-meanPeng1)*(peng2HW[i]-meanPeng2)
  },0);
  bottom = devPeng1*devPeng2*(peng1HW.length-1);
  corr = ourSum/bottom;
  return corr;



}




var getHWArray = function(penguin)
{
  hwGrades = penguin.homework.map(function(d)
  {
    return d.grade;
  });
  return hwGrades;
}
