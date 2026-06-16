import type { HatBlock } from './types'
import type { Sprite } from '../canvas/sprite'
import { execute, type StopSignal } from './interpreter'

export interface PenState {
  isDown: boolean
  color: string
  size: number
  lines: Array<{ x1: number; y1: number; x2: number; y2: number; color: string; size: number }>
  stamps: Array<{ x: number; y: number; direction: number; size: number }>
}

export class RuntimeEnvironment {
  private variables = new Map<string, number | string | boolean>()
  private visibleVars = new Set<string>()
  sprites: Sprite[] = []
  mouseX = 0
  mouseY = 0
  private timerStart = Date.now()
  private keysPressed = new Set<string>()
  pen: PenState = {
    isDown: false,
    color: '#000000',
    size: 2,
    lines: [],
    stamps: []
  }
  onPrint?: (text: string) => void

  getVariable(spriteId: string, name: string): number | string | boolean {
    return this.variables.get(`${spriteId}:${name}`) ?? 0
  }

  setVariable(spriteId: string, name: string, value: number | string | boolean) {
    this.variables.set(`${spriteId}:${name}`, value)
  }

  showVariable(name: string) {
    this.visibleVars.add(name)
  }

  hideVariable(name: string) {
    this.visibleVars.delete(name)
  }

  getVisibleVariables(): Map<string, number | string | boolean> {
    const result = new Map<string, number | string | boolean>()
    for (const name of this.visibleVars) {
      for (const [key, value] of this.variables) {
        if (key.endsWith(`:${name}`)) {
          result.set(name, value)
          break
        }
      }
    }
    return result
  }

  isKeyPressed(key: string): boolean {
    return this.keysPressed.has(key)
  }

  setKeyPressed(key: string, pressed: boolean) {
    if (pressed) {
      this.keysPressed.add(key)
    } else {
      this.keysPressed.delete(key)
    }
  }

  getTimer(): number {
    return (Date.now() - this.timerStart) / 1000
  }

  resetTimer() {
    this.timerStart = Date.now()
  }

  clearPen() {
    this.pen.lines = []
    this.pen.stamps = []
  }

  clear() {
    this.variables.clear()
    this.visibleVars.clear()
    this.keysPressed.clear()
    this.timerStart = Date.now()
    this.pen = {
      isDown: false,
      color: '#000000',
      size: 2,
      lines: [],
      stamps: []
    }
  }
}

interface ScriptThread {
  spriteId: string
  abortController: AbortController
}

export class Engine {
  sprites: Sprite[] = []
  private initialStates: Map<string, { x: number; y: number; direction: number; visible: boolean; size: number; costume: HTMLImageElement | null }> = new Map()
  hats: HatBlock[] = []
  env = new RuntimeEnvironment()
  private threads: ScriptThread[] = []
  private running = false
  private onStateChange?: () => void
  private keysTriggered = new Set<string>()

  setOnStateChange(callback: () => void) {
    this.onStateChange = callback
  }

  get isRunning(): boolean {
    return this.running
  }

  setSprites(sprites: Sprite[]) {
    this.sprites = sprites
    this.env.sprites = sprites
  }

  setHats(hats: HatBlock[]) {
    this.hats = hats
  }

  start() {
    this.stop()
    this.running = true

    // Save initial states
    this.initialStates.clear()
    for (const sprite of this.sprites) {
      this.initialStates.set(sprite.id, {
        x: sprite.x,
        y: sprite.y,
        direction: sprite.direction,
        visible: sprite.visible,
        size: sprite.size,
        costume: sprite.costume
      })
    }

    this.env.clear()
    this.onStateChange?.()

    console.log('Engine start, hats:', this.hats.length, this.hats.map(h => h.trigger.type))

    for (const hat of this.hats) {
      if (hat.trigger.type === 'flag_clicked') {
        this.spawnThread(hat)
      }
    }
  }

  stop() {
    for (const thread of this.threads) {
      thread.abortController.abort()
    }
    this.threads = []
    this.running = false
    this.onStateChange?.()

    for (const sprite of this.sprites) {
      sprite.sayText = ''
      sprite.sayType = null
      sprite.sayExpiry = 0

      // Restore initial state
      const state = this.initialStates.get(sprite.id)
      if (state) {
        sprite.x = state.x
        sprite.y = state.y
        sprite.direction = state.direction
        sprite.visible = state.visible
        sprite.size = state.size
        sprite.costume = state.costume
      }
    }
  }

  handleKeyPress(key: string) {
    this.env.setKeyPressed(key, true)
    if (this.keysTriggered.has(key)) return
    this.keysTriggered.add(key)
    for (const hat of this.hats) {
      if (hat.trigger.type === 'key_pressed' && hat.trigger.key === key) {
        this.spawnThread(hat)
      }
    }
  }

  handleKeyRelease(key: string) {
    this.env.setKeyPressed(key, false)
    this.keysTriggered.delete(key)
  }

  handleMouseMove(x: number, y: number) {
    this.env.mouseX = x
    this.env.mouseY = y
  }

  handleSpriteClick(spriteId: string) {
    for (const hat of this.hats) {
      if (hat.trigger.type === 'sprite_clicked' && hat.spriteId === spriteId) {
        this.spawnThread(hat)
      }
    }
  }

  private async spawnThread(hat: HatBlock) {
    const sprite = this.sprites.find(s => s.id === hat.spriteId)
      || this.sprites.find(s => s.name === hat.spriteId)
      || this.sprites[0]
    if (!sprite) return

    const abortController = new AbortController()
    const thread: ScriptThread = { spriteId: hat.spriteId, abortController }
    this.threads.push(thread)

    try {
      await execute(hat.body, sprite, this.env, abortController.signal)
    } catch (e) {
      if (e !== 'stopped') console.error('Script error:', e)
    } finally {
      const idx = this.threads.indexOf(thread)
      if (idx >= 0) this.threads.splice(idx, 1)
      if (this.threads.length === 0) {
        this.running = false
        this.onStateChange?.()
      }
    }
  }
}
