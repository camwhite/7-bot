import { join } from 'path'
import { Readable } from 'stream'
import Twitch from 'twitch-js'
import notifier from 'node-notifier'
import { token, username, channels } from './options'

const { chat, chatConstants } = new Twitch({
  token,
  username,
  log: { level: 0 }
})

;(async () => {
  await chat.connect()
  channels.forEach(channel => chat.join(channel))
})()

class Bot extends Readable {
  constructor() {
    super({ objectMode: true })
    chat.on('PRIVMSG', ({ username, message }) => {
      this.push({ username, message }, this.encoding)
      notifier.notify({
        title: username,
        icon: join(__dirname, 'icon.png'),
        message
      })
    })
  }
  _read(size) {}
}

export default new Bot()
