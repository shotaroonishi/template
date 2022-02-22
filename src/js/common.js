$(function () {
  // #で始まるリンクをクリックしたら実行されます
  $('a[href^="#"]').click(function () {
    // スクロールの速度
    var speed = 400; // ミリ秒で記述
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? "html" : href);
    var position = target.offset().top;
    $("body,html").animate(
      {
        scrollTop: position,
      },
      speed,
      "swing"
    );
    return false;
  });
});

$(function () {
  $("#page_top").click(function () {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      400
    );
    return false;
  });
});

$("#js-btn").click(function () {
  $("#js-drawer").toggleClass("active");
});

$(".slick01").slick({
  autoplay: true, // 自動再生を設定
  autoplaySpeed: 2000, // スライド切り替えの時間を設定
  dots: true, // ドットインジケーターの表示
  infinite: true, // スライドのループを有効にするか
  slidesToShow: 3, // 表示するスライド数を設定
  slidesToScroll: 1, // スクロールするスライド数を設定
  responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
});
