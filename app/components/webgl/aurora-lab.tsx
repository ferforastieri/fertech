'use client'

import {useEffect,useRef} from 'react'

export type AuroraScene='field'|'prism'|'signal'|'grid'|'tunnel'|'terrain'|'aim'
export type AuroraMotion='orbit'|'wave'|'chaos'
export type AuroraSettings={scene:AuroraScene;motion:AuroraMotion;color:string;density:number;speed:number;brush:number;paused:boolean;drawing:boolean}

const vertex=`
precision highp float;
attribute vec4 a_seed;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_scene;
uniform float u_motion;
uniform float u_density;
uniform float u_pointScale;
uniform float u_trail;
varying float v_alpha;
varying float v_energy;

float hash(float n){return fract(sin(n)*43758.5453123);}
vec2 rotate(vec2 point,float angle){float c=cos(angle);float s=sin(angle);return vec2(point.x*c-point.y*s,point.x*s+point.y*c);}
void main(){
  float id=a_seed.w;
  float active=step(id,u_density);
  float t=u_time;
  vec2 trailAnchor=a_seed.xy;
  vec2 p=a_seed.xy;
  float depth=a_seed.z;
  float energy=.45;

  if(u_scene<.5){
    if(u_motion<.5){
      float angle=t*.34+a_seed.z*6.283;
      float radius=.22+abs(a_seed.x)*.62;
      p=vec2(cos(angle)*radius,sin(angle*1.55)*(.24+abs(a_seed.y)*.58));
      depth=sin(angle+id*9.0);
    }else if(u_motion<1.5){
      p.y+=sin(t*1.35+p.x*7.0+a_seed.z*6.0)*.19;
      depth=cos(t+p.y*4.0);
    }else{
      p+=vec2(sin(t*1.8+a_seed.z*12.0),cos(t*1.43+id*13.0))*.18;
      depth=sin(t*2.1+id*31.0);
    }
  }else if(u_scene<1.5){
    float ring=floor(id*9.0)/9.0;
    float angle=id*56.0+t*(.12+ring*.22);
    float r=.16+ring*.7;
    p=vec2(cos(angle)*r,sin(angle)*r*.58);
    p.y+=sin(angle*3.0+t)*.04;
    depth=cos(angle);
    energy=.8;
  }else if(u_scene<2.5){
    p.x=mix(-.92,.92,id);
    float carrier=sin(p.x*18.0+t*2.0)*.16+sin(p.x*47.0-t*1.25)*.045;
    p.y=carrier+(a_seed.y*.12);
    depth=sin(p.x*10.0+t);
    energy=.65+abs(carrier)*1.5;
  }else if(u_scene<3.5){
    float side=26.0;
    float ix=mod(floor(id*676.0),side);
    float iy=floor(id*676.0/side);
    p=vec2(ix/(side-1.0),iy/(side-1.0))*1.72-.86;
    float pulse=sin(length(p-u_pointer)*18.0-t*3.2);
    p.y+=pulse*.022;
    depth=pulse;
    energy=.45+pulse*.28;
  }else if(u_scene<4.5){
    float z=fract(a_seed.z-t*.075);
    float angle=a_seed.w*82.0+t*.24;
    float r=.08+z*.93;
    p=vec2(cos(angle),sin(angle))*r;
    depth=1.0-z;
    energy=1.0-z*.58;
  }else if(u_scene<5.5){
    float side=28.0;
    float ix=mod(floor(id*784.0),side);
    float iy=floor(id*784.0/side);
    vec2 g=vec2(ix,iy)/(side-1.0)*2.0-1.0;
    float h=sin(g.x*8.0+t)+cos(g.y*7.0-t*.8);
    p=vec2(g.x*.92,(g.y*.46-.17)+h*.055-(g.y*g.y)*.08);
    depth=h*.5+g.y;
    energy=.38+h*.12;
  }else{
    float cluster=floor(id*5.0);
    float angle=id*190.0;
    vec2 center=vec2(hash(cluster*13.1)*1.5-.75,hash(cluster*29.7)*1.0-.5);
    p=center+vec2(cos(angle),sin(angle))*(.018+hash(id*91.0)*.055);
    depth=1.0;
    energy=.9;
  }

  if(u_scene>=.5){
    if(u_motion<.5){
      p=rotate(p,t*.055+id*.14);
    }else if(u_motion<1.5){
      p.y+=sin(p.x*7.0+t*1.4+id*8.0)*.045;
    }else{
      p+=vec2(sin(t*1.7+id*19.0),cos(t*1.3+id*23.0))*.055;
    }
  }

  if(u_trail>.5){
    float born=a_seed.z;
    float seed=a_seed.w;
    float age=max(0.0,t-born);
    vec2 local=vec2(0.0);
    p=trailAnchor;
    depth=sin(seed*31.0+t*2.0);
    energy=.72;

    if(u_scene<.5){
      if(u_motion<.5){
        float angle=seed*6.283+age*(.8+seed*.9);
        float radius=.008+seed*.025+min(age*.028,.085);
        local=vec2(cos(angle)*radius,sin(angle*1.55)*radius*.72);
      }else if(u_motion<1.5){
        local.y=sin(t*1.35+trailAnchor.x*7.0+seed*6.0)*.19;
      }else{
        local=vec2(sin(t*1.8+seed*12.0),cos(t*1.43+seed*13.0))*.18;
      }
    }else if(u_scene<1.5){
      float ring=floor(seed*9.0)/9.0;
      float angle=seed*56.0+t*(.12+ring*.22);
      float radius=.018+ring*.08;
      local=vec2(cos(angle)*radius,sin(angle)*radius*.58);
      local.y+=sin(angle*3.0+t)*.008;
      depth=cos(angle);
      energy=.8;
    }else if(u_scene<2.5){
      local.x=mod(age*.18+seed*.12,.24)-.12;
      float signalX=trailAnchor.x+local.x;
      float carrier=sin(signalX*18.0+t*2.0)*.16+sin(signalX*47.0-t*1.25)*.045;
      local.y=carrier;
      depth=sin(signalX*10.0+t);
      energy=.65+abs(carrier)*1.5;
    }else if(u_scene<3.5){
      float stepSize=1.72/25.0;
      p=floor((trailAnchor+.86)/stepSize+.5)*stepSize-.86;
      float pulse=sin(length(p-trailAnchor)*18.0-t*3.2+seed*6.283);
      local.y=pulse*.022;
      depth=pulse;
      energy=.45+pulse*.28;
    }else if(u_scene<4.5){
      float z=fract(seed-age*.075);
      float angle=seed*82.0+t*.24;
      float radius=.008+z*.105;
      local=vec2(cos(angle),sin(angle))*radius;
      depth=1.0-z;
      energy=1.0-z*.58;
    }else if(u_scene<5.5){
      float h=sin(trailAnchor.x*8.0+t)+cos(trailAnchor.y*7.0-t*.8);
      local=vec2((seed-.5)*.035,h*.055-(trailAnchor.y*trailAnchor.y)*.08);
      depth=h*.5+trailAnchor.y;
      energy=.38+h*.12;
    }else{
      float angle=seed*190.0;
      float radius=.018+hash(seed*91.0)*.055;
      local=vec2(cos(angle),sin(angle))*radius;
      depth=1.0;
      energy=.9;
    }

    if(u_scene>=.5){
      if(u_motion<.5){
        local=rotate(local,t*.055+seed*.14);
      }else if(u_motion<1.5){
        local.y+=sin((trailAnchor.x+local.x)*7.0+t*1.4+seed*8.0)*.045;
      }else{
        local+=vec2(sin(t*1.7+seed*19.0),cos(t*1.3+seed*23.0))*.055;
      }
    }
    p+=local;
  }

  vec2 repel=p-u_pointer;
  float distanceToPointer=max(length(repel),.025);
  float pointerForce=smoothstep(.26,0.0,distanceToPointer);
  if(u_trail<.5&&pointerForce>0.0){
    if(u_scene<.5){
      p+=normalize(repel)*pointerForce*.07;
    }else if(u_scene<1.5){
      p=u_pointer+rotate(repel,pointerForce*.32);
    }else if(u_scene<2.5){
      p.y+=sin(distanceToPointer*34.0-t*5.0)*pointerForce*.075;
    }else if(u_scene<3.5){
      p+=normalize(repel)*sin(distanceToPointer*28.0-t*4.0)*pointerForce*.045;
    }else if(u_scene<4.5){
      p=u_pointer+repel*(1.0-pointerForce*.24);
    }else if(u_scene<5.5){
      p.y+=cos(repel.x*24.0-t*3.0)*pointerForce*.065;
    }else{
      p-=normalize(repel)*pointerForce*.055;
    }
  }
  float aspect=u_resolution.x/u_resolution.y;
  p.x/=max(1.0,aspect*.73);
  gl_Position=vec4(p,0.0,1.0);
  gl_PointSize=(2.0+energy*4.8+max(depth,0.0)*2.8)*u_pointScale;
  v_alpha=active*(.28+energy*.68);
  v_energy=energy;
}`

