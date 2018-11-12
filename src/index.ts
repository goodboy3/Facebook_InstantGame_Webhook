import { HttpsServer } from "./HttpsServer";
import { RedisHelper } from "./RedisHelper";
import { LogHelper } from "./LogHelper";




class StartUp
{
    public static main(): number
    {
        LogHelper.Init();
        LogHelper.info("Server server");

        //redis-client初始化
        RedisHelper.Init();

        //开启https服务器
        HttpsServer.GetInstance().Init();
        HttpsServer.GetInstance().Run();


        return 0;
    }
}

StartUp.main();




