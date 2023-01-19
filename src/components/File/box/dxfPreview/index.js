import Vue from 'vue'
// 导入组件
import DxfPreview from './BoxMask.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const DxfPreviewConstructor = Vue.extend(DxfPreview)

let dxfPreviewInstance = null
/**
 * 初始化预览实例
 * @param {string} fileInfo 文件信息
 * @param {boolean} isEdit 是否可编辑
 */
const initInstanceDxfPreview = (fileInfo, isEdit) => {
	dxfPreviewInstance = new DxfPreviewConstructor({
		el: document.createElement('div'),
		data() {
			return {
				fileInfo,
				isEdit
			}
		} 
	})
}
/**
 * 预览 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showDxfPreviewBox = (obj) => {
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (dxfPreviewInstance !== null) {
		document.body.removeChild(dxfPreviewInstance.$el)
	}
	let { fileInfo, isEdit } = obj
	return new Promise((reslove) => {
		initInstanceDxfPreview(fileInfo, isEdit)
		dxfPreviewInstance.callback = (res) => {
			reslove(res)
			// 服务取消时卸载 DOM
			if (res === 'cancel' && dxfPreviewInstance !== null) {
				document.body.removeChild(dxfPreviewInstance.$el)
				dxfPreviewInstance = null
			}
		}
		document.body.appendChild(dxfPreviewInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			dxfPreviewInstance.visible = true //  打开代码预览遮罩层
		})
	})
}

export default showDxfPreviewBox
