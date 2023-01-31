const {Task,MultiTask,WeightedTask,sortTask,sortMultiTask,radixSortWeightedTask} = require('../Entity/Task')
// const {initialize,unite,find} = require('../Util/EquivUtil')
const {initializeInTree,uniteInTree,findInTree} = require('../Util/EquivTreeUtil')
const {hours,unitTime} = require('../config/constConfig')

//主要算法模块

//任务执行时间为单位时间的无优先级任务调度
/**
 * @ param JsonTasks[]:入参的任务数组，待排序
 * @ response result[]:出参的结果数组，本质上是任务数组的某一个排列结果
 */
function genResult(JsonTasks){
    let length = JsonTasks.length
    //Json数组向实体数组的转换
    var tasks = new Array()
    for(i=0;i<length;i++){
        let temp = JsonTasks[i]
        let task = new Task(temp.name,temp.start,temp.end)
        tasks.push(task)
    }
    //按开始时间将tasks排序
    sortTask(tasks)
    //结果数组
    let result = new Array()
    //0索引弃用
    for(i=0;i<=hours;i++){
        result.push(new Task())
    }
    //初始化等价类数组
    var Nodes = new Array()
    // initialize(hours,Nodes)
    initializeInTree(hours,Nodes)
    for(i=0;i<length;i++){
        var task = tasks[i]
        var end = task.end
        var start = task.start
        // var equiv = find(end,Nodes)
        var equiv = findInTree(end,Nodes)
        //如果end等价类不为0，说明这个时段之前的时段还没用完
        if(equiv!==0 && equiv>start){
            //可以分配任务
            result[equiv]=new Task(task.name,task.start,task.end)
            //将第一个时间段占用，1之前就没时间段了
            // if(equiv===1){
            //     Nodes[equiv].equivClass=0
            // }
            // unite(find(equiv-1,Nodes),equiv,Nodes)
            uniteInTree(findInTree(equiv-1,Nodes),equiv,Nodes)
        }
        else{
            //调度失败
            return null
        }
    }
    //置空一下Nodes 不然var生命周期影响后续调用
    Nodes=new Array()
    return result
}


//任务执行时间大于单位时间的无优先级任务调度方案
/**
 * @ param : MultiJsonTasks[]: 入参的任务数组,待排序
 * @ param : MultiResult[]: 出参的结果数组
 */
function genMultiResult(MultiJsonTasks){
    let length = MultiJsonTasks.length
    //带执行时间的任务列表
    var MultiTasks = new Array()
    for(i=0;i<length;i++){
        let temp = MultiJsonTasks[i]
        let multiTask = new MultiTask(temp.name,temp.start,temp.end,temp.exeTime)
        MultiTasks.push(multiTask)
    }
    //返回结果
    let MultiResult = new Array()
    for(i=0;i<=hours;i++){
        MultiResult.push(new MultiTask())
    }
    //任务列表排序
    sortMultiTask(MultiTasks)
    //初始化等价类数组
    var Nodes = new Array()
    // initialize(hours,Nodes)
    initializeInTree(hours,Nodes)
    //任务调度
    for(i=0;i<length;i++){
        var multiTask = MultiTasks[i] //当前任务
        var multiEnd = multiTask.end //结束时间
        var multiStart = multiTask.start //开始时间
        var exeTime = multiTask.exeTime //执行时间
        // var equiv = find(multiEnd,Nodes)
        var equiv = findInTree(multiEnd,Nodes)
        var restTime = exeTime //剩余时间
        while(restTime!==0){
            //每成功一个单位时间的调度，就更新一次MultiResult
            if(equiv!==0 && equiv>multiStart){
                MultiResult[equiv]=new MultiTask(multiTask.name,multiStart,multiEnd,exeTime)
                // unite(find(equiv-1,Nodes),equiv,Nodes)
                uniteInTree(findInTree(equiv-1,Nodes),equiv,Nodes)
            }
            else{
                //调度失败
                return null
            }
            //更新剩余执行时间和equiv
            //更新equiv是更新可用时间段,给MultiResult的索引更新
            restTime=restTime-1
            console.log('当前是'+multiTask.name+'的第'+(exeTime-restTime)+'轮');
            equiv = findInTree(multiEnd,Nodes)
        }
    }
    Nodes=new Array()
    return MultiResult
}

