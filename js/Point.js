/** Описывает точку на игровом поле
* Есть зависимость от метода проверки координат на вылет из поля - checkCoord()
*/
class Point {
    constructor(x,y) {
        this.coord = [x,y];
        this.alive = 0;
    }
    clear() {
        this.coord = [0,0];
        this.alive = 0;
    }
}