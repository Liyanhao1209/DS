const {TaskNode} = require('../Entity/TaskNode')
const {TaskChain} = require('../Entity/TaskChain')
const {byStart,byPriority,rangeForStart,rangeForPriority} = require('../config/constConfig')

class Task{
    name // 任务名
    start // 任务开始时间
    end //任务最迟结束时间
     
    constructor(name,start,end){
        this.name=name
        this.start=start
        this.end=end
    }
}

class MultiTask{
    name // 任务名
    start // 任务开始时间
    end // 任务最迟结束时间
    exeTime // 任务执行需要时间

    constructor(name,start,end,exeTime){
        this.name=name
        this.start=start
        this.end=end
        this.exeTime=exeTime
    }
}

class WeightedTask{
    name // 任务名
    start //任务开始时间
    end // 任务最迟结束时间
    exeTime // 任务执行需要时间
    weight // 权重/优先级

    constructor(name,start,end,exeTime,weight){
        this.name=name
        this.start=start
        this.end=end
        this.exeTime=exeTime
        this.weight=weight
    }
}

//单位时间无优先级任务的排序
function sortTask(tasks){
    let length = tasks.length
    //冒泡排序tasks 标准为:任务越晚开始越靠前,同级顺序不变
    for(i=1;i<=length-1;i++){
        for(j=0;j<length-1;j++){
            if(tasks[j].start<tasks[j+1].start){
                //交换对象
                let temp = new Task
                (
                    tasks[j].name,tasks[j].start,tasks[j].end
                )
                tasks[j]=tasks[j+1]
                tasks[j+1]=temp
            }
        }
    }
}

//任意时间无优先级任务的排序
function sortMultiTask(tasks){
    let length = tasks.length
    //冒泡排序tasks 标准为:任务越晚开始越靠前,同级顺序不变
    for(i=1;i<=length-1;i++){
        for(j=0;j<length-1;j++){
            if(tasks[j].start<tasks[j+1].start){
                //交换对象
                let temp = new MultiTask
                (
                    tasks[j].name,tasks[j].start,tasks[j].end,tasks[j].exeTime
                )
                tasks[j]=tasks[j+1]
                tasks[j+1]=temp
            }
        }
    }
}

//单位时间有优先级任务的桶排序
//@ param : standard 为标记,指示按开始时间排还是按优先级排
function binSortWeightedTask(tasks,standard,range){
    //一堆桶
    var bins = new Array()
    //初始化这堆桶
    for(i=0;i<=range;i++){
        bins.push(new TaskChain(null,0))
    }
    //根据开始时间排序,开始越晚越靠前
    if(standard===byStart){
        let length = tasks.length
        for(i=0;i<length;i++){
            let task = tasks[i]
            //修改开始时间指向的桶
            bins[task.start].insert(task,0)
        }
    }
    //根据优先级排序,优先级越高越靠前
    else if(standard===byPriority){
        let length = tasks.length
        for(i=0;i<length;i++){
            let task = tasks[i]
            //修改优先级指向的桶
            bins[task.weight].insert(task,0)
        }
    }
    //把所有桶中的元素收集回tasks[]数组
    var resultChain = new TaskChain(null,0)
    for(j=0;j<=range;j++){
        while(!bins[j].empty()){
            let task = bins[j].get(0)
            resultChain.insert(task,0)
            bins[j].erase(0) 
        }
    }
    //把结果链表里的值全部复制给tasks
    tasks=resultChain.copyToArray(tasks)
    return tasks
}

//单位时间有优先级任务的基数排序
function radixSortWeightedTask(tasks){
    //先按照优先级进行桶排序，再按照开始时间进行
    tasks=binSortWeightedTask(tasks,byPriority,rangeForPriority)
    tasks=binSortWeightedTask(tasks,byStart,rangeForStart)
    return tasks
}

module.exports=
{
    Task,
    MultiTask,
    WeightedTask,
    sortTask,
    sortMultiTask,
    radixSortWeightedTask
}