//任务执行时间为单位时间的具有优先级的任务调度方案
/**
 * @ param: WJsonTasks[]: 入参任务数组
 * @ param: WResult[]: 出参的结果数组
 */
function genWeightedResult(WJsonTasks){
    let length = WJsonTasks.length
    //转换为实体数组
    var WTasks = new Array()
    for(i=0;i<length;i++){
        let temp = WJsonTasks[i]
        let wTask = new WeightedTask(temp.name,temp.start,temp.end,unitTime,temp.weight)
        WTasks.push(wTask)
    }
    //基数排序任务列表 先按优先级桶排序，再按开始时间桶排序
    WTasks=radixSortWeightedTask(WTasks)
    //结果数组
    let WResult = new Array()
    //0索引弃用
    for(i=0;i<=hours;i++){
        WResult.push(new WeightedTask(null,0,24,unitTime,0))
    }
    //初始化等价类数组
    var Nodes = new Array()
    // initialize(hours,Nodes)
    initializeInTree(hours,Nodes)
    //更新结果数组
    for(i=0;i<length;i++){
        var wTask = WTasks[i]
        var end = wTask.end
        var start = wTask.start
        // var equiv = find(end,Nodes)
        var equiv = findInTree(end,Nodes)
        if(equiv!==0 && equiv>start){
            WResult[equiv]=new WeightedTask(wTask.name,wTask.start,wTask.end,unitTime,wTask.weight)
            // unite(find(equiv-1,Nodes),equiv,Nodes)
            uniteInTree(findInTree(equiv-1,Nodes),equiv,Nodes)
        }
        else{
            return null
        }
    }
    Nodes = new Array()
    //将调度方案调整到优先级最优
    var flag = true // 调整标记，调到没有元素移动了，就代表调好了
    while(flag){

        //先认为这一轮没有调整 如果有 那么更新为true
        flag=false
        //最后一个不需要调整
        for(i=1;i<hours;i++){
            //在可以比较的情况下比较当前一个任务和下一个任务
            var currentTask = WResult[i]
            var nextTask = WResult[i+1]
            //保证两个任务可以换(对方的时间在各自的时间段内)
            if(currentTask.start<i+1 && currentTask.end>=i+1){
                if(nextTask.start<i && nextTask.end>=i){
                    //比较优先级，大的往前
                    if(currentTask.weight<nextTask.weight){
                        let temp = new WeightedTask(currentTask.name,currentTask.start,currentTask.end,unitTime,currentTask.weight)
                        WResult[i]=nextTask
                        WResult[i+1]=temp
                        //记录移动
                        flag=true
                    }
                }
            }
        }
    }
    return WResult
}

//任务执行时间为任意时间的具有优先级的任务调度方案
/**
 * @ param: WMJsonTasks[]: 入参任务数组
 * @ param: WResult[]: 出参的结果数组
 */
function genWMResult(WMJsonTasks){
    let length = WMJsonTasks.length
    var WMTasks = new Array()
    for(i=0;i<length;i++){
        let wmJsonTask = WMJsonTasks[i]
        let wmTask = new WeightedTask
        (
            wmJsonTask.name,
            wmJsonTask.start,
            wmJsonTask.end,
            wmJsonTask.exeTime,
            wmJsonTask.weight
        )
        WMTasks.push(wmTask)
    }
    WMTasks = radixSortWeightedTask(WMTasks)
    var WMResult = new Array()
    for(i=0;i<=hours;i++){
        WMResult.push
        (
            new WeightedTask
            (
               null,
               0,
               hours,
               unitTime,
               0 
            )
        )
    }
    var Nodes = new Array()
    // initialize(hours,Nodes)
    initializeInTree(hours,Nodes)
    for(i=0;i<length;i++){
        var wmTask = WMTasks[i]
        var wmName = wmTask.name
        var wmStart = wmTask.start
        var wmEnd = wmTask.end
        var wmExeTime = wmTask.exeTime
        var weight = wmTask.weight
        var restTime = wmExeTime
        // var equiv = find(wmEnd,Nodes)
        var equiv = findInTree(wmEnd,Nodes)
        while(restTime!==0){
            if(equiv!==0 && equiv > wmStart){
                WMResult[equiv] = new WeightedTask
                (
                    wmName,
                    wmStart,
                    wmEnd,
                    wmExeTime,
                    weight
                )
                // unite(find(equiv-1,Nodes),equiv,Nodes)
                uniteInTree(findInTree(equiv-1,Nodes),equiv,Nodes)
            }
            else{
                return null
            }
            restTime += (-1)
            equiv = findInTree(wmEnd,Nodes)
        }
    }
    Nodes = new Array()
    var flag = true
    while(flag){
        flag=false
        for(i=1;i<=hours;i++){
            var currentTask = WMResult[i]
            var nextTask = WMResult[i+1]
            if(currentTask.start<i+1 && currentTask.end>=i+1){
                if(nextTask.start<i && nextTask.end>=i){
                    if(currentTask.weight<nextTask.weight){
                        let temp = new WeightedTask
                        (
                            currentTask.name,
                            currentTask.start,
                            currentTask.end,
                            currentTask.exeTime,
                            currentTask.weight
                        )
                        WMResult[i]=nextTask
                        WMResult[i+1]=temp
                        flag=true
                    }
                }
            }
        }
    }
    return WMResult
}

