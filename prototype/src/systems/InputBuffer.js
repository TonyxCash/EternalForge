export class InputBuffer {
  constructor(windowMs = 150) {
    this.windowMs = windowMs;
    this.queue = [];
  }
  push(action, now) {
    this.queue.push({ action, expires: now + this.windowMs });
  }
  consume(action, now) {
    this.queue = this.queue.filter(item => item.expires >= now);
    const index = this.queue.findIndex(item => item.action === action);
    if (index < 0) return false;
    this.queue.splice(index, 1);
    return true;
  }
  clear() { this.queue.length = 0; }
}