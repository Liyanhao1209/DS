const {EquivTreeNode} = require('../Entity/EquivTreeNode')

function initializeInTree(length,Nodes){
    //初始化等价类数组 树结构节点
    Nodes.push(new EquivTreeNode)
    for(i=1;i<=length;i++){
        Nodes.push
        (
            //一开始的每一个节点都是自己这棵树的根,则parent域为1(节点个数为1),等价类也是自己的索引
            new EquivTreeNode
            (
                i,1,true
            )
        )
    }
}

//这个合并不能用重量规则 因为时间是有先后顺序的 必须是后面的时间合并到前面去 
//不然先占了4 再占3 再占2 则为3->4|->2(|表示统一层级) 后来人问路4 是2
function uniteInTree(rootA,rootB,Nodes){
    //特判x合并到0
    //因为没有0这个节点 所以相当于没有实际的合并操作
    if(rootA===0){
        //修改rootB的等价类，提醒后人前面已经不再有空位了
        Nodes[rootB].equivClass=0
        return
    }
    //修改节点数量
    Nodes[rootA].parent+=Nodes[rootB].parent
    //修改B的根节点指向
    Nodes[rootB].parent=rootA
    //修改rootB的标识符 不为根节点了
    Nodes[rootB].root=false
}

//路径紧缩的查找方式 首次查找比较麻烦 但是方便了后续的查找
function findInTree(ele,Nodes){
    if(ele===0){
        return 0;
    }
    //定义根节点指针 最终返回
    var theRoot = ele
    ;
    while(!Nodes[theRoot].root){
        // console.log(theRoot);
        theRoot = Nodes[theRoot].parent
    }

    //紧缩路径 让这条路径上所有的节点统统指向根节点
    var currentNode = ele
    while(currentNode!==theRoot){
        let parentNode = Nodes[currentNode].parent
        Nodes[currentNode].parent=theRoot
        currentNode=parentNode
    }

    //未改善过的代码中我们认为节点的数组索引就是等价类
    //但是现在我们要通过等价类是否为0提示调用方前方是否还有空位
    //而数组索引是肯定不涉及到0的
    //因此即便大部分情况下theRoot的等价类equivClass就是数组索引theRoot
    //但我们还是要返回equivClass
    return Nodes[theRoot].equivClass

}

module.exports=
{
    initializeInTree,
    uniteInTree,
    findInTree
}