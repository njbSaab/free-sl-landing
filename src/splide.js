var splide = new Splide(".splide", {
  type: "loop", // Включает бесконечную прокрутку
  perPage: 1, // Показывает 1 элемент за раз
  perMove: 1, // Перемещение на 1 элемент за раз
  padding: {
    right: "30%", // Показывает половину следующего элемента справа
  },
  focus: "center", // Центрирует основной элемент
  autoplay: false, // Отключает автопрокрутку (включите, если нужно)
  breakpoints: {
    500: {
      perPage: 1, // 1 слайд на экранах до 500px
      padding: 0, // Убираем padding для центрирования
      focus: "center", // Центрируем слайд
    },
  },
});

var bar = splide.root.querySelector(".my-slider-progress-bar");

if (bar) {
  splide.on("mounted move", function () {
    var end = splide.Components.Controller.getEnd() + 1;
    var rate = Math.min((splide.index + 1) / end, 1);
    bar.style.width = String(100 * rate) + "%";
  });
} else {
  console.error("Progress bar element not found");
}

splide.mount();
