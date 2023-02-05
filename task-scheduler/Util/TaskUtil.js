const {TaskChain} = require('../Entity/TaskChain')
const {byStart,byPriority,rangeForStart,rangeForPriority} = require('../config/constConfig')
const { maxHeap } = require('../Entity/maxHeap')
const { minHeap } = require('../Entity/minHeap')
const { Task } = require('../Entity/Task')

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
    //先按照优先级进行桶排序，再按照开始时间进行堆排序
    tasks=binSortWeightedTask(tasks,byPriority,rangeForPriority)
    // tasks=binSortWeightedTask(tasks,byStart,rangeForStart)
    tasks = heapSortTasks(tasks)
    return tasks
}

//任务堆要降序
function heapSortTasks(tasks){
    //预处理tasks 使它的0索引弃用
    for(i=tasks.length-1;i>=0;i--){
        tasks[i+1]=tasks[i]
    }
    tasks[0]=new Task(null,null,null,null,null)

    var heap = new maxHeap()
    heap.initialize(tasks)
    var newTasks = new Array();newTasks.length=tasks.length-1;

    //tasks任务数组的0索引已经弃用了 所以他的length是n+1 0到n-1才是n个
    for(i=0;i<tasks.length-1;i++){
        var ele = heap.top()
        heap.pop()
        newTasks[i]=ele
    }

    //返回的tasks的0索引是启用的
    return newTasks
}

//时间堆其实最好降序 但是降序之后任务堆不方便构建 所以写成升序了
//顶多是在等价类合并的时候需要倒着遍历所有可执行时段(因为要根据结束时间降序)
//这个函数使用在 前端把Json的任务数组送过来后,对其进行排序，这样后续先对任务进行堆排序时可以通过1号索引访问start的最小值
//再对等价类做合并时，可以倒着遍历所有时段，从而进行调度
function heapSortTime(time){
    var heap = new minHeap()
    heap.initialize(time)
    let length = time.length
    //js里面是数据的引用，如果在下面的for循环里修改构建堆的数组，那么堆中的成员变量是这个数组的引用，也就是修改了堆的成员变量本身
    var newTime = new Array();newTime.length=time.length;newTime[0]=null
    //前端送过来的数据中,时间数组的0索引弃用了
    //不能使用i<=time.length，因为js的数组是不定长的
    for(i=1;i<=length-1;i++){
        var ele = heap.top()
        heap.pop()
        newTime[i]=ele
    }
    return newTime
}

module.exports=
{
    binSortWeightedTask,
    radixSortWeightedTask,
    heapSortTime 
}