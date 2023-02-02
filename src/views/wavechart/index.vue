<template>
    <div id="contain" class="contain">
        <div id="charts" style="width:100%;height:100%;background-color: rgb(255, 255, 255);"
            v-loading.body.lock="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"></div>
        <div :class="!mylinkageClicked?'linkage':'linkage linkage-active'" title="二三维联动" @click=mylinkageClick()></div>
        <Configuration name="configuration" :data="data" :show="show" @output="output" />
       
        <el-button @click="sending()">sending</el-button>
        <el-button @click="getListApi()">getListApi</el-button>
    </div>

</template>
<script>
import * as echarts from 'echarts'
import { getData, routeToWgs, wgsToRoute } from '@/api/wavecharts/wavechart'
import { testApi,getListApi} from '@/api/file/file'
import Configuration from './configuration/configuration'
import { FloatDiv, FloatSub } from '@/utils/floatMath.js'
import { initWebSocket, sendSock, webSocketClose } from '@/utils/websocket1.js'
export default {
    props: {
    },
    components: { Configuration },
    data() {
        return {
            pid: 13,// this.$store.state.pid,
            data: "",
            show: false,
            loading: false,
            myChart: null,
            series: [],
            alldata: {
                gauge: [],
                horizontal: [],
                leftdirect: [],
                rightdirect: [],
                lefthigh: [],
                righthigh: [],
                tri: [],
            },
            param: {
                gaugeparam: 1000,
                horizontalparam: 1,
                lefthighparam: 2,
                righthighparam: 1.5,
                leftdirectparam: 1.5,
                rightdirectparam: 1.5,
                triparam: 1,
            },
            keys: ["tri", "horizontal", "gauge", "rightdirect", "leftdirect", "righthigh", "lefthigh"],//所有通道，用于控制通道顺序
            scaleParams: [1, 1, 1000, 1.5, 1.5, 1.5, 2],
            colors: ["#FEF083", "#22B0F4", "#327C9F", "#0BBFED", "#40F2FF", "#FFBAE8", '#0080DE'],
            names: ["三角坑", "水平", "轨距", "右轨向", "左轨向", "右高低", "左高低"],
            offsets: [],
            visible: "none",
            handleData: {},
            tooltipData: "",
            handler: undefined,
            optionsData: {},
            start: 0,
            end: 100,
            level: 5,
            route:0,
            mylinkageClicked:false,
            wsUrl:'ws://192.168.30.139:8080/ws',
        }
    },
    beforeDestroy() {
        // this.Clear("routeposition");
        if (this.myChart) {
            window.removeEventListener('resize', this.myChart.resize);
            this.myChart = null;
        }
    },
    mounted() {
        setTimeout(() => {
            this.viewer = window.CesiumViewer;
            this.searchData();
        }, 1000);
        initWebSocket(this.wsUrl)
    },
    created() {
    },
    computed: {
    getSocketMsg() {
      return this.$store.state.webSocketMsg
    },
  },
  //监控 getSocketMsg 是否有接收到数据
  watch: {
    getSocketMsg: {
      handler: function (val) {
        this.getConfigResult(val)
      },
    },},
    beforeDestroy(){
        // console.log("beforeDestroy");
        this.handleClose()
    },
    methods: {
        
        getConfigResult(val) { 
            // console.log(val);
        }, 
        sending() {
      sendSock('发送的信息')
    }, handleClose() {
     //关闭连接
      webSocketClose()
    },
        dialog(show, i, type, name) {
            this.show = show;

            let form = {
                i: i,
                type: type,
                list: [],
                name: name,
                color: this.colors[i],
                scale: this.scaleParams[i],
                offset: this.offsets[i],
                unit: "mm",
                current: true,
                old: true
            }
            this.handleData = form;
            this.data = form;
        },
        searchData() {
            var that = this;
            this.loading = true;
            getData(this.pid).then(res => {
                if (res.success) {
                    this.alldata = res.result;

                    this.myChart = echarts.init(document.getElementById("charts"));
                    this.setOffsets();
                    this.myChart.on("click", 'series.line.markLine',  function (param) {
                        if (param.componentType == 'markLine') {
                            for (let i = 0; i < that.keys.length; i++) {
                                var linename = that.getName(that.keys[i]) + that.getParam(that.keys[i]);
                                if (linename == param.name) {
                                    that.dialog(true, i, that.keys[i], that.getName(that.keys[i]))
                                }
                            }

                        }
                    })
                    // this.myChart.getZr().on("mousedown", function (params) {
                    //     that.getLongLaT(that.tooltipData);
                    // })
                    var start = this.alldata.lefthigh[0][0];
          var end = start + 350;
          this.start = 0;
          this.end = Math.ceil(100 * (end - start) / (this.alldata.lefthigh[this.alldata.lefthigh.length - 1][0] - start));

                    this.drawMarkLines();
                    this.drawLines();
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                }
                this.myChartResize();
                this.loading = false;
            }).catch(e => {
                this.loading = false;
            })
        },
        drawMarkLines() {
            var markLines = [];
            var num = 0;
            this.alldata.lefthigh.forEach((element) => {
                var a = Math.ceil(element[0] / 100) * 100;
                if (num != a) {
                    num = a;
                    markLines.push({
                        name: Math.trunc(a / 1000).toString() +
                            "+" +
                            (a % 1000).toString(),
                        xAxis: a,
                    });
                }
            });
            for (let i = 0; i < this.keys.length; i++) {
                var linename = this.getName(this.keys[i]) + this.getParam(this.keys[i]);
                markLines.push({
                    name: linename,
                    yAxis: this.offsets[i],
                });
            }
            this.series = [];
            this.series.push({
                data: [],
                type: "line",
                markLine: {
                    symbol: ["none", "none"], // 去掉箭头
                    label: { show: true, position: "end", formatter: "{b}", color: "#000" },
                    data: markLines,
                    lineStyle: {
                        color: "#A8A8A8",
                        type: "dashed",
                        dashOffset: 4
                    },
                },
            });
            this.getOptions(this.series);
        },
        getIndex(name) {
            let i = 0;
            this.keys.filter((value, index) => {
                if (value === name) {
                    i = index;
                    return;
                }
            })
            return i;
        },
        setOffsets() {
            this.offsets = [];
            this.keys.map((value, index) => {
                this.offsets.push(index + 1)
            })
            console.log(this.offsets);
        },
        getName(key) {
            let i = this.getIndex(key);
            return this.names[i];
        },
        getParam(key) {
            let i = this.getIndex(key);
            return "(" + this.scaleParams[i] + "mm)";
        },
        getColor(key) {
            let i = this.getIndex(key);
            return this.colors[i];
        },
        getScale(key) {
            let i = this.getIndex(key);
            return this.scaleParams[i];
        },
        drawLines() {
            for(var no=6;no>-1;no--){
                for (let key in this.alldata) {
                    let i = this.getIndex(key);
                    if (this.alldata[key] && this.alldata[key].length > 0) {
                        if(no===i){
                            this.setSeriesVisible(this.alldata[key], this.scaleParams[i], true, this.offsets[i], this.names[i], this.colors[i])
                        }
                    }
                }
            }
        },
        mylinkageClick(){
            var that = this;
            that.mylinkageClicked = !that.mylinkageClicked;
            if (that.myChart) {
            if (that.mylinkageClicked) {
                this.handleInput();
                that.myChart.getZr().on("click", (param) => {
                if (param.target != undefined && (param.target.type == "tspan" || param.target.type == "path")) return;
                //联动
                if (that.route && that.route > 0) {
                    that.getLongLaT(that.route)
                }
                })
            }
            else {
                that.clearObjects();
            }
            }
        },
        setSeriesVisible(alldata, param, show, offset, name, color) {
            if (show) {
                var datas = [];
                alldata.forEach((element, index) => {
                    // var divs = this.keys.indexOf(key) + 1;
                    if (index % 100 == 0) {
                        var y = element[1] / (param*7) + offset;
                        var data = [element[0], y];
                        datas.push(data);
                    }
                });
                // console.log(datas);
                this.series.push({
                    name: name,
                    type: "line",
                    data: datas,
                    itemStyle: {
                        color: color,
                    },
                    lineStyle: {
                        color: color,
                    },
                    symbol: "none",
                    smooth: false
                });
                this.getOptions(this.series);
            } else {
                var datas = [];
                this.series.forEach((element) => {
                    if (element.name != name) datas.push(element);
                });
                this.series = datas;
                this.getOptions(this.series);
            }
            // this.getOptions(this.series);
        },
        getOptions(datas) {
            var that = this;
            var options = {
                tooltip: {
                    trigger: "axis",
                    backgroundColor: "#333",
                    textStyle: {
                        color: "#fff"
                    },
                    formatter: function (params) {
                        var value = params[0].data[0]
                        that.tooltipData = params[0].data[0];
                        that.route=params[0].data[0];
                        let str = `里程值：KM${Math.trunc(value / 1000).toString()}+${Math.trunc(value % 1000).toString()}` + "<br/>";
                        // console.log(params);
                        //params是数组格式
                        for (let item of params) {
                            //设置浮层图形的样式跟随图中展示的颜色
                        
                            str +=
                                "<span style='display:inline-block;width:10px;height:10px;border-radius:10px;background-color:" +
                                item.color +
                                ";'></span>" +
                                "\t" +
                                item.seriesName +
                                " : " +
                                that.getData(item.seriesName, item.dataIndex) +
                                "<br/>";
                        }
                        return str;
                    },
                },
                 grid: {
                    left: 30,
                    right: 100,
                    top: 60,
                    bottom: "5%",
                },
                xAxis: {
                    type: "value",
                    axisTick: { show: false },
                    splitLine: {
                        show: false
                    },  
                    axisLabel: { show: false },
                    min: this.alldata.tri[0][0],
                    max: this.alldata.tri[this.alldata.tri.length - 1][0],
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        show: false,
                    },
                    axisTick: { show: true },
                    minorTick: {
                        show: true,
                        splitNumber: 7,
                    },
                    splitLine: {
                        show: true,
                    }
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 0,
                            xAxisIndex: 0,
                        },
                    },
                    right: 20
                },
                dataZoom: [
                    {
                        type: "inside",
                        start: that.start,
                        end: that.end,
                        zoomOnMouseWheel: false,
                        moveOnMouseMove: false,
                        moveOnMouseWheel: true
                    },
                ],
                series: datas,
            };
            this.setOptions(options);
            this.optionsData = options;
        },
        setOptions(options) {
            this.myChart.setOption(options, true);
        },
        getData(name, index) {
            var data = [];
    var unit = "mm";
    switch (name) {
      case "左高低":
        data = [...this.alldata.lefthigh];
        break;
      case "右高低":
        data = [...this.alldata.righthigh];
        break;
      case "左轨向":
        data = [...this.alldata.leftdirect];
        break;
      case "右轨向":
        data = [...this.alldata.rightdirect];
        break;
      case "轨距":
        data = [...this.alldata.gauge];
        break;
      case "水平":
        data = [...this.alldata.horizontal];
        break;
      case "三角坑":
        data = [...this.alldata.tri];
        break;
      default:
        break;
    }
    var res = data[index][1].toFixed(2) + unit;
    return res;
        },
        output(data) {
            let num = 0;
            if (this.colors[data.i] != data.color) {
                this.colors[data.i] = data.color;
                num++;
            }
            if (this.names[data.i] != data.name) {
                this.names[data.i] = data.name;
                num++;
            }
            if (this.scaleParams[data.i] != data.scale) {
                this.scaleParams[data.i] = data.scale;
                num++;
            }
            if (this.offsets[data.i] != Number(data.offset)) {
                this.offsets[data.i] = Number(data.offset);
                num++;
            }
            if (num > 0) {
                //重新加载echarts
                this.drawMarkLines();
                this.drawLines();
            }

            this.show = false;

        },
        handleMousedown(params) {
            //通过获取鼠标点击事件，获取到值
            // console.log(params);
        },
        getCatesian3FromPX(px) {
            if (this.viewer && px) {
                var cartesian = null;
                var isOnTerrain = false;
                let boolTerrain = this.viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider;
                if (!boolTerrain) {
                    var ray = this.viewer.scene.camera.getPickRay(px);
                    if (!ray) return null;
                    cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
                    isOnTerrain = true;
                }
                // 地球
                // if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
                if (!isOnTerrain && boolTerrain) {
                    cartesian = this.viewer.scene.camera.pickEllipsoid(px, this.viewer.scene.globe.ellipsoid
                    );
                }
                if (cartesian) {
                    let position = this.transformCartesianToWGS84(cartesian);
                    if (position.alt < 0) {
                        cartesian = this.transformWGS84ToCartesian(position, 0.1);
                    }
                    return cartesian;
                }
                return false;
            }
        },
        handleInput() {
            if (this.handler) return;
            this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
            this.handler.setInputAction((dbl) => {
                let cartesian3 = this.getCatesian3FromPX(dbl.position);
                if (Cesium.defined(cartesian3)) {
                    let ll = this.transformCartesianToWGS84(cartesian3);
                    if (ll && ll.lng && ll.lat) {
                        this.getRoute(ll.lat, ll.lng);
                        this.Clear("routeposition");
                        this.DrawPoint('routeposition', Cesium.Cartesian3.fromDegrees(ll.lng, ll.lat, ll.alt));
                    }

                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        },
        transformCartesianToWGS84(cartesian) {
            if (this.viewer && cartesian) {
                var ellipsoid = Cesium.Ellipsoid.WGS84;
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                return {
                    lng: Cesium.Math.toDegrees(cartographic.longitude),
                    lat: Cesium.Math.toDegrees(cartographic.latitude),
                    alt: cartographic.height,
                };
            }
        },
        getLongLaT(route) {
            //转换成经纬度显示地图上
            let param = {
                pid: this.pid,
                route: route
            }
            routeToWgs(param).then((res) => {
                if (res.code==200 && res.result && res.result.longitude) {
                    let point = {
                        longitude: res.result.longitude,
                        latitude: res.result.latitude,
                        height: res.result.height,
                    }
                    this.viewer.camera.flyTo({
                        //经度、纬度、高度
                        destination: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.height + 1000),
                        orientation: {
                            // 水平偏角，默认正北 0
                            heading: 0,
                            // 俯视角，默认-90，垂直向下
                            pitch: Cesium.Math.toRadians(-90 || -Cesium.Math.PI_OVER_FOUR),
                            // 旋转角
                            roll: Cesium.Math.toRadians(360 || 0)
                        },
                        duration: 5 //过渡时间
                    });
                    this.Clear("routeposition");
                    this.DrawPoint('routeposition', Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.height));
                }
            }).catch((err) => {
                // console.log(err);
            });
        },
        getRoute(latitude, longitude) {
            let param = {
                pid: this.pid,
                latitude: latitude,
                longitude: longitude
            }
            wgsToRoute(param).then((res) => {
                if (res.code==200 && res.result && res.result > 0.0) {
                    this.ChangeOptions(res.result);

                }
            });
        },
        //根据route切换波形图
        ChangeOptions(route) {
            let max = this.optionsData.xAxis.max;
            let min = this.optionsData.xAxis.min;
            let sub = FloatSub(route, min);
            let sum = FloatSub(max, min);
            let number = parseInt(FloatDiv(sub, sum) * 100);
            this.start = number - this.level < 0 ? 0 : number - this.level;
            this.end = number + this.level > 100 ? 100 : number + this.level;
            this.optionsData.dataZoom[0].start = this.start;
            this.optionsData.dataZoom[0].end = this.end;
            this.setOptions(this.optionsData);
        },
        DrawPoint(id, point) {
            this.viewer.entities.add({
                position: point,
                id: id,
                billboard: {
                    image: '/images/map-marker.png',
                    scaleByDistance: new Cesium.NearFarScalar(1200, 0.8, 5200, 0.5), //设置随图缩放距离和比例
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 60000), //设置可见距离
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // //相对于对象的原点（注意是原点的位置）的水平位置
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //相对于对象的原点的垂直位置，BOTTOM时锚点在下，对象在上
                },
            });
        },
        Clear(id) {
            let entities = this.viewer.entities.getById(id);
            if (entities) this.viewer.entities.remove(entities);
        },
        test(){
            let param={
                code: 'G00101A1K0911050'
            }
            testApi(param).then((res)=>{
                // console.log(res);
            }).catch((err)=>{
                // console.log(err);
            })
        },
        getListApi(){
            let param={
                type: 'gangGui'
            }
            getListApi(param).then((res)=>{
                // console.log(res);
            }).catch((err)=>{
                // console.log(err);
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.contain {
    width: 100%;
    height: 800px;
    background: #242424;

    .charts {
        height: 100%;
        width: 100%;
        // background-color: aqua;
    }

    .linkage {
        position: absolute;
        width: 18px;
        height: 18px;
        background-image: url("../../assets/images/生长曲线.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        z-index: 99;
        top: 7px;
        right: 75px;
        opacity: 0.3;
    }

    .linkage:hover,.linkage-active {
        background-image: url("../../assets/images/生长曲线select.png");
        opacity: 1;
        cursor:pointer
    }
}

#spinloading {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(17, 17, 17, 0.2);
    text-align: center;
    padding-top: 300px;
    z-index: 998;
}

#configuration {
    .color-div {
        width: 60px;
        height: 30px;
    }

    .chrome-picker {
        display: none;
        top: -34px;
        position: relative;
        left: 33%;
    }
}
</style>