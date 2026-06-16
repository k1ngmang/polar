import type { ASTNode, HatBlock } from './types'
import type { Sprite } from '../canvas/sprite'
import * as Blockly from 'blockly/core'

function compileExpr(block: Blockly.Block | null): ASTNode {
  if (!block) return { type: 'number_literal', value: 0 }
  const type = block.type

  switch (type) {
    case 'math_number':
      return { type: 'number_literal', value: Number(block.getFieldValue('NUM')) }
    case 'text':
      return { type: 'string_literal', value: String(block.getFieldValue('TEXT')) }
    case 'var_get':
      return { type: 'variable_ref', name: String(block.getFieldValue('NAME')) }

    case 'motion_x':
      return { type: 'variable_ref', name: '__x__' }
    case 'motion_y':
      return { type: 'variable_ref', name: '__y__' }
    case 'motion_direction':
      return { type: 'variable_ref', name: '__dir__' }

    case 'op_add':
      return { type: 'binary_op', op: '+', left: compileExpr(block.getInputTargetBlock('A')!), right: compileExpr(block.getInputTargetBlock('B')!) }
    case 'op_subtract':
      return { type: 'binary_op', op: '-', left: compileExpr(block.getInputTargetBlock('A')!), right: compileExpr(block.getInputTargetBlock('B')!) }
    case 'op_multiply':
      return { type: 'binary_op', op: '*', left: compileExpr(block.getInputTargetBlock('A')!), right: compileExpr(block.getInputTargetBlock('B')!) }
    case 'op_divide':
      return { type: 'binary_op', op: '/', left: compileExpr(block.getInputTargetBlock('A')!), right: compileExpr(block.getInputTargetBlock('B')!) }
    case 'op_lt':
      return { type: 'binary_op', op: '<', left: compileExpr(block.getInputTargetBlock('A')!), right: compileExpr(block.getInputTargetBlock('B')!) }
    case 'op_gt':
      return { type: 'binary_op', op: '>', left: compileExpr(block.getInputTargetBlock('A')!), right: compileExpr(block.getInputTargetBlock('B')!) }
    case 'op_equals':
      return { type: 'binary_op', op: '=', left: compileExpr(block.getInputTargetBlock('A')!), right: compileExpr(block.getInputTargetBlock('B')!) }
    case 'op_and':
      return { type: 'binary_op', op: 'and', left: compileExpr(block.getInputTargetBlock('A')!), right: compileExpr(block.getInputTargetBlock('B')!) }
    case 'op_or':
      return { type: 'binary_op', op: 'or', left: compileExpr(block.getInputTargetBlock('A')!), right: compileExpr(block.getInputTargetBlock('B')!) }
    case 'op_not':
      return { type: 'not', operand: compileExpr(block.getInputTargetBlock('OPERAND')!) }
    case 'op_random':
      return { type: 'random', from: compileExpr(block.getInputTargetBlock('FROM')!), to: compileExpr(block.getInputTargetBlock('TO')!) }

    default: {
      const val = block.getFieldValue('NUM') ?? block.getFieldValue('TEXT') ?? 0
      return { type: 'number_literal', value: Number(val) || 0 }
    }
  }
}

function getInput(block: Blockly.Block, name: string): ASTNode {
  const target = block.getInputTargetBlock(name)
  if (target) return compileExpr(target)
  return { type: 'number_literal', value: Number(block.getFieldValue(name)) || 0 }
}

function compileStmt(block: Blockly.Block): ASTNode {
  try {
    return compileStmtInner(block)
  } catch (e) {
    console.error('Block compile error:', block.type, e)
    return { type: 'sequence', body: [] }
  }
}

function getStaticString(block: Blockly.Block | null, defaultValue: string): string {
  if (!block) return defaultValue
  if (block.type === 'text') {
    return String(block.getFieldValue('TEXT'))
  }
  const val = block.getFieldValue('TEXT') ?? block.getFieldValue('NUM') ?? block.getFieldValue('NAME')
  if (val !== null && val !== undefined) return String(val)
  return defaultValue
}

