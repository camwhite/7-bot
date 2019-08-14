import { resolve } from 'path'
import { Duplex } from 'stream'
import Twitch from 'twitch-js'
import notifier from 'node-notifier'
import { token, username, channels } from '../options'

class Bot extends Duplex {
  constructor() {
    super({ objectMode: true })
    chat.on('PRIVMSG', ({ username, message }) => {
      this.push({ username, message }, this.encoding)
      const notification = {
        title: username,
        icon: resolve('icon.png'),
        message
      }
      notifier.notify(notification)
    })
  }
  _write(chunk, encoding, callback) {
    if (Buffer.isBuffer(chunk)) {
      chunk = chunk.toString(encoding)
    }
    channels.forEach(async channel => {
      const { username } = await chat.say(channel, chunk)
      this.push({ username, message: chunk }, this.encoding)
    })
    callback()
  }
  _read() {}
}

const { chat } = new Twitch({
  token,
  username,
  log: { level: 0 }
})
;(async () => {
  await chat.connect()
  channels.forEach(channel => chat.join(channel))
})()

export default new Bot()
