import * as Blockly from 'blockly/core'

export function defineMotionBlocks() {
  Blockly.Blocks['motion_move'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('STEPS').setCheck('Number').appendField('переместить на').appendField(new Blockly.FieldNumber(10), '_').appendField('шагов')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(210)
    }
  }

  Blockly.Blocks['motion_turn_cw'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('DEGREES').setCheck('Number').appendField('повернуть ↻').appendField(new Blockly.FieldNumber(15), '_').appendField('градусов')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(210)
    }
  }

  Blockly.Blocks['motion_turn_ccw'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('DEGREES').setCheck('Number').appendField('повернуть ↺').appendField(new Blockly.FieldNumber(15), '_').appendField('градусов')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(210)
    }
  }

  Blockly.Blocks['motion_goto'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('X').setCheck('Number').appendField('идти в x:')
      this.appendValueInput('Y').setCheck('Number').appendField('y:')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(210)
    }
  }

  Blockly.Blocks['motion_set_x'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('X').setCheck('Number').appendField('изменить x на')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(210)
    }
  }

  Blockly.Blocks['motion_set_y'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('Y').setCheck('Number').appendField('изменить y на')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(210)
    }
  }

  Blockly.Blocks['motion_glide'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('SECS').setCheck('Number').appendField('скользить').appendField(new Blockly.FieldNumber(1), '_').appendField('сек. в x:')
      this.appendValueInput('X').setCheck('Number')
      this.appendDummyInput().appendField('y:')
      this.appendValueInput('Y').setCheck('Number')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(210)
    }
  }

  Blockly.Blocks['motion_point_in_direction'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('DIR').setCheck('Number').appendField('указать в направлении')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(210)
    }
  }

  Blockly.Blocks['motion_bounce_edge'] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField('если на ребре, отскочить')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(210)
    }
  }

  Blockly.Blocks['motion_x'] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField('x позиция')
      this.setOutput(true, 'Number')
      this.setColour(210)
    }
  }

  Blockly.Blocks['motion_y'] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField('y позиция')
      this.setOutput(true, 'Number')
      this.setColour(210)
    }
  }

  Blockly.Blocks['motion_direction'] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField('направление')
      this.setOutput(true, 'Number')
      this.setColour(210)
    }
  }
}
