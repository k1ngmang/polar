import * as Blockly from 'blockly/core'

export function defineLooksBlocks() {
  Blockly.Blocks['looks_say'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('TEXT').appendField('сказать')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(260)
    }
  }

  Blockly.Blocks['looks_say_for'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('TEXT').appendField('сказать')
      this.appendValueInput('SECS').setCheck('Number').appendField('for').appendField(new Blockly.FieldNumber(2), '_').appendField('secs')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(260)
    }
  }

  Blockly.Blocks['looks_think'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('TEXT').appendField('думать')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(260)
    }
  }

  Blockly.Blocks['looks_think_for'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('TEXT').appendField('думать')
      this.appendValueInput('SECS').setCheck('Number').appendField('for').appendField(new Blockly.FieldNumber(2), '_').appendField('secs')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(260)
    }
  }

  Blockly.Blocks['looks_show'] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField('показать')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(260)
    }
  }

  Blockly.Blocks['looks_hide'] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField('скрыть')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(260)
    }
  }

  Blockly.Blocks['looks_set_size'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('PERCENT').setCheck('Number').appendField('изменить размер').appendField(new Blockly.FieldNumber(100), '_').appendField('%')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(260)
    }
  }

  Blockly.Blocks['looks_switch_costume'] = {
    init(this: Blockly.Block) {
      this.appendValueInput('COSTUME').appendField('сменить костюм на')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(260)
    }
  }
}
