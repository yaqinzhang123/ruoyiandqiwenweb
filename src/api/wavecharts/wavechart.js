
import request from '@/utils/requestEcharts'

export function getData(projectid = 1) {
    console.log("getData",projectid)
    return request({
        url: 'Plantform/echartdata?pid=' + projectid,
        method: 'get'
    })
}
export function wgsToRoute(params) {
    return request({
        url: 'Plantform/wgstoroute',
        method: 'get',
        params
    })
}
export function routeToWgs(params) {
    return request({
        url: 'Plantform/routetowgs',
        method: 'get',
        params
    })
}
