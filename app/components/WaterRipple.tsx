"use client"

import { useEffect, useRef } from "react"
import { Renderer, Camera, Transform, Program, Mesh, Triangle, Texture } from "ogl"

export default function WaterRipple(){

const containerRef = useRef<HTMLDivElement>(null)

useEffect(()=>{

const container = containerRef.current
if(!container) return

/* ------------------------- */
/* AUDIO SETUP */
/* ------------------------- */
const audio = new Audio("/sounds/water-drop.mp3")
audio.volume = 1
audio.preload = "auto"

let started = false

document.addEventListener("click", () => {
  if(!started){
    started = true
    setInterval(()=>{
      audio.currentTime = 0
      audio.play().catch(()=>{})
    },5000)
  }
})

/* play sound on any click */

document.addEventListener("click",()=>{

playDropSound()

})

/* ------------------------- */
/* RENDERER */
/* ------------------------- */

const renderer = new Renderer({ alpha:true, dpr:2 })
const gl = renderer.gl

container.appendChild(gl.canvas)

const camera = new Camera(gl)
camera.position.z = 1

const scene = new Transform()

const geometry = new Triangle(gl)

/* ------------------------- */
/* HERO IMAGE TEXTURE */
/* ------------------------- */

const texture = new Texture(gl)

const img = new Image()

img.src = "/hero/hero-new.jpg"

img.onload = ()=>{

texture.image = img

}

/* ------------------------- */
/* SHADER */
/* ------------------------- */

const program = new Program(gl,{

vertex:`

attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main(){

vUv = uv;
gl_Position = vec4(position,0,1);

}

`,

fragment:`

precision highp float;

uniform sampler2D tMap;

uniform float uTime;
uniform vec2 uCenter;

varying vec2 vUv;

/* mandala reflection */

float mandala(vec2 uv){

vec2 p = uv - 0.5;

float r = length(p);

float a = atan(p.y,p.x);

float pattern = sin(a * 10.0) * 0.5 + 0.5;

return smoothstep(0.3,0.0,r) * pattern;

}

void main(){

float dist = distance(vUv,uCenter);

/* slow viscous ripple */

float ripple = sin((dist - uTime*0.03)*9.0);

/* ripple mask */

float mask = smoothstep(0.8,0.0,dist);

/* viscosity */

float viscosity = exp(-dist * 4.0);

float strength = ripple * mask * viscosity;

/* image refraction */

vec2 uv = vUv + normalize(vUv - uCenter) * strength * 0.015;

/* distorted hero image */

vec3 imageColor = texture2D(tMap,uv).rgb;

/* gold reflection */

vec3 gold = vec3(0.78,0.66,0.41);

float highlight = smoothstep(0.0,0.2,dist);

/* mandala reflection */

float mandalaPattern = mandala(vUv);

/* final color */

vec3 color = mix(imageColor,gold,highlight*0.15);

color += mandalaPattern * 0.08;

/* transparent water */

gl_FragColor = vec4(color,0.45);

}

`,

uniforms:{
uTime:{ value:0 },
uCenter:{ value:[0.5,0.5] },
tMap:{ value:texture }
}

})

const mesh = new Mesh(gl,{ geometry, program })
mesh.setParent(scene)

/* ------------------------- */
/* RESIZE */
/* ------------------------- */

function resize(){

renderer.setSize(container.clientWidth,container.clientHeight)

}

window.addEventListener("resize",resize)

resize()

let start = performance.now()

/* ------------------------- */
/* RIPPLE */
/* ------------------------- */

function triggerDrop(x:number,y:number){

program.uniforms.uCenter.value = [x,y]

start = performance.now()

}

/* ripple every 20 seconds */

setInterval(()=>{

triggerDrop(0.5,0.5)

},20000)

/* ripple on click */

container.addEventListener("click",(e)=>{

const rect = container.getBoundingClientRect()

const x = (e.clientX - rect.left) / rect.width
const y = 1 - (e.clientY - rect.top) / rect.height

triggerDrop(x,y)

})

/* ------------------------- */
/* ANIMATION LOOP */
/* ------------------------- */

function update(t:number){

program.uniforms.uTime.value = (t-start)*0.001

renderer.render({ scene, camera })

requestAnimationFrame(update)

}

requestAnimationFrame(update)

},[])

return(

<div
ref={containerRef}
className="absolute inset-0 pointer-events-auto z-[2]"
/>

)

}