"use client"

import Particles from "@tsparticles/react"

export default function SmokeText() {

  return (

    <div className="relative flex items-center justify-center h-[160px] w-full">

      <Particles
        id="smoke"
        className="absolute inset-0"
        options={{
          fullScreen:false,

          particles:{
            number:{ value:100 },
            color:{ value:"#ffffff" },
            opacity:{ value:0.35 },
            size:{ value:{ min:2, max:5 } },

            move:{
              enable:true,
              speed:0.5,
              random:true,
              outModes:{
                default:"out"
              }
            }
          },

          interactivity:{
            events:{
              onHover:{
                enable:true,
                mode:"repulse"
              }
            },
            modes:{
              repulse:{
                distance:140
              }
            }
          }
        }}
      />

      <h1 className="font-cursive hero-hindi brand-glow text-white text-[90px] md:text-[140px] tracking-widest relative z-10">
        पोकर
      </h1>

    </div>
  )
}