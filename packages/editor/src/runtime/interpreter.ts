import type { ASTNode } from './types'
import type { Sprite } from '../canvas/sprite'
import type { RuntimeEnvironment } from './engine'

function evalExpr(node: ASTNode, sprite: Sprite, env: RuntimeEnvironment): number | string | boolean {
  switch (node.type) {
    case 'number_literal':
      return node.value
    case 'string_literal':
      return node.value
    case 'variable_ref':
      if (node.name === '__x__') return sprite.x
      if (node.name === '__y__') return sprite.y
      if (node.name === '__dir__') return sprite.direction
      return env.getVariable(sprite.id, node.name)
    case 'binary_op': {
      const l = evalExpr(node.left, sprite, env)
      const r = evalExpr(node.right, sprite, env)
      const ln = Number(l), rn = Number(r)
      switch (node.op) {
        case '+': return ln + rn
        case '-': return ln - rn
        case '*': return ln * rn
        case '/': return rn !== 0 ? ln / rn : 0
        case '<': return ln < rn
        case '>': return ln > rn
        case '=': return l === r || ln === rn
        case 'and': return Boolean(l) && Boolean(r)
        case 'or': return Boolean(l) || Boolean(r)
      }
      return 0
    }
    case 'not':
      return !evalExpr(node.operand, sprite, env)
    case 'random': {
      const from = Number(evalExpr(node.from, sprite, env))
      const to = Number(evalExpr(node.to, sprite, env))
      return Math.floor(Math.random() * (to - from + 1)) + from
    }
    // Sensing
    case 'key_pressed':
      return env.isKeyPressed(node.key)
    case 'mouse_x':
      return env.mouseX
    case 'mouse_y':
      return env.mouseY
    case 'touching_edge': {
      const halfW = 240, halfH = 180
      return sprite.x >= halfW || sprite.x <= -halfW || sprite.y >= halfH || sprite.y <= -halfH
    }
    case 'touching_sprite': {
      const other = env.sprites.find(s => s.name === node.sprite || s.id === node.sprite)
      if (!other) return false
      const dx = sprite.x - other.x
      const dy = sprite.y - other.y
      return Math.sqrt(dx * dx + dy * dy) < 30 * (sprite.size / 100 + other.size / 100) / 2
    }
    case 'distance_to': {
      const other = env.sprites.find(s => s.name === node.sprite || s.id === node.sprite)
      if (!other) return 0
      const dx = sprite.x - other.x
      const dy = sprite.y - other.y
      return Math.sqrt(dx * dx + dy * dy)
    }
    case 'timer':
      return env.getTimer()
    case 'sprite_property': {
      const other = env.sprites.find(s => s.name === node.sprite || s.id === node.sprite)
      if (!other) return 0
      switch (node.property) {
        case 'x': return other.x
        case 'y': return other.y
        case 'direction': return other.direction
        case 'size': return other.size
        case 'visible': return other.visible
        default: return 0
      }
    }
    default:
      return 0
  }
}

function num(node: ASTNode, sprite: Sprite, env: RuntimeEnvironment): number {
  return Number(evalExpr(node, sprite, env))
}

export type StopSignal = { type: 'stop'; target: 'all' | 'this' }

