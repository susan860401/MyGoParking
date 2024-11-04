import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/all";

export async function scrollanimation() {
  await LoadSVG();
  
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(MotionPathPlugin);

  // 測試用SVGPath
  // gsap.registerPlugin(MotionPathPlugin);
  // gsap.to("#element", {
  //     duration: 5,
  //     motionPath: {
  //     path: "#myPath",
  //     align: "#myPath",
  //     autoRotate: true
  //     }
  // });
  //
  // gsap.to(".view-point", { backgroundColor: "#87CEEB" });
  // gsap.to(".main_stars",{opacity:"0"});
  ScrollTrigger.create({
    trigger: ".panel_search",
    start: "top bottom",
    endTrigger: ".footer",
    end: "17% bottom", // 200px past the start
    onEnter: () => {
      gsap.to(".main_stars", { opacity: "1" });
    },
    onUpdate: (self) => {
      // 獲取滾動的進度
      const progress = self.progress; // 進度 0 到 1
      // 根據進度計算車子移動距離
      const moveDistance = progress * 100; // 根據需要調整比例
      // 更新車子的位置
      gsap.to("#car_path", {
        duration: 0.5,
        x: `-${moveDistance * 2}vw`,
        y: 0,
        opacity: 1,
      });
      // 更新車子旁邊的對話雲的位置
      //console.log(progress)
      if (progress === 0) {
        gsap.to(".question", { duration: 0.5, opacity: 0 });
      } else if (0 < progress && progress < 0.15) {
        gsap.to(".question", {
          duration: 0.5,
          x: `-${moveDistance}vw`,
          opacity: 1,
        });
      } else if (0.4 < progress && progress < 0.6) {
        gsap.to(".question", {
          duration: 0.5,
          x: `-${moveDistance}vw`,
          opacity: 1,
        });
      } else if (0.8 < progress && progress < 1) {
        // console.log("測試測試"); 
      } else {
        gsap.to(".question", {
          duration: 0.5,
          x: `-${moveDistance}vw`,
          y: 0,
          opacity: 0,
        });
      }
      // 計算道路距離
      gsap.to("#car_container", {
        duration: 0.5,
        x: `${moveDistance}vw`,
        y: 0,
        opacity: 1,
      });
      // 計算建築物的移動距離
      const totalBuildingMoveDistance =
        progress * (buildingWidth * buildingCount);
      gsap.to(buildings, {
        duration: 0.5,
        x: `${totalBuildingMoveDistance}px`,
        y: 0,
        opacity: 1,
        ease:'power1.out',
      });

      gsap.set("#car_container", {
        backgroundImage: "url('src/images/road.png')",
      });

      //太陽跟月亮的旋轉
      const rotationAngle = progress * 360;
      gsap.to(".main_stars", {
        duration: 0.5,
        rotation: rotationAngle, // 讓建築物同步旋轉
        // opacity:1
      });

      //天空背景顏色
      let color,mountainColor;
      let color_progress = progress * 1.1;
      if (color_progress <= 0.3) {
        // 保持 skyblue 顏色
        color = "#87CEEB"; // skyblue
        //山的顏色
        mountainColor = "#3EAE57"; // 綠色
      } else if (color_progress > 0.3 && color_progress <= 0.35) {
        // 從 skyblue 到淡橙色過渡
        color = gsap.utils.interpolate("#87CEEB", "#FFEF99",(color_progress - 0.3) * 20); // 淡黃色過渡
        mountainColor = gsap.utils.interpolate("#3EAE57", "#6B8E23", (color_progress - 0.3) * 20); // 深綠色
      } else if (color_progress > 0.35 && color_progress <= 0.4) {
        // 從淡橙色到 #FF8600 過渡
        color = gsap.utils.interpolate("#FFEF99", "#FF8600", (color_progress - 0.35) * 10 );
        mountainColor = gsap.utils.interpolate("#6B8E23", "#3B5A1B", (color_progress - 0.35) * 10); // 更深的綠色
      } else if (color_progress > 0.4) {
        // 從橙色到黑色過渡
        color = gsap.utils.interpolate( "#FF8600", "#000", (color_progress - 0.4) * 10 );
        mountainColor = "#121C08";
      } 



      gsap.to(".view-point", { backgroundColor: color });
      gsap.to(".mountain path[fill='#3EAE57']", { fill: mountainColor});
    },
    onLeave: () => {
      gsap.set(".main_stars", { duration: 0.5, opacity: "0" });
    },
    onEnterBack: () => {
      gsap.set(".main_stars", { duration: 0.5, opacity: "1" });
    },
  });

  //這段是要拿來放故事的
  ScrollTrigger.create({
    trigger: ".panel_search",
    start: "50% bottom",
    //endTrigger:"",
    end: "bottom bottom",
    toggleActions: "play reverse play reverse", // 進入時播放，離開時反轉，回滾時再次播放
    animation: gsap.to(".chat", {
      // 將動畫直接放入
      duration: 0.5,
      opacity: 0.8,
      ease: "none",
      // scrub:1,
    }),
    onEnter: () => {
      gsap.set(".story", { textContent: "想要找停車場嗎?" });
    },
    onEnterBack: () => {
      gsap.set(".story", { textContent: "想要找停車場嗎?" });
    },
  });
  //這段是跳出功能
  ScrollTrigger.create({
    trigger: ".panel_search_follow",
    start: "top bottom",
    //endTrigger:"",
    end: "50% bottom",
    toggleActions: "play reverse play reverse", // 進入時播放，離開時反轉，回滾時再次播放
    animation: gsap.to("#phone1", {
      // 將動畫直接放入
      duration: 0.5,
      opacity: 1,
      ease: "none",
      // scrub:1,
    }),
    onEnter: () => {
      document.getElementById("phone1").style.zIndex = "3000";
      document.getElementById("phone2").style.zIndex = "-1";
    },
    onEnterBack: () => {
      document.getElementById("phone1").style.zIndex = "3000";
      document.getElementById("phone2").style.zIndex = "-1";
    },
  });
  // 這段是放停車位出現後被其他車子搶走
  ScrollTrigger.create({
    trigger: ".panel_search_follow",
    start: "bottom bottom",
    endTrigger: ".footer",
    end: "bottom bottom",
    toggleActions: "play reverse play reverse", // 進入時播放，離開時反轉，回滾時再次播放
    animation: gsap.to("#parked_car1", {
      // 將動畫直接放入
      duration: 0.5,
      left: "4vmin",
      opacity: 1,
      ease: "none",
      // scrub:1,
    }),
  });
  //搶車位的y軸偏移
  ScrollTrigger.create({
    trigger: ".panel_search_follow",
    start: "80% bottom",
    endTrigger: ".panel_reserve_follow",
    end: "50% bottom",
    toggleActions: "play reverse play reverse", // 進入時播放，離開時反轉，回滾時再次播放
    animation: gsap.to("#car_body", {
      // 將動畫直接放入
      duration: 0.5,
      y: "-3vmin",
      opacity: 1,
      ease: "none",
      // scrub:1,
    }),
  });
  //這段是要拿來放雲的
  ScrollTrigger.create({
    trigger: ".panel_search",
    start: "top bottom",
    endTrigger: ".panel_reserve",
    end: "top bottom",
    toggleActions: "play reverse play reverse", // 進入時播放，離開時反轉，回滾時再次播放
    animation: gsap.to(".sky", {
      // 將動畫直接放入
      duration: 1,
      opacity: 1,
      ease: "power1.out",
    }),
  });
  //這段是要拿來放預定文字的
  ScrollTrigger.create({
    trigger: ".panel_reserve",
    start: "25% bottom",
    //endTrigger:".panel_reserve_follow",
    end: "80% bottom",
    toggleActions: "play reverse play reverse", // 進入時播放，離開時反轉，回滾時再次播放
    animation: gsap.to(".chat", {
      // 將動畫直接放入
      duration: 0.5,
      opacity: 0.8,
      ease: "none",
      // scrub:1,
    }),
    onEnter: () => {
      gsap.set(".story", { textContent: "車位常常在眼前錯過嗎?" });
    },
    onLeave: () => {},
  });

  //這段放預約的提示
  ScrollTrigger.create({
    trigger: ".panel_reserve",
    start: "80% bottom",
    endTrigger: ".panel_reserve_follow",
    end: "50% bottom",
    toggleActions: "play reverse play reverse", // 進入時播放，離開時反轉，回滾時再次播放
    animation: gsap.to("#phone2", {
      // 將動畫直接放入
      duration: 0.5,
      opacity: 1,
      ease: "none",
      // scrub:1,
    }),
    onEnter: () => {
      document.getElementById("phone1").style.zIndex = "-1";
      document.getElementById("phone2").style.zIndex = "3000";
    },
    onEnterBack: () => {
      document.getElementById("phone1").style.zIndex = "-1";
      document.getElementById("phone2").style.zIndex = "3000";
    },
  });

  //這段是要拿來放星星的
  ScrollTrigger.create({
    trigger: ".panel_reserve",
    start: "top bottom",
    endTrigger: ".footer",
    end: "bottom bottom",
    toggleActions: "play reverse play reverse", // 進入時播放，離開時反轉，回滾時再次播放
    animation: gsap.to(".stars", {
      // 將動畫直接放入
      duration: 1,
      opacity: 1,
      ease: "power1.out",
    }),
  });

  //測試讓我的view-point 可以不要蓋到.footer
  const fixedDiv = document.querySelector(".view-point");
  const footer = document.querySelector(".footer");
  const footerHeight = footer.offsetHeight; // 獲取 footer 的高度
  // console.log(fixedDiv);
  // console.log(footer);
  ScrollTrigger.create({
    trigger: footer,
    start: "top bottom", // 當 footer 的頂部與 viewport 的頂部相接時觸發
    end: `+=${footerHeight}`, // 結束位置為 footer 高度
    onUpdate: (self) => {
      // 根據滾動的進度計算移動的距離
      const moveAmount = footerHeight * self.progress; // 計算應該向上移動的距離
      gsap.set(fixedDiv, { y: -moveAmount }); // 將 fixed div 向上移動
    },
    markers: false, // 可選，方便調試
  });

  gsap.to(".buildings", {
    scrollTrigger: {
      trigger: ".footer",
      start: "bottom top", // 當元素的頂部碰到視窗的頂部時觸發
      end: "+=500", // 固定的結束點，滾動 500px
      pin: true, // 立即 pin 該元素
      pinSpacing: false, // 可選：如果不想要額外的空間
      onEnter: () => {
        // console.log("pin有運作");
      },
    },
  });

  const buildings = document.querySelector(".buildings");
  const buildingWidth = document.querySelector(".building").offsetWidth;
  const buildingCount = buildings.children.length;

  // 生成克隆的元素並放在原始元素的右邊
  for (let i = 0; i < buildingCount; i++) {
    const clone = buildings.children[i].cloneNode(true);
    buildings.appendChild(clone); // 確保克隆的元素在原始元素的右邊
  }

  // 設置建築物的父容器寬度，以便它能夠容納兩組建築物
  buildings.style.width = `${buildingWidth * buildingCount * 2}px`;

  gsap.set(buildings, { right: "0%" });
  // 使用 GSAP 來控制從左到右的無縫滑動, 無限循環動畫
  // gsap.to(buildings, {
  //     x: `${buildingWidth * buildingCount}px`, // 向左移動整個容器的寬度
  //     duration: 20,  // 控制動畫速度
  //     ease: "linear",  // 線性動畫
  //     repeat: -1  // 無限循環
  // });

  // const carContainer = document.querySelector("#car_path");
  const viewContainer = document.querySelector(".view-container");

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: viewContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: true, // 使滾動和動畫同步
    },
  });

  const search_timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".panel_search",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
    },
  });

  //console.log(document.getElementById('#stars'))
}

