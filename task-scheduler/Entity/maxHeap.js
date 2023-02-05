//给任务堆用的
class maxHeap{
    heap//堆数组 元素类型为Task类型
    heapSize//堆中元素数量

    constructor(){
        this.heap=new Array()
        this.heapSize=0
    }

    top(){
        if(this.heapSize===0){return null}
        return this.heap[1]
    }

    //根据最小开始时间进行push
    push(theTask){
        var currentNode = ++this.heapSize
        //start本身是个堆的数据成员数组 0索引弃用 最小开始时间
        while(currentNode!==1 && this.heap[parseInt(currentNode/2)].start[1]<theTask.start[1]){
            this.heap[currentNode] = this.heap[parseInt(currentNode/2)]
            currentNode=parseInt(currentNode/2)
        }
        this.heap[currentNode]=theTask
    }

    pop(){
        if(this.heapSize===0){return}
        else
        {
            var lastNode = this.heap[this.heapSize--]
            var cur = 1
            var child = 2
            //下潜
            while(child<=this.heapSize){
                //取子节点中较小的 <heapSize防止比较空元素（也即另一种形式的数组越界)
                if(child<this.heapSize && this.heap[child].start[1]<this.heap[child+1].start[1]){
                    child++
                }

                //找到可行的位置
                if(lastNode.start[1] >= this.heap[child].start[1]){
                    break
                }

                //lastNode < heap[child] child提升到当前位置，随后cur,child下潜
                this.heap[cur] = this.heap[child]
                cur=child
                child*=2
            }
            this.heap[cur] = lastNode
        }
    }

    //heap和theHeap的0号索引均弃用
    initialize(theHeap){
        //将每一个有节点的子树调整成小根堆
        let size = theHeap.length-1
        this.heap=theHeap
        this.heapSize = size
        for(i=parseInt(size/2);i>=1;i--){
            var root = i //子树根节点
            var rootElement = this.heap[root]
            var child = root*2
            while(child<=size){
                if(child<size && this.heap[child].start[1]<this.heap[child+1].start[1]){
                    child++
                }

                if(rootElement.start[1]>this.heap[child].start[1]){
                    break
                }

                this.heap[root] = this.heap[child]
                root=child
                child*=2
            }
            this.heap[root]=rootElement
        }
    }
}

module.exports=
{
    maxHeap
}