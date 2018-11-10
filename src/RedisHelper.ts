import redis from 'redis';

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
    static client:redis.RedisClient = null;

    static Init()
    {
        RedisHelper.client=redis.createClient();
        //错误监听
        RedisHelper.client.on("error", function (err)
        {
            console.error("Error " + err);
        });

        RedisHelper.client.on("ready",function(err)
        {
            console.log("redisCache connection succeed")
        });
    }

}