function compileStmtInner(block: Blockly.Block): ASTNode {
  switch (block.type) {
    case 'motion_move':
      return { type: 'move', steps: getInput(block, 'STEPS') }
    case 'motion_turn_cw':
      return { type: 'turn', direction: 'cw', degrees: getInput(block, 'DEGREES') }
    case 'motion_turn_ccw':
      return { type: 'turn', direction: 'ccw', degrees: getInput(block, 'DEGREES') }
    case 'motion_goto':
      return { type: 'goto', x: getInput(block, 'X'), y: getInput(block, 'Y') }
    case 'motion_set_x':
      return { type: 'set_x', x: getInput(block, 'X') }
    case 'motion_set_y':
      return { type: 'set_y', y: getInput(block, 'Y') }
    case 'motion_glide':
      return { type: 'glide', secs: getInput(block, 'SECS'), x: getInput(block, 'X'), y: getInput(block, 'Y') }
    case 'motion_point_in_direction':
      return { type: 'point_in_direction', dir: getInput(block, 'DIR') }
    case 'motion_bounce_edge':
      return { type: 'bounce_on_edge' }

    case 'looks_say':
      return { type: 'say', text: getInput(block, 'TEXT') }
    case 'looks_say_for':
      return { type: 'say', text: getInput(block, 'TEXT'), duration: getInput(block, 'SECS') }
    case 'looks_think':
      return { type: 'think', text: getInput(block, 'TEXT') }
    case 'looks_think_for':
      return { type: 'think', text: getInput(block, 'TEXT'), duration: getInput(block, 'SECS') }
    case 'looks_show':
      return { type: 'show' }
    case 'looks_hide':
      return { type: 'hide' }
    case 'looks_set_size':
      return { type: 'set_size', percent: getInput(block, 'PERCENT') }
    case 'looks_switch_costume':
      return { type: 'switch_costume', costume: getInput(block, 'COSTUME') }

    case 'control_wait':
      return { type: 'wait', seconds: getInput(block, 'SECS') }
    case 'control_wait_until':
      return { type: 'wait_until', condition: getInput(block, 'COND') }
    case 'control_repeat':
      return { type: 'repeat', count: getInput(block, 'COUNT'), body: compileBody(block, 'BODY') }
    case 'control_repeat_until':
      return { type: 'repeat_until', condition: getInput(block, 'COND'), body: compileBody(block, 'BODY') }
    case 'control_forever':
      return { type: 'forever', body: compileBody(block, 'BODY') }
    case 'control_for_each': {
      const varName = String(block.getFieldValue('VAR'))
      const from = getInput(block, 'FROM')
      const to = getInput(block, 'TO')
      const body = compileBody(block, 'BODY')
      return {
        type: 'sequence',
        body: [
          { type: 'set_variable', name: varName, value: from },
          { type: 'repeat_until', condition: { type: 'binary_op', op: '>', left: { type: 'variable_ref', name: varName }, right: to }, body: { type: 'sequence', body: [body, { type: 'change_variable', name: varName, delta: { type: 'number_literal', value: 1 } }] } }
        ]
      }
    }
    case 'control_if':
      return { type: 'if', condition: getInput(block, 'COND'), body: compileBody(block, 'BODY') }
    case 'control_if_else':
      return { type: 'if', condition: getInput(block, 'COND'), body: compileBody(block, 'BODY'), elseBody: compileBody(block, 'ELSE') }
    case 'control_stop':
      return { type: 'stop', target: block.getFieldValue('TARGET') as 'all' | 'this' }

    case 'var_set':
      return { type: 'set_variable', name: String(block.getFieldValue('NAME')), value: getInput(block, 'VALUE') }
    case 'var_create':
      return { type: 'set_variable', name: String(block.getFieldValue('NAME')), value: getInput(block, 'VALUE') }
    case 'var_change':
      return { type: 'change_variable', name: String(block.getFieldValue('NAME')), delta: getInput(block, 'DELTA') }

    case 'var_show':
      return { type: 'show_variable', name: String(block.getFieldValue('NAME')) }
    case 'var_hide':
      return { type: 'hide_variable', name: String(block.getFieldValue('NAME')) }

    case 'text_print':
      return { type: 'print', text: getInput(block, 'TEXT') }

    // Sensing
    case 'sensing_key_pressed':
      return { type: 'key_pressed', key: String(block.getFieldValue('KEY')) }
    case 'sensing_mouse_x':
      return { type: 'mouse_x' }
    case 'sensing_mouse_y':
      return { type: 'mouse_y' }
    case 'sensing_touching_edge':
      return { type: 'touching_edge' }
    case 'sensing_touching_sprite': {
      const target = block.getInputTargetBlock('SPRITE')
      const name = getStaticString(target, 'Кот')
      return { type: 'touching_sprite', sprite: name }
    }
    case 'sensing_distance_to': {
      const target = block.getInputTargetBlock('SPRITE')
      const name = getStaticString(target, 'Кот')
      return { type: 'distance_to', sprite: name }
    }
    case 'sensing_timer':
      return { type: 'timer' }
    case 'sensing_reset_timer':
      return { type: 'reset_timer' }
    case 'sensing_of': {
      const target = block.getInputTargetBlock('SPRITE')
      const name = getStaticString(target, 'Кот')
      return { type: 'sprite_property', sprite: name, property: String(block.getFieldValue('PROP')) }
    }

    // Pen
    case 'pen_down':
      return { type: 'pen_down' }
    case 'pen_up':
      return { type: 'pen_up' }
    case 'pen_clear':
      return { type: 'pen_clear' }
    case 'pen_set_color':
      return { type: 'pen_set_color', color: String(block.getFieldValue('COLOR')) }
    case 'pen_set_size':
      return { type: 'pen_set_size', size: getInput(block, 'SIZE') }
    case 'pen_stamp':
      return { type: 'pen_stamp' }

    default:
      return { type: 'sequence', body: [] }
  }
}

