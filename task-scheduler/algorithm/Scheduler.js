const { hours } = require("../config/constConfig")
const { Task } = require("../Entity/Task")
const { findInTree, uniteInTree } = require("../Util/EquivTreeUtil")


//初次调度结果
function getResult(result,Nodes,tasks){
    let length = tasks.length
    for(let i=0;i<length;i++){
        var task = tasks[i]
        //剩余执行时间
        var restTime = task.exeTime
        //剩余任务的结束时间始发点
        var restEnd = task.end[task.end.length-1]
        //第一个查找的位置是最后一个结束时间指出的位置
        var equiv = findInTree(restEnd,Nodes)
        while(restTime!==0){
            //标志着所有可执行时段中是否有可用的位置
            var flag = false
            //一旦equiv===0 说明前面的位置全没了，不用再往前找了
            if(equiv!==0){
                //逆序遍历所有时段，查询是否某个时段中有可用的位置
                for(let i=task.start.length-1;i>=1;i--){
                    let curStart = task.start[i]
                    if(equiv > curStart){
                        flag = true
                        //更新剩余任务始发点
                        restEnd = task.end[i]
                        //已经找到合适的位置，停止遍历
                        break
                    }
                    else{
                        //如果本轮不成功，让下一轮的end指出可用的位置
                        //当i为1，此时已经是所有时段中的最后一个，前面的判断说明前方已经没有位置了，调度失败
                        if(i===1){break}
                        else if(i>1){
                            equiv = findInTree(task.end[i-1],Nodes)
                        }
                    }
                }
            }
            if(equiv===0 || !flag){
                //调度失败
                return null
            }
            else{
                //调度成功
                //分配任务进结果数组
                result[equiv] = new Task
                (
                    task.name,
                    task.start,
                    task.end,
                    task.exeTime,
                    task.weight
                )
                //等价类数组合并
                uniteInTree(findInTree(equiv-1,Nodes),equiv,Nodes)
            }
            restTime += (-1)
            //之后的每个单位时长都从当前结束时间始发点出发即可，后面已经没了
            equiv = findInTree(restEnd,Nodes)
        }
    }
    return result
}

//两次询问的函数
/**
 * 
 * @param {当前任务} currentTask 
 * @param {后面的某个任务} afterTask 
 * @param {当前任务索引} indexOfCur 
 * @param {后面的任务的索引} indexOfAft 
 */
function doubleHandShake(currentTask,afterTask,indexOfCur,indexOfAft){
    var flagOfCur = false
    var flagOfAft = false
    //遍历当前任务的开始和结束时间
    for(i=1;i<=currentTask.start.length-1;i++){
        //检查后面的位置是否处于当前时段中
        let curStart = currentTask.start[i]
        let curEnd = currentTask.end[i]
        if(curStart<indexOfAft+1 && curEnd >=indexOfAft+1){
            flagOfCur = true
            break
        }
    }
    if(!flagOfCur){return false}//第一次握手就失败了 不能交换
    //遍历后面的任务的开始和结束时间
    for(i=1;i<=afterTask.start.length-1;i++){
        //检查当前位置是否处于后面的任务的可执行时段中
        let aftStart = afterTask.start[i]
        let aftEnd = afterTask.end[i]
        if(aftStart<indexOfCur && aftEnd>=indexOfCur){
            flagOfAft = true
            break
        }
    }
    //保险起见取个与
    return flagOfCur&&flagOfAft
}

//调整至优先级最优
function adjustByPriority(result){
    //标志着上一个轮次是否有元素产生交换
    var flag = true

    while(flag){

        flag=false
        
        for(let i=1;i<=hours;i++){
            // console.log(result[i].name + ' ' + i);
            var currentTask = result[i]

            //遍历这个位置后面的所有位置，询问是否有元素交换
            for(let j=i+1;j<=hours;j++){
                var afterTask = result[j]
                //两次询问
                if(doubleHandShake(currentTask,afterTask,i,j)){
                    //一次比较
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
    return result
}

// //初次调度结果
// function getResult(result,Nodes,tasks){
//     let length = tasks.length
//     for(i=0;i<length;i++){
//         var task = tasks[i]
//         var restTime = task.exeTime
//         var equiv = findInTree(task.end,Nodes)
//         while(restTime!==0){
//             if(equiv!==0 && equiv > task.start){
//                 result[equiv] = new Task
//                 (
//                     task.name,
//                     task.start,
//                     task.end,
//                     task.exeTime,
//                     task.weight
//                 )
//                 uniteInTree(findInTree(equiv-1,Nodes),equiv,Nodes)
//             }
//             else{
//                 return null
//             }
//             restTime+=(-1)
//             equiv = findInTree(task.end,Nodes)
//         }
//     }
//     return result
// }

//调整至优先级最优
// function adjustByPriority(result){
//     var flag = true
//     while(flag){
//         flag = false
//         for(i=1;i<=hours;i++){
//             var currentTask = result[i]
            
//             //遍历这个位置后面的所有位置，询问是否有元素交换
//             for(j=i+1;j<=hours;j++){
                
//                 var afterTask = WMResult[j]
//                 if(currentTask.start<j+1 && currentTask.end>=j+1){
//                     if(afterTask.start<i && afterTask.end>=i){
//                         if(currentTask.weight<afterTask.weight){
//                             let temp = new Task
//                             (
//                                 currentTask.name,
//                                 currentTask.start,
//                                 currentTask.end,
//                                 currentTask.exeTime,
//                                 currentTask.weight
//                             )
//                             result[i]=afterTask
//                             result[j]=temp
//                             flag=true
//                             //更新当前元素
//                             currentTask = result[i]
//                         }
//                     }
//                 }
            
//             }
        
//         }
//     }
//     return result
// }

module.exports=
{
    getResult,
    adjustByPriority
}