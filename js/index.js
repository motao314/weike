/* hover动画 */
(function (){
    let animates = document.querySelectorAll(".animate");
    animates.forEach(item => {
        item.addEventListener("animationend",end);
        item.addEventListener("mouseenter",function(){
            this.classList.remove("animation-start");
            this.classList.add("animation-start");
        });
    });
    function end(){
        // item.removeEventListener("animationend",end);
        this.classList.remove("animation-start");
    }
})();
/* 导航的下划线跟随 */
(function(){
    let indexNavs = document.querySelectorAll(".index-nav div");
    let line = document.querySelector(".index-nav .line");
    let active = document.querySelector(".index-nav .active");
    moveLine(active);
    indexNavs.forEach(item=>{
        item.onmouseenter = function(){
            moveLine(item);
        };
        item.onmouseleave = function(){
            moveLine(active);
        };
    });
    function moveLine(el){
        mTween.stop(line);
        mTween({
            el: line,
            fx: "backOut",
            duration: {
                multiple: 1.6,
                min: 400,
                max: 800
            },
            attrs: {
                width: el.offsetWidth,
                left: el.offsetLeft
            }
        });
    }
})();

/* 课程列表交互 */
(function(){
    let courseList = document.querySelector(".course-list");
    let courses = courseList.querySelectorAll("ul li");
    courses.forEach(item=>{
        courseAnimate(item);
    });
})();


/* 课程交互 */
function courseAnimate(course){
    const maxDeg = 10;
    const courseInner = course.children[0];
    courseInner.style.transition = ".1s";
    course.addEventListener("mouseenter",function(e){
        courseInner.style.transition = ".3s";
        courseInner.style.boxShadow = "0 0 15px rgba(0,0,0,.5)";
        animation(e);
    });
    course.addEventListener("mousemove",function(e){
        courseInner.style.transition = ".1s";
        animation(e);
    });
    course.addEventListener("mouseleave",function(e){
        courseInner.style.transition = ".3s";
        courseInner.style.boxShadow = "none";
        css(courseInner,{
            rotateX: 0,
            rotateY: 0
        });
    });
    function animation(e){
        let cX = e.clientX;
        let cY = e.clientY;
        let center =  getElCenter(course);
        let degY = -(center.x - cX)/(course.offsetWidth/2)*maxDeg;
        let degX = (center.y - cY)/(course.offsetHeight/2)*maxDeg;
        css(courseInner,{
            rotateX: degX,
            rotateY: degY
        });  
    }
}

// 获取元素中心相对可视区的坐标
function getElCenter(el){
    let rect = el.getBoundingClientRect();
    return {
        x: rect.left + rect.width/2,
        y: rect.top + rect.height/2
    }
}