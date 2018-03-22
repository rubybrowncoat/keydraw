import paint from '../system/paint'

export default ({ argsOriginal }) => new Promise((resolve, reject) => {
  resolve(paint(argsOriginal))
})
