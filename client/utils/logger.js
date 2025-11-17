const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
    error: (message, error = null) => {
        if (isDevelopment) {
            console.error(`[ERROR] ${message}`, error || '');
        }
    },

    warn: (message) => {
        if (isDevelopment) {
            console.warn(`[WARN] ${message}`);
        }
    },

    info: (message) => {
        if (isDevelopment) {
            // eslint-disable-next-line no-console
            console.log(`[INFO] ${message}`);
        }
    },
};