//任务执行时间为任意时间的具有优先级的任务调度方案
//会把所有优先级高的任务尽量前置
/**
 * @ param: WMJsonTasks[]: 入参任务数组
 * @ param: WResult[]: 出参的结果数组
 */
function genWMResultVeryFirst(WMJsonTasks){
    let length = WMJsonTasks.length
    var WMTasks = new Array()
    for(i=0;i<length;i++){
        let wmJsonTask = WMJsonTasks[i]
        let wmTask = new WeightedTask
        (
            wmJsonTask.name,
            wmJsonTask.start,
            wmJsonTask.end,
            wmJsonTask.exeTime,
            wmJsonTask.weight
        )
        WMTasks.push(wmTask)
    }
    WMTasks = radixSortWeightedTask(WMTasks)
    var WMResult = new Array()
    for(i=0;i<=hours;i++){
        WMResult.push
        (
            new WeightedTask
            (
               null,
               0,
               hours,
               unitTime,
               0 
            )
        )
    }
    var Nodes = new Array()
    // initialize(hours,Nodes)
    initializeInTree(hours,Nodes)
    for(i=0;i<length;i++){
        var wmTask = WMTasks[i]
        var wmName = wmTask.name
        var wmStart = wmTask.start
        var wmEnd = wmTask.end
        var wmExeTime = wmTask.exeTime
        var weight = wmTask.weight
        var restTime = wmExeTime
        // var equiv = find(wmEnd,Nodes)
        var equiv = findInTree(wmEnd,Nodes)
        while(restTime!==0){
            if(equiv!==0 && equiv > wmStart){
                WMResult[equiv] = new WeightedTask
                (
                    wmName,
                    wmStart,
                    wmEnd,
                    wmExeTime,
                    weight
                )
                // unite(find(equiv-1,Nodes),equiv,Nodes)
                uniteInTree(findInTree(equiv-1,Nodes),equiv,Nodes)
            }
            else{
                return null
            }
            restTime += (-1)
            equiv = findInTree(wmEnd,Nodes)
        }
    }
    Nodes = new Array()
    var flag = true
    while(flag){
        flag=false
        for(i=1;i<=hours;i++){
            var currentTask = WMResult[i]
            //遍历这个位置后面的所有位置，询问是否有元素交换
            for(j=i+1;j<=hours;j++){
                var afterTask = WMResult[j]
                if(currentTask.start<j+1 && currentTask.end>=j+1){
                    if(afterTask.start<i && afterTask.end>=i){
                        if(currentTask.weight<afterTask.weight){
                            let temp = new WeightedTask
                            (
                                currentTask.name,
                                currentTask.start,
                                currentTask.end,
                                currentTask.exeTime,
                                currentTask.weight
                            )
                            WMResult[i]=afterTask
                            WMResult[j]=temp
                            flag=true
                            //更新当前元素
                            currentTask = WMResult[i]
                        }
                    }
                }
            }
        }
    }
    return WMResult
}

module.exports=
{
    genResult,
    genMultiResult,
    genWeightedResult,
    genWMResult,
    genWMResultVeryFirst
}