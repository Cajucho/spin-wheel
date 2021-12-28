/**
 * Spin Wheel (IIFE) v2.0.0
 * https://github.com/CrazyTim/spin-wheel#readme
 * Copyright (c) CrazyTim 2021.
 * Distributed under the MIT License.
 */
var wheel=(()=>{var v=Object.defineProperty;var g=Math.pow;var z=n=>v(n,"__esModule",{value:!0});var B=(n,t)=>{z(n);for(var e in t)v(n,e,{get:t[e],enumerable:!0})};var k={};B(k,{Wheel:()=>E});function p(n=0,t=0){return n=Math.ceil(n),t=Math.floor(t),Math.floor(Math.random()*(t-n))+n}function m(n=0){return n*Math.PI/180}function C(n,t){let e=0;for(let i of n){let o=i[t];o&&(e+=typeof o=="number"?o:1)}return e}function _(n,t,e){return t<e?t<=n&&n<e:t<=n||n<e}function R(n,t,e,i){i.save(),i.font=`1px ${t}`;let o=i.measureText(n).width;return i.restore(),e/o}function y(n={x:0,y:0},t,e,i){return g(n.x-t,2)+g(n.y-e,2)<=g(i,2)}function b(n={x:0,y:0},t={}){let e=t.getBoundingClientRect();return{x:n.x-e.left,y:n.y-e.top}}function S(n,t,e,i){let o=n-e,u=t-i,c=Math.atan2(-u,-o);return c*=180/Math.PI,c<0&&(c+=360),c}function L(n=0,t=0){let e=n+t,i;return e>0?i=e%360:i=360+e%360,i===360&&(i=0),i}function I(n=0,t=0){let e=180-t,i=L(n,e);return 180-i}var f=-90,M=500,x=250,A=.3,D=Object.freeze({left:"left",right:"right",center:"center"}),s=Object.freeze({debug:!1,image:"",isInteractive:!0,itemBackgroundColors:[],itemLabelAlign:D.right,itemLabelBaselineOffset:0,itemLabelColors:[],itemLabelFont:"sans-serif",itemLabelFontSizeMax:100,itemLabelRadius:.85,itemLabelRadiusMax:.2,itemLabelRotation:0,items:[],lineColor:"#000",lineWidth:1,radius:.95,rotation:0,rotationResistance:-35,rotationSpeed:0,rotationSpeedMax:250,offset:{w:0,h:0},onCurrentIndexChange:null,onRest:null,onSpin:null,overlayImage:"",pointerRotation:0});function F(n={}){let t=n.canvas;"PointerEvent"in window?(t.addEventListener("pointerdown",o),t.addEventListener("pointermove",e)):(t.addEventListener("touchstart",c),t.addEventListener("mousedown",u),t.addEventListener("mousemove",i));function e(h={}){let d={x:h.clientX,y:h.clientY};n.isCursorOverWheel=n.wheelHitTest(d),n.refreshCursor()}function i(h={}){let d={x:h.clientX,y:h.clientY};n.isCursorOverWheel=n.wheelHitTest(d),n.refreshCursor()}function o(h={}){let d={x:h.clientX,y:h.clientY};if(!n.isInteractive||!n.wheelHitTest(d))return;h.preventDefault(),n.dragStart(d),t.setPointerCapture(h.pointerId),t.addEventListener("pointermove",r),t.addEventListener("pointerup",l),t.addEventListener("pointercancel",l);function r(a={}){a.preventDefault(),n.dragMove({x:a.clientX,y:a.clientY})}function l(a={}){a.preventDefault(),t.releasePointerCapture(a.pointerId),t.removeEventListener("pointermove",r),t.removeEventListener("pointerup",l),t.removeEventListener("pointercancel",l),n.dragEnd()}}function u(h={}){let d={x:h.clientX,y:h.clientY};if(!n.isInteractive||!n.wheelHitTest(d))return;n.dragStart(d),document.addEventListener("mousemove",r),document.addEventListener("mouseup",l);function r(a={}){a.preventDefault(),n.dragMove({x:a.clientX,y:a.clientY})}function l(a={}){a.preventDefault(),document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",l),n.dragEnd()}}function c(h={}){let d={x:h.targetTouches[0].clientX,y:h.targetTouches[0].clientY};if(!n.isInteractive||!n.wheelHitTest(d))return;h.preventDefault(),n.dragStart(d),t.addEventListener("touchmove",r),t.addEventListener("touchend",l),t.addEventListener("touchcancel",l);function r(a={}){a.preventDefault(),n.dragMove({x:a.targetTouches[0].clientX,y:a.targetTouches[0].clientY})}function l(a={}){a.preventDefault(),t.removeEventListener("touchmove",r),t.removeEventListener("touchend",l),t.removeEventListener("touchcancel",l),n.dragEnd()}}}var E=class{constructor(t,e={}){this.canvasContainer=t,this.initCanvas(),this._debug=s.debug,this._image=s.image,this._isInteractive=s.isInteractive,this._itemBackgroundColors=s.itemBackgroundColors,this._itemLabelAlign=s.itemLabelAlign,this._itemLabelBaselineOffset=s.itemLabelBaselineOffset,this._itemLabelColors=s.itemLabelColors,this._itemLabelFont=s.itemLabelFont,this._itemLabelFontSizeMax=s.itemLabelFontSizeMax,this._itemLabelRadius=s.itemLabelRadius,this._itemLabelRadiusMax=s.itemLabelRadiusMax,this._itemLabelRotation=s.itemLabelRotation,this._items=s.items,this._lineColor=s.lineColor,this._lineWidth=s.lineWidth,this._rotationSpeedMax=s.rotationSpeedMax,this._radius=s.radius,this._rotation=s.rotation,this._rotationResistance=s.rotationResistance,this._rotationSpeed=s.rotationSpeed,this._offset=s.offset,this._onRest=s.onRest,this._onSpin=s.onSpin,this._overlayImage=s.overlayImage,this._pointerRotation=s.items,e&&this.init(e)}initCanvas(){for(;this.canvasContainer.firstChild;)this.canvasContainer.removeChild(this.canvasContainer.firstChild);this.canvas=document.createElement("canvas"),this.canvasContainer.appendChild(this.canvas),this.context=this.canvas.getContext("2d"),this.registerEvents()}init(t={}){this.debug=t.debug,this.image=t.image,this.isInteractive=t.isInteractive,this.itemBackgroundColors=t.itemBackgroundColors,this.itemLabelAlign=t.itemLabelAlign,this.itemLabelBaselineOffset=t.itemLabelBaselineOffset,this.itemLabelColors=t.itemLabelColors,this.itemLabelFont=t.itemLabelFont,this.itemLabelFontSizeMax=t.itemLabelFontSizeMax,this.itemLabelRadius=t.itemLabelRadius,this.itemLabelRadiusMax=t.itemLabelRadiusMax,this.itemLabelRotation=t.itemLabelRotation,this.items=t.items,this.lineColor=t.lineColor,this.lineWidth=t.lineWidth,this.rotationSpeedMax=t.rotationSpeedMax,this.radius=t.radius,this.rotation=t.rotation,this.rotationResistance=t.rotationResistance,this.rotationSpeed=t.rotationSpeed,this.offset=t.offset,this.onRest=t.onRest,this.onSpin=t.onSpin,this.overlayImage=t.overlayImage,this.pointerRotation=t.items,this.resize()}registerEvents(){window.onresize=()=>this.resize(),F(this)}resize(){window.cancelAnimationFrame(this.frameRequestId);let[t,e]=[this.canvasContainer.clientWidth,this.canvasContainer.clientHeight],i=Math.min(t,e),o={w:i-i*this.offset.w,h:i-i*this.offset.h},u=Math.min(t/o.w,e/o.h);this.size=Math.max(o.w*u,o.h*u),this.canvas.style.width=t+"px",this.canvas.style.height=e+"px",this.canvas.width=t,this.canvas.height=e,this.center={x:t/2+t*this.offset.w,y:e/2+e*this.offset.h},this.actualRadius=this.size/2*this.radius,this.itemLabelFontSize=this.itemLabelFontSizeMax*(this.size/M),this.labelMaxWidth=this.actualRadius*(this.itemLabelRadius-this.itemLabelRadiusMax);for(let c of this.actualItems)this.itemLabelFontSize=Math.min(this.itemLabelFontSize,R(c.label,this.itemLabelFont,this.labelMaxWidth,this.context));this.frameRequestId=window.requestAnimationFrame(this.draw.bind(this))}draw(t=0){var c,h,d;let e=this.context;e.clearRect(0,0,this.canvas.width,this.canvas.height),this.lastFrame===void 0&&(this.lastFrame=t);let i=(t-this.lastFrame)/1e3;i>0&&(this.rotation+=i*this.rotationSpeed,this.rotation=this.rotation%360),this.lastFrame=t;let o=this.getItemAngles(this.rotation);for(let[r,l]of o.entries())e.beginPath(),e.moveTo(this.center.x,this.center.y),e.arc(this.center.x,this.center.y,this.actualRadius,m(l.start+f),m(l.end+f)),e.closePath(),e.fillStyle=this.actualItems[r].backgroundColor,e.fill(),this.lineWidth>0&&(e.strokeStyle=this.lineColor,e.lineWidth=this.lineWidth,e.lineJoin="bevel",e.stroke()),_(this.pointerRotation,l.start%360,l.end%360)&&this._currentIndex!==r&&(this._currentIndex=r,(c=this.onCurrentIndexChange)==null||c.call(this,{currentIndex:this._currentIndex}));e.textBaseline="middle",e.textAlign=this.itemLabelAlign,e.font=this.itemLabelFontSize+"px "+this.itemLabelFont;let u=this.itemLabelFontSize*-this.itemLabelBaselineOffset;e.save();for(let[r,l]of o.entries()){e.save(),e.beginPath(),e.fillStyle=this.actualItems[r].labelColor;let a=l.start+(l.end-l.start)/2;e.translate(this.center.x+Math.cos(m(a+f))*(this.actualRadius*this.itemLabelRadius),this.center.y+Math.sin(m(a+f))*(this.actualRadius*this.itemLabelRadius)),e.rotate(m(a+f)),this.debug&&(e.beginPath(),e.strokeStyle="#ff00ff",e.lineWidth=1,e.moveTo(0,0),e.lineTo(-this.labelMaxWidth,0),e.stroke(),e.strokeRect(0,-this.itemLabelFontSize/2,-this.labelMaxWidth,this.itemLabelFontSize)),e.rotate(m(this.itemLabelRotation)),this.actualItems[r].label!==void 0&&e.fillText(this.actualItems[r].label,0,u),e.restore()}if(this.drawImage(this.image,!1),this.drawImage(this.overlayImage,!0),this.rotationSpeed!==0){let r=this.rotationSpeed+this.rotationResistance*i*this.rotationDirection;(this.rotationDirection===1&&r<0||this.rotationDirection===-1&&r>=0)&&(r=0),this.rotationSpeed=r,this.rotationSpeed===0&&((h=this.onRest)==null||h.call(this,{event:"rest",currentIndex:this._currentIndex}))}if(this.debug&&((d=this.dragEvents)==null?void 0:d.length)){let r=[...this.dragEvents].reverse();for(let[l,a]of r.entries()){let w=l/this.dragEvents.length*100;e.beginPath(),e.arc(a.x,a.y,5,0,2*Math.PI),e.fillStyle=`hsl(200,100%,${w}%)`,e.strokeStyle="#000",e.lineWidth=.5,e.fill(),e.stroke()}}this.frameRequestId=window.requestAnimationFrame(this.draw.bind(this))}drawImage(t,e=!1){if(!t)return;let i=this.context;i.save(),i.translate(this.center.x,this.center.y),e||i.rotate(m(this.rotation));let o=e?this.size:this.size*this.radius,u=-(o/2);i.drawImage(t,u,u,o,o),i.restore()}spin(t=0){var i;let e=A/2;this.rotationSpeed=p(t*(1-e),t*(1+e)),(i=this.onSpin)==null||i.call(this,{event:"spin",direction:this.rotationDirection,rotationSpeed:this.rotationSpeed})}getRotationDirection(t=0){return t>0?1:-1}wheelHitTest(t={x:0,y:0}){let e=b(t,this.canvas);return y(e,this.center.x,this.center.y,this.actualRadius)}refreshCursor(){if(this.isDragging){this.canvas.style.cursor="grabbing";return}if(this.isInteractive&&this.isCursorOverWheel){this.canvas.style.cursor="grab";return}this.canvas.style.cursor=null}processItems(){this.actualItems=[];for(let[t,e]of this.items.entries()){let i={};typeof e.backgroundColor=="string"?i.backgroundColor=e.backgroundColor:this.itemBackgroundColors.length?i.backgroundColor=this.itemBackgroundColors[t%this.itemBackgroundColors.length]:i.backgroundColor="#fff",typeof e.label=="string"?i.label=e.label:i.label="",typeof e.labelFont=="string"?i.labelFont=e.labelFont:i.labelFont=this.itemLabelFont,typeof e.labelColor=="string"?i.labelColor=e.labelColor:this.itemLabelColors.length?i.labelColor=this.itemLabelColors[t%this.itemLabelColors.length]:i.labelColor="#000",typeof e.weight=="number"?i.weight=e.weight:i.weight=1,this.actualItems.push(i)}this.actualItems.length?this.weightedItemAngle=360/C(this.actualItems,"weight"):this.weightedItemAngle=0}getAngleFromCenter(t={x:0,y:0}){return(S(this.center.x,this.center.y,t.x,t.y)+90)%360}getCurrentIndex(){return this._currentIndex}getItemAngles(t=0){let e=[],i,o=t;for(let u of this.actualItems)i=u.weight*this.weightedItemAngle,e.push({start:o,end:o+i}),o+=i;return e}get debug(){return this._debug}set debug(t){typeof t=="boolean"?this._debug=t:this._debug=s.debug}get image(){return this._image}set image(t){typeof t=="string"?(this._image=new Image,this._image.src=t):this._image=s.image}get isInteractive(){return this._isInteractive}set isInteractive(t){typeof t=="boolean"?this._isInteractive=t:this._isInteractive=s.isInteractive}get itemBackgroundColors(){return this._itemBackgroundColors}set itemBackgroundColors(t){Array.isArray(t)?this._itemBackgroundColors=t:this._itemBackgroundColors=s.itemBackgroundColors,this.processItems()}get itemLabelAlign(){return this._itemLabelAlign}set itemLabelAlign(t){typeof t=="string"?this._itemLabelAlign=t:this._itemLabelAlign=s.itemLabelAlign}get itemLabelBaselineOffset(){return this._itemLabelBaselineOffset}set itemLabelBaselineOffset(t){typeof t=="number"?this._itemLabelBaselineOffset=t:this._itemLabelBaselineOffset=s.itemLabelBaselineOffset,this.resize()}get itemLabelColors(){return this._itemLabelColors}set itemLabelColors(t){Array.isArray(t)?this._itemLabelColors=t:this._itemLabelColors=s.itemLabelColors,this.processItems()}get itemLabelFont(){return this._itemLabelFont}set itemLabelFont(t){typeof t=="string"?this._itemLabelFont=t:this._itemLabelFont=s.itemLabelFont,this.resize()}get itemLabelFontSizeMax(){return this._itemLabelFontSizeMax}set itemLabelFontSizeMax(t){typeof t=="number"?this._itemLabelFontSizeMax=t:this._itemLabelFontSizeMax=s.itemLabelFontSizeMax}get itemLabelRadius(){return this._itemLabelRadius}set itemLabelRadius(t){typeof t=="number"?this._itemLabelRadius=t:this._itemLabelRadius=s.itemLabelRadius}get itemLabelRadiusMax(){return this._itemLabelRadiusMax}set itemLabelRadiusMax(t){typeof t=="number"?this._itemLabelRadiusMax=t:this._itemLabelRadiusMax=s.itemLabelRadiusMax}get itemLabelRotation(){return this._itemLabelRotation}set itemLabelRotation(t){typeof t=="number"?this._itemLabelRotation=t:this._itemLabelRotation=s.itemLabelRotation}get items(){return this._items}set items(t){Array.isArray(t)?this._items=t:this._items=s.items,this.processItems()}get lineColor(){return this._lineColor}set lineColor(t){typeof t=="string"?this._lineColor=t:this._lineColor=s.lineColor}get lineWidth(){return this._lineWidth}set lineWidth(t){typeof t=="number"?this._lineWidth=t:this._lineWidth=s.lineWidth}get radius(){return this._radius}set radius(t){typeof t=="number"?this._radius=t:this._radius=s.radius,this.resize()}get rotation(){return this._rotation}set rotation(t){typeof t=="number"?this._rotation=t:this._rotation=s.rotation}get rotationResistance(){return this._rotationResistance}set rotationResistance(t){typeof t=="number"?this._rotationResistance=t:this._rotationResistance=s.rotationResistance}get rotationSpeed(){return this._rotationSpeed}set rotationSpeed(t){if(typeof t=="number"){let e=Math.min(t,this.rotationSpeedMax);e=Math.max(e,-this.rotationSpeedMax),this.rotationDirection=this.getRotationDirection(e),this._rotationSpeed=e}else this.rotationDirection=0,this._rotationSpeed=s.rotationSpeed}get rotationSpeedMax(){return this._rotationSpeedMax}set rotationSpeedMax(t){typeof t=="number"?this._rotationSpeedMax=t:this._rotationSpeedMax=s.rotationSpeedMax}get offset(){return this._offset}set offset(t){t?this._offset=t:this._offset=s.offset,this.resize()}get onCurrentIndexChange(){return this._onCurrentIndexChange}set onCurrentIndexChange(t){typeof t=="function"?this._onCurrentIndexChange=t:this._onCurrentIndexChange=s.onCurrentIndexChange}get onRest(){return this._onRest}set onRest(t){typeof t=="function"?this._onRest=t:this._onRest=s.onRest}get onSpin(){return this._onSpin}set onSpin(t){typeof t=="function"?this._onSpin=t:this._onSpin=s.onSpin}get overlayImage(){return this._overlayImage}set overlayImage(t){typeof t=="string"?(this._overlayImage=new Image,this._overlayImage.src=t):this._overlayImage=s.overlayImage}get pointerRotation(){return this._pointerRotation}set pointerRotation(t){typeof t=="number"?this._pointerRotation=t:this._pointerRotation=s.pointerRotation}dragStart(t={x:0,y:0}){let e=b(t,this.canvas),i=-this.getAngleFromCenter(e);this.isDragging=!0,this.rotationSpeed=0,this.dragStartRotation=L(i,this.rotation),this.dragEvents=[{distance:0,x:e.x,y:e.y,now:performance.now()}],this.refreshCursor()}dragMove(t={x:0,y:0}){let e=b(t,this.canvas),i=this.getAngleFromCenter(e),o=this.dragEvents[0],u=this.getAngleFromCenter(o),c=I(u,i);this.dragEvents.unshift({distance:c,x:e.x,y:e.y,now:performance.now()}),this.debug&&this.dragEvents.length>=40&&this.dragEvents.pop(),this.rotation=L(i,this.dragStartRotation)}dragEnd(){var i;this.isDragging=!1,clearInterval(this.dragClearOldDistances);let t=0,e=performance.now();for(let[o,u]of this.dragEvents.entries()){if(!this.isDragEventTooOld(e,u)){t+=u.distance;continue}this.dragEvents.length=o;break}t!==0&&(this.rotationSpeed=t*(1e3/x),(i=this.onSpin)==null||i.call(this,{event:"spin",rotationDirection:this.rotationDirection,rotationSpeed:this.rotationSpeed,dragEvents:[...this.dragEvents]})),this.refreshCursor()}isDragEventTooOld(t,e={}){return t-e.now>x}};return k;})();
