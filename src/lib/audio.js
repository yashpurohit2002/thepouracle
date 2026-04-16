let audioCtx = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

function playTone(freq, duration, type = 'square', volume = 0.25, delay = 0) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.value = freq
    const t = ctx.currentTime + delay
    gain.gain.setValueAtTime(volume, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
    osc.start(t)
    osc.stop(t + duration + 0.01)
  } catch (e) {
    // Audio not supported or context suspended
  }
}

export function playDrinkLog() {
  playTone(440, 0.08)
  playTone(660, 0.08, 'square', 0.2, 0.08)
}

export function playAchievement() {
  const melody = [523, 659, 784, 1047]
  melody.forEach((freq, i) => {
    playTone(freq, 0.12, 'square', 0.2, i * 0.1)
  })
}

export function playUndo() {
  playTone(330, 0.06)
  playTone(220, 0.1, 'square', 0.2, 0.07)
}

export function playJoin() {
  playTone(523, 0.06)
  playTone(784, 0.1, 'square', 0.2, 0.07)
}

export function playError() {
  playTone(200, 0.15, 'sawtooth', 0.2)
}