export async function execute(
  node: ASTNode,
  sprite: Sprite,
  env: RuntimeEnvironment,
  abortSignal?: AbortSignal
): Promise<StopSignal | null> {
  if (abortSignal?.aborted) return { type: 'stop', target: 'all' }

  switch (node.type) {
    case 'sequence':
      for (const stmt of node.body) {
        const result = await execute(stmt, sprite, env, abortSignal)
        if (result) return result
      }
      break

    case 'move': {
      const steps = num(node.steps, sprite, env)
      const rad = (sprite.direction - 90) * Math.PI / 180
      const prevX = sprite.x
      const prevY = sprite.y
      sprite.x += steps * Math.cos(rad)
      sprite.y += steps * Math.sin(rad)
      if (env.pen.isDown) {
        env.pen.lines.push({
          x1: prevX, y1: prevY,
          x2: sprite.x, y2: sprite.y,
          color: env.pen.color,
          size: env.pen.size
        })
      }
      break
    }

    case 'turn': {
      const degrees = num(node.degrees, sprite, env)
      sprite.direction += node.direction === 'cw' ? degrees : -degrees
      break
    }

    case 'goto': {
      const prevX = sprite.x
      const prevY = sprite.y
      sprite.x = num(node.x, sprite, env)
      sprite.y = num(node.y, sprite, env)
      if (env.pen.isDown) {
        env.pen.lines.push({
          x1: prevX, y1: prevY,
          x2: sprite.x, y2: sprite.y,
          color: env.pen.color,
          size: env.pen.size
        })
      }
      break
    }

    case 'set_x': {
      const prevX = sprite.x
      sprite.x = num(node.x, sprite, env)
      if (env.pen.isDown) {
        env.pen.lines.push({
          x1: prevX, y1: sprite.y,
          x2: sprite.x, y2: sprite.y,
          color: env.pen.color,
          size: env.pen.size
        })
      }
      break
    }

    case 'set_y': {
      const prevY = sprite.y
      sprite.y = num(node.y, sprite, env)
      if (env.pen.isDown) {
        env.pen.lines.push({
          x1: sprite.x, y1: prevY,
          x2: sprite.x, y2: sprite.y,
          color: env.pen.color,
          size: env.pen.size
        })
      }
      break
    }

    case 'glide': {
      const secs = num(node.secs, sprite, env)
      const targetX = num(node.x, sprite, env)
      const targetY = num(node.y, sprite, env)
      const startX = sprite.x
      const startY = sprite.y
      const steps = Math.max(1, Math.round(secs * 60))
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        sprite.x = startX + (targetX - startX) * t
        sprite.y = startY + (targetY - startY) * t
        await yieldFrame()
        if (abortSignal?.aborted) return { type: 'stop', target: 'all' }
      }
      break
    }

    case 'point_in_direction':
      sprite.direction = num(node.dir, sprite, env)
      break

    case 'bounce_on_edge': {
      const halfW = 240
      const halfH = 180
      let bounced = false
      if (sprite.x > halfW) { sprite.x = halfW; bounced = true }
      if (sprite.x < -halfW) { sprite.x = -halfW; bounced = true }
      if (sprite.y > halfH) { sprite.y = halfH; bounced = true }
      if (sprite.y < -halfH) { sprite.y = -halfH; bounced = true }
      if (bounced) {
        sprite.direction = (180 - sprite.direction + 360) % 360
      }
      break
    }

    case 'say': {
      const text = String(evalExpr(node.text, sprite, env))
      sprite.sayText = text
      sprite.sayType = 'say'
      if (node.duration) {
        const dur = num(node.duration, sprite, env)
        sprite.sayExpiry = Date.now() + dur * 1000
      } else {
        sprite.sayExpiry = 0
      }
      break
    }

    case 'think': {
      const text = String(evalExpr(node.text, sprite, env))
      sprite.sayText = text
      sprite.sayType = 'think'
      if (node.duration) {
        const dur = num(node.duration, sprite, env)
        sprite.sayExpiry = Date.now() + dur * 1000
      } else {
        sprite.sayExpiry = 0
      }
      break
    }

    case 'show':
      sprite.visible = true
      break

    case 'hide':
      sprite.visible = false
      break

    case 'set_size':
      sprite.size = num(node.percent, sprite, env)
      break

    case 'switch_costume': {
      const costumeVal = String(evalExpr(node.costume, sprite, env))
      if (!costumeVal || costumeVal === '0' || costumeVal === 'default') {
        sprite.costume = null
      } else {
        const img = new Image()
        img.src = costumeVal
        img.onload = () => {
          sprite.costume = img
        }
      }
      break
    }

    case 'wait': {
      const seconds = num(node.seconds, sprite, env)
      await sleep(seconds * 1000, abortSignal)
      if (abortSignal?.aborted) return { type: 'stop', target: 'all' }
      break
    }

    case 'wait_until': {
      while (!abortSignal?.aborted) {
        const cond = evalExpr(node.condition, sprite, env)
        if (cond) break
        await yieldFrame()
      }
      break
    }

    case 'repeat': {
      const count = num(node.count, sprite, env)
      for (let i = 0; i < count; i++) {
        const result = await execute(node.body, sprite, env, abortSignal)
        if (result) return result
        await yieldFrame()
      }
      break
    }

    case 'repeat_until': {
      while (!abortSignal?.aborted) {
        const cond = evalExpr(node.condition, sprite, env)
        if (cond) break
        const result = await execute(node.body, sprite, env, abortSignal)
        if (result) return result
        await yieldFrame()
      }
      break
    }

    case 'forever':
      while (!abortSignal?.aborted) {
        const result = await execute(node.body, sprite, env, abortSignal)
        if (result) return result
        await yieldFrame()
      }
      break

    case 'if': {
      const cond = evalExpr(node.condition, sprite, env)
      if (cond) {
        const result = await execute(node.body, sprite, env, abortSignal)
        if (result) return result
      } else if (node.elseBody) {
        const result = await execute(node.elseBody, sprite, env, abortSignal)
        if (result) return result
      }
      break
    }

    case 'set_variable':
      env.setVariable(sprite.id, node.name, evalExpr(node.value, sprite, env))
      break

    case 'change_variable': {
      const cur = env.getVariable(sprite.id, node.name)
      env.setVariable(sprite.id, node.name, Number(cur) + num(node.delta, sprite, env))
      break
    }

    case 'stop':
      return { type: 'stop', target: node.target }

    case 'print': {
      const text = String(evalExpr(node.text, sprite, env))
      if (env.onPrint) env.onPrint(text)
      break
    }

    case 'show_variable':
      env.showVariable(node.name)
      break

    case 'hide_variable':
      env.hideVariable(node.name)
      break

    case 'reset_timer':
      env.resetTimer()
      break

    case 'pen_down':
      env.pen.isDown = true
      break

    case 'pen_up':
      env.pen.isDown = false
      break

    case 'pen_clear':
      env.clearPen()
      break

    case 'pen_set_color':
      env.pen.color = node.color
      break

    case 'pen_set_size':
      env.pen.size = num(node.size, sprite, env)
      break

    case 'pen_stamp':
      env.pen.stamps.push({
        x: sprite.x,
        y: sprite.y,
        direction: sprite.direction,
        size: sprite.size
      })
      break
  }

  return null
}

function yieldFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise(resolve => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      resolve()
    }, { once: true })
  })
}
