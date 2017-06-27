const mongoose = require('mongoose')

const Schema = mongoose.Schema

let CallSchema = new Schema({
  sid: { type: String, unique: true },
  from: String,
  to: String,
  userId: { type: Schema.Types.String, ref: 'User' },
  status: { type: String, enum: ['queued', 'ringing', 'in-progress', 'completed', 'busy', 'failed', 'no-answer', 'canceled'] },
  direction: { type: String, enum: ['inbound', 'outbound'] },
  duration: Number,
}, { versionKey: false, timestamps: true })

module.exports = mongoose.model('Call', CallSchema)
