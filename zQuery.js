//版权 北京智能社©, 保留所有权利

(function(window, undefined) {
    "use strict";

    function zQuery(args) {

        this.elements = [];
        this.domString = "";

        switch (typeof args) {
            case "function": // domReady
                domReady(args);
                break;
            case "string": // getEle()  1 创建元素  2 获取元素
                if (args.indexOf("<") != -1) { //创建元素
                    this.domString = args;
                } else { //获取元素
                    this.elements = getEle(args);
                }

                break;
            case "object": // 包装
                if ("length" in args) {
                    for (var i = 0; i < args.length; i++) {
                        this.elements.push(args[i]);
                    }
                } else {
                    this.elements.push(args);
                }

                break;
        }
    }

    function $(args) {
        return new zQuery(args);
    }

    window.$ = window.zQuery = $;


    //添加 appendTo
    zQuery.prototype.appendTo = function(str) {

        //str 父级    创建的元素 this.domString  <span>span</span>
        var aParent = getEle(str);

        //aParent[0/1/2/3]   this.domString
        for (var i = 0; i < aParent.length; i++) {
            appendStr(aParent[i], this.domString);
        }
    };


    function appendStr(oParent, str) {
        var oTmp = document.createElement("div");
        oTmp.innerHTML = str;
        var aChild = oTmp.childNodes;
        while (aChild.length > 0) {
            oParent.appendChild(aChild[0]);
        }
    }

    $.trim = function(str) {
        return str.replace(/^\s+|\s+$/g, "");
    };

    $.ajax = ajax;

    function ajax(options) {

        options = options || {};
        if (!options.url) {
            return;
        }
        options.type = options.type || "get";
        options.data = options.data || {};
        options.timeout = options.timeout || 0;

        // 1 创建

        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else {
            var xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        var arr = [];
        options.data.t = Math.random();
        for (var name in options.data) {
            arr.push(name + "=" + encodeURIComponent(options.data[name]));
        }
        var str = arr.join("&");

        if (options.type == "get") {
            // 2 连接
            xhr.open("get", options.url + "?" + str, true);
            // 3 发送
            xhr.send();
        } else {
            // 2 连接
            xhr.open("post", options.url, true);

            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            // 3 发送
            xhr.send(str);
        }


        // 4 接收
        xhr.onreadystatechange = function() {

            if (xhr.readyState == 4) { //完成
                clearTimeout(timer);
                // 2xx 304
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) { // 成功
                    options.success && options.success(xhr.responseText);
                } else { // 失败
                    options.error && options.error(xhr.status, xhr.statusText);
                }
            }
        };

        if (options.timeout) {
            var timer = setTimeout(function() {
                xhr.abort();
            }, options.timeout);
        }

    }


    /*
    $obj.css(name); 获取
    $obj.css(name,value); 设置
    $obj.css(json); 批量设置

    */
    zQuery.prototype.css = function(name, value) {

        if (arguments.length == 2) { //设置
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].style[name] = value;
            }
        } else {
            if (typeof name == "string") { //获取

                return getStyle(this.elements[0], name);
            } else { //批量设置
                for (var i = 0; i < this.elements.length; i++) {
                    for (var j in name) {
                        this.elements[i].style[j] = name[j];
                    }
                }
            }
        }
    };

    /*
    $obj.attr(name); 获取
    $obj.attr(name,value); 设置
    $obj.attr(json); 批量设置

    */

    zQuery.prototype.attr = function(name, value) {
        if (arguments.length == 2) { //设置
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].setAttribute(name, value);
            }
        } else {
            if (typeof name == "string") { //获取

                return this.elements[0].getAttribute(name);

            } else { //批量设置
                for (var i = 0; i < this.elements.length; i++) {
                    for (var j in name) {
                        this.elements[i].setAttribute(j, name[j]);
                    }
                }
            }
        }
    };


    "click|mouseover|mouseout|mouseup|mousedown|mousewheel|contextmenu|load|scroll|resize|keyup|keydown|focus|blur".replace(/\w+/g, function(sEv) {
        zQuery.prototype[sEv] = function(fn) {
            for (var i = 0; i < this.elements.length; i++) {
                addEvent(this.elements[i], sEv, fn);
            }
        };
    });

    zQuery.prototype.mouseenter = function(fn) {
        for (var i = 0; i < this.elements.length; i++) {
            addEvent(this.elements[i], "mouseover", function(ev) {

                var oFrom = ev.fromElement || ev.releatedTarget;

                if (this.contains(oFrom)) {
                    return;
                }

                fn && 　fn.call(this, ev);
            });
        }
    };

    zQuery.prototype.mouseleave = function(fn) {
        for (var i = 0; i < this.elements.length; i++) {
            addEvent(this.elements[i], "mouseout", function(ev) {

                var oTo = ev.toElement || ev.releatedTarget;

                if (this.contains(oTo)) {
                    return;
                }

                fn && 　fn.call(this, ev);
            });
        }
    };


    zQuery.prototype.hover = function(fnOver, fnOut) {
        this.mouseenter(fnOver);
        this.mouseleave(fnOut || fnOver);
    };

    //toggle  ---> click
    zQuery.prototype.toggle = function() {

        //arguments
        var arg = arguments;
        //var count = 0;
        var len = arguments.length;
        var _this = this;
        for (var i = 0; i < this.elements.length; i++) {

            (function(count) {
                //this.elements[i].count = 0;
                addEvent(_this.elements[i], "click", function(ev) {
                    arg[count % len].call(this, ev);
                    count++;
                    //this.count++;
                });
            })(0);
        }
    };

    /*
    zQuery.prototype.click = function(fn){
    	for(var i = 0; i < this.elements.length; i++){
    		addEvent(this.elements[i],"click",fn);
    	}
    };

    zQuery.prototype.mouseover = function(fn){
    	for(var i = 0; i < this.elements.length; i++){
    		addEvent(this.elements[i],"mouseover",fn);
    	}
    };

    zQuery.prototype.mouseout = function(fn){
    	for(var i = 0; i < this.elements.length; i++){
    		addEvent(this.elements[i],"mouseout",fn);
    	}
    };*/


    //eq
    zQuery.prototype.eq = function(index) {
        return $(this.elements[index]);
    };

    //get
    zQuery.prototype.get = function(index) {
        return this.elements[index];
    };

    //index
    zQuery.prototype.index = function() {

        var obj = this.elements[0];

        var aChild = obj.parentNode.children;

        for (var i = 0; i < aChild.length; i++) {
            if (obj == aChild[i]) {
                return i;
            }
        }
    };

    //show
    zQuery.prototype.show = function() {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].style.display = "block";
        }
    };

    //hide
    zQuery.prototype.hide = function() {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].style.display = "none";
        }
    };

    //addClass

    zQuery.prototype.addClass = function(sClass) {

        var re = new RegExp("\\b" + sClass + "\\b");

        for (var i = 0; i < this.elements.length; i++) {
            if (!re.test(this.elements[i].className)) {

                if (this.elements[i].className) {
                    this.elements[i].className += " " + sClass;
                } else {
                    this.elements[i].className = sClass;
                }
            }
        }
    };

    //removeClass

    zQuery.prototype.removeClass = function(sClass) {

        var re = new RegExp("\\b" + sClass + "\\b", "g");

        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].className = this.elements[i].className.replace(re, "").replace(/\s+/g, " ");

            if (!this.elements[i].className) {
                this.elements[i].removeAttribute("class");
            }
        }
    };

    //hasClass
    zQuery.prototype.hasClass = function(sClass) {

        var re = new RegExp("\\b" + sClass + "\\b", "g");

        return re.test(this.elements[0].className);

    };
    //toggleClass
    zQuery.prototype.toggleClass = function(sClass) {
        if (this.hasClass()) {
            this.removeClass();
        } else {
            this.addClass();
        }
    };


    //find

    zQuery.prototype.find = function(str) {
        //this.elements aParent
        //str  a
        //   aUl             ul    document
        //   aLi             li    aUl
        //   aA              a     aLi

        var aParent = this.elements; //[ul,ul,ul]
        var aChild = [];

        var aChild = getEle(str, aParent);

        return $(aChild);
    };

    zQuery.prototype.bind = function(sEv, fn) {
        for (var i = 0; i < this.elements.length; i++) {
            addEvent(this.elements[i], sEv, fn);
        }
    };


    //插件
    $.fn = zQuery.prototype;
    $.fn.extend = function(json) {
        for (var name in json) {
            zQuery.prototype[name] = json[name];
        }
    };

    function addEvent(obj, sEv, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(sEv, function(ev) {
                if (fn.call(this, ev) == false) {
                    ev.cancelBubble = true;
                    ev.preventDefault();
                }
            }, false);
        } else {
            obj.attachEvent("on" + sEv, function() {
                if (fn.call(obj, event) == false) {
                    event.cancelBubble = true;
                    return false;
                }
            });
        }
    }


    function getStyle(obj, name) {
        return (obj.currentSyle || getComputedStyle(obj, false))[name];
    }

    function domReady(fn) {
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", fn, false);
        } else {
            document.attachEvent("onreadystatechange", function() {
                if (document.readyState == "complete") {
                    fn && fn();
                }
            });
        }
    }


    function getByClass(oParent, sClass) {

        if (oParent.getElementsByClassName) {
            return oParent.getElementsByClassName(sClass);
        }

        var result = [];
        var re = new RegExp("\\b" + sClass + "\\b");

        var aEle = oParent.getElementsByTagName("*");

        for (var i = 0; i < aEle.length; i++) {
            if (re.test(aEle[i].className)) {
                result.push(aEle[i]);
            }
        }
        return result;
    }


    function getByStr(aParent, str) {
        var aChild = [];

        //选择元素
        //str  #id  .class  tagname
        for (var i = 0; i < aParent.length; i++) {
            switch (str.charAt(0)) {
                case "#": // id
                    var obj = document.getElementById(str.substring(1));
                    aChild.push(obj);
                    break;
                case ".": // 类
                    var aEle = getByClass(aParent[i], str.substring(1));
                    //aChild = aChild.concat(aEle);
                    for (var j = 0; j < aEle.length; j++) {
                        aChild.push(aEle[j]);
                    }
                    break;
                default: //标签

                    //tagname#id
                    if (/^[a-z0-9]+#[a-z0-9\-_$]+$/i.test(str)) {
                        //[tagname,id]
                        var arr = str.split("#");
                        var aEle = aParent[i].getElementsByTagName(arr[0]);
                        for (var j = 0; j < aEle.length; j++) {
                            if (aEle[j].id == arr[1]) {
                                aChild.push(aEle[j]);
                            }
                        }
                        //li.box
                    } else if (/[a-z0-9]+\.[a-z0-9\-_$]+$/i.test(str)) {
                        // [tagname,class]
                        var arr = str.split(".");
                        var aEle = aParent[i].getElementsByTagName(arr[0]);
                        for (var j = 0; j < aEle.length; j++) {
                            if (aEle[j].className == arr[1]) {
                                aChild.push(aEle[j]);
                            }
                        }
                        //input[type=button]
                    } else if (/\w+\[\w+=\w+\]/.test(str)) {

                        //arr [input,type,button,]
                        var arr = str.split(/\[|=|\]/);
                        var aEle = aParent[i].getElementsByTagName(arr[0]);
                        for (var j = 0; j < aEle.length; j++) {

                            if (aEle[j].getAttribute(arr[1]) == arr[2]) {
                                aChild.push(aEle[j]);
                            }
                        }
                        //li:first  li:eq(index)
                    } else if (/\w+:\w+(\(\.\))?/.test(str)) {

                        /*[li,eq,index,]
                          arr[0]  tagname
                          arr[1]  first/eq/gt/lt/odd/even
                          arr[2]  内容
                        */
                        var arr = str.split(/:|\(|\)/);
                        var aEle = aParent[i].getElementsByTagName(arr[0]);
                        switch (arr[1]) {
                            case "first":
                                aChild.push(aEle[0]);
                                break;
                            case "last":
                                aChild.push(aEle[aEle.length - 1]);
                                break;
                            case "eq":
                                aChild.push(aEle[arr[2]]);
                                break;
                            case "gt": //大于
                                for (var j = parseInt(arr[2]) + 1; j < aEle.length; j++) {
                                    aChild.push(aEle[j]);

                                }

                                break;
                            case "lt": //小于
                                for (var j = 0; j < parseInt(arr[2]); j++) {
                                    aChild.push(aEle[j]);

                                }
                                break;
                            case "odd":
                                for (var j = 0; j < aEle.length; j++) {
                                    if (j % 2 == 1) {
                                        aChild.push(aEle[j]);
                                    }
                                }
                                break;
                            case "even":
                                for (var j = 0; j < aEle.length; j += 2) {
                                    aChild.push(aEle[j]);
                                }
                                break;
                        }



                    } else { //纯标签
                        var aEle = aParent[i].getElementsByTagName(str);
                        //aChild = aChild.concat(aEle);
                        for (var j = 0; j < aEle.length; j++) {
                            aChild.push(aEle[j]);
                        }
                    }
            }

        }
        return aChild;
    }


    //获取元素
    function getEle(str, aParent) {
        // 切
        var arr = str.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ").split(" ");
        aParent = aParent || [document];
        var aChild = [];

        //循环获取元素
        for (var i = 0; i < arr.length; i++) {

            aChild = getByStr(aParent, arr[i]);

            //核心： 上一次子级 是下一次父级
            aParent = aChild;
        }

        return aChild;
    }


})(window);
