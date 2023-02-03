const { hours } = require("../config/constConfig")
const { Task } = require("../Entity/Task")
const { findInTree, uniteInTree } = require("../Util/EquivTreeUtil")

//初次调度结果
function getResult(result,Nodes,tasks){
    let length = tasks.length
    for(i=0;i<length;i++){
        var task = tasks[i]
        var restTime = task.exeTime
        var equiv = findInTree(task.end,Nodes)
        while(restTime!==0){
            if(equiv!==0 && equiv > task.start){
                result[equiv] = new Task
                (
                    task.name,
                    task.start,
                    task.end,
                    task.exeTime,
                    task.weight
                )
                uniteInTree(findInTree(equiv-1,Nodes),equiv,Nodes)
            }
            else{
                return null
            }
            restTime+=(-1)
            equiv = findInTree(task.end,Nodes)
        }
    }
    return result
}

//调整至优先级最优
function adjustByPriority(result){
    var flag = true
    while(flag){
        flag = false
        for(i=1;i<=hours;i++){
            var currentTask = result[i]
            
            //遍历这个位置后面的所有位置，询问是否有元素交换
            for(j=i+1;j<=hours;j++){
                
                var afterTask = WMResult[j]
                if(currentTask.start<j+1 && currentTask.end>=j+1){
                    if(afterTask.start<i && afterTask.end>=i){
                        if(currentTask.weight<afterTask.weight){
                            let temp = new Task
                            (
                                currentTask.name,
                                currentTask.start,
                                currentTask.end,
                                currentTask.exeTime,
                                currentTask.weight
                            )
                            result[i]=afterTask
                            result[j]=temp
                            flag=true
                            //更新当前元素
                            currentTask = result[i]
                        }
                    }
                }
            
            }
        
        }
    }
    return result
}

module.exports=
{
    getResult,
    adjustByPriority
}