const fragment=`
precision mediump float;
uniform vec3 u_color;
varying float v_alpha;
varying float v_energy;
void main(){
  vec2 p=gl_PointCoord-.5;
  float d=length(p);
  float core=smoothstep(.5,.08,d);
  float halo=smoothstep(.5,.0,d)*.34;
  if(d>.5||v_alpha<.01)discard;
  vec3 color=mix(u_color,vec3(1.0),core*.42);
  gl_FragColor=vec4(color,(core+halo)*v_alpha);
}`

function compile(gl:WebGLRenderingContext,type:number,source:string){const shader=gl.createShader(type);if(!shader)return null;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){console.error(gl.getShaderInfoLog(shader));gl.deleteShader(shader);return null}return shader}
function makeProgram(gl:WebGLRenderingContext){const v=compile(gl,gl.VERTEX_SHADER,vertex),f=compile(gl,gl.FRAGMENT_SHADER,fragment);if(!v||!f)return null;const result=gl.createProgram();if(!result)return null;gl.attachShader(result,v);gl.attachShader(result,f);gl.linkProgram(result);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(result,gl.LINK_STATUS)){gl.deleteProgram(result);return null}return result}
function rgb(hex:string){const value=parseInt(hex.slice(1),16);return[((value>>16)&255)/255,((value>>8)&255)/255,(value&255)/255] as const}

