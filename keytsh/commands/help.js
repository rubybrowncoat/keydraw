export default ({ args }) => new Promise((resolve, reject) => {
  const helpLines = [
    '',
    [
      ['EXCLAMATION MARK', { styles: ['red', 'underline', 'bold'] }],
      '&mdash;',
      [
        'Toggle the',
        ['Keytsh', { styles: ['underlines'] }],
        'console.',
      ],
    ],
    [
      ['ARROWS', { styles: ['magenta', 'underline', 'bold'] }],
      '&mdash; Move the drawing keyset across the board in the selected direction.',
    ],
    [
      ['SHIFT + ARROWS', { styles: ['magenta', 'underline', 'bold'] }],
      '&mdash; Increment or decrement the size of the board in the selected direction.',
    ],
    ['TO DO', { styles: ['cyan', 'underline', 'bold'] }],
  ]

  resolve(helpLines)
})
