"use strict";

$(".slick01").slick({
  autoplay: true,
  // 自動再生を設定
  autoplaySpeed: 2000,
  // スライド切り替えの時間を設定
  dots: true,
  // ドットインジケーターの表示
  infinite: true,
  // スライドのループを有効にするか
  slidesToShow: 3,
  // 表示するスライド数を設定
  slidesToScroll: 1,
  // スクロールするスライド数を設定
  responsive: [{
    breakpoint: 960,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1
    }
  }]
});