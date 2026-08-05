'use client'

import {useEffect,useRef} from 'react'

export type LiquidMode='ripple'|'rain'|'pulse'
export type LiquidSettings={mode:LiquidMode;intensity:number;radius:number;paused:boolean}

const vertex=`
attribute vec2 a_position;
varying vec2 v_uv;
void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`

const simulation=`
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_state;
uniform vec2 u_texel;
uniform vec2 u_drop;
uniform float u_radius;
uniform float u_strength;
float heightAt(vec2 p){return texture2D(u_state,p).r*2.-1.;}
void main(){
  vec4 state=texture2D(u_state,v_uv);
  float previous=state.g*2.-1.;
  float neighbors=heightAt(v_uv+vec2(u_texel.x,0.))+heightAt(v_uv-vec2(u_texel.x,0.))+heightAt(v_uv+vec2(0.,u_texel.y))+heightAt(v_uv-vec2(0.,u_texel.y));
  float next=(neighbors*.5-previous)*.986;
  vec2 delta=v_uv-u_drop;
  next+=exp(-dot(delta,delta)/(u_radius*u_radius))*u_strength;
  gl_FragColor=vec4(next*.5+.5,state.r,0.,1.);
}`

const render=`
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_state;
uniform vec2 u_texel;
uniform vec3 u_deep;
uniform vec3 u_surface;
uniform float u_time;
float heightAt(vec2 p){return texture2D(u_state,p).r*2.-1.;}
void main(){
  float h=heightAt(v_uv);
  float l=heightAt(v_uv-vec2(u_texel.x,0.));
  float r=heightAt(v_uv+vec2(u_texel.x,0.));
  float b=heightAt(v_uv-vec2(0.,u_texel.y));
  float t=heightAt(v_uv+vec2(0.,u_texel.y));
  vec2 normal=vec2(r-l,t-b);
  float ridge=clamp(length(normal)*4.2,0.,1.);
  float grain=(sin((v_uv.x+v_uv.y)*820.+u_time*.15)+1.)*.012;
  vec3 color=mix(u_deep,u_surface,.22+clamp(h*.7+ridge*.54,0.,.72));
  color+=ridge*.16+grain;
  gl_FragColor=vec4(color,1.);
}`

function shader(gl:WebGLRenderingContext,type:number,source:string){const value=gl.createShader(type);if(!value)return null;gl.shaderSource(value,source);gl.compileShader(value);if(!gl.getShaderParameter(value,gl.COMPILE_STATUS)){gl.deleteShader(value);return null}return value}
function program(gl:WebGLRenderingContext,fragment:string){const v=shader(gl,gl.VERTEX_SHADER,vertex);const f=shader(gl,gl.FRAGMENT_SHADER,fragment);if(!v||!f)return null;const value=gl.createProgram();if(!value)return null;gl.attachShader(value,v);gl.attachShader(value,f);gl.linkProgram(value);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(value,gl.LINK_STATUS)){gl.deleteProgram(value);return null}return value}

