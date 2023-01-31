import axios from 'axios'
import {store} from '@/store/index'
import {host} from '@/config/urlConfig'

function genRequest(url,data) {
    let body = new URLSearchParams()
    body.append("data",JSON.stringify(data))
    return axios.post
    (
        host + url,
        body,
        {
            headers: 
            {
                Authorization: store.state.jwt
            }
        }
    ).then(res=>{
        return res.data
    }).catch(()=>{
        return
    })
}

function genResult(data){
    return genRequest('/api/task/genResult',data)
}

function genMultiResult(data){
    return genRequest('/api/task/genMultiResult',data)
}

function genWeightedResult(data){
    return genRequest('/api/task/genWeightedResult',data)
}

function genWMResultVeryFirst(data){
    return genRequest('/api/task//genWMResultVeryFirst',data)
}

export 
{
    genResult,
    genMultiResult,
    genWeightedResult,
    genWMResultVeryFirst
}
