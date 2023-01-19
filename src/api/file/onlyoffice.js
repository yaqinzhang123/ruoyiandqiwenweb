// onlyoffice 相关接口
import request from '@/utils/request'

// 创建文档
// export const createOfficeFile = (p) => post('/office/createofficefile', p)
// // 编辑文档
// export const editOfficeFile = (p) => post('/office/editofficefile', p)
// // 查看文档
// export const previewOfficeFile = (p) => post('/office/previewofficefile', p)


export function createOfficeFile(data) {
	return request({
	  url: '/office/createofficefile',
	  method: 'post',
	  data
	})
}
export function editOfficeFile(data) {
	return request({
	  url: '/office/editofficefile',
	  method: 'post',
	  data
	})
}
export function previewOfficeFile(data) {
	return request({
	  url: '/office/previewofficefile',
	  method: 'post',
	  data
	})
}
