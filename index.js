/*Количество клеток*/
let N = 50,
    cellSize;

var field = [];

let i = 0, j=0, point;

//TODO добавить окраску клетки по наведению удержанной мыши, чтобы можно было "красить"
//с адаптивностью траблы

/*EVENTS*/
window.addEventListener('load', function() {
    setDynamicStyles();
    for( i = 0; i < N; i++) {
        for(j = 0; j < N; j++) {
            point = new Object();
            point.coord = [];
            point.alive = false;
            point.coord.push(i);
            point.coord.push(j);
            field.push(point);
        }
        
    }
    d3.select("#field")
        .selectAll("rect")
          .data(field)
        .enter().append("rect")
          .attr('x', function(d) { return d.coord[1] * cellSize })
          .attr('y', function(d) { return d.coord[0] * cellSize })
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('class', 'panel')
          .attr('fill', 'rgba(0,0,0,.1)')
            .attr('id', function(d,i){ return i})
            .attr('stroke-width', 1)
            .attr('stroke', 'rgba(0,0,0, .7)')
            .text( function(d,i) { return i} )
        .exit().remove();

    Array.from( document.querySelectorAll('rect.panel')).forEach( function(item) {
        item.addEventListener('click', function(e) {
            //console.log(e.target.id);
            //d3.select('#'+e.target.id).attr('fill','rgba(0,0,0,.9)');
            e.target.setAttribute('fill','rgba(0,0,0,.9)');
        });
        
    });
        
});
window.addEventListener('resize', function() {
    setDynamicStyles();
});


