Number.prototype.round = Number.prototype.round || function(scale) {
	return scale < 0 || scale > 20 ? this : Math.round(this * Math.pow(10, scale)) / Math.pow(10, scale); 
};
var stockChart = function(){};
stockChart.prototype = {
    init: function (isFigure, tradeType, isTrade, nextTime) {
        this.klineData = {};
        this.isFigure = isFigure;
        this.tradeType = tradeType;//0停牌,1正常
        this.isTrade = isTrade;
        this.nextTime = nextTime;
        this.yesClose = yesClose;
        this.index = 0;
        $(".chart-details").html("");
    },
    getChart: function (type, minChartType, rangeSelectorButtons, rangeSelectorIndex) {
        var _this = this;
        //if(minChartType!="today"){
        this.clearTime();
        //}
        _this.minChartType = minChartType;
        if (!_this.klineData[minChartType]) {
            $.ajax({
                url: '/stock/quote/min.html',
                dataType: 'jsonp',
                type: 'get',
                data: {
                    code: code,
                    p: type
                },
                success: function (data) {
                    if(minChartType=='today' || minChartType=='day5'){
                        _this.result = data.result;
                    }else{
                        _this.result = true;
                    }
                    if (data.result) {
                        _this.yesClose = data.yesClose;
                        _this.currPrice = data.current;
                        _this.initChart(data.data, data.yesClose, rangeSelectorButtons, rangeSelectorIndex);
                        if (minChartType != "today") {
                            _this.klineData[minChartType] = data;
                        }
                    }else{
                        _this.initChart(_this.rankTime(),_this.yesClose, rangeSelectorButtons, rangeSelectorIndex);
                    }
                }
            });
        } else {
            _this.initChart(_this.klineData[minChartType].data, _this.klineData[minChartType].yesClose, rangeSelectorButtons, rangeSelectorIndex);
        }
    },
    initChart: function (t, yesClose, rangeSelectorButtons, rangeSelectorIndex) {
        var _this = this;
        _this.initMA();//初始化MA
        var curs = [], vols = [], mas = [],showAverage =  _this.minChartType=='today' || _this.minChartType=='day5' ,isMin = _this.minChartType=='today' || _this.minChartType=='day5';
        _this.showAverage = showAverage;
        var colors = ['#ff5256', '#55a500'];
        var color = '';
        for (var i = 0; i < t.length; i++) {
            curs.push({
                x: t[i][0],
                y: t[i][1]
            });
            if ( showAverage ) {
                //今日+五日的
                mas.push({
                    x: t[i][0],
                    y: (t[i][3]),
                });
            }
            //判断交易量颜色
            if (i == 0) {
                if (t[i][1] > yesClose) {
                    color = colors[0];
                } else {
                    color = colors[1];
                }
            } else {
                if (t[i][1] > t[i - 1][1]) {
                    color = colors[0];
                } else {
                    color = colors[1];
                }
            }
            if(isMin){
                vols.push({
                    x: t[i][0],
                    y: t[i][2],
                    color: color
                });
            }else{
                vols.push({
                    x: t[i][0],
                    y: t[i][5],
                    color: color
                });
            }

        }
        _this.minQhy = curs;
        _this.minQhyCnt = vols;
        _this.minAverage = mas;
        var startData = yesClose;
        Highcharts.setOptions({
            //语言文字对象：所有highstock文字相关设置
            lang: {
                downloadJPEG: '下载JPGE格式',
                contextButtonTitle: 'hello',
                rangeSelectorFrom: "日期:",
                rangeSelectorTo: "至",
                rangeSelectorZoom: "范围",
                loading: '加载中...',
                shortMonths: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            },
            global: {
                useUTC: false
            }
        });
        $('.chart-details').highcharts('StockChart', {
            rangeSelector: {
                enabled: true,
                selected: rangeSelectorIndex,
                buttons: rangeSelectorButtons,
                inputEnabled: false,
            },
            chart: {
                margin: 0,
                marginTop: 0,
                marginRight: 55,
                marginLeft: 55,
                spacingBottom: 10,
                style: {fontFamily: '"Helvetica Neue", Arial, "Microsoft YaHei"', fontSize: "12px"},
                animation: !1,
                panning: !1/*,
                 plotBorderWidth:1,
                 plotBorderColor: '#e6e6e6'*/
            },
            //拆线、tips颜色不包括文字颜色
            //colors: ['#a6c96a', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
            credits: {
                enabled: false
            },
            navigation: {
                enabled: true,
                buttonOptions: {
                    align: 'center'
                }
            },
            navigator: {
                margin: 39,
                maskFill: 'rgba(255,255,255,0.8)',
                maskInside: false,
                series: {
                    color: '#4572A7',
                    fillOpacity: 0.5,
                },
                xAxis: {
                    labels: {
                        formatter: function () {
                            if(_this.minChartType!='today'){
                                return Highcharts.dateFormat('%m-%d', this.value);
                            }else{
                                var xVal = Highcharts.dateFormat("%H:%M", this.value);
                                if(xVal == '13:00'){
                                    return '11:30/13:00';
                                }else if(xVal == '09:30' || xVal == '10:00' ||  xVal == '10:30' || xVal == '14:00' || xVal == '15:00'){
                                    return xVal;
                                }
                            }
                        },
                        style: {
                            color: '#000'
                        },
                        x: -15,
                        y: 0
                    }
                }
            },
            plotOptions: {
                line: {
                    turboThreshold: Number.MAX_VALUE,
                    dataGrouping: {enabled: !1},
                    connectNulls: !0,
                    lineWidth: 1.2,
                    states: {
                        hover: {lineWidth: 0.2}
                    }
                },
                area: {
                    turboThreshold: Number.MAX_VALUE,dataGrouping: {enabled: !1},connectNulls: !0,fillColor: {linearGradient: {x1: 0,y1: 0,x2: 0,y2: 1},stops: [[0, "rgba(135, 189, 238, 1)"], [1, "rgba(135, 189, 238, 0)"]]},color: "#87bdee",threshold: null
                },
                column: {
                    color: "#d0d0d0",
                    turboThreshold: Number.MAX_VALUE,
                    dataLabels:{
                        y:10
                    },
                    dataGrouping: {enabled: !1},
                    enableMouseTracking:!1
                },
                columnrange: {
                    color: '#f00'
                }
            },
            scrollbar: {
                enabled: false,
                liveRedraw: false
            },
            tooltip: {
                enabled:_this.result,
                crosshairs: [{
                    color: '#ffcbcc'
                }, {
                    color: '#ffcbcc'
                }],
                positioner: function () {
                    return {x: 50, y: 0};
                },
                shared: !0,
                useHTML: !0,
                shadow: !1,
                borderColor: "rgba(255, 255, 255, 0)",
                backgroundColor: "rgba(255, 255, 255, 0)",
                valueDecimals: 2,
                style: {},
                formatter: function () {
                    var date, price, dealNum, change, averageCurr;
                    var _this = this;
                    _this.formatUnit = function (num, floatLen) {
                        var pointIndex = 0;
                        if (num > Math.pow(10, 8)) {
                            num = num / Math.pow(10, 8) + '';
                            pointIndex = num.indexOf('.');
                            num = num.substring(0, pointIndex + floatLen + 1);
                            num += '亿';
                        } else if (num > Math.pow(10, 4)) {
                            num = num / Math.pow(10, 4) + '';
                            pointIndex = num.indexOf('.');
                            num = num.substring(0, pointIndex + floatLen + 1);
                            num += '万';
                        }
                        return num;
                    };
                    var currObj = this.points[0], AverObj = this.points[1], index = this.points[0].point.index;
                    date = Highcharts.dateFormat("20%y-%m-%d %H:%M", currObj.x);
                    price = '当前价:' + currObj.y.toFixed(2);
                    dealNum = '成交量:' + _this.formatUnit(vols[index].y, 2);
                    if(showAverage){
                        averageCurr = AverObj.y != undefined ? '均价:' + AverObj.y.toFixed(2) + '&nbsp;&nbsp;' : '';
                    }else{
                        averageCurr='';
                    }
                    change = _this.y ? (((_this.y - startData) / startData) * 100).round(2) : _this.y.round(2);
                    if (change > 0) {
                        change = '涨跌幅：<span style="color: #e4462e">+' + change + '%</span>';
                    } else {
                        change = '涨跌幅：<span style="color: #00A600">' + change + '%</span>';
                    }
                    return date + '&nbsp;&nbsp;' + price + '&nbsp;&nbsp;' + averageCurr + dealNum + '&nbsp;&nbsp;' + change;
                }
            },
            //Y轴相关设置
            yAxis: [
                {
                    offset:-10,
                    opposite: false,
                    labels: {
                        formatter: function() {
                            return this.value.toFixed(2);
                        },
                        y:5
                    },
                    showLastLabel: true,
                    height: 200,
                    top: 28,
                    lineColor:'#4572A7',
                    tickPositioner: function () {
                        var bDay1 = _this.minChartType=='today',
                        basePrice = bDay1 ? yesClose : yesClose,// TODO: first data
                        dMax = this.dataMax || this.chart.series[0].dataMax || basePrice,
                        dMin = this.dataMin || this.chart.series[0].dataMin || basePrice,
                        chgMax = Math.max(Math.abs(dMax - basePrice), Math.abs(dMin - basePrice));
                        
                        var rangeMax = 2;
                        for (rangeMax; ; rangeMax += 2) {
                        	if (Math.round(basePrice * rangeMax) / 100 >= chgMax.round(2))
                        		break;
                        }
                        
                        var positions = [
                             basePrice - Math.round(basePrice * rangeMax) / 100,
                             basePrice - Math.round(basePrice * rangeMax / 2) / 100,
                             basePrice,
                             basePrice + Math.round(basePrice * rangeMax / 2) / 100,
                             basePrice + Math.round(basePrice * rangeMax) / 100,
                        ];
                        if (bDay1) return positions;
                        
                        var start = 0, end = positions.length;
                        for(; positions[start + 1] <= dMin && start < 2; start++);
                        for(end; positions[end - 2] >= dMax && end > 3; end--);
                        if (end - start < 2) {
                        	start--;
                        	end++;
                        }
                        
                        return positions.slice(start, end);
                    },
                    plotLines : [{
                        value : yesClose,
                        color : '#ff5256',
                        dashStyle : 'LongDash',
                        width : _this.minChartType=='today'?1:0,
                        zIndex: 1
                    }]
                },
                {
                    linkedTo: 0,
                    labels: {
                        formatter: function() {
                        	var s = yesClose <= 0 ? 0 : ((this.value - yesClose) / yesClose * 100).round(2);
                            return '<span style="color: ' + (s > 0 ? '#ff5256' : s < 0 ? '#4daf7b' : '#555') + '">' + (s>0?'+': '') + s.toFixed(2) + '%</span>';
                        },
                        align: 'right',
                        x: 50,
                        y: 5,
                    },
                    showLastLabel: true,
                    height: 200,
                    top: 28,
                    gridLineWidth: 0,
                    tickPositioner: function () {
                        return this.chart.yAxis[0].tickPositions;
                    },
                },
                {
                    opposite: true,
                    offset: 0,
                    labels: {
                        align: "left",
                        y: 5,
                        formatter:function(){
                            var val = this.value;
                            if(val<0){
                                return 0;
                            }
                            if(this.value >= 10000 && this.value < 1000000){
                                val = this.value / 10000 + '万';
                            }else if(this.value >= 1000000 && this.value < Math.pow(10,8)){
                                val = this.value / 1000000 + '百万';
                            }else if(this.value >= Math.pow(10,8)){
                                val = this.value / 100000000 + '亿';
                            }
                            return val;
                        }
                    },
                    tickPositioner: function() {
                    	var dMax = this.dataMax || this.chart.series[2].dataMax,
                    	halfMax = dMax / 2;
                    	for (var exp = 2; halfMax > 100; exp += 2) {
                    		halfMax /= 100;
                    	}
                    	halfMax = Math.ceil(halfMax) * Math.pow(10, exp - 2);
                        return [0, halfMax, halfMax * 2];
                    },
                    top: 260,
                    height: 60,
                    gridLineColor: "#f6f6f6"
                }
            ],
            //X轴相关设置
            xAxis: [{
                showLastLabel: true,
                showFirstLabel: true,
                offset: -80,
                tickWidth:0,
                lineWidth:0,
                gridLineWidth:1,
                gridLineColor:"#f6f6f6",
                tickPositioner: function () {
                	if (_this.minChartType=='today') {
                		var interval = 60*60*1000,
        				xDatas = this.chart.series[0].xData,
        				tmp = xDatas[0], tmpI = 0,
        				positions = [tmp];
        				for (var i = 0; i < xDatas.length; i++) {
        					if (xDatas[i] - tmp >= interval) {
        						tmp = xDatas[i];
        						if (i - tmpI > 1) {
        							tmpI = i;
        							positions.push(tmp);
        						}
        					}
        				}
        				return positions;
                	} else {
                		var interval = 12*60*60*1000,
        				userMin = this.userMin,
        				userMax = this.userMax,
        				xDatas = userMin && userMin ? $(this.chart.series[0].xData).filter(function() {
        					return this >= userMin && this <= userMax;
        				}) : this.chart.series[0].xData,
        				tmp = xDatas[0],
        				positions = [tmp];
        				for (var i = 0; i < xDatas.length; i++) {
        					if (xDatas[i] - tmp >= interval) {
        						tmp = xDatas[i];
    							positions.push(tmp);
        					}
        				}
        				if (positions.length <= 6)
        					return positions;
        				var boot = Math.ceil(positions.length / 5),
        				idx = positions.length - 1,
        				subPositions = [];
        				
        				for (idx; idx >= 0; idx -= boot) {
        					subPositions.push(positions[idx]);
        				}
        				return subPositions;
                	}
                },
                labels: {
                    formatter: function(){
                        if(_this.minChartType!='today'){
                            return Highcharts.dateFormat('%m-%d', this.value);
                        }else{
                            var xVal = Highcharts.dateFormat("%H:%M", this.value);
                            if(xVal == '11:30'){
                                return '11:30/13:00';
                            }
                            return xVal;
                        }
                    },
                    style:{
                        color: '#a5a5a5'
                    },
                    x: _this.minChartType=='today'?0:25
                }
            }],
            series : [
                {
                    type: "line",
                    name: "当前价",
                    color:'#5baff2',
                    data: curs,
                    zIndex: 1,
                    yAxis: 0
                },
                {
                    type: "line",
                    name: "均价",
                    color:'#ff9900',
                    data: mas,
                    yAxis: 0,
                    marker: {
                    	states: {
                    		hover: {
                    			enabled: false
                    		}
                    	}
                    }
                },
                {
                    type: "column",
                    name: "成交量",
                    data: vols,
                    yAxis: 2
                }
            ]
        });
        var chart = $('.chart-details').highcharts();
        _this.minQhyChart = chart;
        
        if(_this.result){
            //更新数据
            _this.updateData();
        }else{
            $(".highcharts-series").hide();
        }

    },
    calculateValueYPixelOfMinuteChart: function(t, e) {
        var a = 200
            , i = t.yAxis[0]
            , o = i.min
            , n = i.max
            , r = t.plotTop;
        return (n - e) * a / (n - o) + r;
    },
    invertValueString: function(t) {
        var e = parseFloat(t);
        return /.*k$/.test(t) ? 1e3 * e : e;
    },
    updateData: function () {
        var _this = this;
        if (_this.minChartType != 'today') {
            return;
        }
        var chart = _this.minQhyChart,
            minQhy = _this.minQhy,
            currentTime = new Date().getTime()
        ;
        //交易时间
        if (_this.isTrade) {
            for (var i = 0; i < minQhy.length; i++) {
                if (minQhy[i].x >= currentTime && minQhy[i].y == null) {
                    _this.index = i;
                    break;
                }
            }
            if (_this.isFigure || (!_this.isFigure && _this.tradeType == '1' )) {
                //正常
                var lastTime = minQhy[_this.index].x - currentTime;
                _this.timeOutTimer = window.setTimeout(function () {
                    _this.loadOneMinMethod(minQhy, chart);
                    _this.loadOneMinData(minQhy, chart);
                }, lastTime);

            } else if (!_this.isFigure && _this.tradeType == '0') {
                var lastTime = minQhy[_this.index].x - currentTime;
                if (lastTime < 0) {
                    return;
                }
                //停牌
                _this.timeOutTimer = window.setTimeout(function () {
                    _this.loadNotTradeMethod(minQhy, chart);
                    _this.loadNotTradeData(minQhy, chart);
                }, lastTime);
            }

        } else {
            for (var i = 0; i < minQhy.length; i++) {
                if (minQhy[i].x >= currentTime && minQhy[i].y == null) {
                    _this.index = i;
                    break;
                }
            }
            _this.loadNextTradingTimeData(minQhy, chart);
        }
    },
    loadOneMinData: function (minQhy, chart) {
        var _this = this;
        _this.chartTimer = window.setInterval(function () {
            _this.loadOneMinMethod(minQhy, chart);
        }, 60000);
    },
    loadOneMinMethod: function (minQhy, chart) {
        var _this = this;
        var currPP = _this.currPrice = CURRENT_PRICE;
        if (_this.index == 0) {
            _this.reloadChart();
            _this.index++;
            return;
        }
        //请求前一个时间点的分时数据
        var updateDate = minQhy[_this.index - 1].x, updateAverage = null;
        if(_this.showAverage){
            updateAverage =  _this.minAverage[_this.index - 1].y;
        }
        $.post("/stock/curr/min.html", {"code": code, "oneMin": updateDate}, function (data) {
            if (!data.result) {
                chart.series[0].data[_this.index - 1].update(currPP);
                chart.series[0].data[_this.index].update(currPP);
                //均线更新
                if(_this.showAverage) {
                    chart.series[1].data[_this.index].update(updateAverage);
                    chart.series[1].data[_this.index - 1].update(updateAverage);
                }
                _this.index++;
                return;
            }

            var isMinTrade = data.isMinTrade, curr = data.data.current, volume = data.data.volume, average = data.data.average;
            if (curr) {
                //重新设置当前价
                currPP = curr;
            }
            if (average) {
                //重新设置均价
                updateAverage = average;
            }
            chart.series[0].data[_this.index].update(currPP);
            chart.series[0].data[_this.index - 1].update(currPP);
            chart.series[2].data[_this.index - 1].update(volume);
            //均线更新
            if(_this.showAverage) {
                chart.series[1].data[_this.index].update(updateAverage);
                chart.series[1].data[_this.index - 1].update(updateAverage);
            }
            if (!isMinTrade) {
                window.clearInterval(_this.chartTimer);
                if (data.nextTime) {
                    _this.nextTime = data.nextTime;
                    _this.loadNextTradingTimeData(minQhy, chart);
                    return;
                }
            }
            _this.index++;
        }, "jsonp");
        if (_this.index == minQhy.length - 1) {
            window.clearInterval(_this.chartTimer);
        }
    },
    loadNextTradingTimeData: function (minQhy, chart) {
        var _this = this;
        var currDate = new Date().getTime(),
            betWeenTime = _this.nextTime - currDate,
            betWeenMaxTime = 60 * 60 * 1000;//1小时
        if (betWeenTime <= betWeenMaxTime) {
            _this.timeOutTimer = window.setTimeout(function () {
                _this.loadOneMinMethod(minQhy, chart);
                _this.loadOneMinData(minQhy, chart);
            }, betWeenTime);
        }

    },
    loadNotTradeData: function (minQhy, chart) {
        var _this = this;
        _this.chartTimer = window.setInterval(function () {
            _this.loadNotTradeMethod(minQhy, chart);
        }, 60000);
    },
    loadNotTradeMethod: function (minQhy, chart) {
        var _this = this;
        if (_this.index == 0) {
            _this.reloadChart();
            _this.index++;
            return;
        }
        chart.series[0].data[_this.index].update(_this.currPrice);
        _this.index++;
        if (_this.index == minQhyLength - 1) {
            window.clearInterval(_this.chartTimer);
        }
    },
    clearTime: function () {
        var _this = this;
        if (_this.timeOutTimer) {
            window.clearTimeout(this.timeOutTimer);
        }
        ;
        if (_this.chartTimer) {
            window.clearInterval(this.chartTimer);
        }
    },
    reloadChart: function () {
        //到开盘时间，重新绘制一下图形
        //加载分时
        var span_wrap = $("span.title_type").eq(0);
        if (span_wrap.parent().hasClass("curr") && $("span.min_sub_type[display='today']").parent().hasClass("curr")) {
            //console.info("重新绘制一下图形");
            span_wrap.trigger("click");
        }
    },
    initMA:function(){
        $(".ma-stock-line").children("span").each(function(){
            $(this).text("");
        });
    },
    rankTime:function(){
        var _this = this;
        var yClose = _this.isFigure ? parseInt(_this.yesClose):_this.yesClose;
        var t = [[1455586260000,null,0,null,null],[1455586320000,null,0,null,null],[1455586380000,null,0,null,null],[1455586440000,null,0,null,null],[1455586500000,null,0,null,null],[1455586560000,null,0,null,null],[1455586620000,null,0,null,null],[1455586680000,null,0,null,null],[1455586740000,null,0,null,null],[1455586800000,null,0,null,null],[1455586860000,null,0,null,null],[1455586920000,null,0,null,null],[1455586980000,null,0,null,null],[1455587040000,null,0,null,null],[1455587100000,null,0,null,null],[1455587160000,null,0,null,null],[1455587220000,null,0,null,null],[1455587280000,null,0,null,null],[1455587340000,null,0,null,null],[1455587400000,null,0,null,null],[1455587460000,null,0,null,null],[1455587520000,null,0,null,null],[1455587580000,null,0,null,null],[1455587640000,null,0,null,null],[1455587700000,null,0,null,null],[1455587760000,null,0,null,null],[1455587820000,null,0,null,null],[1455587880000,null,0,null,null],[1455587940000,null,0,null,null],[1455588000000,null,0,null,null],[1455588060000,null,0,null,null],[1455588120000,null,0,null,null],[1455588180000,null,0,null,null],[1455588240000,null,0,null,null],[1455588300000,null,0,null,null],[1455588360000,null,0,null,null],[1455588420000,null,0,null,null],[1455588480000,null,0,null,null],[1455588540000,null,0,null,null],[1455588600000,null,0,null,null],[1455588660000,null,0,null,null],[1455588720000,null,0,null,null],[1455588780000,null,0,null,null],[1455588840000,null,0,null,null],[1455588900000,null,0,null,null],[1455588960000,null,0,null,null],[1455589020000,null,0,null,null],[1455589080000,null,0,null,null],[1455589140000,null,0,null,null],[1455589200000,null,0,null,null],[1455589260000,null,0,null,null],[1455589320000,null,0,null,null],[1455589380000,null,0,null,null],[1455589440000,null,0,null,null],[1455589500000,null,0,null,null],[1455589560000,null,0,null,null],[1455589620000,null,0,null,null],[1455589680000,null,0,null,null],[1455589740000,null,0,null,null],[1455589800000,null,0,null,null],[1455589860000,null,0,null,null],[1455589920000,null,0,null,null],[1455589980000,null,0,null,null],[1455590040000,null,0,null,null],[1455590100000,null,0,null,null],[1455590160000,null,0,null,null],[1455590220000,null,0,null,null],[1455590280000,null,0,null,null],[1455590340000,null,0,null,null],[1455590400000,null,0,null,null],[1455590460000,null,0,null,null],[1455590520000,null,0,null,null],[1455590580000,null,0,null,null],[1455590640000,null,0,null,null],[1455590700000,null,0,null,null],[1455590760000,null,0,null,null],[1455590820000,null,0,null,null],[1455590880000,null,0,null,null],[1455590940000,null,0,null,null],[1455591000000,null,0,null,null],[1455591060000,null,0,null,null],[1455591120000,null,0,null,null],[1455591180000,null,0,null,null],[1455591240000,null,0,null,null],[1455591300000,null,0,null,null],[1455591360000,null,0,null,null],[1455591420000,null,0,null,null],[1455591480000,null,0,null,null],[1455591540000,null,0,null,null],[1455591600000,null,0,null,null],[1455591660000,null,0,null,null],[1455591720000,null,0,null,null],[1455591780000,null,0,null,null],[1455591840000,null,0,null,null],[1455591900000,null,0,null,null],[1455591960000,null,0,null,null],[1455592020000,null,0,null,null],[1455592080000,null,0,null,null],[1455592140000,null,0,null,null],[1455592200000,null,0,null,null],[1455592260000,null,0,null,null],[1455592320000,null,0,null,null],[1455592380000,null,0,null,null],[1455592440000,null,0,null,null],[1455592500000,null,0,null,null],[1455592560000,null,0,null,null],[1455592620000,null,0,null,null],[1455592680000,null,0,null,null],[1455592740000,null,0,null,null],[1455592800000,null,0,null,null],[1455592860000,null,0,null,null],[1455592920000,null,0,null,null],[1455592980000,null,0,null,null],[1455593040000,null,0,null,null],[1455593100000,null,0,null,null],[1455593160000,null,0,null,null],[1455593220000,null,0,null,null],[1455593280000,null,0,null,null],[1455593340000,null,0,null,null],[1455598800000,null,0,null,null],[1455598860000,null,0,null,null],[1455598920000,null,0,null,null],[1455598980000,null,0,null,null],[1455599040000,null,0,null,null],[1455599100000,null,0,null,null],[1455599160000,null,0,null,null],[1455599220000,null,0,null,null],[1455599280000,null,0,null,null],[1455599340000,null,0,null,null],[1455599400000,null,0,null,null],[1455599460000,null,0,null,null],[1455599520000,null,0,null,null],[1455599580000,null,0,null,null],[1455599640000,null,0,null,null],[1455599700000,null,0,null,null],[1455599760000,null,0,null,null],[1455599820000,null,0,null,null],[1455599880000,null,0,null,null],[1455599940000,null,0,null,null],[1455600000000,null,0,null,null],[1455600060000,null,0,null,null],[1455600120000,null,0,null,null],[1455600180000,null,0,null,null],[1455600240000,null,0,null,null],[1455600300000,null,0,null,null],[1455600360000,null,0,null,null],[1455600420000,null,0,null,null],[1455600480000,null,0,null,null],[1455600540000,null,0,null,null],[1455600600000,null,0,null,null],[1455600660000,null,0,null,null],[1455600720000,null,0,null,null],[1455600780000,null,0,null,null],[1455600840000,null,0,null,null],[1455600900000,null,0,null,null],[1455600960000,null,0,null,null],[1455601020000,null,0,null,null],[1455601080000,null,0,null,null],[1455601140000,null,0,null,null],[1455601200000,null,0,null,null],[1455601260000,null,0,null,null],[1455601320000,null,0,null,null],[1455601380000,null,0,null,null],[1455601440000,null,0,null,null],[1455601500000,null,0,null,null],[1455601560000,null,0,null,null],[1455601620000,null,0,null,null],[1455601680000,null,0,null,null],[1455601740000,null,0,null,null],[1455601800000,null,0,null,null],[1455601860000,null,0,null,null],[1455601920000,null,0,null,null],[1455601980000,null,0,null,null],[1455602040000,null,0,null,null],[1455602100000,null,0,null,null],[1455602160000,null,0,null,null],[1455602220000,null,0,null,null],[1455602280000,null,0,null,null],[1455602340000,null,0,null,null],[1455602400000,null,0,null,null],[1455602460000,null,0,null,null],[1455602520000,null,0,null,null],[1455602580000,null,0,null,null],[1455602640000,null,0,null,null],[1455602700000,null,0,null,null],[1455602760000,null,0,null,null],[1455602820000,null,0,null,null],[1455602880000,null,0,null,null],[1455602940000,null,0,null,null],[1455603000000,null,0,null,null],[1455603060000,null,0,null,null],[1455603120000,null,0,null,null],[1455603180000,null,0,null,null],[1455603240000,null,0,null,null],[1455603300000,null,0,null,null],[1455603360000,null,0,null,null],[1455603420000,null,0,null,null],[1455603480000,null,0,null,null],[1455603540000,null,0,null,null],[1455603600000,null,0,null,null],[1455603660000,null,0,null,null],[1455603720000,null,0,null,null],[1455603780000,null,0,null,null],[1455603840000,null,0,null,null],[1455603900000,null,0,null,null],[1455603960000,null,0,null,null],[1455604020000,null,0,null,null],[1455604080000,null,0,null,null],[1455604140000,null,0,null,null],[1455604200000,null,0,null,null],[1455604260000,null,0,null,null],[1455604320000,null,0,null,null],[1455604380000,null,0,null,null],[1455604440000,null,0,null,null],[1455604500000,null,0,null,null],[1455604560000,null,0,null,null],[1455604620000,null,0,null,null],[1455604680000,null,0,null,null],[1455604740000,null,0,null,null],[1455604800000,null,0,null,null],[1455604860000,null,0,null,null],[1455604920000,null,0,null,null],[1455604980000,null,0,null,null],[1455605040000,null,0,null,null],[1455605100000,null,0,null,null],[1455605160000,null,0,null,null],[1455605220000,null,0,null,null],[1455605280000,null,0,null,null],[1455605340000,null,0,null,null],[1455605400000,null,0,null,null],[1455605460000,null,0,null,null],[1455605520000,null,0,null,null],[1455605580000,null,0,null,null],[1455605640000,null,0,null,null],[1455605700000,null,0,null,null],[1455605760000,null,0,null,null],[1455605820000,null,0,null,null],[1455605880000,null,0,null,null],[1455605940000,null,0,null,null]];
        for (var i = 0; i < t.length; i++) {
            t[i][1] = yClose ;
        }
        return t;
    }
};
