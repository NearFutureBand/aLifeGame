/*Количество клеток*/
let N = 10,
/*Размер клетки в пикселях*/
    cellSize,
/**/
    i = 0,
    j = 0,
/*Объект, описывающи одну клетку*/
    point,
/*Переменная для отслеживания нажатой мыши*/
    mousedown = false,
/*Цвет 'мёртвой' клетки*/
    stockColor = 'rgba(0,0,0,.1)',
/*Цвет 'живой' клетки*/
    activeColor = 'rgba(0,0,0,.9)';
    
/*Массив, содержащий всё поле*/
var field = [];

//TODO добавить окраску клетки по наведению удержанной мыши, чтобы можно было "красить"
//вынести перерисовку в отдельную функцию
//вынести логику расчетов в отдельную функцию

/*EVENTS*/
window.addEventListener('load', function() {
    setDynamicStyles();
    
    /*Создание и заполнени поля*/
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
    
    /*создание dom-элементов*/
    d3.select("#field")
        .on('mousedown', function() {
            mousedown = true;
        })
        .on('mouseup', function() {
            mousedown = false;
        })
        .selectAll("rect")
          .data(field)
        .enter().append("rect")
          .attr('x', function(d) { return d.coord[1] * cellSize })
          .attr('y', function(d) { return d.coord[0] * cellSize })
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('class', 'panel')
          .attr('fill', stockColor)
            .attr('id', function(d,i){ return i})
            .attr('stroke-width', 1)
            .attr('stroke', 'rgba(0,0,0, .7)')
            .on('mousemove', function(d, i) {
                if(mousedown) {
                    this.setAttribute('fill', activeColor);
                }
            })
            .on('click', function() {
                this.setAttribute('fill', ( this.getAttribute('fill') == activeColor? stockColor : activeColor));
            })
        .exit().remove();      
});
window.addEventListener('resize', function() {
    setDynamicStyles();
});

var rise = function(el) {
    el.setAttribute('fill', stockColor);
}
var die = function(el) {
    el.setAttribute('fill', activeColor);
}

