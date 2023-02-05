const {genWMResultVeryFirst} = require('./algorithm/TaskScheduler')
//暴露minHeap给前端使用
const {minHeap} = require('./Entity/minHeap')
module.exports=
{
    genWMResultVeryFirst,
    minHeap
}