export class Random
{
    /**
     *  随机0-1间的浮点数
     */
    static Random0To1Float()
    {
        return Math.random();
    }

    /**
     *  随机0或者1
     */
    static Random0To1Int()
    {
        return Math.round(Math.random());
    }

    /**
     *  0-9随机
     */
    static Random0To9Int()
    {
        return Math.floor(Math.random() * 10);
    }

    /**
     *  min max 间随机产生一个小数 min包括 max包括
     */
    static RandomInt(min: number, max: number)
    {
        let offset = max - min;
        let num = Math.floor(Math.random() * (offset + 1)) + min;
        return num;
    }

    /**
     *  min max 间随机产生一个小数 min包括 max不包括
     */
    static RandomFloat(min: number, max: number)
    {
        return Math.random() * (max - min) + min;
    }
}