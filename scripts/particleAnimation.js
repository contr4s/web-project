document.addEventListener("DOMContentLoaded", async () => {
    await window.tsParticles.load("tsparticles", {
      particles: {
        number: { // количество частиц
          value: 44,
          density: { // плотность частиц
            enable: true,
            value_area: 400
          }
        },
        color: { // цвет частиц
          value: "#81b6ee"
        },
        shape: { // форма частиц
          type: "circle",
        },
        opacity: { // прозрачность частиц
          value: 0.6,
          random: true, // рандомная прозрачность
          anim: { // анимация плавного изменения прозрачности
            enable: true,
            speed: 0.1, // скорость анимации
            opacity_min: 0.2, // минимальная прозрачность
          }
        },
        size: { // размер частиц
          value: 5, 
          random: true, // рандомный размер
          anim: { // анимация плавного изменения размера
            enable: true,
            speed: 0.1, // скорость анимации
            size_min: 1, // минимальный размер
          }
        },
        move: { // движение частиц
          enable: true,
          speed: 1.5, // скорость движения
          direction: "bottom", // направление движения
          random: false, // не случайное движение
          straight: false, // не вертикально вниз движение
          bounce: false, // не отскакивать от стенок
        }
      }
    });
});
