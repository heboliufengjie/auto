define("financial/goodsItem/1.2.0/js/appraiseChart", function(require, t, e) {
    var a = function() {
        Highcharts.setOptions({
            lang: {
                shortMonths: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
                weekdays: ["\u661f\u671f\u65e5", "\u661f\u671f\u4e00", "\u661f\u671f\u4e8c", "\u661f\u671f\u4e09", "\u661f\u671f\u56db", "\u661f\u671f\u4e94", "\u661f\u671f\u516d"]
            },
            global: {
                useUTC: !1
            }
        }), this.setTimer()
    };
    a.prototype = {
        getChart: function(t) {
            var e = this;
            return e.nullDatas || e.notTradeTime ? (e.clearTimer(), void 0) : (e.param = t, $.ajax({
                url: t.url + t.sku + ".do",
                dataType: "jsonp",
                success: function(a) {
                    if (0 == a[0].data.length) return e.nullDatas = !0, t.container.html('<div class="empty-con"><div class="empty-icon"></div><p class="empty-words">\u6682\u65e0\u6570\u636e</p></div>'), void 0;
                    if (!a[0].nullDatas) return e.nullDatas = !0, t.container.html('<div class="empty-con"><div class="empty-icon"></div><p class="empty-words">\u6682\u65e0\u6570\u636e</p></div>'), void 0;
                    if (a[0].notTradeTime) return e.notTradeTime = !0, t.container.html('<div class="empty-con"><div class="empty-icon"></div><p class="empty-words">\u6682\u65e0\u6570\u636e</p></div>'), void 0;
                    var i = a[0].data;
                    e.initChart(i, a[0].fundNav, [a[0].currentNav, a[0].currentRating, a[0].currentDate])
                }
            }), void 0)
        },
        setTimer: function() {
            var t = this;
            this.timer = setInterval(function() {
                t.getChart(t.param)
            }, 1e5)
        },
        clearTimer: function() {
            var t = this;
            clearInterval(t.timer)
        },
        initChart: function(t, e, a) {
            for (var i = this, r = [], n = [], s = 0; s < t.length; s++)
                r.push({
                    x: t[s][0],
                    y: t[s][1]
                }), n.push({
                    x: t[s][0],
                    y: t[s][1]
                });
            i.param.container.highcharts("StockChart", {
                chart: {
                    plotBorderWidth: 1,
                    plotBorderColor: "#e6e6e6",
                    animation: !1,
                    marginLeft: 45,
                    marginRight: 45,
                    alignTicks: !0,
                    style: {
                        fontFamily: '"Helvetica Neue", Arial, "Microsoft YaHei"',
                        fontSize: "12px"
                    }
                },
                credits: {
                    enabled: !1
                },
                legend: {
                    enabled: !1
                },
                navigator: {
                    enabled: !1,
                    maskFill: "#fff",
                    maskInside: !1,
                    series: {
                        type: "areaspline",
                        color: "#4572A7",
                        fillOpacity: .4,
                        dataGrouping: {
                            smoothed: !0
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: !1
                        }
                    },
                    xAxis: {
                        xAxis: {
                            type: "datetime",
                            labels: {
                                overflow: "justify"
                            }
                        },
                        labels: {
                            style: {},
                            formatter: function() {
                                return Highcharts.dateFormat("%b-%e", this.value)
                            },
                            x: -15,
                            y: 28
                        }
                    },
                    yAxis: {
                        gridLineWidth: 0,
                        startOnTick: !1,
                        endOnTick: !1,
                        minPadding: .1,
                        maxPadding: .1,
                        labels: {
                            enabled: !1
                        },
                        title: {
                            text: null
                        },
                        tickWidth: 0
                    }
                },
                plotOptions: {
                    line: {
                        color: "#67ace9",
                        lineWidth: 1.4,
                        animation: !1,
                        states: {
                            hover: {
                                lineWidth: .4
                            }
                        },
                        pointStart: 0
                    }
                },
                rangeSelector: {
                    enabled: !1
                },
                scrollbar: {
                    enabled: !1
                },
                series: [{
                    type: "line",
                    name: "\u5f53\u524d\u4ef7",
                    enabledCrosshairs: !0,
                    data: r,
                    yAxis: 0
                }, {
                    type: "line",
                    name: "\u5f53\u524d\u4ef7",
                    enabledCrosshairs: !0,
                    data: n,
                    yAxis: 1
                }],
                tooltip: {
                    crosshairs: [{
                        color: "#ffcbcc",
                        width: 1
                    }, {
                        color: "#ffcbcc",
                        width: 1
                    }],
                    followPointer: !1,
                    useHTML: !0,
                    borderColor: "#ccc",
                    style: {},
                    formatter: function() {
                        var e = this.points[0].point.index,
                            a = null;
                        a = t[e] ? t[e][2] : 0;
                        var i = "";
                        i = "<span>" + this.y + "</span>", a = 0 > a ? '<span style="color:#3fb539">' + a + "%</span>" : '<span style="color:#ff5256">' + a + "%</span>";
                        var r = "";
                        return r = '<span style="line-height: 20px; padding: 8px 10px;">\u65f6\u95f4\uff1a' + Highcharts.dateFormat("%H:%M", this.x) + '</span><br><span style="line-height: 20px; padding: 8px 10px;">\u4f30\u503c\uff1a' + i + '\u5143</span><br><span style="line-height: 20px; padding: 8px 10px;">\u6da8\u5e45\uff1a' + a + "</span>"
                    }
                },
                yAxis: [{
                    offset: -335,
                    labels: {
                        y: 4,
                        style: {
                            color: "#a5a5a5",
                            fontSize: "12px"
                        },
                        formatter: function() {
                            var t = this.value.toFixed(4);
                            return t = t > e ? '<span style="color:#f52f3e">' + t + "</span>" : '<span style="color:#69cd8e">' + t + "</span>"
                        }
                    },
                    plotLines: [{
                        value: e,
                        color: "#5e5e5e",
                        dashStyle: "shortdash",
                        width: 1,
                        label: {
                            align: "right",
                            x: -5,
                            y: -4,
                            text: '<span class="add-bor">0%</span>',
                            style: {
                                backgroundColor: "#fff"
                            }
                        },
                        zIndex: 1
                    }, {
                        value: e,
                        color: "#5e5e5e",
                        dashStyle: "shortdash",
                        width: 1,
                        label: {
                            align: "left",
                            x: 5,
                            text: e,
                            style: {
                                backgroundColor: "#fff"
                            }
                        },
                        zIndex: 1
                    }],
                    gridLineColor: "#f0f0f0",
                    showLastLabel: !0
                }, {
                    offset: -10,
                    labels: {
                        y: 4,
                        style: {
                            color: "#a5a5a5",
                            fontSize: "12px"
                        },
                        formatter: function() {
                            var t = ((this.value - e) / e * 100).toFixed(2);
                            return t = t > 0 ? '<span style="color:#f52f3e">' + t + "%</span>" : '<span style="color:#69cd8e">' + t + "%</span>"
                        }
                    },
                    gridLineColor: "#f6f6f6",
                    showLastLabel: !0
                }],
                xAxis: {
                    gridLineColor: "#f0f0f0",
                    gridLineWidth: 1,
                    gridLineDashStyle: "dash",
                    showLastLabel: !0,
                    showFirstLabel: !0,
                    tickWidth: 0,
                    tickPixelInterval: 50,
                    labels: {
                        formatter: function() {
                            var t = Highcharts.dateFormat("%H:%M", this.value);
                            return "13:00" == t ? "11:30/13:00" : "09:30" == t || "10:30" == t || "14:00" == t || "15:00" == t ? t : void 0
                        },
                        rotation: 0,
                        staggerLines: 2,
                        style: {
                            color: "#a5a5a5",
                            whiteSpace: "normal"
                        }
                    }
                }
            }, function() {
                var t = $(".fund-chart-item li");
                t.eq(0).find("span").text(a[0] + "\u5143"), a[1] > 0 ? t.eq(1).find("span").text(a[1] + "%").attr("class", "red-color") : t.eq(1).find("span").text(a[1] + "%").attr("class", "green-color"), t.eq(2).text("[" + Highcharts.dateFormat("%m-%d", a[2]) + " " + Highcharts.dateFormat("%H:%M", a[2]) + "]")
            })
        }
    }, e.exports = a
});
