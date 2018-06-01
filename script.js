//create a class for the game of life
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {grid: [], generations: 0, rows: 50, columns: 50};
    this.cellAutomata = this.cellAutomata.bind(this);
    this.changeCell = this.changeCell.bind(this);
    this.pauseGame = this.pauseGame.bind(this);
    this.runGame = this.runGame.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.addRow = this.addRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.addColumn = this.addColumn.bind(this);
    this.deleteColumn = this.deleteColumn.bind(this);
  }
  cellAutomata() {//run the game of life
    var oldGrid = this.state.grid;
    var generations = this.state.generations;
    var newGrid = [];
    for(var row=0; row<oldGrid.length; row++) {
      newGrid[row] = [];
      for(var col=0; col<oldGrid[row].length; col++) {
        var prevRow = row - 1;
        var nextRow = row + 1;
        var prevCol = col - 1;
        var nextCol = col + 1;
        prevRow = prevRow < 0 ? oldGrid.length-1 : prevRow;
        nextRow = nextRow == oldGrid.length ? 0 : nextRow;
        prevCol = prevCol < 0 ? oldGrid[row].length-1 : prevCol;
        nextCol = nextCol == oldGrid[row].length ? 0 : nextCol;
        var neighbour1 = oldGrid[prevRow][prevCol];
        var neighbour2 = oldGrid[prevRow][col];
        var neighbour3 = oldGrid[prevRow][nextCol];
        var neighbour4 = oldGrid[row][prevCol];
        var neighbour5 = oldGrid[row][nextCol];
        var neighbour6 = oldGrid[nextRow][prevCol];
        var neighbour7 = oldGrid[nextRow][col];
        var neighbour8 = oldGrid[nextRow][nextCol];
        var neighbours = [neighbour1, neighbour2, neighbour3, neighbour4, neighbour5, neighbour6, neighbour7, neighbour8];
        var alive = neighbours.filter(function(val) {
          return val == 1;
        });
        if ((oldGrid[row][col] == 1) && (alive.length > 3 || alive.length < 2)) {
          newGrid[row].push(0);
        } else if ((oldGrid[row][col] == 0) && (alive.length == 3)) {
          newGrid[row].push(1);
        } else {
          newGrid[row].push(oldGrid[row][col]);
        }
      }
    }
    generations = JSON.stringify(oldGrid) !== JSON.stringify(newGrid) ? generations+1 : generations;
    this.setState({grid: newGrid, generations: generations});
    this.loop = setTimeout(this.cellAutomata, 30);
  }
  changeCell(row, column) {//make a cell either alive or dead
    var grid = this.state.grid;
    grid[row][column] = grid[row][column] == 0 ? 1 : 0;
    this.setState({grid: grid});
  }
  toggleButton(display) {//hide or show buttons
    var runButton = document.getElementById('run');
    runButton.style.display = (runButton.style.display == 'none' || runButton.style.display == '') ? 'block' : 'none';
    var clearButton = document.getElementById('clear');
    clearButton.style.display = (clearButton.style.display == 'none' || clearButton.style.display == '') ? 'block' : 'none';
    var drawButton = document.getElementById('form');
    drawButton.style.display = (drawButton.style.display == 'none' || drawButton.style.display == '') ? 'block' : 'none';
    var pauseButton = document.getElementById('pause');
    pauseButton.style.display = display;
  }
  pauseGame() {//pause the game of life
    clearInterval(this.loop);
    this.toggleButton('none');
  }
  runGame() {//run the game of life
    this.cellAutomata();
    this.toggleButton('block');
  }
  clearBoard() {//clear the board
    let oldGrid = this.state.grid;
    var clearGrid = [];
    for(var row=0; row<oldGrid.length; row++) {
      clearGrid[row] = [];
      for(var col=0; col<oldGrid[row].length; col++) {
        clearGrid[row].push(0);
      }
    }
    this.setState({grid: clearGrid, generations: 0});
  }
  addRow() {
    var rows = this.state.rows;
    this.setState({rows: rows === 60 ? rows : rows + 1});
  }
  deleteRow() {
    var rows = this.state.rows;
    this.setState({rows: rows === 40 ? rows : rows - 1});
  }
  addColumn() {
    var columns = this.state.columns;
    this.setState({columns: columns === 60 ? columns : columns + 1});
  }
  deleteColumn() {
    var columns = this.state.columns;
    this.setState({columns: columns === 40 ? columns : columns - 1});
  }
  drawGrid() {//draw a board
    const grid = this.state.grid;
    var rows = this.state.rows;
    var columns = this.state.columns;
    var newGrid = [];
    for(var row=0; row<rows; row++) {
      newGrid[row] = [];
      for(var col=0; col<columns; col++) {
        newGrid[row].push(0);
      }
    }
    this.setState({grid: newGrid, generations: 0});
  }
  componentWillMount() {//set the initial state before the component renders
    const grid = this.state.grid;
    for(var row=0; row<this.state.rows; row++) {
      grid[row]=[];
      for(var col=0; col<this.state.columns; col++) {
        grid[row].push(Math.random() < 0.5 ? 0 : 1);
      }
    }
    this.setState({grid: grid});
  }
  componentDidMount() {//run the game of life after the component renders
    this.cellAutomata();
  }
  render() {
    var arr = this.state.grid;
    var rows = this.state.rows;
    var columns = this.state.columns;
    var generations = this.state.generations;
    return(
      <div className="game-field">
        <div className="row text-center" id="form">
          <div className="col-xs-2 col-xs-offset-3 row">
            <button className="btn btn-primary" onClick={this.addRow}>+</button>
            <h5 className="text-center">rows: {rows}</h5>
            <button className="btn btn-primary" onClick={this.deleteRow}>-</button>
          </div>
          <div className="col-xs-2 row">
            <button className="btn btn-primary" onClick={this.addColumn}>+</button>
            <h5 className="text-center">columns: {columns}</h5>
            <button className="btn btn-primary" onClick={this.deleteColumn}>-</button>
          </div>
          <div className="col-xs-2">
            <button className="btn btn-primary" id="draw" onClick={this.drawGrid}>Draw</button>
          </div>
        </div>
        <h5 className="text-center">Generations: {generations}</h5>
        <div id="table">
          <table>
            <tbody>
              {arr.map((row, i) => (
                <tr key={i}>
                  {row.map((col, j) => (
                    col == 1 ? <td key={j} className='alive' id={i + '-' + j} onClick={() => this.changeCell(i, j)}></td> : <td key={j} id={i + '-' + j} onClick={() => this.changeCell(i, j)}></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row" id="buttons">
          <button onClick={this.runGame} className="col-xs-offset-3 col-xs-2 btn btn-success" id="run">Run</button>
          <button onClick={this.clearBoard} className="col-xs-offset-2 col-xs-2 btn btn-warning" id="clear">Clear</button>
          <button onClick={this.pauseGame} className="col-xs-offset-5 col-xs-2 btn btn-danger" id="pause">Pause</button>
        </div>
      </div>
    );
  }
};

ReactDOM.render(<Board />, document.getElementById('app'));
