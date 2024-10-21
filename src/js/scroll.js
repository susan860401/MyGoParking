import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/all';

export function scrollanimation(){
    LoadSVG();
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
    gsap.to(".view-point",{backgroundColor:"#87CEEB"});
    // gsap.to(".main_stars",{opacity:"0"});
    ScrollTrigger.create({
        trigger: ".panel_search",
        start: "top bottom",
        endTrigger:".footer", 
        end: "17% bottom", // 200px past the start 
        // pin: "#car_container",
        // pinSpacer:false,
        onEnter: () => {
            gsap.set("#car_container", { backgroundImage: "url('src/images/road.png')"});
            gsap.to(".main_stars",{opacity:"1"});
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

        //太陽跟月亮的旋轉
        const rotationAngle = progress * 360;
        gsap.to(".main_stars", { 
            duration: 0.5, 
            rotation: rotationAngle, // 讓建築物同步旋轉
            // opacity:1 
        });

        //天空背景顏色
        let color;
        let color_progress = progress * 1.1;
        /*
        if (color_progress <= 0.3) {
            // 當進度小於或等於 0.25 時，從 skyblue 到 skyblue (保持 skyblue)
            color = "#87CEEB";
        } else if (color_progress > 0.3 && color_progress <= 0.4) {
        // 當進度在 0.25 到 0.5 之間時，從 skyblue 到 #FF8600
        color = gsap.utils.interpolate("#87CEEB", "#FF8600", (progress - 0.3) * 7); // 調整速度
        } else if (color_progress > 0.4) {
        // 當進度大於 0.5 時，從 #FF8600 到 #000
        color = gsap.utils.interpolate("#FF8600", "#000", (progress - 0.4) * 10);
        }
        */
        if (color_progress <= 0.3) {
            // 保持 skyblue 顏色
            color = "#87CEEB"; // skyblue
        } else if (color_progress > 0.3 && color_progress <= 0.35) {
        // 從 skyblue 到淡橙色過渡
            color = gsap.utils.interpolate("#87CEEB", "#FFEF99", (color_progress - 0.3) * 20); // 淡黃色過渡
        } else if (color_progress > 0.35 && color_progress <= 0.4) {
        // 從淡橙色到 #FF8600 過渡
            color = gsap.utils.interpolate("#FFEF99", "#FF8600", (color_progress - 0.35) * 10);
        } else if (color_progress > 0.4) {
        // 從橙色到黑色過渡
            color = gsap.utils.interpolate("#FF8600", "#000", (color_progress - 0.4) * 10);
        }



        gsap.to(".view-point", { backgroundColor: color });

        },
        onLeave: () => {
            gsap.set("#car_container", { backgroundImage:"none"});
            gsap.set(".main_stars",{duration:0.5,opacity:"0"});
        },
        onEnterBack: () => {
            gsap.set(".main_stars",{duration:0.5,opacity:'1'});
        }
    });

    //這段是要拿來放搜尋文字的
    ScrollTrigger.create({
        trigger:".panel_search",
        start:"25% bottom",
        //endTrigger:"",
        end:"bottom bottom",
        onEnter: () => {
            console.log("進入panel_search")
        },
        onUpdate: () => {

        },
        onLeave: () => {
            console.log("離開panel_search")    
        },
        onEnterBack: () => {
            console.log("從end點進入panel_search")
        },
        onLeaveBack:() => {
            console.log("從trigger點離開")
        }
    });
    //這段是要拿來放雲的
    ScrollTrigger.create({
        trigger:".panel_search",
        start:"top bottom",
        endTrigger:".panel_reserve",
        end:"top bottom",
        onEnter: () => {
            console.log("進入panel_search")
        },
        onUpdate: () => {

        },
        onLeave: () => {
            console.log("離開panel_search")    
        },
        onEnterBack: () => {
            console.log("從end點進入panel_search")
        },
        onLeaveBack:() => {
            console.log("從trigger點離開")
        }
    });
    //這段是要拿來放預定文字的
    ScrollTrigger.create({
        trigger:".panel_reserve",
        start:"25% bottom",
        endTrigger:".footer",
        end:"top bottom",
        onEnter: () => {
            console.log("進入預定panel_search")
        },
        onUpdate: () => {

        },
        onLeave: () => {
            console.log("離開預定panel_search")    
        },
        onEnterBack: () => {
            console.log("從end點進入預定panel_search")
        },
        onLeaveBack:() => {
            console.log("從trigger點離開預定")
        }
    });
    //這段是要拿來放星星的
    ScrollTrigger.create({
        trigger:".panel_reserve",
        start:"top bottom",
        endTrigger:".footer",
        end:"top bottom",
        onEnter: () => {
            console.log("進入星星panel_search")
        },
        onUpdate: () => {

        },
        onLeave: () => {
            console.log("離開星星panel_search")    
        },
        onEnterBack: () => {
            console.log("從end點進入星星panel_search")
        },
        onLeaveBack:() => {
            console.log("從trigger點離開星星")
        }
    });


    gsap.to(".buildings", {
        scrollTrigger: {
            trigger: ".footer",
            start: "bottom top", // 當元素的頂部碰到視窗的頂部時觸發
            end: "+=500",     // 固定的結束點，滾動 500px
            pin: true,        // 立即 pin 該元素
            pinSpacing: false, // 可選：如果不想要額外的空間
            onEnter: () => {
                console.log("pin有運作")
            }
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