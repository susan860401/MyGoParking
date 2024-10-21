import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/all';

export function scrollanimation(){
    LoadSVG();
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(MotionPathPlugin);


    // 
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



    ScrollTrigger.create({
        trigger: ".panel_search",
        start: "top bottom",
        endTrigger:".footer", 
        end: "17% bottom", // 200px past the start 
        // pin: "#car_container",
        // pinSpacer:false,
        onEnter: () => {
            gsap.set("#car_container", { backgroundImage: "url('src/images/road.png')"});
            //gsap.set("#car_container", { backgroundColor: "blue"});
        },
        onUpdate: (self) => {
        // 獲取滾動的進度
        const progress = self.progress; // 進度 0 到 1
        // 根據進度計算車子移動距離
        const moveDistance = progress * 100; // 根據需要調整比例
        // 更新車子的位置
        //gsap.set("#car_path", { x: `-${moveDistance}vw` }); //這是立即性
        gsap.to("#car_path", { duration: 0.5, x: `-${moveDistance}vw`, y: 0, opacity: 1 });
        // gsap.set("#car_container", { backgroundColor: 'gray'});
        // gsap.set(".view-point",{opacity:'1'});
        // 計算建築物的移動距離
        const totalBuildingMoveDistance = progress * (buildingWidth * buildingCount);
        //gsap.set(buildings, { x: `${totalBuildingMoveDistance}px` });
        gsap.to(buildings, { duration: 0.5, x: `${totalBuildingMoveDistance}px`, y: 0, opacity: 1 });
        // const buildingMoveDistance = moveDistance * (buildingWidth * buildingCount / (buildingWidth * buildingCount * 2)); // 調整比例
        // gsap.set(buildings, { x: `${buildingMoveDistance}px` });
        gsap.set("#car_container", { backgroundImage: "url('src/images/road.png')"});
        },
        onLeave: () => {
            gsap.set("#car_container", { backgroundImage:"none"});
        }
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
    
    gsap.set(buildings,{right:"0%"})
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

function LoadSVG(){
    fetch("src/images/car.svg")
    .then((response) => {return response.text();})
    .then((svg)=>{
        // console.log(svg)
        document.getElementById("car").innerHTML=svg;
    });
}