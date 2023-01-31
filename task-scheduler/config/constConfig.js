//一般用来初始化等价类数组的常量，对应一天24个小时
const hours = 24
//根据开始时间进行桶排序的标记
const byStart = 0
//根据优先级进行桶排序的标记
const byPriority = 1
//开始时间的范围，最大到23
const rangeForStart = 23
//优先级的范围，最大到5
const rangeForPriority = 5
//单位时间
const unitTime = 1
module.exports=
{
    hours,
    byStart,
    byPriority,
    rangeForStart,
    rangeForPriority,
    unitTime
}