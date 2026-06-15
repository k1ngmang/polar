import * as Blockly from 'blockly/core'

export function defineEventBlocks() {
  Blockly.Blocks['event_flag_clicked'] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField('если ▶ нажатие')
      this.appendStatementInput('BODY')
      this.setColour(45)
      this.setDeletable(false)
      this.setMovable(true)
    }
  }

  Blockly.Blocks['event_key_pressed'] = {
    init(this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('если')
        .appendField(new Blockly.FieldDropdown([
          ['space', ' '],
          ['up arrow', 'ArrowUp'],
          ['down arrow', 'ArrowDown'],
          ['left arrow', 'ArrowLeft'],
          ['right arrow', 'ArrowRight'],
          ['a', 'a'],
          ['b', 'b'],
          ['c', 'c'],
          ['d', 'd'],
          ['e', 'e'],
          ['enter', 'Enter']
        ]), 'KEY')
        .appendField('клавиша нажата')
      this.appendStatementInput('BODY')
      this.setColour(45)
    }
  }

  Blockly.Blocks['event_sprite_clicked'] = {
    init(this: Blockly.Block) {
      this.appendDummyInput().appendField('если спрайт нажат')
      this.appendStatementInput('BODY')
      this.setColour(45)
    }
  }
}
