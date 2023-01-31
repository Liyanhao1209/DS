const db = require('../db/datasource')
const TaskScheduler = require('equiv-task-scheduler')

//提取返回任务调度结果数组
function resSendResult(result,res){
    if(result===null){
        res.cc('抱歉,对于这样的任务列表不存在一个完全可行的调度方案')
    }
    else{
        res.send
        (
            {
                status:0,
                data:result,
                message:'已为您生成调度方案'
            }
        )
    }
}

/**
 * 前端过来的json数组应该是
 *
 *JsonTasks:
 [
    {
        name:'A',
        start:0,
        end:24
    }
    ,
    ...
 ]
 */
exports.genResult = (req,res)=>{
    //获取Json任务数组
    const JsonTasks = req.body
    // var tasks = JSON.parse(JsonTasks.JsonTasks)
    var tasks = JSON.parse(JsonTasks.data)
    // console.log(tasks);
    const result = TaskScheduler.genResult(tasks)
    resSendResult(result,res)
}


/**
 * MultiJsonTasks:
[
  {
    name:'A',
    start:0,
    end:24,
    exeTime:2
  },
  ...
]
 */
exports.genMultiResult = (req,res)=>{
    const MultiJsonTasks = req.body
    var tasks = JSON.parse(MultiJsonTasks.data)
    const MultiResult = TaskScheduler.genMultiResult(tasks)
    resSendResult(MultiResult,res)
}

/**
 * [
 * {
 * name:'A',
 * start:0,
 * end:24,
 * exeTime:1,
 * weight:5
 * },
 * ...
 * ]
 */
exports.genWeightedResult = (req,res)=>{
    const WJsonTasks = req.body
    var tasks = JSON.parse(WJsonTasks.data)
    const WResult = TaskScheduler.genWeightedResult(tasks)
    resSendResult(WResult,res)
}

/**
 * [
 * {
 * name:'A',
 * start:0,
 * end:24,
 * exeTime:2,
 * weight:3
 * },
 * ...
 * ]
 */
exports.genWMResult = (req,res)=>{
    const WMJsonTasks = req.body
    var tasks = JSON.parse(WMJsonTasks.data)
    const WMResult = TaskScheduler.genWMResult(WMJsonTasks)
    resSendResult(WMResult,res)
}

/**
 * [
 * {
 * name:'A',
 * start:0,
 * end:24,
 * exeTime:2,
 * weight:3
 * },
 * ...
 * ]
 */
exports.genWMResultVeryFirst = (req,res)=>{
    const WMJsonTasks = req.body
    console.log(WMJsonTasks);
    var tasks = JSON.parse(WMJsonTasks.data)
    console.log(tasks);
    const WMResult = TaskScheduler.genWMResultVeryFirst(tasks)
    resSendResult(WMResult,res)
}