/*Количество клеток по вертикали*/
let N = 10,
/*Количество клеток по горизонтали*/
    M = 10;


var field = [100,200,300,400];
d3.select("#field")
  .selectAll("rect")
    .data(field)
  .enter().append("rect")
    .attr('x', function(d) { return d})
    .attr('y', function(d) { return d})
    .attr('width', function(d) { return d/10})
    .attr('height', function(d) { return d/10})
    .attr('class', 'panel')
    .exit().remove();