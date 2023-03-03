<template>
    <div>
        
            <el-dialog :visible.sync="dialogVisible" @close="closeUpload" width="50%">
                <div class="container">
            <el-row class="handle-box" >
                <el-col :span="8">
                    模型类型：<el-select v-model="modelType" size="small" placeholder="请选择模型类型">
                    <el-option
                    v-for="item in modelParams"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                </el-col>
                <el-col :span="16">
                    <!-- <div id="extend-upload-chooseFile"
                     style="float: left;margin: 0px 5px;">
                    <i class="el-icon-plus"></i>
                    选择文件</div> -->
                <el-button
                        size="small"
                        type="success"
                        :icon="uploadStaus"
                        class="handle-del "
                        @click="handelUpload()"
                        :disabled="uploadBtnDisabled"
                >上传文件</el-button>
                <!-- <el-button
                        type="danger"
                        size="small"
                        icon="el-icon-close"
                        class="handle-del "
                        @click="clearFiles()"
                        :disabled="uploadBtnDisabled"
                >清空文件</el-button> -->
                </el-col>
               
    
            </el-row>
            <div class="showMsg">
                <TipsTable/>
            </div>
            <!-- <el-table
                    :data="fileListData"
                    style="width: 100%">
                <el-table-column
                        prop="fileName"
                        label="文件名称"
                        align="center"
                        width="180">
    
                </el-table-column>
                <el-table-column
                        prop="fileSize"
                        align="center"
                        label="文件大小"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="progress"
                        align="center"
                        label="进度">
                </el-table-column>
                <el-table-column label="操作" width="200" align="center"  fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-close"
                                class="red"
                                @click="removeRow(scope.$index, scope.row)"
                        >移除</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-search"
                                class="red"
                                @click="seeFile(scope.$index, scope.row)"
                        >查看</el-button>
                    </template>
                </el-table-column>
            </el-table> -->
        </div>
        </el-dialog>
        </div>
    </template>
    <script>
    import $ from 'jquery'
    import webUploader from 'webuploader'
    import { getToken } from '@/utils/auth'
    import TipsTable from './tipsTable.vue'
    export default {
        name: 'webupload',
        components:{
            TipsTable
        },
        props:{
            headers:{
                type: String,
                default:''
            },
            fileNumLimit:{
                type:Number,
                default:500
            },
            fileSize:{
                type:Number,
                default:100*1024*1024*1024
            },
            chunkSize:{
                type: Number,
                default: 5*1024*1024
            },
            uploadSuffixUrl:{
                type:String,
                default: process.env.VUE_APP_BASE_API
            },
            options:{
                type:Object,
                default:{
                    //允许上传的文件
                    fileType:"doc,docx,pdf,xls,xlsx,ppt,pptx,gif,jpg,jpeg,bmp,png,rar,zip,mp4,avi",
                    fileUploadUrl:"/uploadResource/fileRecord/zone/upload",//上传地址
                    fileCheckUrl:"/uploadResource/fileRecord/zone/upload/md5Check",//检测文件是否存在url
                    checkChunkUrl:"/uploadResource/fileRecord/zone/upload/md5Check",//检测分片url
                    mergeChunksUrl:"/uploadResource/fileRecord/zone/upload/merge/",//合并文件请求地址
                    headers:{
                    'Authorization': "Bearer " +getToken()
                    },
                    projectId:'',
                }
            },
            fileListData:{
                type:Array,
                default:[]
            },
            dialogVisible:{
                type:Boolean,
                default:false
            }
    
        },
        data() {
            return {
                uploader:{},
                uploadBtnDisabled:false,
                uploadStaus:"el-icon-upload",
                fList:[{
                    numbers:1,
                    fileName:"",
                    fileSize:"120",
                    progress:"20%",
                    oper:""
                }],//文件集合
                modelParams:[{
					  label:'倾斜摄影',
					  value:1
					},{
					  label:'Revit',
					  value:2
					},{
					  label:'3DMax',
					  value:3
					},{
						label:'矢量数据',
					  value:4
					},{
						label:'三维部件',
					  value:5
					},{
						label:'全景影像',
					  value:6
					}
				],
                modelType:1
            }
        },
        mounted() {
            this.register();
            this.createUploader();
            this.events();
        },
        methods: {
            handelUpload(){
                this.$openBox.uploadFileGis({
                    params: {
                        projectId:this.options.projectId,
                        modelType:this.modelType
                    },
                    uploadWay:1,
                    serviceEl: this,
                    callType: 1 //  callType 调用此服务的方式：1 - 顶部栏，2 - 右键菜单
                })
                this.dialogVisible=false
            },
            closeUpload(){
                this.dialogVisible=false
                this.$emit('output')
            },
            createUploader(){
                var fileType=this.options.fileType;
                this.uploader = webUploader.create({
                    // 不压缩image
                    resize: false,
                    // swf文件路径
                    swf: '../../../assets/Uploader.swf', // swf文件路径
                    // 默认文件接收服务端。
                    server: this.uploadSuffixUrl+this.options.fileUploadUrl,
                    pick: {
                        id: '#extend-upload-chooseFile',//指定选择文件的按钮容器，不指定则不创建按钮。注意 这里虽然写的是 id, 不仅支持 id, 还支持 class, 或者 dom 节点。
                        multiple :true //开启文件多选
                    },
                    // fileSingleSizeLimit:fileSize,//单个文件大小
                    accept:[{
                        title: 'file',
                        extensions: fileType,
                        mimeTypes: this.buildFileType(fileType)
                    }],
                    // 单位字节，如果图片大小小于此值，不会采用压缩。512k  512*1024，如果设置为0，原图尺寸大于设置的尺寸就会压缩；如果大于0，只有在原图尺寸大于设置的尺寸，并且图片大小大于此值，才会压缩
                    compressSize: 0,
                    fileNumLimit : this.fileNumLimit,//验证文件总数量, 超出则不允许加入队列,默认值：undefined,如果不配置，则不限制数量
                    fileSizeLimit : 100*1024*1024*1024, //1kb=1024*1024,验证文件总大小是否超出限制, 超出则不允许加入队列。
                    fileSingleSizeLimit:this.fileSize, //验证单个文件大小是否超出限制, 超出则不允许加入队列。
                    chunked:true,//是否开启分片上传
                    threads:1,
                    chunkSize:this.chunkSize,//如果要分片，每一片的文件大小
                    prepareNextFile:false//在上传当前文件时，准备好下一个文件,请设置成false，不然开启文件多选你浏览器会卡死
                });
            },
            register(){//注册函数
                var uploadSuffixUrl=this.uploadSuffixUrl;
                var  that=this;
                var options = this.options;
                var headers=options.headers||{};
                var fileCheckUrl=uploadSuffixUrl+options.fileCheckUrl;//检测文件是否存在url
                var checkChunkUrl=uploadSuffixUrl+options.checkChunkUrl;//检测分片url
                var mergeChunksUrl=uploadSuffixUrl+options.mergeChunksUrl;//合并文件请求地址
                headers={
                    'Authorization': "Bearer " +getToken()
                }
                //监控文件上传的三个时间点(注意：该段代码必须放在WebUploader.create之前)
                //时间点1：:所有分块进行上传之前（1.可以计算文件的唯一标记;2.可以判断是否秒传）
                //时间点2： 如果分块上传，每个分块上传之前（1.询问后台该分块是否已经保存成功，用于断点续传）
                //时间点3：所有分块上传成功之后（1.通知后台进行分块文件的合并工作）
                webUploader.Uploader.register({
                    "before-send-file":"beforeSendFile",
                    "before-send":"beforeSend",
                    "after-send-file":"afterSendFile"
                },{
                    //时间点1：:所有分块进行上传之前调用此函数
                    beforeSendFile:function(file){//利用md5File（）方法计算文件的唯一标记符
                        //创建一个deffered
                        var deferred = webUploader.Deferred();
                        //1.计算文件的唯一标记，用于断点续传和秒传,获取文件前20m的md5值，越小越快，防止碰撞，把文件名文件大小和md5拼接作为文件唯一标识
                        (new webUploader.Uploader()).md5File(file,0,10*1024*1024).progress(function(percentage){
                        }).then(function(val){
                            file.fileMd5=val;
                            
                            //2.请求后台是否保存过该文件，如果存在，则跳过该文件，实现秒传功能
                            $.ajax({
                                type:"POST",
                                url:fileCheckUrl,
                                headers:headers,
                                data:{
                                    checkType:1,
                                    contentType:file.type,
                                    zoneTotalMd5:val
                                },
                                dataType:"json",
                                success:function(response){
                                    if(response.success){
                                        that.uploader.skipFile(file);
                                        that.setTableBtn(file.id,"文件秒传",response.data.networkPath);
                                        that.$notify.success({
                                            showClose: true,
                                            message: `[ ${file.name} ]文件秒传`
                                        });
                                        //如果存在，则跳过该文件，秒传成功
                                        that.fList.push(response.data);
                                        deferred.reject();
                                    }else{
                                        if(response.code === 30001){//判断是否支持此类文件上传
                                            var m=response.message+"，文件后缀："+file.ext;
                                            that.uploader.skipFile(file);
                                            that.setTableBtn(file.id,m);
                                            //如果存在，则跳过该文件，秒传成功
                                            that.fList.push(response.data);
                                            deferred.reject();
                                        }else{
                                            //继续上传
                                            deferred.resolve();
                                        }
                                    }
                                }
                            });
    
                        });
                        //返回deffered
                        return deferred.promise();
                    },
                    //时间点2：如果有分块上传，则 每个分块上传之前调用此函数
                    //block:代表当前分块对象
                    beforeSend:function(block){//向后台发送当前文件的唯一标记，用于后台创建保存分块文件的目录
                        //1.请求后台是否保存过当前分块，如果存在，则跳过该分块文件，实现断点续传功能
                        var deferred = webUploader.Deferred();
                        //请求后台是否保存完成该文件信息，如果保存过，则跳过，如果没有，则发送该分块内容
                        (new webUploader.Uploader()).md5File(block.file,block.start,block.end).progress(function(percentage){
                        }).then(function(val){
                            block.zoneMd5=val;
                            $.ajax({
                                    type:"POST",
                                    url:checkChunkUrl,
                                    headers:headers,
                                    data:{
                                        checkType:2,
                                        zoneTotalMd5:block.file.fileMd5,
                                        zoneMd5:block.zoneMd5
                                    },
                                    dataType:"json",
                                    success:function(response){
                                        if(response.success){
                                            //分块存在，跳过该分块
                                            deferred.reject();
                                        }else{
                                            //分块不存在或者不完整，重新发送该分块内容
                                            deferred.resolve();
                                        }
                                    }
                                }
                            );
                        });
                        return deferred.promise();
                    },
                    //时间点3：所有分块上传成功之后调用此函数
                    afterSendFile:function(file){//前台通知后台合并文件
                        //1.如果分块上传，则通过后台合并所有分块文件
                        //请求后台合并文件
                        $.ajax({
                            type:"POST",
                            url:mergeChunksUrl+file.fileMd5+"?projectId="+that.options.projectId+"&modelType="+that.modelType,
                            headers:headers,
                            dataType:"JSON",
                            success:function(resdata){
                                if(resdata.success){//存在了，+1
                                    var data=resdata.data.fileInfo;
                                    that.uploader.skipFile(file);
                                    that.setTableBtn(file.id,'上传成功',data.networkPath);
                                    that.fList.push(data);
                                }
                            }
                        });
                    }
                });
            },
            events(){
                var that = this;
                var uplaod=this.uploader;
                //当文件添加进去
                uplaod.on('fileQueued', function( file ){
                    var fileSize = that.formatFileSize(file.size);
                    var row={fileId:file.id,fileName:file.name,fileSize:fileSize,validateMd5:'0%',progress:"等待上传",state:'就绪'};
                    console.log("this.fileListData:",that.fileListData);
                    that.fileListData.push(row);
                });
    
                //监听进度条,更新进度条信息
                uplaod.on( 'uploadProgress', function( file, percentage ) {
                    that.setTableBtn(file.id,(percentage * 100).toFixed(2)+'%');
                });
    
                /**上传之前**/
                uplaod.on('uploadBeforeSend', function( block, data, headers ) {
                    data.fileMd5 = block.file.fileMd5;
                    data.contentType=block.file.type;
                    data.chunks = block.file.chunks;
                    data.zoneTotalMd5= block.file.fileMd5;
                    data.zoneMd5=block.zoneMd5;
                    data.zoneTotalCount=block.chunks;
                    data.zoneNowIndex=block.chunk;
                    data.zoneTotalSize=block.total;
                    data.zoneStartSize=block.start;
                    data.zoneEndSize=block.end;
                    $.extend(headers, {
                        "Authorization":"Bearer "+getToken()
                    }); 

                });
    
                //错误信息监听
                uplaod.on('error', function(handler){
    
                    if(handler=='F_EXCEED_SIZE'){
                        that.$message.error({
                            showClose: true,
                            message: '上传的单个太大!\n最大支持'+that.formatFileSize(that.fileSize)+'! \n操作无法进行,如有需求请联系管理员'
                        });
                    }else if(handler=='Q_TYPE_DENIED'){
                        that.$message.error({
                            showClose: true,
                            message: '不允许上传此类文件!。<br>操作无法进行,如有需求请联系管理员'
                        });
                    }
                });
    
                /**从文件队列移除**/
                uplaod.on('fileDequeued', function( file ) {
                    // delete percentages[ file.id ];
                });
    
                //当文件上传成功时触发。file {ArchivesFile} File对象, response {Object}服务端返回的数据
                uplaod.on('uploadSuccess',function(file,response){
                    // debugger;
                    if(response.success){
                        that.setTableBtn(file.id,'正在校验文件...');
                    }
                })
                //所有文件上传成功后
                uplaod.on('uploadFinished',function(){//成功后
                    that.uploadBtnDisabled=false;
                    that.uploadStaus="el-icon-upload";
                    that.$message.success({
                        showClose: true,
                        message: '文件上传完毕'
                    });
    
                });
            },
            setTableBtn(fileId,showmsg,networkPath){
                var fileList=this.fileListData;
                for(var i=0;i<fileList.length;i++){
                    if(fileList[i].fileId==fileId){
                        this.fileListData[i].progress=showmsg;
                        this.fileListData[i].networkPath=networkPath||"";
                    }
                }
            },
            removeRow(index,row){
                console.log("index:",index);
                console.log("row:",row);
                this.uploader.removeFile(row.fileId);
                this.fileListData.splice(index,1);
            },
            seeFile(index,row){
                console.log("row:",row);
                var npath=row.networkPath;
                if(this.strIsNull(npath)){
                    this.$message.error({
                        showClose: true,
                        message: '文件未上传，请等待文件上传完成后，方可查看'
                    });
                    return;
                }
                var filens=npath.substring(npath.lastIndexOf(".")+1);
                if(filens=="png"||filens=="jpg"||filens=="jpeg"
                    ||filens=="gif"){//图片，在当前窗口查看
                    this.$message.success({
                        dangerouslyUseHTMLString: true,
                        showClose: true,
                        message: `<img src="${this.uploadSuffixUrl+npath}" style="max-width: 80%;max-height: 80%;"/>`
                    });
                }else{
                   window.open(this.uploadSuffixUrl+npath);
                }
            },
            uploadToServer(){
                if(this.fileListData.length<=0){
                    this.$message.error({
                        showClose: true,
                        message: '没有上传的文件'
                    });
                    return;
                }
                this.uploadBtnDisabled=true;
                this.uploadStaus="el-icon-loading";
                $("#extent-button-uploader").text("正在上传，请稍等...");
                // $("#extent-button-uploader").addClass('layui-btn-disabled');
                this.uploader.upload();
            },
            clearFiles(){
                var that=this;
                that.uploadBtnDisabled=false;
                that.uploadStaus="el-icon-upload";
                that.uploader.reset();
                that.fileListData=[];
            },
            beginUploadFile(index,row){
                this.uploadBtnDisabled=false;
                this.uploadStaus="el-icon-upload";
                this.uploader.upload();
            },
            stopUploadFile(index,row){
                this.uploadBtnDisabled=false;
                this.uploadStaus="el-icon-upload";
                this.uploader.stop();
            },
            buildFileType(fileType){
                var ts = fileType.split(',');
                var ty='';
    
                for(var i=0;i<ts.length;i++){
                    ty=ty+ "."+ts[i]+",";
                }
                return  ty.substring(0, ty.length - 1)
            },
            strIsNull(str){
                if(typeof str == "undefined" || str == null || str == "")
                    return true;
                else
                    return false;
            },
            formatFileSize(size){
                var fileSize =0;
                if(size/1024>1024){
                    var len = size/1024/1024;
                    fileSize = len.toFixed(2) +"MB";
                }else if(size/1024/1024>1024){
                    var len = size/1024/1024;
                    fileSize = len.toFixed(2)+"GB";
                }else{
                    var len = size/1024;
                    fileSize = len.toFixed(2)+"KB";
                }
                return fileSize;
            },
    
        }
    }
    </script>
    <style>
        .container {
            padding: 15px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .handle-box {
            margin-bottom: 10px;
        }
    
        #picker div:nth-child(2){width:100%!important;height:100%!important;}
        .webuploader-container {
            position: relative;
        }
        .webuploader-element-invisible {
            position: absolute !important;
            clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
            clip: rect(1px,1px,1px,1px);
        }
    .webuploader-pick{
        position: relative;
        display: inline-block;
        cursor: pointer;
        background:#409eff;
        padding: 8px 12px;
        color: #fff;
        font-size: 10px;
        text-align: center;
        border-radius: 3px;
        overflow: hidden;
    }
    .webuploader-pick-hover {
        background: #409EFF;
    }
        .showMsg{
            margin: 5px;
            /* background: radial-gradient(#d2b8b8, transparent); */
            color: red;
        }
    </style>
    