import { Readable } from 'stream'
import { terminal, ScreenBuffer, TextBuffer } from 'terminal-kit'

let previous

const readable = new Readable({
  read() {}
})
const screenBuffer = new ScreenBuffer({
  dst: terminal,
  width: terminal.width,
  height: 1,
  x: 1,
  y: terminal.height
})
const textBuffer = new TextBuffer({
  dst: screenBuffer
})

terminal.fullscreen()
terminal.saveCursor()
terminal.grabInput()

terminal.on('key', (key, matches, { isCharacter }) => {
  const result = textBuffer.getText()
  if (isCharacter) {
    textBuffer.insert(key)
  }
  // @TODO maybe convert to switch
  if (key === 'ENTER') {
    textBuffer.backDelete(result.length)
    readable.push(result)
  } else if (key === 'BACKSPACE') {
    textBuffer.backDelete()
  } else if (key === 'CTRL_C') {
    process.exit()
  }
  textBuffer.draw()
  screenBuffer.draw()
  textBuffer.drawCursor()
  screenBuffer.drawCursor()
})

// streaming input
export const stream = readable

// data handler
export default async function(data) {
  terminal.restoreCursor()
  if (previous && previous.username === data.username) {
    terminal.bold('\n' + data.message)
  } else {
    const [date, timestamp] = new Date()
      .toLocaleString()
      .split(' ')
    terminal
      .inverse('\n' + data.username)
      .dim(' @ ' + timestamp)
      .bold('\n' + data.message)
  }
  const { x, y } = await terminal.getCursorLocation()
  if (y === terminal.height) {
    terminal.scrollUp().moveTo(x, y - 1)
  }
  terminal.saveCursor()
  previous = data
}
