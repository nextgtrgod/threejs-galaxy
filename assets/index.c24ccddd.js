import{C as T,S as z,P as A,O as L,W as F,B as O,a as v,b as f,c as R,A as k,d as E,G as I}from"./vendor.b08d14b7.js";const W=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function i(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=i(n);fetch(n.href,o)}};W();var _=`uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main() {
	vec4 modelPosition = modelMatrix * vec4(position, 1.0);

	float angle = atan(modelPosition.x, modelPosition.z);
	float distanceToCenter = length(modelPosition.xz);
	// float angleOffset = (1.0 / (distanceToCenter * distanceToCenter)) * uTime * 0.2;
	float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;

	angle -= angleOffset;

	modelPosition.x = cos(angle) * distanceToCenter;
	modelPosition.z = sin(angle) * distanceToCenter;

	modelPosition.xyz += aRandomness;

	vec4 viewPosition = viewMatrix * modelPosition;
	vec4 projectedPosition = projectionMatrix * viewPosition;

	gl_Position = projectedPosition;

	gl_PointSize = uSize * aScale;
	gl_PointSize *= (1.0 / -viewPosition.z);

	vColor = color;
}`,D=`varying vec3 vColor;

void main() {
	// Disc
	// float strength = distance(gl_PointCoord, vec2(0.5));
	// strength = step(0.5, strength);
	// strength = 1.0 - strength;

	// Diffuse point
	// float strength = distance(gl_PointCoord, vec2(0.5));
	// strength *= 2.0;
	// strength = 1.0 - strength;

	// Light point pattern
	float strength = distance(gl_PointCoord, vec2(0.5));
	strength = 1.0 - strength;
	strength = pow(strength, 10.0);

	// Final color
	vec3 color = mix(vec3(0.0), vColor, strength);

	gl_FragColor = vec4(color, 1.0);
}`;class j extends T{constructor(e){super(e);this.pauseTime=0}pause(){this.pauseTime=this.elapsedTime,this.running=!1,this.autoStart=!1}resume(){this.oldTime=performance.now(),this.running=!0}getElapsedTime(){return this.getDelta(),this.elapsedTime}}const t={count:1e5,radius:5,branches:7,randomness:.15,randomnessPower:3.5,innerColor:"#ff5555",outerColor:"#55f5ff"},p=new j(!1);let h=window.innerWidth,m=window.innerHeight,P=parseInt(new URL(document.location).searchParams.get("dpr"))||window.devicePixelRatio,x=0;class B{constructor({canvas:e}){this.canvas=e,this.init(),this.generate()}init(){this.scene=new z,this.camera=new A(75,h/m,1,50),this.camera.position.x=3,this.camera.position.y=1.75,this.camera.position.z=5,this.scene.add(this.camera),this.controls=new L(this.camera,this.canvas),this.controls.enableDamping=!0,this.controls.minDistance=5,this.controls.maxDistance=20,this.renderer=new F({canvas:this.canvas,antialias:!0,powerPreference:"high-performance"}),this.renderer.setSize(h,m),this.renderer.setPixelRatio(P),window.addEventListener("resize",this.setSize.bind(this))}setSize(){h=window.innerWidth,m=window.innerHeight,this.camera.aspect=h/m,this.camera.updateProjectionMatrix(),this.renderer.setSize(h,m),this.renderer.setPixelRatio(P)}generate(){this.galaxy&&(this.galaxy.geometry.dispose(),this.galaxy.material.dispose(),this.scene.remove(this.galaxy));const e=new O,i=new Float32Array(t.count*3),a=new Float32Array(t.count*3),n=new Float32Array(t.count*1),o=new Float32Array(t.count*3),c=new v(t.innerColor),C=new v(t.outerColor);for(let d=0;d<t.count;d++){const r=d*3,l=Math.random()*t.radius,w=d%t.branches/t.branches*2*Math.PI,b=Math.pow(Math.random(),t.randomnessPower)*(Math.random()<.5?1:-1)*t.randomness*l,M=Math.pow(Math.random(),t.randomnessPower)*(Math.random()<.5?1:-1)*t.randomness*l,S=Math.pow(Math.random(),t.randomnessPower)*(Math.random()<.5?1:-1)*t.randomness*l;i[r+0]=Math.cos(w)*l,i[r+1]=0,i[r+2]=Math.sin(w)*l,o[r+0]=b,o[r+1]=M,o[r+2]=S;const g=c.clone();g.lerp(C,l/t.radius),a[r+0]=g.r,a[r+1]=g.g,a[r+2]=g.b,n[d]=Math.random()}e.setAttribute("position",new f(i,3)),e.setAttribute("color",new f(a,3)),e.setAttribute("aScale",new f(n,1)),e.setAttribute("aRandomness",new f(o,3));const y=new R({depthWrite:!1,blending:k,vertexColors:!0,vertexShader:_,fragmentShader:D,uniforms:{uTime:{value:0},uSize:{value:16*this.renderer.getPixelRatio()}}});this.galaxy=new E(e,y),this.scene.add(this.galaxy)}animate(){x=requestAnimationFrame(this.animate.bind(this));const e=p.getElapsedTime();this.galaxy.material.uniforms.uTime.value=30+e,this.draw()}draw(){this.controls.update(),this.renderer.render(this.scene,this.camera)}start(){p.resume(),this.animate()}stop(){p.pause(),cancelAnimationFrame(x)}restart(){this.stop(),this.generate(),this.start()}}let G=({onFinishChange:s}={})=>{let e=new I;return e.add(t,"count").min(3e4).max(3e5).step(100).name("count (!)"),e.add(t,"radius").min(2).max(8).step(.01),e.add(t,"branches").min(2).max(10).step(1),e.add(t,"randomness").min(0).max(2).step(.001),e.add(t,"randomnessPower").min(1).max(10).step(.001),e.addColor(t,"innerColor"),e.addColor(t,"outerColor"),s&&e.controllers.forEach(i=>{i.onFinishChange(s)}),e},H=(()=>{try{return window.self!==window.top}catch{return!0}})(),N=document.getElementById("scene"),u=new B({canvas:N});if(H){document.body.classList.add("is-iframe"),u.draw();let s=["http://localhost:8080","https://nextgtrgod.github.io","https://nextgtrgod-experiments.vercel.app"];window.addEventListener("message",e=>{if(!!s.includes(e.origin))switch(e.data){case"start":u.start();break;case"stop":u.stop();break}})}else u.start(),window.innerWidth>=720&&G({onFinishChange:()=>u.restart()});
