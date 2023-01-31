const express = require('express')
const router = express.Router()
const taskSchedulerHandler = require('../router_handler/taskSchedulerHandler')

//生成单位执行时间且无优先级的调度结果
router.post('/genResult',taskSchedulerHandler.genResult)

//生成任意执行时间且无优先级的调度结果
router.post('/genMultiResult',taskSchedulerHandler.genMultiResult)

//生成单位执行时间且有优先级的调度结果
router.post('/genWeightedResult',taskSchedulerHandler.genWeightedResult)

//生成任意执行时间且有优先级的调度结果(无所谓优先级是否尽可能靠前)
router.post('/genWMResult',taskSchedulerHandler.genWMResult)

//生成任意执行时间且有优先级的调度结果(优先级高的尽可能靠前)
router.post('/genWMResultVeryFirst',taskSchedulerHandler.genWMResultVeryFirst)

module.exports = router