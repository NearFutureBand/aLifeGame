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
    /*Массив направлений для просмотра соседей*/
    dir: [],
    /*Для хранения SetInterval*/
    interval: null,
    /**/
    step: 0,
    maxStep: 100,
    
    init: function(N) {
        this.N = N;
        this.initField();
        this.initDirectionsArray();
        this.createDOM();
        this.setDynamicStyles();
        this.activateResponsive();
        this.setMenu();
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
        
        let field = d3.select("#field")
            .on('mousedown', () => this.mousedown = true )
            .on('mouseup', () => this.mousedown = false )
            .selectAll("rect")
                .data(this.field);
        
        field.enter().append("rect")
            .attr('class', 'panel')
            .attr('fill', sCol)
            .attr('id', (d, i) => i)
            .attr('stroke-width', 1)
            .attr('stroke', 'rgba(0,0,0, .7)')
            .on('mousemove', (d,i) => { if(this.mousedown) this.rise(i)} )
            .on('click', function(d) {
                this.setAttribute('fill', ( this.getAttribute('fill') == aCol? sCol : aCol));
                d.alive = (1 - d.alive);
            });
        
        field.exit().remove();
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
        tmpField = this.field,
        /*Массив уже просмотренных живых точек*/
        seen = [];
        
        for(i = 0 ; i < Math.pow(this.N, 2); i++) { /*Цикл по всем клеткам поля*/
            seen = [];
            living = 0;
            
            for(j = 0; j < 8; j++) { /*цикл по всем направлениям*/
                currentPoint.clear();
                
                for(k = 0; k < 2; k++) { /*Цикл по двум координатам*/
                    currentPoint.coord[k] = tmpField[i].coord[k] + this.dir[j][k];
                }
                currentPoint.checkCoord();
                index = this.coordToId(currentPoint.coord[0], currentPoint.coord[1]);
                
                if( seen.indexOf( index) == -1) {
                    living += tmpField[index].alive;
                    seen.push(index);
                }
                
            } /*цикл по всем направлениям*/
            if( tmpField[i].alive == 1 && ( living == 2 || living == 3) ||
                tmpField[i].alive == 0 && living == 3
            ) {
                this.rise(i);
            } else {
                this.die(i);
            }
        } /*Цикл по всем клеткам поля*/        
    },
    
    game: function() {
        if( LifeGame.step >= LifeGame.maxStep) {
            clearInterval(LifeGame.interval);   
            LifeGame.interval = null;
        }
        LifeGame.step += 1;
        LifeGame.update();
    },
    
    setMenu: function() {
        let menu = document.createElement('div');
        menu.className = 'button-block';
        menu.innerHTML = '<h5>Menu</h5><form class="frm-set-field-size"><input type="text" name="dimention" class="input-number" id="input-dimention"><br><input type="button" class="btn btn-danger" value="Build" id="button-build"></form><button class="btn btn-success" id="button-start">Start</button><button class="btn btn-primary" id="buton-clear">Clear</button>';
        document.querySelector('body').appendChild(menu);
        
        document.getElementById('button-start').addEventListener('click', function() {
            LifeGame.step = 0;
            LifeGame.interval = setInterval( LifeGame.game, 1000/60);
        });
        document.getElementById('buton-clear').addEventListener('click', function() {
            if( LifeGame.interval != null) {
                clearInterval(LifeGame.interval);   
                LifeGame.interval = null;
            }
            LifeGame.clear();
        });
        document.getElementById('button-build').addEventListener('click', function() {
            LifeGame.rebuild( parseInt( document.getElementById('input-dimention').value ) );    
        });
    }
}