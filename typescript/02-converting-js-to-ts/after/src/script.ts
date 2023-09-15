// Display/UI

import {
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
  positionMatch,
  markedTilesCount,
  Tile,
  Position,
} from "./minesweeper.ts"

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

let board = createBoard(
  BOARD_SIZE,
  getMinePositions(BOARD_SIZE, NUMBER_OF_MINES)
)
const boardElement = document.querySelector<HTMLDivElement>(".board")!
const minesLeftText =
  document.querySelector<HTMLSpanElement>("[data-mine-count]")!
const messageText = document.querySelector<HTMLDivElement>(".subtext")!

function render() {
  boardElement.innerHTML = ""
  checkGameEnd()

  getTileElements().forEach(element => {
    boardElement.append(element)
  })

  listMinesLeft()
}

function getTileElements() {
  return board.flatMap(row => {
    return row.map(tileToElement)
  })
}

function tileToElement(tile: Tile) {
  const element = document.createElement("div")
  element.dataset.status = tile.status
  element.dataset.x = tile.x.toString()
  element.dataset.y = tile.y.toString()
  element.textContent = tile.adjacentMinesCount
    ? tile.adjacentMinesCount.toString()
    : ""
  return element
}

boardElement.addEventListener("click", e => {
  if (
    !(e.target instanceof HTMLElement) ||
    !e.target.matches("[data-status]") ||
    e.target.dataset.x == null ||
    e.target.dataset.y == null
  ) {
    return
  }

  board = revealTile(board, {
    x: parseInt(e.target.dataset.x),
    y: parseInt(e.target.dataset.y),
  })
  render()
})

boardElement.addEventListener("contextmenu", e => {
  if (
    !(e.target instanceof HTMLElement) ||
    !e.target.matches("[data-status]") ||
    e.target.dataset.x == null ||
    e.target.dataset.y == null
  ) {
    return
  }

  e.preventDefault()
  board = markTile(board, {
    x: parseInt(e.target.dataset.x),
    y: parseInt(e.target.dataset.y),
  })
  render()
})

boardElement.style.setProperty("--size", BOARD_SIZE.toString())
render()

function listMinesLeft() {
  minesLeftText.textContent = `${NUMBER_OF_MINES - markedTilesCount(board)}`
}

function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true })
    boardElement.addEventListener("contextmenu", stopProp, { capture: true })
  }

  if (win) {
    messageText.textContent = "You Win"
  }
  if (lose) {
    messageText.textContent = "You Lose"
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.status === "marked") board = markTile(board, tile)
        if (tile.mine) board = revealTile(board, tile)
      })
    })
  }
}

function stopProp(e: Event) {
  e.stopImmediatePropagation()
}

function getMinePositions(boardSize: number, numberOfMines: number) {
  const positions: Position[] = []

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    }

    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position)
    }
  }

  return positions
}

function randomNumber(size: number) {
  return Math.floor(Math.random() * size)
}
