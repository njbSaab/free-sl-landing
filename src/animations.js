gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Анимация для каждого .h1-title индивидуально
gsap.utils.toArray(".h1-title").forEach((title) => {
  gsap.from(title, {
    opacity: 0,
    y: -50,
    duration: 1,
    ease: "bounce.out",
    scrollTrigger: {
      trigger: title, // Каждый заголовок — свой триггер
      start: "top 80%", // Начать, когда верх заголовка достигает 80% вьюпорта
      toggleActions: "play none none none", // Запуск только при входе
    },
  });
});

gsap.utils.toArray(".h2-title").forEach((subTitle) => {
  gsap.from(subTitle, {
    opacity: 0,
    scale: 0.8,
    rotation: 10,
    duration: 0.8,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: subTitle,
      start: "top 80%",
    },
  });
});

gsap.utils.toArray(".text-anim-l").forEach((text) => {
  gsap.from(text, {
    opacity: 0,
    x: -100,
    filter: "blur(5px)",
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: text,
      start: "top 80%",
    },
  });
});

gsap.utils.toArray(".text-anim-r").forEach((text) => {
  gsap.from(text, {
    opacity: 0,
    x: 100,
    filter: "blur(5px)",
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: text,
      start: "top 80%",
    },
  });
});

gsap.from(".card-list-anim", {
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.2,
  ease: "power3.out",
  scrollTrigger: { trigger: ".card-list-anim", start: "top 60%" },
});

// Анимации для левого и правого изображений без классов
gsap.fromTo(
  ".social-decor .img:first-child img",
  {
    xPercent: -50, // Смещено влево
  },
  {
    xPercent: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".social-decor",
      start: "top 80%",
      end: "bottom 20%",
      scrub: true,
    },
  }
);

gsap.fromTo(
  ".social-decor .img:last-child img",
  {
    xPercent: 50, // Смещено вправо
  },
  {
    xPercent: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".social-decor",
      start: "top 80%",
      end: "bottom 20%",
      scrub: true,
    },
  }
);

// Левый декор футера: поднимается снизу вверх, не опускаясь ниже естественного положения
gsap.utils.toArray(".build-decor-left-anim").forEach((img) => {
  gsap.fromTo(
    img,
    {
      bottom: "-50%", // Стартует спрятанным вниз
    },
    {
      bottom: "0%", // Поднимается навстречу, но не выше естественного положения
      ease: "none",
      scrollTrigger: {
        trigger: ".free",
        start: "top 50%", // Начинает подъём, когда секция дошла до половины экрана
        end: "bottom bottom", // ...и доезжает ровно к низу страницы
        scrub: true,
      },
    }
  );
});
gsap.utils.toArray(".hero-anim").forEach((img) => {
  gsap.fromTo(
    img,
    {
      xPercent: 40, // Смещено влево
    },
    {
      xPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: img, // Триггер — сам элемент
        start: "top 100%",
        end: "top 40%",
        scrub: 1.5, // Плавная анимация с инерцией, привязанная к скроллу
      },
    }
  );
});