export function LiquidLab({settings,clearToken,label}:{settings:LiquidSettings;clearToken:number;label:string}){
  const canvas=useRef<HTMLCanvasElement>(null)
  const settingsRef=useRef(settings)
  const clearRef=useRef(clearToken)
  useEffect(()=>{settingsRef.current=settings},[settings])
  useEffect(()=>{clearRef.current=clearToken},[clearToken])

  useEffect(()=>{
    const element=canvas.current
    if(!element||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const gl=element.getContext('webgl',{alpha:false,antialias:false,premultipliedAlpha:false})
    if(!gl)return
    const simulationProgram=program(gl,simulation)
    const renderProgram=program(gl,render)
    if(!simulationProgram||!renderProgram)return
    const buffer=gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW)
    const size=matchMedia('(pointer:coarse)').matches?256:384
    const blank=new Uint8Array(size*size*4)
    for(let i=0;i<blank.length;i+=4){blank[i]=128;blank[i+1]=128;blank[i+3]=255}
    const textures:WebGLTexture[]=[]
    const frames:WebGLFramebuffer[]=[]
    for(let i=0;i<2;i++){
      const texture=gl.createTexture()!;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,size,size,0,gl.RGBA,gl.UNSIGNED_BYTE,blank)
      const framebuffer=gl.createFramebuffer()!;gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);textures.push(texture);frames.push(framebuffer)
    }
    const positions=new Map<WebGLProgram,number>()
    const use=(selected:WebGLProgram)=>{gl.useProgram(selected);let location=positions.get(selected);if(location===undefined){location=gl.getAttribLocation(selected,'a_position');positions.set(selected,location)}gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0)}
    const uniform=(selected:WebGLProgram,name:string)=>gl.getUniformLocation(selected,name)
    const resize=()=>{const rect=element.getBoundingClientRect();const ratio=Math.min(devicePixelRatio,1.5);element.width=Math.max(1,Math.round(rect.width*ratio));element.height=Math.max(1,Math.round(rect.height*ratio))}
    const observer=new ResizeObserver(resize);observer.observe(element);resize()
    let source=0,target=1,raf=0,lastClear=clearRef.current,lastAuto=0
    let drop:{x:number;y:number;strength:number}|null=null
    const point=(event:PointerEvent)=>{const rect=element.getBoundingClientRect();drop={x:(event.clientX-rect.left)/rect.width,y:1-(event.clientY-rect.top)/rect.height,strength:.08+settingsRef.current.intensity*.018}}
    const down=(event:PointerEvent)=>{element.setPointerCapture?.(event.pointerId);point(event)}
    element.addEventListener('pointerdown',down);element.addEventListener('pointermove',point);element.style.touchAction='none'
    const reset=()=>textures.forEach(texture=>{gl.bindTexture(gl.TEXTURE_2D,texture);gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,size,size,gl.RGBA,gl.UNSIGNED_BYTE,blank)})
    const draw=(time:number)=>{
      const current=settingsRef.current
      if(clearRef.current!==lastClear){lastClear=clearRef.current;reset()}
      if(!current.paused){
        if(current.mode==='rain'&&time-lastAuto>150){drop={x:.08+Math.random()*.84,y:.08+Math.random()*.84,strength:.035+current.intensity*.012};lastAuto=time}
        if(current.mode==='pulse'&&time-lastAuto>240){const angle=time*.0014;drop={x:.5+Math.cos(angle)*.22,y:.5+Math.sin(angle)*.22,strength:.055+current.intensity*.014};lastAuto=time}
        use(simulationProgram);gl.bindFramebuffer(gl.FRAMEBUFFER,frames[target]);gl.viewport(0,0,size,size);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,textures[source]);gl.uniform1i(uniform(simulationProgram,'u_state'),0);gl.uniform2f(uniform(simulationProgram,'u_texel'),1/size,1/size);gl.uniform2f(uniform(simulationProgram,'u_drop'),drop?.x??-2,drop?.y??-2);gl.uniform1f(uniform(simulationProgram,'u_radius'),.008+current.radius*.004);gl.uniform1f(uniform(simulationProgram,'u_strength'),drop?.strength??0);gl.drawArrays(gl.TRIANGLES,0,6);[source,target]=[target,source];drop=null
      }
      use(renderProgram);gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,element.width,element.height);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,textures[source]);gl.uniform1i(uniform(renderProgram,'u_state'),0);gl.uniform2f(uniform(renderProgram,'u_texel'),1/size,1/size)
      const light=document.documentElement.dataset.theme==='light';gl.uniform3f(uniform(renderProgram,'u_deep'),...(light?[.72,.69,.63]:[.025,.028,.025]) as [number,number,number]);gl.uniform3f(uniform(renderProgram,'u_surface'),...(light?[.98,.96,.91]:[.72,.77,.69]) as [number,number,number]);gl.uniform1f(uniform(renderProgram,'u_time'),time*.001);gl.drawArrays(gl.TRIANGLES,0,6);raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return()=>{cancelAnimationFrame(raf);observer.disconnect();element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',point);textures.forEach(value=>gl.deleteTexture(value));frames.forEach(value=>gl.deleteFramebuffer(value));gl.deleteBuffer(buffer);gl.deleteProgram(simulationProgram);gl.deleteProgram(renderProgram)}
  },[])

  return <canvas ref={canvas} className="liquid-lab" aria-label={label}/>
}
