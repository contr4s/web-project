document.addEventListener("DOMContentLoaded", async () => {
    await window.tsParticles.load("tsparticles", {
      particles: {
        number: {
          value: 44,
          density: {
            enable: true,
            value_area: 400
          }
        },
        color: {
          value: "#81b6ee"
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.4,
          random: true,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 5,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: "bottom",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        }
      }
    });
});
