interface LogMeta {
  [key: string]: unknown;
}

export const logger = {
  info: (message: string, meta?: LogMeta) => {
    console.log(
      JSON.stringify({
        level: "info",
        message,
        meta,
        timestamp: new Date().toISOString(),
      })
    );
  },

  error: (message: string, meta?: LogMeta) => {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        meta,
        timestamp: new Date().toISOString(),
      })
    );
  },

  warn: (message: string, meta?: LogMeta) => {
    console.warn(
      JSON.stringify({
        level: "warn",
        message,
        meta,
        timestamp: new Date().toISOString(),
      })
    );
  },

  debug: (message: string, meta?: LogMeta) => {
    console.debug(
      JSON.stringify({
        level: "debug",
        message,
        meta,
        timestamp: new Date().toISOString(),
      })
    );
  },
};
