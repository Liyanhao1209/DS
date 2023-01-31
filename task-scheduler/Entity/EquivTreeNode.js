class EquivTreeNode{
    equivClass // 等价类 同时也是最近前置位的标识
    parent // 伪树结构的父节点模拟指针 但当该节点为树的根节点时代表这棵树的节点数
    root // 是否为根的bool标识

    constructor(equivClass,parent,root){
        this.equivClass=equivClass;this.parent=parent;this.root=root;
    }
}

module.exports=
{
    EquivTreeNode
}