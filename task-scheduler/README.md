### 安装
```
npm install equiv-task-scheduler
```

### 导入
``` js
const TaskScheduler = require('equiv-task-scheduler')
```

### 对单位时间任务列表做调度
```js
/**
 * JsonTasks为任务列表
 * 每个任务有三个成员变量:name,start,end
 * 分别对应任务名,开始时间,结束时间
 */
const result = TaskScheduler.genResult(JsonTasks)
/**
 * result[1:n]是返回的调度后的任务列表
 * result[0]弃用
 */
console.log(result)
```

### 对非单位时间任务列表做调度
```js
/**
 * MultiJsonTasks为任务列表
 * 每个任务有四个成员变量:name,start,end,exeTime
 * 分别对应任务名,开始时间,结束时间,任务执行需要的时间
 */
const MultiResult = TaskScheduler.genMultiResult(MultiJsonTasks)
/**
 * MultiResult[1:n]是返回的调度后的任务列表
 * MultiResult[0]弃用
 */
console.log(MultiResult)
```

### 对单位时间有优先级的任务列表做调度
```js
/**
 * WJsonTasks为任务列表
 * 每个任务有五个成员变量:name,start,end,exeTime=unitTime=1,weight
 * 分别对应任务名,开始时间,结束时间,任务执行需要的时间(应设置为1),优先级
 */
const WResult =TaskScheduler.genWeightedResult(WJsonTasks)
/**
 * WResult[1:n]是返回的调度后的任务列表
 * WResult[0]弃用
 */
console.log(WResult)
```

### 对任意时间有优先级的任务列表做调度
```js
/**
 * WMJsonTasks为任务列表
 * 每个任务有五个成员变量:name,start,end,exeTime,weight
 * 分别对应任务名,开始时间,结束时间,任务执行需要的时间,优先级
 */
const WMResult =TaskScheduler.genWMResult(WMJsonTasks)
/**
 * WMResult[1:n]是返回的调度后的任务列表
 * WMResult[0]弃用
 */
console.log(WMResult)
```

### 对任意时间有优先级任务列表的调度(优先级高的尽可能的靠前)
```js
/**
 * WMJsonTasks为任务列表
 * 每个任务有五个成员变量:name,start,end,exeTime,weight
 * 分别对应任务名,开始时间,结束时间,任务执行需要的时间,优先级
 */
const WMResult =TaskScheduler.genWMResultVeryFirst(WMJsonTasks)
/**
 * WMResult[1:n]是返回的调度后的任务列表
 * WMResult[0]弃用
 */
console.log(WMResult)
```

### 数据结构(三种等价类)
    1.基于数组的(未经过测试,也没有实际投入使用,谨慎使用它!)
    2.基于伪链表的(经过测试,在1.0.10版本之前投入使用)
    3.基于伪树的(经过测试,当前版本投入使用)

### 卸载
```
npm uninstall TaskScheduling
```

### 即将上线
    1.并行时间最优方案