import log4js, { Logger } from "log4js"

export class LogHelper
{

    static logLogger: Logger;

    static Init()
    {
        log4js.configure({
            //配置不同的输出目的地
            appenders: {
                logFile: {
                    type: 'file',
                    filename: './logs/log.log',
                    maxLogSize: 5000000,
                    backups: 5,
                    replaceConsole: true
                },
                console: {
                    type: 'console',
                    replaceConsole: true
                },
            },
            //配置不同的logger类别
            categories: {
                default: { appenders: ['console', 'logFile'], level: 'trace' },
            },
        });

        LogHelper.logLogger = log4js.getLogger("default");

        // log4js.shutdown(
        //     (error: Error) =>
        //     {
        //         LogHelper.error(error);
        //     });

    }


    static debug(message: any, ...args: any[])
    {
        LogHelper.logLogger.debug(message, ...args);
    }

    static info(message: any, ...args: any[])
    {
        LogHelper.logLogger.info(message, ...args);
    }

    static warn(message: any, ...args: any[])
    {
        LogHelper.logLogger.warn(message, ...args);
    }

    static error(message: any, ...args: any[])
    {
        LogHelper.logLogger.error(message, ...args);
    }



}