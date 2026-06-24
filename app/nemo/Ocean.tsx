"use client";

import { useEffect, useRef } from "react";

export default function Ocean({ className }: { className: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce =
      typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion:reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl || reduce) {
      canvas.style.display = "none";
      return;
    }

    const vs = `attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}`;
    const fs = `
  precision highp float;
  uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse;
  // value noise
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);
    float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));
    vec2 u=f*f*(3.-2.*f);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
  // animated caustic field
  float caustic(vec2 uv,float t){
    vec2 p=uv*4.0;float c=0.0;
    for(int i=0;i<4;i++){
      float fi=float(i);
      p+=vec2(sin(p.y*1.5+t*0.9+fi*1.3),cos(p.x*1.5-t*0.7+fi*1.7))*0.45;
      c+=0.5/(length(sin(p)*0.9+1.15));
    }
    return c*0.25;
  }
  void main(){
    vec2 uv=gl_FragCoord.xy/u_res.xy;
    float asp=u_res.x/u_res.y;
    // depth gradient
    vec3 shallow=vec3(0.05,0.42,0.50);
    vec3 mid=vec3(0.02,0.20,0.30);
    vec3 deep=vec3(0.008,0.05,0.12);
    vec3 col=mix(deep,mid,smoothstep(0.0,0.55,uv.y));
    col=mix(col,shallow,smoothstep(0.45,1.0,uv.y));
    // god rays from upper area, swaying
    vec2 src=vec2(0.5+0.18*sin(u_time*0.15+u_mouse.x*1.2),1.25);
    vec2 r=uv-src;
    float ang=atan(r.x, -r.y);
    float rays=0.5+0.5*sin(ang*26.0+sin(u_time*0.3)*2.0);
    rays=pow(rays,2.0)*smoothstep(0.0,1.0,uv.y);
    col+=vec3(0.35,0.75,0.78)*rays*0.12;
    // caustics, strongest near surface
    float c=caustic(vec2(uv.x*asp,uv.y), u_time*0.7);
    c=pow(max(c,0.0),2.2);
    col+=vec3(0.45,0.92,0.95)*c*smoothstep(0.1,1.0,uv.y)*0.55;
    // soft floating particulate
    float m=noise(vec2(uv.x*asp,uv.y)*9.0+vec2(0.0,-u_time*0.18));
    col+=pow(m,6.0)*vec3(0.6,0.95,0.9)*0.25;
    // vignette + subtle dither
    col*=smoothstep(1.35,0.25,length(uv-vec2(0.5,0.55)));
    col+=hash(uv+u_time)*0.012;
    gl_FragColor=vec4(col,1.0);
  }`;

    function sh(t: number, s: string): WebGLShader | null {
      const context = gl as WebGLRenderingContext;
      const o = context.createShader(t);
      if (!o) return null;
      context.shaderSource(o, s);
      context.compileShader(o);
      if (!context.getShaderParameter(o, context.COMPILE_STATUS)) {
        console.warn(context.getShaderInfoLog(o));
        return null;
      }
      return o;
    }

    const prog = gl.createProgram();
    if (!prog) {
      canvas.style.display = "none";
      return;
    }
    const v = sh(gl.VERTEX_SHADER, vs),
      f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) {
      canvas.style.display = "none";
      return;
    }
    gl.attachShader(prog, v);
    gl.attachShader(prog, f);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.style.display = "none";
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_res"),
      uTime = gl.getUniformLocation(prog, "u_time"),
      uMouse = gl.getUniformLocation(prog, "u_mouse");

    let mouse = [0.5, 0.5];
    const onPointerMove = (e: PointerEvent) => {
      mouse = [e.clientX / innerWidth, 1 - e.clientY / innerHeight];
    };
    addEventListener("pointermove", onPointerMove, { passive: true });

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 1.75);
      canvas!.width = innerWidth * dpr;
      canvas!.height = innerHeight * dpr;
    }
    addEventListener("resize", resize);
    resize();

    const start = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const context = gl as WebGLRenderingContext;
      context.viewport(0, 0, canvas!.width, canvas!.height);
      context.uniform2f(uRes, canvas!.width, canvas!.height);
      context.uniform1f(uTime, (now - start) / 1000);
      context.uniform2f(uMouse, mouse[0], mouse[1]);
      context.drawArrays(context.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onPointerMove);
      removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className={className} ref={canvasRef} />;
}
