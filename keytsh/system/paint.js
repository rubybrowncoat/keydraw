import classNames from 'classnames'

const paint = (string, args = {}) => {
  if (!string) {
    return ''
  }

  const classes = classNames('paint', ...(args.styles ? args.styles : {}))
  const linkedString = args.link
    ? `<a href="${args.link}" target="_blank">${string}</a>`
    : string

  const painted = `<span class="${classes}">${linkedString}</span>`

  return painted
}

export default paint
