//套件js
import AOS from "aos"; //(滾動頁面動態載入元素效果)
import GLightbox from "glightbox";
import Isotope from "isotope-layout";
import Swiper from "swiper/bundle";

/**
 * Template Name: UpConstruction - v1.3.0
 * Template URL: https://bootstrapmade.com/upconstruction-bootstrap-construction-website-template/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  aos_init();
  // 獲取scrollTop按鈕元素
  const scrollTop = document.querySelector(".scroll-top");

  // 初始檢查顯示按鈕
  togglescrollTop(scrollTop);

  window.addEventListener("scroll", () => {
    togglescrollTop(scrollTop);
  });

  if (scrollTop) {
    scrollTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  } else {
    console.error("Element with class 'scroll-top' not found.");
  }

  /**
   * Mobile nav toggle(導覽列)
   */

  const mobileNavShow = document.querySelector(".mobile-nav-show");
  const mobileNavHide = document.querySelector(".mobile-nav-hide");

  document.querySelectorAll(".mobile-nav-toggle").forEach((el) => {
    el.addEventListener("click", function (event) {
      event.preventDefault();
      mobileNavToogle();
    });
  });

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavShow.classList.toggle("d-none");
    mobileNavHide.classList.toggle("d-none");
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navbar a").forEach((navbarlink) => {
    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll(".navbar .dropdown > a");

  navDropdowns.forEach((el) => {
    el.addEventListener("click", function (event) {
      if (document.querySelector(".mobile-nav-active")) {
        event.preventDefault();
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("dropdown-active");

        let dropDownIndicator = this.querySelector(".dropdown-indicator");
        dropDownIndicator.classList.toggle("bi-chevron-up");
        dropDownIndicator.classList.toggle("bi-chevron-down");
      }
    });
  });

  /**
   * Initiate glightbox:可能不需保留?直接放component的mounted?
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Porfolio isotope and filter
   */
  let portfolionIsotope = document.querySelector(".portfolio-isotope");

  if (portfolionIsotope) {
    let portfolioFilter = portfolionIsotope.getAttribute(
      "data-portfolio-filter"
    )
      ? portfolionIsotope.getAttribute("data-portfolio-filter")
      : "*";
    let portfolioLayout = portfolionIsotope.getAttribute(
      "data-portfolio-layout"
    )
      ? portfolionIsotope.getAttribute("data-portfolio-layout")
      : "masonry";
    let portfolioSort = portfolionIsotope.getAttribute("data-portfolio-sort")
      ? portfolionIsotope.getAttribute("data-portfolio-sort")
      : "original-order";

    window.addEventListener("load", () => {
      let portfolioIsotope = new Isotope(
        document.querySelector(".portfolio-container"),
        {
          itemSelector: ".portfolio-item",
          layoutMode: portfolioLayout,
          filter: portfolioFilter,
          sortBy: portfolioSort,
        }
      );

      let menuFilters = document.querySelectorAll(
        ".portfolio-isotope .portfolio-flters li"
      );
      menuFilters.forEach(function (el) {
        el.addEventListener(
          "click",
          function () {
            document
              .querySelector(
                ".portfolio-isotope .portfolio-flters .filter-active"
              )
              .classList.remove("filter-active");
            this.classList.add("filter-active");
            portfolioIsotope.arrange({
              filter: this.getAttribute("data-filter"),
            });
            if (typeof aos_init === "function") {
              aos_init();
            }
          },
          false
        );
      });
    });
  }

  /**
   * Init swiper slider with 2 slides at once in desktop view
   * 可能不需保留?直接放component的mounted?
   */
  new Swiper(".slides-2", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      400: {
        slidesPerView: 1,
        spaceBetween: 20,
      },

      1000: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
    },
  });

  /**
   * Initiate pURE cOUNTER
   */
  // new PureCounter();

  /**
   * Animation on scroll function and init
   */

  window.addEventListener("load", () => {
    aos_init();
  });
});

// 滑到最上方按鈕的顯示與隱藏
function togglescrollTop(scrollTop) {
  if (scrollTop) {
    window.scrollY > 100
      ? scrollTop.classList.add("active")
      : scrollTop.classList.remove("active");
  }
}

//初始化aos
function aos_init() {
  AOS.init({
    duration: 800,
    easing: "slide",
    once: true,
    mirror: false,
  });
}
