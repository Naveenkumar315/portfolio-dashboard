import fs from 'fs'
import path from 'path'

const logDir = path.join(process.cwd(), 'logs')
const errorFile = path.join(logDir, 'error.log')

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logError = (msg, context) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] Error: ${msg}\n${context}\n\n`;
    fs.appendFileSync(errorFile, logMessage, 'utf8')

}

const infoFile = path.join(logDir, 'info.log')

const logInfo = (msg, context) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] Info: ${msg}\n${context}\n\n`;
    fs.appendFileSync(infoFile, logMessage, 'utf8')
}

export { logError, logInfo }