import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function scrollanimation(){
    gsap.registerPlugin(ScrollTrigger);


    let sections = gsap.utils.toArray(".panel");

    gsap.set(".panels",{x:"-400vw"})
    let scrollTween = gsap.to(sections, {
        xPercent: +100 * (sections.length - 1),
        ease: "none", // <-- IMPORTANT!
        scrollTrigger: {
        trigger: ".panels",
        pin: true,
        scrub: 2,
        // snap: {
        //     snapTo: (value) => Math.round(value * (sections.length - 1)) / (sections.length - 1), // 精確對齊每個區塊
        //     duration: {min: 0.2, max: 0.5},  // 調整對齊動畫的持續時間
        //     ease: "power1.inOut"             // 平滑對齊過渡
        // },
        // end: "+=3000"
        end: () => "+=" + (sections.length * window.innerWidth)
        }
    });
    gsap.set(".car-parked", {x:"+10vw",y:""});
    gsap.set(".box-1, .box-2", {x:"-20vw",y:"10vh"});
    ScrollTrigger.defaults({markers: {startColor: "white", endColor: "white"}});

    // red section
    gsap.to(".box-1", {
    y: "-2vh",
    x: "-60vw",
    duration: 2,
    // ease: "elastic",
    ease:"none",
    scrollTrigger: {
        // trigger: ".box-1",
        trigger: ".red",
        containerAnimation: scrollTween,
        // start: "left center",
        start: "center 51%",
        end:"center 20%",
        toggleActions: "play none none reset",
        // toggleActions:"play reverse reverse reset",
        // scrub: true,
        id: "1",
    }
    });

    
    // 首先，將車輛移動到第一個位置
    // 首先，將車輛向前移動一小段
    // GSAP動畫設定
    gsap.to(".car-parked", {
        x: "20vw", // 向右移動一小段
        y: "-20vh",
        duration: 1,
        ease: "none",
        scrollTrigger: {
            trigger: ".red", // 觸發器
            containerAnimation: scrollTween,
            start: "center 51%", // 開始時的參考點
            end: "center 20%", // 離開觸發器的點
            toggleActions: "play none none reset",
            id:"car",
        }
    });
    



    




    
    




    // gray section
    gsap.to(".box-2", {
    y: -120,
    backgroundColor: "#1e90ff",
    ease: "none",
    scrollTrigger: {
        trigger: ".box-2",
        // trigger: ".gray",
        containerAnimation: scrollTween,
        start: "center 65%",
        end: "center 20%",
        scrub: true,
        id: "2"
    }
    });

    // purple section
    ScrollTrigger.create({
    trigger: ".box-3",
    containerAnimation: scrollTween,
    toggleClass: "active",
    start: "center 60%",
    id: "3"
    });

    // green section
    ScrollTrigger.create({
    trigger: ".green",
    containerAnimation: scrollTween,
    start: "center 65%",
    end: "center 51%",
    onEnter: () => console.log("enter"),
    onLeave: () => console.log("leave"),
    onEnterBack: () => console.log("enterBack"),
    onLeaveBack: () => console.log("leaveBack"),
    onToggle: self => console.log("active", self.isActive),
    id: "4"
    });

    // only show the relevant section's markers at any given time
    gsap.set(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end", {autoAlpha: 0});
    ["red","gray","purple","green"].forEach((triggerClass, i) => {
    ScrollTrigger.create({
        trigger: "." + triggerClass,
        containerAnimation: scrollTween,
        start: "right 30%",
        end: i === 3 ? "right right" : "left 30%",
        markers: false,
        onToggle: self => gsap.to(".marker-" + (i+1), {duration: 0.25, autoAlpha: self.isActive ? 1 : 0})
    });
    });
}
