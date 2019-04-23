var data = d3.json("classData.json");
data.then(function(data){
  makeRectangles(data);
},
function(err){

});

margins = {
  top:50,
  bottom:50,
  right:200,
  left:75
}

var makeRectangles = function(penguins)
{
  var width = 1000;
  var height = 800;
  var body = d3.select("body");
  var svg  = body.append("svg")
              .attr("width",width)
              .attr("height",height)
              .classed("svg",true)
              .attr("transform","translate(0,0)");

  var body = d3.select("body");

  var plotWidth = width-margins.left-margins.right;
  var plotHeight = height-margins.top-margins.bottom;

  var rectWidth = plotWidth/penguins.length;
  var rectHeight = plotHeight/penguins.length;

  var legend = svg.append("g");
  data = [-1,-.5,0,.5,1];
  data.forEach(function(d,i){
    legend.append("rect")
    .attr("width",rectWidth)
    .attr("height",rectHeight)
    .attr("x",25*rectWidth+margins.left)
    .attr("y",i*rectHeight+margins.top)
    .attr("fill",d3.interpolateRdBu((d+1)/2))

    legend.append("text").attr("x",26*rectWidth+margins.left+10)
    .attr("y",i*rectHeight+margins.top+.5*rectHeight+5)
    .text(d)


  })




  var yScale = d3.scaleLinear()
              .range([0,plotHeight])
              .domain([0,23]);

  var xScale = d3.scaleLinear()
              .range([0,plotWidth])
              .domain([0,23]);




  penguins.forEach(function(penguin1,i1){
    console.log(penguin1.picture);
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
      var group = svg.append("g")
         .datum(corr)



         group.append("rect")
         .attr("width",rectWidth)
         .attr("height",rectHeight)
         .attr("x",i2*rectWidth+margins.left)
         .attr("y",i1*rectHeight+margins.top)
         .attr("fill",d3.interpolateRdBu((corr+1)/2))





         //.on("mouseout");



    })
    // make y axis label

    svg.append("image")
    .attr("x",25)
    .attr("y",yScale(i1)+margins.top)
    .attr("width",rectWidth)
    .attr("height",rectHeight)
    .attr("href", function(d,i){
      return "penguins/"+penguin1.picture;
    })
    .attr("alt","Penguin Picture");

    svg.append("image")
    .attr("x",xScale(i1)+margins.left)
    .attr("y",10)
    .attr("width",rectWidth)
    .attr("height",rectHeight)
    .attr("href", function(d,i){
      return "penguins/"+penguin1.picture;
    })
    .attr("alt","Penguin Picture");

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
