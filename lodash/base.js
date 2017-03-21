 /*create by fengjie.liu*/

 ;
 (function() {
     'use strict';
     var undefined;
     var VERSION = '0.01';

     function LodashWrapper(value) {
         this.value = value;
         this.toString(value);
     }

     function base(value) {
         return new LodashWrapper(value);
     }

     base.VERSION = VERSION;
     LodashWrapper.prototype.toString = function(value) {
         console.log('value>>>>>', value)
         return 'xx>>>>';
     }

     //base.prototype.toString = LodashWrapper.prototype.toString;

     self.base = base;

     if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
         define(function() {
             return base;
         });
     } else {
         return base;
     };

 }.call(this));
