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
  // maybe convert to switch
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

// synchronous message handler
export default function(data) {
  terminal.restoreCursor()
  if (previous && previous.username === data.username) {
    terminal.bold('\n' + data.message)
  } else {
    terminal
      .dim('\n' + new Date().toLocaleString())
      .inverse('\n' + data.username)
      .bold('\n' + data.message)
  }
  terminal.saveCursor()
  previous = data
}
