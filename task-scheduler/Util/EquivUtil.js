const EquivNode = require('../Entity/EquivNode')

// var Nodes = new Array() // 等价类数组

//一般做一天的任务调度都是24小时制，这个length通常也就是24
function initialize(length,Nodes){
    //初始化等价类数组
    Nodes.push(new EquivNode) // 0号索引弃用
    for(i=1;i<=length;i++){
        let node = new EquivNode(i,0,1)
        Nodes.push(node)
    }
}

//将classB合并到classA中
function unite(classA,classB,Nodes){
    //安全性校验
    if(classA===classB){
        return
    }

    let k = classB
    while(Nodes[k].next!==0){
        //遍历classB中的所有元素，把等价类改为classA
        Nodes[k].equivClass = classA
        k=Nodes[k].next
    }
    //剩最后一个没有改
    Nodes[k].equivClass = classA
    //当合并到0号时，不用合并到0等价类，因为没有这个等价类
    if(classA===0){
        return
    }
    //修改新classA中的size
    Nodes[classA].size += Nodes[classB].size
    /**
     * 将classB整个插入到classA首节点后
     * 先把classB中最后一个节点的next指向classA的第二个节点(没有则为空/0)
     * 再把classA的首节点的next指向classB的首节点
     */
    Nodes[k].next=Nodes[classA].next
    Nodes[classA].next=classB
}

function find(ele,Nodes){
    if(ele===0){
        return 0
    }
    return Nodes[ele].equivClass
}

module.exports=
{
    // Nodes,
    initialize,
    unite,
    find
}