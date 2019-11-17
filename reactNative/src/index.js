import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const buildMatrix = (rows, cols) => {
  return new Array(rows).fill(0).map((item, i) => {
    return new Array(cols).fill(0).map((item, j) => {
      return i * cols + j;
    });
  });
}

const initDirectionsArray = () => {
  const dir = [];
  let i = 0,
      j = 0;
  for (i = -1; i < 2; i++) {
      for (j = -1; j < 2; j++) {
          if (!(i == 0 && j == 0)) dir.push([i, j]);
      }
  }
  return dir;
}

let interval;

const MainScreen = ({
  cols = 10,
  rows = 20
}) => {
  const [ matrix, setMatrix ] = useState( buildMatrix(rows, cols) );
  const [ alive, setAlive ] = useState({ });
  const [ dir, setDiections ] = useState(initDirectionsArray());

  const onCellClick = (index) => {
    const nextAlive = {...alive};
    if (index in nextAlive) {
      delete nextAlive[index];
    } else {
      nextAlive[index] = true;
    }
    setAlive(nextAlive);
  }

  const checkCellCoordX = useCallback((coord) => {
    coord = (coord > -1) ? coord : rows - 1;
    coord = (coord < rows) ? coord : 0;
    return coord;
  }, [rows]);

  const checkCellCoordY =  useCallback((coord) => {
    coord = (coord > -1) ? coord : cols - 1;
    coord = (coord < cols) ? coord : 0;
    return coord;
  }, [cols]);

  const oneFrame = useCallback(() => {
    let seen = {};
    let living = 0;
    const nextAlive = { ...alive};
    for (let index = 0; index < rows * cols; index++ ) { // цикл по живым точкам
      
      // координаты текущей точки для осмотра соседей
      const i = Math.floor(index / cols);
      const j = index % cols;
      living = 0;
      seen = {};
      for ( let k = 0; k < 8; k++ ) { // цикл по 7-ми соседям
        
        // координаты точки-соседа с учетом периодических границ
        const nextI = checkCellCoordX(i + dir[k][0]);
        const nextJ = checkCellCoordY(j + dir[k][1]);
        const currentIndex = matrix[nextI][nextJ];
        if (!(currentIndex in seen) && currentIndex in alive) {
          living++;
          seen[currentIndex] = true;
        }
      }

      if (
        index in alive && (living === 2 || living === 3) ||
        !(index in alive) && (living === 3)
      ) {
        nextAlive[index] = true;
      } else {
        delete nextAlive[index];
      }
    }
    setAlive(nextAlive);
  }, [alive, rows, cols, checkCellCoordX, checkCellCoordY, matrix]);

  const run = () => {
    let steps = 0;
    interval = setInterval(() => {
      console.log(steps);
      oneFrame();
      if ( steps > 100 ) {
        clearInterval(interval);
      }
      steps++;
    }, 2000);
  }

  return (
    <View style={styles.container}>
      <View style={styles.gamePanel}>
        {matrix.map((row, i) => (
          <View style={styles.row} key={i}>
            {row.map((cell, j) => (
              <TouchableOpacity
                key={cell}
                style={[
                  styles.cell,
                  alive[cell] && styles.cellAlive
                ]}
                onPress={() => onCellClick(cell)}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.controlPanel}>
        <Text>{`W ${cols}`}</Text>
        <Text>{`H ${rows}`}</Text>
        <TouchableOpacity
          onPress={run}
          style={styles.controlButton}
        >
          <Text>S</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
        >
          <Text>C</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  gamePanel: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  controlPanel: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 5,
  },
  controlButton: {
    paddingVertical: 10,
    width: '15%',
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.3)',
    flex: 1,
  },
  cellAlive: {
    backgroundColor: 'black'
  }
})

export default MainScreen;
