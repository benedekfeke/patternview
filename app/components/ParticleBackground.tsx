'use client';

import {
  type Container,
  type ISourceOptions
} from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useMemo, useState } from "react";

const ParticleBackground = ({darkMode}: {darkMode: boolean}) => {
  const [init, setInit] = useState(false);

  const colors = {
    light: {
      background: "#ffffff",
      particles: "#8e51ff",
    },
    dark: {
      background: "#09090b",
      particles: "#7f22fe",
    },
  }

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      fpsLimit: 30,
      background: { color: darkMode ? colors.dark.background : colors.light.background },
      particles: {
        color: {
          value: darkMode ? colors.dark.particles : colors.light.particles,
        },
        number: { value: 110 },
        size: { value: {min: 1, max: 3} },
        move: { enable: true, speed: 1, random: true },
        opacity: {
          value: {min: .1, max: 1}
        }
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "attract",
          },
        },
        modes: {
          attract: {
            distance: 600,
            duration: .2,
            // speed: 2,
          },
        }
      }
    }),
    [],
  );

  if (init) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -10,
          pointerEvents: "none", // so it doesn't block interactions
        }}
      >
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </div>
    );
  }

  return null;
};

export default ParticleBackground;
