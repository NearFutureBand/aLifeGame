var setDynamicStyles = function() {
    
    cellSize = Math.floor( ( ( innerHeight <= innerWidth )? innerHeight : innerHeight ) / N);
    d3.select('#field')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .selectAll('rect')
            .data(field)
            .attr('x', function(d) { return d.coord[1] * cellSize })
            .attr('y', function(d) { return d.coord[0] * cellSize })
            .attr('width', cellSize)
            .attr('height', cellSize);
        
    
}