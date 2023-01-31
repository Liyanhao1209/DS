function initializeInArray(length,Nodes){
    Nodes.push(null)
    for(i=1;i<=length;i++){
        Nodes.push(i)
    }
}

function uniteInArray(classA,classB,Nodes){
    for(i=1;i<=Nodes.length;i++){
        if(Nodes[i]===classB){
            Nodes[i]=classA
        }
    }
}

function findInArray(ele,Nodes){
    if(ele===0){
        return 0
    }
    return Nodes[ele]
}

module.exports=
{
    initializeInArray,
    uniteInArray,
    findInArray,
}