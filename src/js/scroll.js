import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function scrollanimation(){
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
        trigger: ".panel_search",
        start: "top bottom",
        endTrigger:".footer", 
        end: "top bottom", // 200px past the start 
        pin: "#car_container",
        pinSpacer:false,
        onUpdate: (self) => {
        // 獲取滾動的進度
        const progress = self.progress; // 進度 0 到 1

        // 根據進度計算車子移動距離
        const moveDistance = progress * 100; // 根據需要調整比例

        // 更新車子的位置
        gsap.set("#car_path", { x: `-${moveDistance}vw` });
        }
    });

    // const carContainer = document.querySelector("#car_path");
    const viewContainer = document.querySelector(".view-container");
    
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: viewContainer,
            start: "top top",
            end: "bottom bottom",
            scrub: true // 使滾動和動畫同步
        }
    });

    const search_timeline = gsap.timeline({
        scrollTrigger:{
            trigger:".panel_search",
            start:"top bottom",
            end:"bottom bottom",
            scrub:true
        }
    });
    
    
    timeline.to(".box1",{ x: 100})
    search_timeline.to(".box2",{x:"50vw",opacity:1,duration:1})


}


