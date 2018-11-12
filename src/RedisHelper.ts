import redis from 'redis';
import { LogHelper } from './LogHelper';

export class RedisHelper
{
    // private static instance:RedisHelper;
    // static GetInstance():RedisHelper
    // {
    //     if (!RedisHelper.instance) 
    //     {
    //         RedisHelper.instance=new RedisHelper();
    //         this.client=redis.createClient();    
    //     }
    //     return RedisHelper.instance;
    // }

    //内存数据库     
    static client: redis.RedisClient = null;

    static Init()
    {
        RedisHelper.client = redis.createClient();
        //错误监听
        RedisHelper.client.on("error", function (err)
        {
            LogHelper.error(err);
        });

        RedisHelper.client.on("ready", function (info)
        {
            LogHelper.info("redisCache connection succeed",info)
        });
    }

}