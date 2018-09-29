# Game Of Life

This animation is made according to the algorythm took from this [paper](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

## How To Play

### Shortly about the game

There is a field and cells inside it. Cells is showing as quads. They can be in two states: alive or dead.
If the cell is alive and has two or three alive neighbors it continues to live.
In other cases alive cell dies.
If the dead cell has exactly three neighbors it comes to live.
In any other cases the died cell remains dead.

### Setting the field

You can set the size of the field by typing an integer number from 3 to whatever to the input area in the top of the menu window.
Then press "Build" and you get it. For now the width and height are both equal to N, where N - your typed number.

![img](https://preview.ibb.co/hhkMzK/1.jpg)

### Setting up the initial condition

Every quad on the field could be pressed. One click makes the died cells alive and viсe versa. 
Also you can just hold the left mouse button and simply draw any condition you want.

![img](https://preview.ibb.co/nQx1zK/2.jpg)

### Launching the animation

To make the life run just press the button "Start". 

### Stopping the animation

(temporary solution) The animation automatically stops when it's get to 100 steps.

The animation could be stopped by pressing the button "Clear". The field will be cleared and you can start the game again.

## Next updates highlights

* Some threads to process huge fields
* Different dimentions for width and height
* More correct condition of stopping the animation

## Developers

Paval Belyakov (Paul White)
* [GitHub](https://github.com/NearFutureBand)
* [LinkedIn](https://www.linkedin.com/in/%D0%BF%D0%B0%D0%B2%D0%B5%D0%BB-%D0%B1%D0%B5%D0%BB%D1%8F%D0%BA%D0%BE%D0%B2-035b1b162/)
* Telegram - @paulWhite43
