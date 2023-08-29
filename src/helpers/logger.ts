import * as Environment from "./environment";

/**
 * Logs a message if debug mode is enabled, or does nothing otherwise.
 * @param message The error message to be logged.
 */
export function debug(...message: unknown[]): void {
    if (Environment.isDevelopment) {
        console.log(message);
    }
}