gsap.to(".why-text-anim", {
  yPercent: 30,
  ease: "none",
  scrollTrigger: {
    trigger: ".why-list",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});

// 3. p: Печатный эффект
// gsap.fromTo(
//   ".why-text-anim",
//   {
//     text: "",
//   },
//   {
//     text: { value: (target) => target.textContent },
//     duration: 1.5,
//     ease: "none",
//     scrollTrigger: {
//       trigger: ".why",
//       start: "top 0%",
//     },
//   }
// );
// 4. .list-anim: Появление всего списка с лёгким масштабированием
gsap.from(".list-anim", {
  opacity: 0,
  scale: 0.9,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".list-anim",
    start: "top 80%",
  },
});
// 5. .list-item-anim: Последовательное появление элементов списка
gsap.from(".list-item-anim", {
  opacity: 0,
  x: 50,
  duration: 0.6,
  stagger: 0.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".list-anim",
    start: "top 80%",
  },
});
// Пульсация для .hero-button
gsap.to(".hero-button", {
  scale: 1.05,
  duration: 0.8,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

// gsap.to("#videox", {
//   yPercent: 0,
//   ease: "none",
//   scrollTrigger: {
//     trigger: ".banner",
//     start: "top bottom",
//     end: "bottom top",
//     scrub: true,
//   },
// });
// document.querySelector("#videox").addEventListener("mouseenter", () => {
//   gsap.to("#videox", {
//     scale: 1.05,
//     filter: "brightness(1.2)",
//     duration: 0.4,
//     ease: "power2.out",
//   });
// });
// document.querySelector("#videox").addEventListener("mouseleave", () => {
//   gsap.to("#videox", {
//     scale: 1,
//     filter: "brightness(1)",
//     duration: 0.4,
//     ease: "power2.out",
//   });
// });
// Параллакс-анимация для .img-parallax
gsap.utils.toArray(".img-parallax-top").forEach((img) => {
  gsap.fromTo(
    img,
    {
      yPercent: 0,
    },
    {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
});
gsap.utils.toArray(".img-parallax-top-looking").forEach((img) => {
  gsap.fromTo(
    img,
    {
      bottom: "-200px", // Начальная позиция: -15% от низа
    },
    {
      bottom: "0px", // Конечная позиция: 0% (естественное положение)
      ease: "none",
      scrollTrigger: {
        trigger: ".looking",
        start: "top bottom",
        end: "center",
        scrub: true,
      },
    }
  );
});
gsap.utils.toArray(".img-parallax-build-decor-right").forEach((img) => {
  gsap.fromTo(
    img,
    {
      top: "0vw", // Стартует не выше нуля — в минус не уходит
    },
    {
      top: "10vw", // Съезжает вниз, сопровождая скролл
      ease: "none",
      scrollTrigger: {
        trigger: ".free",
        start: "top bottom", // Сопровождает с появления секции...
        end: "bottom bottom", // ...до самого низа страницы
        scrub: true,
      },
    }
  );
});
gsap.utils.toArray(".img-parallax-top-min").forEach((img) => {
  gsap.fromTo(
    img,
    {
      bottom: "-15%", // Начальная позиция: -15% от низа
    },
    {
      bottom: "0%", // Конечная позиция: 0% (естественное положение)
      ease: "none",
      scrollTrigger: {
        trigger: img, // Триггер — сам элемент
        start: "top bottom", // Начать, когда верх элемента входит в нижнюю часть вьюпорта
        end: "bottom top", // Закончить, когда низ элемента выходит из верхней части вьюпорта
        scrub: true, // Плавная анимация, привязанная к скроллу
      },
    }
  );
});
gsap.utils.toArray(".img-parallax-bottom").forEach((img) => {
  gsap.fromTo(
    img,
    {
      yPercent: 0,
    },
    {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
});
gsap.utils.toArray(".img-parallax-bottom-min").forEach((img) => {
  gsap.fromTo(
    img,
    {
      yPercent: 0,
    },
    {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
});
gsap.utils.toArray(".img-parallax-about").forEach((img) => {
  gsap.fromTo(
    img,
    {
      yPercent: -15,
    },
    {
      yPercent: 30, // Уезжает в самый низ, «провожая» при скролле
      ease: "power1.in", // Медленный старт, разгон к концу — без стыка фаз
      scrollTrigger: {
        trigger: img,
        start: "top center", // Начинает, когда верх картинки на середине экрана
        end: "center top", // Заканчивает, когда центр картинки уходит за верх
        scrub: 1.5, // Плавное «догоняющее» движение с инерцией
      },
    }
  );
});
gsap.utils.toArray(".text-parallax-bottom").forEach((text, index) => {
  gsap.fromTo(
    text,
    {
      yPercent: 0,
    },
    {
      yPercent: 10,
      ease: "none",
      scrollTrigger: {
        trigger: text,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
});
gsap.utils.toArray(".text-parallax-bottom-max").forEach((text, index) => {
  gsap.fromTo(
    text,
    {
      yPercent: 0,
    },
    {
      yPercent: 50,
      ease: "none",
      scrollTrigger: {
        trigger: text,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
});
gsap.utils.toArray(".text-parallax-top").forEach((text, index) => {
  gsap.fromTo(
    text,
    {
      yPercent: 0,
    },
    {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: text,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
});
// Обновление ScrollTrigger после загрузки
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

// // 6. .img-anim-hero: Появление с размытием и вращением
// gsap.from(".img-anim-hero", {
//   opacity: 0,
//   filter: "blur(10px)",
//   rotation: 15,
//   duration: 1,
//   ease: "power3.out",
//   scrollTrigger: {
//     trigger: ".img-anim-hero",
//     start: "top 80%",
//   },
// });

// // 7. .img-anim-hero-bg: Параллакс-эффект для фона

// // 8. Ховер-эффект для .img-anim-hero
// document.querySelectorAll(".img-anim-hero").forEach((img) => {
//   img.addEventListener("mouseenter", () => {
//     gsap.to(img, {
//       scale: 1.1,
//       rotation: 5,
//       duration: 0.4,
//       ease: "power2.out",
//     });
//   });
//   img.addEventListener("mouseleave", () => {
//     gsap.to(img, {
//       scale: 1,
//       rotation: 0,
//       duration: 0.4,
//       ease: "power2.out",
//     });
//   });
// });

// 9. Timeline для hero-секции (h2, h3, p, .img-anim-hero)
// const heroTimeline = gsap.timeline({
//   scrollTrigger: {
//     trigger: ".hero-section",
//     start: "top 80%",
//   },
// });

// heroTimeline
//   .from(".hero-title", {
//     opacity: 0,
//     x: -100,
//     duration: 0.8,
//     ease: "power2.out",
//   })
//   .from(
//     "h3",
//     { opacity: 0, x: 100, duration: 0.8, ease: "power2.out" },
//     "-=0.4"
//   )
//   .from("p", { opacity: 0, y: 50, duration: 0.8, ease: "power2.out" }, "-=0.4")
//   .from(".img-anim-hero", {
//     opacity: 0,
//     scale: 0.5,
//     duration: 1,
//     ease: "back.out(1.7)",
//   });
