const { hours, unitTime } = require("../config/constConfig")
const { Task } = require("../Entity/Task")
const { initializeInTree } = require("./EquivTreeUtil")
const { radixSortWeightedTask } = require("./TaskUtil")

//Json数组转实体数组
function getTasksEntity(Tasks){
    let length = Tasks.length
    var tasks = new Array()
    for(i=0;i<length;i++){
        let temp = Tasks[i]
        let task = new Task(temp.name,temp.start,temp.end,temp.exeTime,temp.weight)
        tasks.push(task)
    }
    //先对优先级升序，再对结束时间降序
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
                0,
                hours,
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