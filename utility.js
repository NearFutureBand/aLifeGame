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
var rise = function(el) {
    el.setAttribute('fill', activeColor);
}

/*Умереть - красит в стоковый цвет*/
var die = function(el) {
    el.setAttribute('fill', stockColor);
}