export function killAnimation() {
  // 清理所有 ScrollTrigger 和 GSAP 動畫
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf("*");
}

//載入我需要的SVG, 有Car, Star,Mountain
//為了不讓HTML看起來擁腫, 所以使用fetch後再將它放置需要的位置
async function LoadSVG() {
  await fetch("src/images/car.svg")
    .then((response) => {
      return response.text();
    })
    .then((svg) => {
      // console.log(svg)
      document.getElementById("car_body").innerHTML = svg;
    });

  await fetch("src/images/stars.svg")
    .then((response) => {
      return response.text();
    })
    .then((svg) => {
      //console.log(svg)
      document.querySelector(".stars").innerHTML = svg;
      //設定svg內的star動畫
      const stars = document.querySelectorAll("#stars g");
      stars.forEach((star) => {
        const randomDelay = Math.random() * 2; // 隨機延遲時間（0 - 2秒）
        const randomDuration = 2 + Math.random() * 4; // 隨機持續時間（2 到 4 秒）
        //star.style.animationDelay = `${randomDelay}s`;
        // 如果需要使用 GSAP，這裡可以直接使用 GSAP 的動畫功能
        gsap.to(star, {
          opacity: 0, // 或其他你想要的屬性
          duration: randomDuration,
          repeat: -1,
          yoyo: true, // 讓動畫往返
          delay: randomDelay, // 隨機延遲
        });
      });
      // console.log(stars);
    });


    //載入山的背景, 要用svg, 因為我要改變山的顏色
    await fetch("src/images/background.svg")
    .then((response) => { return response.text()})
    .then((svg) => {
      // console.log(svg)
      document.getElementById("background").innerHTML = svg;
    });
}
