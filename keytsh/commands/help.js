import paint from '../system/paint'

export default ({ args }) => new Promise((resolve, reject) => {
  const helpLines = [
    '',
    `${paint('EXCLAMATION MARK', { styles: ['red', 'underline', 'bold'] })} &mdash; ${paint('Toggle the <u>Keytsh</u> console.')}`,
    `${paint('ARROWS', { styles: ['magenta', 'underline', 'bold'] })} &mdash; ${paint('Move the drawing keyset across the board in the selected direction.')}`,
    `${paint('SHIFT + ARROWS', { styles: ['magenta', 'underline', 'bold'] })} &mdash; ${paint('Increment or decrement the size of the board in the selected direction.')}`,
    `${paint('TO DO', { styles: ['cyan', 'underline', 'bold'] })}`,
  ]

  resolve(helpLines)
})
