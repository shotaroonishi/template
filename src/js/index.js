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
