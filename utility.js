var setDynamicStyles = function() {
    d3.select('#field')
        .attr('width', innerWidth)
        .attr('height', innerHeight);
    cellSize = Math.floor( ( ( innerHeight <= innerWidth )? innerHeight : innerHeight ) / N);
}