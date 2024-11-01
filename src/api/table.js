import request from '@/utils/request'

export function lists(params) {
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
    url: '/excel-mysql/getFieldMaps',
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



export function getProcess(params){
  return request({
    url: '/excel-mysql/getProcess',
    method: 'get' ,
    params
  })
}


export function previewCreateTable(params){
  return request({
    url: '/excel-mysql/previewCreateTable',
    method: 'post',
    data:params 
  })
}


export function newExcelTable(params){
  return request({
    url: '/excel-mysql/newExcelTable',
    method: 'post',
    data:params 
  })
}
