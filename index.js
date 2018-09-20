var LifeGame = {
    /*Количество клеток*/
    N: 0,
    /*Размер клетки в пикселях*/
    cellSize: 0,
    /*Переменная для отслеживания нажатой мыши*/
    mousedown: false,
    /*Цвет 'мёртвой' клетки*/
    stockColor: 'rgba(0,0,0,.1)',
    /*Цвет 'живой' клетки*/
    activeColor: 'rgba(0,0,0,.9)',
    
    /*Массив, содержащий всё поле*/
    field: [],
    /*Массив для просмотров соседей*/
    dir: [],
    
    /*Создание и заполнени поля*/
    initField: function( N) {
        this.N = N;
        let i = 0, j = 0;
        let point;
        for( i = 0; i < this.N; i++) {
            for(j = 0; j < this.N; j++) {
                point = new Object();
                point.coord = [];
                point.alive = 0;
                point.checked = false;
                point.coord.push(i);
                point.coord.push(j);
                this.field.push(point);
            }
        }
    },
    
    /*Инициализация массива направлений*/
    initDirectionsArray: function() {
        let i = 0, j = 0;
        for (i = -1; i < 2; i++) {
            for( j = -1; j < 2; j++) {
                if( !( i == 0 && j == 0 )) this.dir.push( [i, j] );
            }
        }
    },
    
    /*создание dom-элементов*/
    createDOM: function() {
        let aCol = this.activeColor;
        let sCol = this.stockColor;
        let obj = this;
        
        d3.select("#field")
            .on('mousedown', () => this.mousedown = true )
            .on('mouseup', () => this.mousedown = false )
            .selectAll("rect")
                .data(this.field)
                .enter().append("rect")
                    .attr('class', 'panel')
                    .attr('fill', sCol)
                    .attr('id', (d, i) => i)
                    .attr('stroke-width', 1)
                    .attr('stroke', 'rgba(0,0,0, .7)')
                    .on('mousemove', (d,i) => { if(this.mousedown) this.rise(i)} )
                    .on('click', function(d) {
                        this.setAttribute('fill', ( this.getAttribute('fill') == aCol? sCol : aCol));
                        d.alive = !d.alive;
                    })
                .exit().remove();
    },
    
    setDynamicStyles: function() {
        
        this.cellSize = Math.floor( ( ( innerHeight <= innerWidth )? innerHeight : innerHeight ) / this.N);
        d3.select('#field')
            .attr('width', this.cellSize * this.N)
            .attr('height', this.cellSize * this.N)
            .selectAll('rect')
                .data(this.field)
                .attr('x', (d) => d.coord[1] * this.cellSize )
                .attr('y', (d) => d.coord[0] * this.cellSize )
                .attr('width', this.cellSize)
                .attr('height', this.cellSize);
    },
    
    checkMouseDown: () => this.mousedown,

    /*Возродить - красит в активный цвет*/
    rise: function(id) {
        this.field[id].alive = 1;
        document.getElementById(id).setAttribute('fill', this.activeColor);
    },

    /*Умереть - красит в стоковый цвет*/
    die: function(id) {
        this.field[id].alive = 0;
        document.getElementById(id).setAttribute('fill', this.stockColor);
    },
    
    //coordToId: (i, j) => i * this.N + j,
    coordToId: function(i, j) {
        return i * this.N + j;  
    },
    
    /*Принимает одну координату*/
    checkCoord: function(coord) {
        coord = (coord > -1)? coord : this.N - 2;
        coord = (coord < this.N)? coord : 1;
        return coord;
    },

    resetCheck: function() {
        this.field.forEach( function(item) {
            item.checked = false;  
        });
    },
    
    /*один шаг игры*/
    update: function() {
        /*Точка для просмотра соседей*/    
        let currentPoint = [0,0],
        /*Объект для просмотра соседей*/
        currentCell = {},
        /*Количество живых соседей*/
        living = 0,
        /*Индексы для циклов*/
        i = 0, j = 0, k = 0;
        
        /*Цикл по всем клеткам поля*/
        for(i = 0 ; i < Math.pow(this.N, 2); i++) {
            
            living = 0;
            
            /*цикл по всем направлениям*/
            for(j = 0; j < 8; j++) {
                currentPoint = [0,0];
                currentCell = {};
                
                /*Цикл по двум координатам*/
                for(k = 0; k < 2; k++) {
                    currentPoint[k] = this.field[i].coord[k] + this.dir[j][k];
                }
                currentPoint = [ this.checkCoord(currentPoint[0]), this.checkCoord(currentPoint[1]) ];
                currentCell = this.field[ this.coordToId(currentPoint[0], currentPoint[1]) ];
                if( currentCell.checked == false) {
                    living += currentCell.alive;
                    currentCell.checked = true;
                }
                
            }/*цикл по всем направлениям*/
            
            if( this.field[i].alive == 1 && ( living == 2 || living == 3) ||
                this.field[i].alive == 0 && living == 3
            ) {
                this.rise( this.coordToId( this.field[i].coord[0], this.field[i].coord[1] ) );
            } else {
                this.die( this.coordToId( this.field[i].coord[0], this.field[i].coord[1] ) );
            }
        
            this.resetCheck();
            
        }/*Цикл по всем клеткам поля*/        
    }
}

//TODO
//currentPoint и currentCell можно сделать одним объектом типа Point
//создать класс Point
//добавить функцию очистки всего поля
//SetInterval
//сделать единую функцию запуска с параметрами


/*EVENTS*/
window.addEventListener('load', function() {
        
    LifeGame.initField(6);
    
    LifeGame.initDirectionsArray();
    
    LifeGame.createDOM();
    
    LifeGame.setDynamicStyles();
    
});
window.addEventListener('resize', function() {
    LifeGame.setDynamicStyles();
});
document.getElementById('button-start').addEventListener('click', function() {
    LifeGame.update();
})