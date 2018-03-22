import minimist from 'minimist'

export const cleanCommand = commandLine => commandLine.trim().replace(/\s\s+/g, ' ')

export const parseCommand = (commandLine) => {
  const clean = cleanCommand(commandLine)
  const [ command, ...parsedArguments ] = clean.split(' ')

  const args = minimist(parsedArguments)
  const argsOriginal = parsedArguments.join(' ')

  return {
    command,

    args,
    argsOriginal,
  }
}
