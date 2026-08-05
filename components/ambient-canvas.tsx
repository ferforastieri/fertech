'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.);}`
const fragment = `
precision highp float;
uniform float uTime; uniform float uScroll; uniform vec2 uMouse; uniform vec2 uResolution;
varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+17.13;a*=.48;}return v;}
void main(){vec2 uv=vUv;vec2 p=(uv-.5)*vec2(uResolution.x/uResolution.y,1.);vec2 m=(uMouse-.5)*.45;float t=uTime*.055+uScroll*.00022;float field=fbm(p*2.1+m+vec2(t,-t*.7));float folds=sin((p.x+field*.65+t)*8.)*.5+.5;float halo=.08/max(.06,length(p-m*1.4));vec3 ink=vec3(.025,.028,.035);vec3 cobalt=vec3(.025,.16,.92);vec3 pearl=vec3(.82,.84,.88);vec3 color=mix(ink,cobalt,smoothstep(.42,.82,field)*.62);color=mix(color,pearl,smoothstep(.78,1.,folds)*.12);color+=cobalt*halo*.28;color+=((hash(gl_FragCoord.xy+uTime)-.5)/255.)*4.;gl_FragColor=vec4(color,1.);}
`

export function AmbientCanvas(){const ref=useRef<HTMLCanvasElement>(null);useEffect(()=>{const canvas=ref.current;if(!canvas)return;const renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));const scene=new THREE.Scene();const camera=new THREE.Camera();const uniforms={uTime:{value:0},uScroll:{value:0},uMouse:{value:new THREE.Vector2(.5,.5)},uResolution:{value:new THREE.Vector2(innerWidth,innerHeight)}};const material=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms,depthTest:false});const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);scene.add(mesh);const resize=()=>{renderer.setSize(innerWidth,innerHeight,false);uniforms.uResolution.value.set(innerWidth,innerHeight)};const pointer=(e:PointerEvent)=>uniforms.uMouse.value.lerp(new THREE.Vector2(e.clientX/innerWidth,1-e.clientY/innerHeight),.28);let frame=0;const clock=new THREE.Clock();const render=()=>{uniforms.uTime.value=clock.getElapsedTime();uniforms.uScroll.value+=(scrollY-uniforms.uScroll.value)*.055;renderer.render(scene,camera);frame=requestAnimationFrame(render)};resize();render();addEventListener('resize',resize);addEventListener('pointermove',pointer);return()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize);removeEventListener('pointermove',pointer);material.dispose();mesh.geometry.dispose();renderer.dispose()}},[]);return <canvas ref={ref} className="ambient-canvas" aria-hidden="true"/>}
