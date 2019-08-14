import { terminal } from 'terminal-kit'

let previous
export default function(data) {
  if (previous && previous.username === data.username) {
    terminal.bold('\n' + data.message)
    return
  }
  terminal
    .inverse('\n' + data.username)
    .dim(' ' + new Date().toLocaleString())
    .bold('\n' + data.message)
  previous = data
}
