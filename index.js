/*Количество клеток*/
let N = 6,
/*Размер клетки в пикселях*/
    cellSize,
/**/
    i = 0,
    j = 0,
/*Переменная для отслеживания нажатой мыши*/
    mousedown = false,
/*Цвет 'мёртвой' клетки*/
    stockColor = 'rgba(0,0,0,.1)',
/*Цвет 'живой' клетки*/
    activeColor = 'rgba(0,0,0,.9)',
/*Точка для просмотра соседей*/    
    currentPoint = [0,0],
/*Объект для просмотра соседей*/
    currentCell = {},
/*Количество живых соседей*/
    living = 0;
    
/*Массив, содержащий всё поле*/
var field = [];
/*Массив для просмотров соседей*/
var dir = [];

//TODO
//вынести логику расчетов в отдельную функцию
//добавить функцию очистки всего поля
//создать нэймспейс

/*EVENTS*/
window.addEventListener('load', function() {
        
    initField();
    
    initDirectionsArray();
    
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
          /*.attr('x', function(d) { return d.coord[1] * cellSize })
          .attr('y', function(d) { return d.coord[0] * cellSize })
          .attr('width', cellSize)
          .attr('height', cellSize)*/
          .attr('class', 'panel')
          .attr('fill', stockColor)
            .attr('id', function(d,i){ return i})
            .attr('stroke-width', 1)
            .attr('stroke', 'rgba(0,0,0, .7)')
            .on('mousemove', function(d) {
                if(mousedown) {
                    this.setAttribute('fill', activeColor);
                    d.alive = 1;
                }
            })
            .on('click', function(d) {
                this.setAttribute('fill', ( this.getAttribute('fill') == activeColor? stockColor : activeColor));
                d.alive = !d.alive;
            })
        .exit().remove();
    setDynamicStyles();
});
window.addEventListener('resize', function() {
    setDynamicStyles();
});

var update = function() {    
    
    /*Цикл по всем клеткам поля*/
    field.forEach( function(cell) {
        
        living = 0;
        /*цикл по всем направлениям*/
        dir.forEach( function(d) {
            currentPoint = [0,0];
            currentCell = {};
            
            /*Цикл по двум координатам*/
            cell.coord.forEach( function(c, it) {
                currentPoint[it] = cell.coord[it] + d[it];
            });
            
            currentPoint = [ checkCoord(currentPoint[0]), checkCoord(currentPoint[1]) ];
            currentCell = field[ coordToId(currentPoint[0], currentPoint[1]) ];
            if( currentCell.checked == false) {
                living += currentCell.alive;
                currentCell.checked = true;
            }
            
        /*цикл по всем направлениям*/
        });
        
        //console.log(living);
        if( cell.alive == 1 && ( living == 2 || living == 3) ||
            cell.alive == 0 && living == 3
        ) {
            rise( coordToId(cell.coord[0], cell.coord[1]));
        } else {
            die( coordToId(cell.coord[0], cell.coord[1]));
        }
        
        resetCheck();
        
    /*Цикл по всем клеткам поля*/
    });   
}

/*Создание и заполнени поля*/
var initField = function() {
    let point;
    for( i = 0; i < N; i++) {
        for(j = 0; j < N; j++) {
            point = new Object();
            point.coord = [];
            point.alive = 0;
            point.checked = false;
            point.coord.push(i);
            point.coord.push(j);
            field.push(point);
        }
    }
}

/*Инициализация массива направлений*/
var initDirectionsArray = function() {
    for (i = -1; i < 2; i++) {
        for( j = -1; j < 2; j++) {
            if( !( i == 0 && j == 0 )) dir.push( [i, j] );
        }
    }
}