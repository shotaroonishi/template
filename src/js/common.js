document.addEventListener("DOMContentLoaded", function () {
  // #で始まるリンクをクリックしたら実行されます
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function () {
      // スクロールの速度
      var speed = 400; // ミリ秒で記述
      var href = this.getAttribute("href");
      var target =
        href === "#" || href === ""
          ? document.documentElement
          : document.querySelector(href);
      var position = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: position,
        behavior: "smooth",
      });
      return false;
    });
  });
});

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
document.addEventListener("DOMContentLoaded", () => {
  const pageTopBtn = document.querySelector("#page_top");
  pageTopBtn.addEventListener("click", scrollToTop);
});

const btn = document.querySelector("#js-btn");
const drawer = document.querySelector("#js-drawer");

if (btn && drawer) {
  const toggleDrawer = () => drawer.classList.toggle("active");

  btn.addEventListener("click", toggleDrawer);
}
