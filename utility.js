
var setDynamicStyles = function() {
    
    cellSize = Math.floor( ( ( innerHeight <= innerWidth )? innerHeight : innerHeight ) / N);
    d3.select('#field')
        .attr('width', cellSize * N)
        .attr('height', cellSize * N)
        .selectAll('rect')
            .data(field)
            .attr('x', function(d) { return d.coord[1] * cellSize })
            .attr('y', function(d) { return d.coord[0] * cellSize })
            .attr('width', cellSize)
            .attr('height', cellSize);
}

/*Возродить - красит в активный цвет*/
var rise = function(id) {
    field[id].alive = 1;
    document.getElementById(id).setAttribute('fill', activeColor);
}

/*Умереть - красит в стоковый цвет*/
var die = function(id) {
    field[id].alive = 0;
    document.getElementById(id).setAttribute('fill', stockColor);
}

var coordToId = function(i,j) {
    return i * N + j;
}

/*Принимает одну координату*/
var checkCoord = function( coord) {
    coord = (coord > -1)? coord : N - 2;
    coord = (coord < N)? coord : 1;
    return coord;
}

var resetCheck = function() {
    field.forEach( function(item) {
        item.checked = false;  
    });
}
