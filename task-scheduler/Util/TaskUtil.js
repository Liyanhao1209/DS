const {TaskChain} = require('../Entity/TaskChain')
const {byStart,byPriority,rangeForStart,rangeForPriority} = require('../config/constConfig')

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
    binSortWeightedTask,
    radixSortWeightedTask
}