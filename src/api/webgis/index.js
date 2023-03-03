// webgis相关接口
import request from '@/utils/request'

export default {
	sceneList(params) {
		return request({
			url: '/scene/list',
			method: 'get',
			params
		})
	},
	addScene(data) {
		return request({
			url: '/scene/add',
			method: 'POST',
			contentType: 'application/json',
			data
		})
	},
	delScene(params) {
	return request({
		url: '/scene/del',
		method: 'DELETE',
		params
	})
	},
	updateScene(data) {
		return request({
			url: '/scene/update',
			method: 'POST',
			contentType: 'application/json',
			data
		})
	},
routeList(params) {
	return request({
		url: '/project/list',
		method: 'get',
		params
	})
},addRoute(data) {
	return request({
		url: '/project/add',
		method: 'POST',
		contentType: 'application/json',
		data
	})
},updateRoute(data) {
	return request({
		url: '/project/update',
		method: 'POST',
		contentType: 'application/json',
		data
	})
},delRoute(params) {
	return request({
		url: '/project/del',
		method: 'DELETE',
		params
	})
},resourceList(params) {
	return request({
		url: `/resource/list1`,
		method: 'GET',
		params
	})
}
,resourceEdit(data) {
	return request({
		url: `/resource/edit`,
		method: 'POST',
		data
	})
},delResource(params) {
	return request({
		url: '/resource/del',
		method: 'DELETE',
		params
	})
},visits(params) {
	return request({
		url:`/resource/visits`,
		method: 'get',
		params
		
	})
},openProject(params) {
	return request({
		url: '/project/open',
		method: 'GET',
		params
	})
},closeProject(params) {
	return request({
		url: '/project/close',
		method: 'GET',
		params
	})
},configList() {
	return request({
		url: '/config/select',
		method: 'GET'
	})
}

,uploadResourceFile(data) {
	return request({
		url: '/resource/uploadResourceFiles',
		method: 'POST',
		// contentType:'application/json',
		data
	})
},insertEducationExp(data) {
	return request({
		url: '/baseinfo/v1/app/my/educationexp/update',
		method: 'POST',
		contentType: 'application/json',
		data
	})
}
,selectEducationExp() {
	return request({
		url: '/baseinfo/v1/app/my/educationexp/select',
		method: 'GET',
		contentType: 'application/json',
	})
},
//获取基础信息状态
selectPersonInfo() {
	return request({
		url: '/baseinfo/v1/app/my/personinfo/select',
		method: 'GET'
	})
},inputGrade(data) {
	return request({
		url: '/invigilate/v1/qrcode/inser/apresult',
		method: 'POST',
		contentType: 'application/json',
		data
	})
},selectInvigilatesList(data) {
	return request({
		url: '/invigilate/v1/qrcode/list/invigilates',
		method: 'POST',
		contentType: 'application/json',
		data
	})
},selectRtNameCondition(params) {
	return request({
		url: '/invigilate/v1/qrcode/list/rtnames',
		method: 'GET',
		contentType: 'application/json',
		params
	})
},signupApplyprocess(params) {
	return request({
		url: '/invigilate/v1/qrcode/signup/applyprocess',
		method: 'GET',
		contentType: 'application/json',
		params
	})
},selectApplyprocess(params) {
	return request({
		url: '/invigilate/v1/qrcode/applyprocess',
		method: 'GET',
		contentType: 'application/json',
		params
	})
},

//CPU资源使用量
cpuUsedPerc() {
	return request({
		url: '/admin/sys/status/cpuUsedPerc',
		method: 'GET'
	})
},//内存资源使用量
memoryUsedPerc() {
	return request({
		url: '/admin/sys/status/memoryUsedPerc',
		method: 'GET'
	})
},diskUsedPerc() {
	return request({
		url: '/admin/sys/status/diskUsedPerc',
		method: 'GET'
	})
},nginxStatus() {
	return request({
		url: '/admin/sys/status/nginx/start',
		method: 'PUT'
	})
}
}