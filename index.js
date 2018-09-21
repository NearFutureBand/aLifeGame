class Point {
    constructor(x,y) {
        this.coord = [x,y];
        this.alive = 0;
        this.checked = Number(0);
    }
    clear() {
        this.coord = [0,0];
        this.alive = 0;
        this.checked = Number(0);
    }
    checkCoord() {
        this.coord[0] = LifeGame.checkCoord(this.coord[0]);
        this.coord[1] = LifeGame.checkCoord(this.coord[1]);
    }
    makeSeen() {
        this.checked = 1;
    }
}

var LifeGame = {
    /*Количество клеток*/
    N: 0,
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
    
    init: function(N) {
        this.N = N;
        this.initField();
        this.initDirectionsArray();
        this.createDOM();
        this.setDynamicStyles();
        this.activateResponsive();
    },
    
    /*Создание и заполнени поля*/
    initField: function() {
        this.field = [];
        let i = 0, j = 0;
        let point;
        for( i = 0; i < this.N; i++) {
            for(j = 0; j < this.N; j++) {
                point = new Point(i,j);
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
                        d.alive = (1 - d.alive);
                    })
                .exit().remove();
    },
    
    setDynamicStyles: function() {
        let cellSize = Math.floor( ( ( innerHeight <= innerWidth )? innerHeight : innerHeight ) / this.N);
        d3.select('#field')
            .attr('width', cellSize * this.N)
            .attr('height', cellSize * this.N)
            .selectAll('rect')
                .data(this.field)
                .attr('x', (d) => d.coord[1] * cellSize )
                .attr('y', (d) => d.coord[0] * cellSize )
                .attr('width', cellSize)
                .attr('height', cellSize);
    },
    
    /*Добавляет возможность полю подстраиваться под размеры экрана*/
    activateResponsive: function() {
        window.addEventListener('resize', function() {
            LifeGame.setDynamicStyles();
        });  
    },
    
    /*Очищает всё поле - убивает все клетки*/
    clear: function() {
        for(let i = 0; i < Math.pow(this.N,2); i++) {
            this.die(i);
        }
    },
    
    rebuild: function(newN) {
        this.N = newN;
        this.initField();
        this.createDOM();
        this.setDynamicStyles();
    },

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
    
    /*один шаг игры*/
    update: function() {
        /*Клетка для просмотра соседей*/    
        let currentPoint = new Point(0,0),
        /*ID просматриваемой клетки*/
        index = 0,
        /*Количество живых соседей*/
        living = 0,
        /*Индексы для циклов*/
        i = 0, j = 0, k = 0,
        /*Резервное поле для расчётов*/
        tmpField = this.field;
        console.log(tmpField);
        /*Цикл по всем клеткам поля*/
        //for(i = 0 ; i < Math.pow(this.N, 2); i++) {
        for(i = 4; i < 5; i++) {    
            living = 0;
            /*цикл по всем направлениям*/
            for(j = 0; j < 8; j++) {
                currentPoint.clear();
                
                /*Цикл по двум координатам*/
                for(k = 0; k < 2; k++) {
                    currentPoint.coord[k] = tmpField[i].coord[k] + this.dir[j][k];
                }
                currentPoint.checkCoord();
                index = this.coordToId(currentPoint.coord[0], currentPoint.coord[1]);
                console.log(index);
                
                if( this.field[index].checked == 0) {
                    living += tmpField[index].alive;
                    this.field[index].checked = 1;
                    console.log(this.field[ index ] );
                    console.log(this.field);
                }
                
            }/*цикл по всем направлениям*/
            console.log(tmpField);
            console.log(living);
            if( tmpField[i].alive == 1 && ( living == 2 || living == 3) ||
                tmpField[i].alive == 0 && living == 3
            ) {
                this.rise(i);
                console.log(i, 'rise');
            } else {
                this.die(i);
                console.log(i, 'die');
            }
            
            tmpField.forEach( function(item) {
                item.checked = 0;  
            });
            
        }/*Цикл по всем клеткам поля*/        
    }
}

//TODO
//тестировка - возможно работает неверно

//прием с checked свойством не работает
//SetInterval
//функция перестройки с заданным новым N - не работает exit.remove
//установка меню и привязка событий автоматически в своём инкапсулированном методе


/*EVENTS*/
window.addEventListener('load', function() {
    LifeGame.init(3);
});
document.getElementById('button-start').addEventListener('click', function() {
    LifeGame.update();
});
document.getElementById('buton-clear').addEventListener('click', function() {
    LifeGame.clear();
});
