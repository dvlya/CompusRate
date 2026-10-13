export function validateEnvironment(config: Record<string, unknown>) {
  const port = Number(config.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  if (typeof config.DATA_FILE_PATH !== 'string' || config.DATA_FILE_PATH.trim() === '') {
    throw new Error('DATA_FILE_PATH is required.');
  }

  return { ...config, PORT: port };
}
