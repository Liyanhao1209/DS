class Task{
    name // 任务名
    start // 任务开始时间
    end //任务最迟结束时间
    exeTime //执行时间
    weight //优先级
     
    constructor(name,start,end,exeTime,weight){
        this.name=name
        this.start=start
        this.end=end
        this.exeTime=exeTime
        this.weight=weight
    }
}

module.exports=
{
    Task,
}