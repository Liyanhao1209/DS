const { getTasksEntity, initResult, getNodes } = require('../Util/PretreatmentUtil')
const { getResult, adjustByPriority } = require('./Scheduler')

//主要算法模块

//任务执行时间为任意时间的具有优先级的任务调度方案
//会把所有优先级高的任务尽量前置
/**
 * 
 * @param {WMJsonTasks} 任务数组 
 * @returns {WMResult} 调度数组
 */
function genWMResultVeryFirst(WMJsonTasks){
    //Json转实体
    WMTasks = getTasksEntity(WMJsonTasks)
    //初始化结果数组
    WMResult = initResult()
    //初始化等价类数组
    Nodes = getNodes()
    //生成初次调度结果
    WMResult = getResult(WMResult,Nodes,WMTasks)
    //调整至优先级最优
    WMResult = adjustByPriority(WMResult)
    return WMResult
}

module.exports=
{
    genWMResultVeryFirst,
}