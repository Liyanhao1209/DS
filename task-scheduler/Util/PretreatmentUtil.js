const { hours, unitTime } = require("../config/constConfig")
const { Task } = require("../Entity/Task")
const { initializeInTree } = require("./EquivTreeUtil")
const { radixSortWeightedTask, heapSortTime } = require("./TaskUtil")

//Json数组转实体数组
//数据格式
/**
 * [
 *  {
 *      name:'A',
 *      start:[-,2,7],
 *      end:[-,4,9],
 *      exeTime:2,
 *      weight:3
 *   },
 *  ...
 * ]
 */
function getTasksEntity(Tasks){
    let length = Tasks.length
    var tasks = new Array()
    for(i=0;i<length;i++){
        let temp = Tasks[i]
        let task = new Task(temp.name,temp.start,temp.end,temp.exeTime,temp.weight)
        tasks.push(task)
    }
    //对每个任务的时间数组做堆排序(升序)
    for(let i=0;i<length;i++){
        tasks[i].start=heapSortTime(tasks[i].start)
        tasks[i].end=heapSortTime(tasks[i].end)
    }
    //先对优先级升序，再对开始时间降序
    tasks=radixSortWeightedTask(tasks)
    return tasks
}

//初始化结果数组
function initResult(){
    var result = new Array()
    for(i=0;i<=hours;i++){
        result.push
        (
            new Task
            (
                null,
                [null,0],
                [null,24],
                unitTime,
                0
            )
            
        )
    }
    return result
}

function getNodes(){
    var Nodes = new Array()
    initializeInTree(hours,Nodes)
    return Nodes
}

module.exports=
{
    getTasksEntity,
    initResult,
    getNodes
}