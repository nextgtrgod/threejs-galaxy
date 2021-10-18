import{S as C,P as z,O as L,W as S,B as F,C as b,a as y,b as O,A as W,c as k,t as B}from"./vendor.76aad2e6.js";const R=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))h(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&h(s)}).observe(document,{childList:!0,subtree:!0});function o(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerpolicy&&(r.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?r.credentials="include":n.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function h(n){if(n.ep)return;n.ep=!0;const r=o(n);fetch(n.href,r)}};R();const t={count:1e5,size:.01,radius:10,branches:9,spin:1,randomness:1.55,randomnessPower:4.75,innerColor:"#ff5555",outerColor:"#55f5ff"};let c=window.innerWidth,l=window.innerHeight,P=parseInt(new URL(document.location).searchParams.get("dpr"))||window.devicePixelRatio,x=0;const E=2*Math.PI;let u=null,w=null,d=null,M=0;class D{constructor({canvas:e}){this.canvas=e,this.init(),this.generate()}init(){this.scene=new C,this.camera=new z(75,c/l,1,100),this.camera.position.x=3,this.camera.position.y=2,this.camera.position.z=5,this.scene.add(this.camera),this.controls=new L(this.camera,this.canvas),this.controls.minDistance=5,this.controls.maxDistance=20,this.controls.enableDamping=!0,this.renderer=new S({canvas:this.canvas,antialias:!0}),this.renderer.setSize(c,l),this.renderer.setPixelRatio(P),window.addEventListener("resize",this.setSize.bind(this))}setSize(){c=window.innerWidth,l=window.innerHeight,this.camera.aspect=c/l,this.camera.updateProjectionMatrix(),this.renderer.setSize(c,l),this.renderer.setPixelRatio(P)}generate(){d!==null&&(u.dispose(),w.dispose(),this.scene.remove(d)),u=new F;const e=new Float32Array(t.count*3),o=new Float32Array(t.count*3),h=new b(t.innerColor),n=new b(t.outerColor);for(let r=0;r<t.count;r++){const s=r*3,a=Math.random()*t.radius,f=a*t.spin,g=r%t.branches/t.branches*E,v=Math.pow(Math.random(),t.randomnessPower)*(Math.random()<.5?1:-1)*t.randomness*a,I=Math.pow(Math.random(),t.randomnessPower)*(Math.random()<.5?1:-1)*t.randomness*a,A=Math.pow(Math.random(),t.randomnessPower)*(Math.random()<.5?1:-1)*t.randomness*a;e[s+0]=Math.cos(g+f)*a+v,e[s+1]=I,e[s+2]=Math.sin(g+f)*a+A;const p=h.clone();p.lerp(n,a/t.radius),o[s+0]=p.r,o[s+1]=p.g,o[s+2]=p.b}u.setAttribute("position",new y(e,3)),u.setAttribute("color",new y(o,3)),w=new O({size:t.size,sizeAttenuation:!0,depthWrite:!1,blending:W,vertexColors:!0}),d=new k(u,w),this.scene.add(d)}animate(){x=requestAnimationFrame(this.animate.bind(this)),d&&(d.rotation.y=M*.0012),this.draw(),M++}draw(){this.controls.update(),this.renderer.render(this.scene,this.camera)}start(){this.animate()}stop(){cancelAnimationFrame(x)}restart(){this.stop(),this.generate(),this.start()}}let G=()=>{let i=new B.exports.Pane,e=i.addFolder({title:"Parameters"});return e.addInput(t,"count",{min:1e3,max:1e6,step:100}),e.addInput(t,"size",{min:.001,max:.1,step:.001}),e.addInput(t,"radius",{min:.01,max:20,step:.01}),e.addInput(t,"branches",{min:2,max:20,step:1}),e.addInput(t,"spin",{min:-5,max:5,step:.001}),e.addInput(t,"randomness",{min:0,max:2,step:.001,label:"random"}),e.addInput(t,"randomnessPower",{min:1,max:10,step:.001,label:"rndPower"}),e.addSeparator(),e.addInput(t,"innerColor",{label:"inner"}),e.addInput(t,"outerColor",{label:"outer"}),i},H=(()=>{try{return window.self!==window.top}catch{return!0}})(),N=document.getElementById("scene"),m=new D({canvas:N});if(H){document.body.classList.add("is-iframe"),m.draw();let i=["http://localhost:8080","https://nextgtrgod.github.io"];window.addEventListener("message",e=>{if(!!i.includes(e.origin))switch(e.data){case"start":m.start();break;case"stop":m.stop();break}})}else m.start(),G().on("change",({last:e})=>{e&&m.restart()});
