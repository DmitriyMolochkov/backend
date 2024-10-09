export function buildLogMsg(message: string, prefix?: string) {
  const time: string = new Date().toLocaleTimeString('en-US', { timeZone: 'UTC' });

  return prefix
    ? `${time} [${prefix}]: ${message}`
    : `${time}: ${message}`;
}
