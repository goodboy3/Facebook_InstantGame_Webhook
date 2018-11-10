import { HttpsServer } from "./HttpsServer";
import { RedisHelper } from "./RedisHelper";




class StartUp {
    public static main():number
    {
        console.log("Server server");

        //redis-client初始化
        RedisHelper.Init();

        //开启https服务器
        HttpsServer.GetInstance().Init();
        HttpsServer.GetInstance().Run();


        return 0;
    }
}

StartUp.main();