const scenes:AuroraScene[]=['field','prism','signal','grid','tunnel','terrain','aim']

export function AuroraLab({settings,clearToken,label}:{settings:AuroraSettings;clearToken:number;label:string}){
  const canvas=useRef<HTMLCanvasElement>(null)
  const settingsRef=useRef(settings)
  const clearRef=useRef(clearToken)
  useEffect(()=>{settingsRef.current=settings},[settings])
  useEffect(()=>{clearRef.current=clearToken},[clearToken])

  useEffect(()=>{
    const element=canvas.current
    if(!element)return
    const gl=element.getContext('webgl',{alpha:false,antialias:true,premultipliedAlpha:false})
    if(!gl)return
    const shaderProgram=makeProgram(gl)
    if(!shaderProgram)return
    const count=1200
    const seeds=new Float32Array(count*4)
    for(let i=0;i<count;i++){const p=i*4;seeds[p]=Math.random()*1.8-.9;seeds[p+1]=Math.random()*1.25-.625;seeds[p+2]=Math.random();seeds[p+3]=i/count}
    const baseBuffer=gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER,baseBuffer);gl.bufferData(gl.ARRAY_BUFFER,seeds,gl.STATIC_DRAW)
    const trailBuffer=gl.createBuffer()
    const trail:number[]=[]
    const trailCapacity=3600
    const particlesPerSample=8
    const position=gl.getAttribLocation(shaderProgram,'a_seed')
    const uniforms={resolution:gl.getUniformLocation(shaderProgram,'u_resolution'),pointer:gl.getUniformLocation(shaderProgram,'u_pointer'),time:gl.getUniformLocation(shaderProgram,'u_time'),scene:gl.getUniformLocation(shaderProgram,'u_scene'),motion:gl.getUniformLocation(shaderProgram,'u_motion'),density:gl.getUniformLocation(shaderProgram,'u_density'),pointScale:gl.getUniformLocation(shaderProgram,'u_pointScale'),trail:gl.getUniformLocation(shaderProgram,'u_trail'),color:gl.getUniformLocation(shaderProgram,'u_color')}
    const pointer={x:9,y:9,down:false}
    let elapsed=0
    const updatePointer=(event:PointerEvent)=>{const rect=element.getBoundingClientRect();const aspectScale=Math.max(1,(rect.width/rect.height)*.73);const samples=event.getCoalescedEvents?.()||[event];samples.forEach(sample=>{pointer.x=(((sample.clientX-rect.left)/rect.width)*2-1)*aspectScale;pointer.y=1-((sample.clientY-rect.top)/rect.height)*2;if(pointer.down&&settingsRef.current.drawing){for(let particle=0;particle<particlesPerSample;particle++){trail.push(pointer.x,pointer.y,elapsed,Math.random());if(trail.length>trailCapacity*4)trail.splice(0,4)}}})}
    const down=(event:PointerEvent)=>{pointer.down=true;element.setPointerCapture?.(event.pointerId);updatePointer(event)}
    const up=()=>{pointer.down=false}
    const leave=()=>{if(!pointer.down){pointer.x=9;pointer.y=9}}
    element.addEventListener('pointermove',updatePointer);element.addEventListener('pointerdown',down);element.addEventListener('pointerup',up);element.addEventListener('pointercancel',up);element.addEventListener('pointerleave',leave)
    const resize=()=>{const rect=element.getBoundingClientRect(),ratio=Math.min(devicePixelRatio,1.65);element.width=Math.max(1,Math.round(rect.width*ratio));element.height=Math.max(1,Math.round(rect.height*ratio))}
    const observer=new ResizeObserver(resize);observer.observe(element);resize()
    let raf=0,last=performance.now(),lastClear=clearRef.current
    const bind=(buffer:WebGLBuffer|null)=>{gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,4,gl.FLOAT,false,0,0)}
    const draw=(now:number)=>{
      const current=settingsRef.current
      if(clearRef.current!==lastClear){trail.splice(0);lastClear=clearRef.current}
      if(!current.paused)elapsed+=Math.min(now-last,34)*.001*current.speed
      last=now
      gl.viewport(0,0,element.width,element.height);gl.clearColor(.02,.019,.017,1);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE)
      gl.useProgram(shaderProgram);gl.uniform2f(uniforms.resolution,element.width,element.height);gl.uniform2f(uniforms.pointer,pointer.x,pointer.y);gl.uniform1f(uniforms.time,elapsed);gl.uniform1f(uniforms.scene,scenes.indexOf(current.scene));gl.uniform1f(uniforms.motion,['orbit','wave','chaos'].indexOf(current.motion));gl.uniform1f(uniforms.density,Math.min(1,current.density/180));gl.uniform1f(uniforms.pointScale,Math.min(devicePixelRatio,1.65));gl.uniform1f(uniforms.trail,0);const color=rgb(current.color);gl.uniform3f(uniforms.color,...color)
      bind(baseBuffer);gl.drawArrays(gl.POINTS,0,count)
      if(trail.length){gl.bindBuffer(gl.ARRAY_BUFFER,trailBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(trail),gl.DYNAMIC_DRAW);gl.vertexAttribPointer(position,4,gl.FLOAT,false,0,0);gl.uniform1f(uniforms.scene,scenes.indexOf(current.scene));gl.uniform1f(uniforms.motion,['orbit','wave','chaos'].indexOf(current.motion));gl.uniform1f(uniforms.density,1);gl.uniform1f(uniforms.pointScale,current.brush*1.35);gl.uniform1f(uniforms.trail,1);gl.uniform2f(uniforms.pointer,9,9);gl.drawArrays(gl.POINTS,0,trail.length/4)}
      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return()=>{cancelAnimationFrame(raf);observer.disconnect();element.removeEventListener('pointermove',updatePointer);element.removeEventListener('pointerdown',down);element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',up);element.removeEventListener('pointerleave',leave);gl.deleteBuffer(baseBuffer);gl.deleteBuffer(trailBuffer);gl.deleteProgram(shaderProgram)}
  },[])
  return <canvas ref={canvas} className="aurora-lab block h-full min-h-[470px] w-full touch-none md:min-h-[610px]" aria-label={label}/>
}
