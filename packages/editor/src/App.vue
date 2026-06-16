<template>
  <div class="app" :class="{ 'is-fullscreen': isFullscreen }">
    <div class="editor-panel">
      <BlockEditor
        ref="editorRef"
        :sprite-id="sprites[0]?.id"
        @hats-changed="onHatsChanged"
      />
    </div>
    <div class="right-panel">
      <Toolbar
        :running="engine.isRunning"
        :is-fullscreen="isFullscreen"
        @toggle-run="toggleRun"
        @stop="stopAll"
        @toggle-fullscreen="toggleFullscreen"
      />
      <Stage
        ref="stageRef"
        :sprites="sprites"
        @sprite-clicked="onSpriteClicked"
        @mouse-moved="onMouseMove"
      />
      <SpritePanel
        :sprites="sprites"
        :selected-id="selectedSpriteId"
        @add-sprite="addSprite"
        @delete-sprite="deleteSprite"
        @select-sprite="selectedSpriteId = $event"
        @rename-sprite="renameSprite"
      />
      <ConsolePanel
        :lines="consoleLines"
        @clear="consoleLines = []"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import BlockEditor from './components/BlockEditor.vue'
import Stage from './components/Stage.vue'
import Toolbar from './components/Toolbar.vue'
import SpritePanel from './components/SpritePanel.vue'
import ConsolePanel from './components/ConsolePanel.vue'
import { createSprite, type Sprite } from './canvas/sprite'
import { Engine } from './runtime/engine'
import type { HatBlock } from './runtime/types'

const editorRef = ref<InstanceType<typeof BlockEditor>>()
const stageRef = ref<InstanceType<typeof Stage>>()

const sprites = reactive<Sprite[]>([createSprite('Кот')])
const selectedSpriteId = ref(sprites[0].id)
const consoleLines = ref<string[]>([])
const isFullscreen = ref(false)

const engine = new Engine()
engine.setSprites(sprites)
engine.setOnStateChange(() => {
  sprites.forEach(s => { s.sayText = s.sayText })
})
engine.env.onPrint = (text: string) => {
  consoleLines.value.push(text)
}

const varUpdateInterval = setInterval(() => {
  if (engine.isRunning) {
    stageRef.value?.updateVisibleVariables(engine.env.getVisibleVariables())
    stageRef.value?.updatePen(engine.env.pen)
    // Check sayExpiry
    const now = Date.now()
    for (const sprite of sprites) {
      if (sprite.sayExpiry > 0 && now > sprite.sayExpiry) {
        sprite.sayText = ''
        sprite.sayType = null
        sprite.sayExpiry = 0
      }
    }
  }
}, 50)

onUnmounted(() => clearInterval(varUpdateInterval))

function onHatsChanged(hats: HatBlock[]) {
  engine.setHats(hats)
}

function toggleRun() {
  if (engine.isRunning) {
    stopAll()
  } else {
    consoleLines.value = []
    // Reset sprites to initial positions
    for (const sprite of sprites) {
      sprite.x = 0
      sprite.y = 0
      sprite.direction = 90
      sprite.visible = true
      sprite.size = 100
      sprite.sayText = ''
      sprite.sayType = null
      sprite.sayExpiry = 0
    }
    stageRef.value?.updatePen({ isDown: false, color: '#000000', size: 2, lines: [], stamps: [] })
    engine.start()
  }
}

function stopAll() {
  engine.stop()
}

function onSpriteClicked(spriteId: string) {
  engine.handleSpriteClick(spriteId)
}

function onMouseMove(x: number, y: number) {
  engine.handleMouseMove(x, y)
}

function addSprite() {
  const sprite = createSprite(`Спрайт ${sprites.length + 1}`)
  sprites.push(sprite)
  selectedSpriteId.value = sprite.id
}

function deleteSprite(id: string) {
  if (sprites.length <= 1) return
  const idx = sprites.findIndex(s => s.id === id)
  if (idx >= 0) {
    sprites.splice(idx, 1)
    if (selectedSpriteId.value === id) {
      selectedSpriteId.value = sprites[0].id
    }
  }
}

function renameSprite(id: string, name: string) {
  const sprite = sprites.find(s => s.id === id)
  if (sprite) sprite.name = name
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

document.addEventListener('keydown', (e) => {
  if ((e.target as HTMLElement)?.tagName === 'INPUT') return
  engine.handleKeyPress(e.key)
})

document.addEventListener('keyup', (e) => {
  if ((e.target as HTMLElement)?.tagName === 'INPUT') return
  engine.handleKeyRelease(e.key)
})
</script>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  gap: 4px;
}

.editor-panel {
  flex: 1;
  min-width: 0;
  background: #181825;
  border-radius: 8px;
  overflow: hidden;
}

.right-panel {
  width: 520px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app.is-fullscreen .editor-panel {
  display: none;
}

.app.is-fullscreen .right-panel {
  width: 100vw;
  height: 100vh;
}

.app.is-fullscreen :deep(.sprite-panel),
.app.is-fullscreen :deep(.console-panel) {
  display: none;
}
</style>
