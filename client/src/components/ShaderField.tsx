import { useEffect, useRef } from "react";

const vertex = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main(){v_uv=a_position*0.5+0.5;gl_Position=vec4(a_position,0.0,1.0);}`;

const fragment = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_pointer;

float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.0,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}

void main(){
 vec2 uv=v_uv; vec2 p=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y;
 vec2 mouse=(u_pointer-.5*u_resolution)/u_resolution.y;
 float t=u_time*.055;
 float n=fbm(p*2.4+vec2(t,-t*.7));
 float flow=fbm(p*3.2+vec2(n*1.4-t*.6,t*.35));
 float glow=exp(-length(p-mouse)*3.2);
 float ring=abs(length(p*vec2(1.0,.82))-(.26+.035*sin(t+flow*4.0)));
 ring=smoothstep(.035,.0,ring)*.24;
 vec3 burgundy=vec3(.30,.035,.055);
 vec3 wine=vec3(.12,.012,.025);
 vec3 ember=vec3(.75,.18,.07);
 vec3 black=vec3(.008,.006,.009);
 vec3 c=mix(black,wine,smoothstep(.05,.8,n));
 c=mix(c,burgundy,smoothstep(.35,.9,flow)*.48);
 c+=ember*(glow*.13+ring);
 c+=vec3(.12,.035,.03)*pow(max(0.0,1.0-length(p)*.72),3.0);
 float vignette=smoothstep(1.25,.18,length(p));
 c*=.68+.32*vignette;
 outColor=vec4(c,1.0);
}`;

export function ShaderField(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const gl=canvas.getContext("webgl2",{alpha:true,antialias:false});
  if(!gl)return;
  const compile=(type:number,source:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||"shader error");return s;};
  const program=gl.createProgram()!;gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);gl.useProgram(program);
  const buffer=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(program,"a_position");gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const time=gl.getUniformLocation(program,"u_time"),resolution=gl.getUniformLocation(program,"u_resolution"),pointer=gl.getUniformLocation(program,"u_pointer");
  let raf=0,started=performance.now(),px=innerWidth*.7,py=innerHeight*.25;
  const resize=()=>{const dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;canvas.style.width="100%";canvas.style.height="100%";gl.viewport(0,0,canvas.width,canvas.height);};
  const move=(e:PointerEvent)=>{px=e.clientX;py=innerHeight-e.clientY;};
  const frame=(now:number)=>{gl.uniform1f(time,(now-started)/1000);gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform2f(pointer,px*(canvas.width/innerWidth),py*(canvas.height/innerHeight));gl.drawArrays(gl.TRIANGLE_STRIP,0,4);raf=requestAnimationFrame(frame);};
  resize();addEventListener("resize",resize);addEventListener("pointermove",move,{passive:true});raf=requestAnimationFrame(frame);
  return()=>{cancelAnimationFrame(raf);removeEventListener("resize",resize);removeEventListener("pointermove",move);};
 },[]);
 return <canvas ref={ref} className="belentani-shader" aria-hidden="true"/>;
}
