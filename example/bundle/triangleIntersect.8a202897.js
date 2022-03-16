function e(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},o={},i=t.parcelRequire4485;null==i&&((i=function(e){if(e in n)return n[e].exports;if(e in o){var t=o[e];delete o[e];var i={id:e,exports:{}};return n[e]=i,t.call(i.exports,i,i.exports),i.exports}var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,t){o[e]=t},t.parcelRequire4485=i);var a,r,l={};a=l,r=function(){var e=function(){function t(e){return i.appendChild(e.dom),e}function n(e){for(var t=0;t<i.children.length;t++)i.children[t].style.display=t===e?"block":"none";o=e}var o=0,i=document.createElement("div");i.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",i.addEventListener("click",(function(e){e.preventDefault(),n(++o%i.children.length)}),!1);var a=(performance||Date).now(),r=a,l=0,s=t(new e.Panel("FPS","#0ff","#002")),d=t(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var c=t(new e.Panel("MB","#f08","#201"));return n(0),{REVISION:16,dom:i,addPanel:t,showPanel:n,begin:function(){a=(performance||Date).now()},end:function(){l++;var e=(performance||Date).now();if(d.update(e-a,200),e>r+1e3&&(s.update(1e3*l/(e-r),100),r=e,l=0,c)){var t=performance.memory;c.update(t.usedJSHeapSize/1048576,t.jsHeapSizeLimit/1048576)}return e},update:function(){a=this.end()},domElement:i,setMode:n}};return e.Panel=function(e,t,n){var o=1/0,i=0,a=Math.round,r=a(window.devicePixelRatio||1),l=80*r,s=48*r,d=3*r,c=2*r,p=3*r,f=15*r,u=74*r,w=30*r,h=document.createElement("canvas");h.width=l,h.height=s,h.style.cssText="width:80px;height:48px";var m=h.getContext("2d");return m.font="bold "+9*r+"px Helvetica,Arial,sans-serif",m.textBaseline="top",m.fillStyle=n,m.fillRect(0,0,l,s),m.fillStyle=t,m.fillText(e,d,c),m.fillRect(p,f,u,w),m.fillStyle=n,m.globalAlpha=.9,m.fillRect(p,f,u,w),{dom:h,update:function(s,y){o=Math.min(o,s),i=Math.max(i,s),m.fillStyle=n,m.globalAlpha=1,m.fillRect(0,0,l,f),m.fillStyle=t,m.fillText(a(s)+" "+e+" ("+a(o)+"-"+a(i)+")",d,c),m.drawImage(h,p+r,f,u-r,w,p,f,u-r,w),m.fillRect(p+u-r,f,r,w),m.fillStyle=n,m.globalAlpha=.9,m.fillRect(p+u-r,f,r,a((1-s/y)*w))}}},e},"object"==typeof l?l=r():"function"==typeof define&&define.amd?define(r):a.Stats=r();var s=i("4Q0VG"),d=i("hGT0Q"),c=i("W2bOH"),p=i("8GBjY");const f={sphereSize:1},u=new p.SeparatingAxisTriangle,w=new p.SeparatingAxisTriangle;let h,m,y,g,b;u.a.set(-1,0,0),u.b.set(2,0,-2),u.c.set(2,0,2),w.a.set(1,0,0),w.b.set(-2,-2,0),w.c.set(-2,2,0);let x,v,M,S,z=[],P=[],C=new d.Line3;function R(){h.begin(),x.visible=!1,P[0].visible=!1,P[1].visible=!1,u.update(),w.update(),u.intersectsTriangle(w,C)?(!function(e,t){e.geometry.dispose();const n=(new d.Vector3).subVectors(t.start,t.end);e.geometry=new d.CylinderGeometry(1,1,n.length(),6,4,!0),e.geometry.applyMatrix4((new d.Matrix4).makeTranslation(0,n.length()/2,0)),e.geometry.applyMatrix4((new d.Matrix4).makeRotationX(d.Math.degToRad(90))),e.geometry.computeVertexNormals(),e.position.copy(t.start),e.lookAt(t.end)}(x,C),x.visible=!0,P[0].visible=!0,P[1].visible=!0):(C.start.set(1/0,1/0,1/0),C.end.set(1/0,1/0,1/0)),z[0].position.copy(u.a),z[1].position.copy(u.b),z[2].position.copy(u.c),z[3].position.copy(w.a),z[4].position.copy(w.b),z[5].position.copy(w.c),P[0].position.copy(C.start),P[1].position.copy(C.end),function(){const e=v.geometry.getAttribute("position");e.setXYZ(0,u.a.x,u.a.y,u.a.z),e.setXYZ(1,u.b.x,u.b.y,u.b.z),e.setXYZ(2,u.c.x,u.c.y,u.c.z),e.needsUpdate=!0,v.geometry.computeVertexNormals();const t=M.geometry.getAttribute("position");t.setXYZ(0,w.a.x,w.a.y,w.a.z),t.setXYZ(1,w.b.x,w.b.y,w.b.z),t.setXYZ(2,w.c.x,w.c.y,w.c.z),t.needsUpdate=!0,M.geometry.computeVertexNormals()}();[...z,...P].forEach((e=>{e.scale.setScalar(.005*f.sphereSize*e.position.distanceTo(y.position))})),P.forEach((e=>e.scale.multiplyScalar(1.5))),x.scale.setScalar(.5*Math.min(P[0].scale.x,P[1].scale.x)),x.scale.z=1,S.updateDisplay(),g.render(m,y),h.end()}!function(){g=new d.WebGLRenderer({antialias:!0}),g.setPixelRatio(window.devicePixelRatio),g.setSize(window.innerWidth,window.innerHeight),g.setClearColor(1251612,1),document.body.appendChild(g.domElement),m=new d.Scene,m.fog=new d.Fog(1251612,20,60);const t=new d.DirectionalLight(16777215,.3);t.position.set(10,10,10),m.add(t),m.add(new d.AmbientLight(16777215,.8));const n=new d.MeshPhongMaterial({color:16711680,side:d.DoubleSide}),o=new d.MeshPhongMaterial({color:255,side:d.DoubleSide}),i=new d.MeshPhongMaterial({color:65280,side:d.DoubleSide}),a=new d.SphereGeometry(1);for(let e=0;e<2;e++){const e=new d.Mesh(a,n);P.push(e),m.add(e)}for(let e=0;e<3;e++){const e=new d.Mesh(a,o);z.push(e),m.add(e)}for(let e=0;e<3;e++){const e=new d.Mesh(a,i);z.push(e),m.add(e)}const r=new d.CylinderGeometry;x=new d.Mesh(r,n),m.add(x);const s=new d.BufferGeometry;s.setAttribute("position",new d.BufferAttribute(new Float32Array([1,1,1,2,2,2,3,3,3]),3)),v=new d.Mesh(s.clone(),o),m.add(v),M=new d.Mesh(s.clone(),i),m.add(M),y=new d.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,50),y.position.set(10,10,10),y.far=100,y.updateProjectionMatrix(),b=new c.OrbitControls(y,g.domElement),h=new(e(l)),document.body.appendChild(h.dom),b.addEventListener("change",(function(){R()})),window.addEventListener("resize",(function(){y.aspect=window.innerWidth/window.innerHeight,y.updateProjectionMatrix(),g.setSize(window.innerWidth,window.innerHeight),R()}),!1)}(),function(){S=new s.GUI,S.add(f,"sphereSize",0,5,.001).onChange(R);const e=["a1","b1","c1","a2","b2","c2"],t=[u.a,u.b,u.c,w.a,w.b,w.c];for(let n=0;n<6;n++){const o=S.addFolder(e[n]);o.add(t[n],"x").min(-10).max(10).step(.001).onChange(R),o.add(t[n],"y").min(-10).max(10).step(.001).onChange(R),o.add(t[n],"z").min(-10).max(10).step(.001).onChange(R),o.open()}const n=["Inter1","Inter2"],o=[C.start,C.end];for(let e=0;e<2;e++){const t=S.addFolder(n[e]);t.add(o[e],"x").step(.001),t.add(o[e],"y").step(.001),t.add(o[e],"z").step(.001),t.open()}S.open()}(),R();
//# sourceMappingURL=triangleIntersect.8a202897.js.map
