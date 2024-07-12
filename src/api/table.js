import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/excel-mysql/lists',
    method: 'get',
    params
  })
}
export function listTable(params) {
  return request({
    url: '/excel-mysql/listTable',
    method: 'get',
    params
  })
}

export function getSheets(params) {
  return request({
    url: '/excel-mysql/getSheets',
    method: 'post',
    data:params 
  })
}

export function getFieldMap(params){
  return request({
    url: '/excel-mysql/getFieldMap',
    method: 'post',
    data:params 
  })
}



export function updateExcelTable(params){
  return request({
    url: '/excel-mysql/updateExcelTable',
    method: 'post',
    data:params 
  })
}