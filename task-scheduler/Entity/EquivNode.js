class EquivNode{
    equivClass // 等价类
    next // 模拟指针,数组索引
    size // 等价类元素个数

    constructor(equivClass,next,size){
        this.equivClass = equivClass
        this.next = next
        this.size = size
    }
}

module.exports = EquivNode