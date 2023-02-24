<template>
  <transition name="el-fade-in-linear el-fade-in">
    <div class="code-preview-wrapper" v-show="visible">
      <!-- 顶部信息栏 & 工具栏 -->
      <div class="tip-wrapper" v-if="visible">
        <div class="name" :title="$file.getFileNameComplete(fileInfo)">
          {{ $file.getFileNameComplete(fileInfo) }}
          <span class="un-save" v-show="isModify && !dxfOptions.readOnly">（未保存）</span>
        </div>
        <div class="editor-preveiw">
          在线预览{{ dxfOptions.readOnly ? '' : ' & 编辑' }}
        </div>
        <div class="tool-wrapper">
          <a class="item download-link" target="_blank" :href="$file.getDownloadFilePath(fileInfo)"
            :download="$file.getFileNameComplete(fileInfo)">
            <i class="el-icon-download" title="下载"></i>
          </a>
          <el-tooltip effect="dark" placement="bottom">
            <div slot="content">
              操作提示: <br />
              1. 按 Esc 键可退出查看；<br />
              2. 支持在线编辑、保存、下载
            </div>
            <div class="item text-wrapper">
              <span class="text">操作提示</span>
              <i class="el-icon-s-opportunity"></i>
            </div>
          </el-tooltip>
          <i class="item el-icon-close" title="关闭预览" @click="closedxfPreview"></i>
        </div>
      </div>
      <!-- 代码编辑区域 -->
      <div class="code-editor-wrapper" v-loading="dxfLoading">

        <div id="dxf-view" class="dxfView" ref="dxfView">
        </div>


      </div>
    </div>
  </transition>
</template>

<script>
import { getToken } from '@/utils/auth'
import {
  fontSizeList,
  dxfFileType,
  dxfThemeList
} from '@/libs/map.js'
// 文件修改相关
import store from '@/store/index.js'
import { getFilePreview, previewerDWG } from '@/api/file/file.js'
import DxfParser from 'dxf-parser'
import { Viewer } from '/public/threedxf/three-dxf.js'
export default {
  name: 'DxfPreview',
  data() {
    return {
      data: "",
      fontSizeList,
      dxfFileType,
      dxfThemeList,
      visible: false, // 代码预览遮罩层组件是否显示
      originalCodeText: '', // 代码原本的文本
      dxfText: '', // 代码实时修改的文本
      dxfLoading: false, // 代码内容是否加载中
      // codemirror 配置项，参考 https://codemirror.net/doc/manual.html#config
      dxfOptions: {
        tabSize: 4, //  制表符的宽度。默认为 4。
        mode: 'text/html', //  解析当前代码的模式，参考 https://codemirror.net/mode/ 每种语言的示例页面的底部都有对应的 MIME 类型，如果当前文件后缀没有匹配的语言，按照 html 来解析
        theme: 'default', //  代码高亮主题色，其他主题色参考 https://codemirror.net/theme/
        readOnly: true, //  true 只读不可编辑 | false 可编辑 | "nocursor"（而不是简单的 true ），不允许编辑器聚焦。
        lineNumbers: true, //  是否在编辑器左侧显示行号
        line: true,
        autoCloseBrackets: true, //  自动补全括号
        foldGutter: true, //  创建带有指示可折叠块的标记的装订线
        lineWrapping: true, //  长行处理：false 滚动 | true 换行
        // 额外的装订线
        gutters: [
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter',
          'CodeMirror-lint-markers'
        ]
      },
      isShow: true,
    }
  },
  mounted() {
    this.getCodeText()
  },
  computed: {
    // 屏幕宽度
    screenWidth() {
      return store.state.common.screenWidth
    },
    // 是否修改
    isModify() {
      return this.originalCodeText !== this.dxfText
    },
  },
  watch: {
    // 监听代码查看组件 显隐状态变化
    visible(val) {
      if (val) {
        this.dxfOptions.readOnly = !this.isEdit //  设置编辑器是否只读			
        // 添加键盘 Esc 事件
        this.$nextTick(() => {
          document.addEventListener('keyup', (e) => {
            if (e.keyCode === 27) {
              this.closedxfPreview()
            }
          })
        })
      } else {
        document.removeEventListener('keyup', (e) => {
          if (e.keyCode === 27) {
            this.closedxfPreview()
          }
        })
      }
    },

  },
  methods: {
    /**
     * 获取代码文本内容
     */
    getCodeText() {   
      if (this.fileType == 'dxf') {
        getFilePreview({
          userFileId: this.fileInfo.userFileId,
          isMin: false,
          shareBatchNum: this.fileInfo.shareBatchNum,
          extractionCode: this.fileInfo.extractionCode,
          token: getToken()
        }).then((res) => {
          this.dxfLoading = true;
          this.createFileform(res);
        })
      } else {
        previewerDWG({
          userFileId: this.fileInfo.userFileId,
          isMin: false,
          shareBatchNum: this.fileInfo.shareBatchNum,
          extractionCode: this.fileInfo.extractionCode,
          token: getToken()
        }).then((res) => {
          // this.createFileform(res);
        })
      }
    },
    createFileform(res) {
      var parser = new DxfParser();
      var dxf = parser.parseSync(res);
      document.getElementById('dxf-view').innerHTML = ""
      let width = this.$refs.dxfView.offsetWidth;
      let height = this.$refs.dxfView.offsetHeight;
      Viewer(dxf, document.getElementById('dxf-view'), width, height, this.LoadingClose);

    },
    LoadingClose() {
      this.dxfLoading = false
    },
    closedxfPreview() {
      this.visible = false
      this.callback('cancel')
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/varibles.scss';
@import '@/assets/styles/mixin.scss';

.code-preview-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  width: 100%;
  height: 100vh;
  z-index: 2;
  display: flex;
  align-items: center;
  animation: imgPreviewAnimation 0.3s;
  -webkit-animation: imgPreviewAnimation 0.3s;
  /* Safari and Chrome */
  animation-iteration-count: 0.3;
  -webkit-animation-iteration-count: 0.3;
  animation-fill-mode: forwards;
  -webkit-animation-fill-mode: forwards;

  /* Safari 和 Chrome */
  @keyframes imgPreviewAnimation {
    0% {
      background: transparent;
    }

    100% {
      background: rgba(0, 0, 0, 0.8);
    }
  }

  @keyframes imgPreviewAnimation {
    0% {
      background: transparent;
    }

    100% {
      background: rgba(0, 0, 0, 0.8);
    }
  }

  .tip-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    padding-left: 200px;
    background: rgba(0, 0, 0, 0.5);
    padding: 0 48px;
    width: 100%;
    height: 48px;
    line-height: 48px;
    color: #fff;
    font-size: 16px;
    display: flex;
    justify-content: space-between;

    .name {
      flex: 1;
      padding-right: 16px;
      padding-left: 200px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .un-save {
        color: $Warning;
        font-size: 14px;
      }
    }

    .tool-wrapper {
      flex: 1;
      display: flex;
      justify-content: flex-end;

      .item {
        margin-left: 16px;
        height: 48px;
        line-height: 48px;
        cursor: pointer;

        &:hover {
          opacity: 0.7;
        }
      }

      .download-link {
        color: inherit;
        font-size: 18px;
      }

      .text-wrapper {
        .text {
          margin-right: 8px;
        }
      }
    }
  }

  .code-editor-wrapper {
    margin: 56px auto 0 auto;
    width: 70vw !important;
    height: calc(100vh - 80px);

    .dxfView {
      width: 70vw;
      height: calc(100vh - 80px);
      background: #fff;
    }
  }

}
</style>
