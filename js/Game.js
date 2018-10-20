class LifeGame {
    constructor() {
        /*Count of cells*/
        this.N = 0;
        /*Переменная для отслеживания нажатой мыши*/
        this.mousedown = false;
        /*Color of a dead cell*/
        this.stockColor = 'rgba(0,0,0,.1)';
        /*Color of an alive cell*/
        this.activeColor = 'rgba(0,0,0,.9)';
        /*Container for all the field*/
        this.field = [];
        /*Array of directions to check neighbors*/
        this.dir = [];
        /*For holding setInterval function's index*/
        this.interval = null;
        /*Information about process of animation*/
        this.step = 0;
        this.maxStep = 100;
    }

    init(N) {
        this.N = N;
        this.initField();
        this.initDirectionsArray();
        this.createDOM();
        this.setDynamicStyles();
        this.activateResponsive();
        this.setMenu();
    }

    /*Creating and filling up the field*/
    initField() {
        this.field = [];
        let i = 0,
            j = 0;
        let point;
        for (i = 0; i < this.N; i++) {
            for (j = 0; j < this.N; j++) {
                point = new Point(i, j);
                this.field.push(point);
            }
        }
    }

    initDirectionsArray() {
        let i = 0,
            j = 0;
        for (i = -1; i < 2; i++) {
            for (j = -1; j < 2; j++) {
                if (!(i == 0 && j == 0)) this.dir.push([i, j]);
            }
        }
    }

    createDOM() {
        let aCol = this.activeColor;
        let sCol = this.stockColor;

        let field = d3.select('#field')
            .on('mousedown', () => this.mousedown = true)
            .on('mouseup', () => this.mousedown = false)
            .selectAll("rect")
            .data(this.field);

        field.enter().append('rect')
            .attr('class', 'panel')
            .attr('fill', sCol)
            .attr('id', (d, i) => i)
            .attr('stroke-width', 1)
            .attr('stroke', 'rgba(0,0,0, .7)')
            .on('mousemove', (d, i) => {
                if (this.mousedown) this.rise(i)
            })
            .on('click', function (d) {
                this.setAttribute('fill', (this.getAttribute('fill') == aCol ? sCol : aCol));
                d.alive = (1 - d.alive);
            });

        field.exit().remove();
    }

    /*This function is called always when is needed to update the graphic part of the game*/
    setDynamicStyles() {
        let cellSize = Math.floor(Math.min(innerHeight, innerWidth) / this.N);
        d3.select('#field')
            .attr('width', cellSize * this.N)
            .attr('height', cellSize * this.N)
            .selectAll('rect')
            .data(this.field)
            .attr('x', (d) => d.coord[1] * cellSize)
            .attr('y', (d) => d.coord[0] * cellSize)
            .attr('width', cellSize)
            .attr('height', cellSize);
    }

    /*Adds the abitilty to change sizes to the field depending on the screen width and height*/
    activateResponsive() {
        let context = this;
        window.addEventListener('resize', function () {
            context.setDynamicStyles();
        });
    }

    /*Clear all the field - kill every cell*/
    clear() {
        for (let i = 0; i < Math.pow(this.N, 2); i++) {
            this.die(i);
        }
    }

    rebuild(newN) {
        this.N = newN;
        this.initField();
        this.createDOM();
        this.setDynamicStyles();
    }

    /*Возродить - красит в активный цвет*/
    rise(id) {
        this.field[id].alive = 1;
        document.getElementById(id).setAttribute('fill', this.activeColor);
    }

    /*Умереть - красит в стоковый цвет*/
    die(id) {
        this.field[id].alive = 0;
        document.getElementById(id).setAttribute('fill', this.stockColor);
    }

    //coordToId: (i, j) => { return i * this.N + j},
    coordToId(i, j) {
        return i * this.N + j;
    }

    checkCoords(point) {
        point.coord[0] = this.checkCoord(point.coord[0]);
        point.coord[1] = this.checkCoord(point.coord[1]);
    }

    /*Checks the coordinate*/
    checkCoord(coord) {
        coord = (coord > -1) ? coord : this.N - 1;
        coord = (coord < this.N) ? coord : 0;
        return coord;
    }

    /*One step of the game*/
    update() {
        /*Cell for cheking neighbors*/
        let currentPoint = new Point(0, 0),
            /*ID of a cell that is cheking*/
            index = 0,
            /*Количество живых соседей*/
            living = 0,
            /*Индексы для циклов*/
            i = 0,
            j = 0,
            k = 0,
            /*Объект содержащий уже просмотренные живые точки*/
            seen = {};
        /*Резервное поле для расчётов*/
        let tmpField = JSON.parse(JSON.stringify(this.field));

        for (i = 0; i < this.N * this.N; i++) { /*Цикл по всем клеткам поля*/

            seen = {};
            living = 0;

            for (j = 0; j < 8; j++) { /*цикл по всем направлениям*/
                currentPoint.clear();

                for (k = 0; k < 2; k++) { /*Цикл по двум координатам*/
                    currentPoint.coord[k] = tmpField[i].coord[k] + this.dir[j][k];
                }

                this.checkCoords(currentPoint);
                index = this.coordToId(currentPoint.coord[0], currentPoint.coord[1]);

                if (!(index in seen)) {
                    living += tmpField[index].alive;
                    seen[index] = true;
                }

            } /*цикл по всем направлениям*/
            if (tmpField[i].alive == 1 && (living == 2 || living == 3) ||
                tmpField[i].alive == 0 && living == 3
            ) {
                this.rise(i);
            } else {
                this.die(i);
            }
        } /*Цикл по всем клеткам поля*/
    }

    setMenu() {
        let menu = document.createElement('div');
        menu.className = 'button-block';
        menu.innerHTML = `
            <h5>Menu</h5>
            <form class="frm-set-field-size">
                <input type="text" name="dimention" class="input-number" id="input-dimention"><br>
                <input type="button" class="btn btn-danger" value="Build" id="button-build">
            </form>
            <button class="btn btn-success" id="button-start">Start</button>
            <button class="btn btn-primary" id="button-clear">Clear</button>
        `;
        document.querySelector('body').appendChild(menu);
        this.addEventsForMenuButtons();
    }

    addEventsForMenuButtons() {
        document.getElementById('button-start').addEventListener('click', () => {
            if (this.interval == null) {
                this.step = 0;
                this.interval = setInterval(() => {
                    
                    if (this.step >= this.maxStep) {
                        clearInterval(this.interval);
                        this.interval = null;
                    }
                    this.step += 1;
                    this.update();

                }, 1000 / 60);  
            }

        });

        document.getElementById('button-clear').addEventListener('click', () => {
            if (this.interval != null) {
                clearInterval(this.interval);
                this.interval = null;
            }
            this.clear();
        });

        document.getElementById('button-build').addEventListener('click', () => {
            this.rebuild(parseInt(document.getElementById('input-dimention').value));
        });
    }
}