function compileBody(block: Blockly.Block, inputName: string): ASTNode {
  const bodyBlock = block.getInputTargetBlock(inputName)
  if (!bodyBlock) return { type: 'sequence', body: [] }
  return compileStatementChain(bodyBlock)
}

function compileStatementChain(firstBlock: Blockly.Block): ASTNode {
  const stmts: ASTNode[] = []
  let current: Blockly.Block | null = firstBlock
  while (current) {
    if (isStatementBlock(current)) {
      stmts.push(compileStmt(current))
    }
    current = current.getNextBlock()
  }
  if (stmts.length === 1) return stmts[0]
  return { type: 'sequence', body: stmts }
}

function isStatementBlock(block: Blockly.Block): boolean {
  return block.type !== 'math_number' && block.type !== 'text' && block.type !== 'var_get'
}

export function compileWorkspace(workspace: Blockly.Workspace, defaultSpriteId: string = 'default'): HatBlock[] {
  const hats: HatBlock[] = []
  const blocks = workspace.getTopBlocks(true)

  for (const block of blocks) {
    const spriteId = (block as any).spriteId || defaultSpriteId
    let trigger: HatBlock['trigger'] | null = null

    switch (block.type) {
      case 'event_flag_clicked':
        trigger = { type: 'flag_clicked' }
        break
      case 'event_key_pressed':
        trigger = { type: 'key_pressed', key: String(block.getFieldValue('KEY')) }
        break
      case 'event_sprite_clicked':
        trigger = { type: 'sprite_clicked' }
        break
    }

    if (trigger) {
      const bodyBlock = block.getInputTargetBlock('BODY')
      const body = bodyBlock ? compileStatementChain(bodyBlock) : { type: 'sequence' as const, body: [] }
      hats.push({ spriteId, trigger, body })
    }
  }

  return hats
}
