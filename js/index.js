/* hover动画 */
(function (){
    let animates = document.querySelectorAll(".animate");
    animates.forEach(item => {
        item.addEventListener("animationend",end);
        item.addEventListener("mouseenter",animation);
        if(item.classList.contains("auto-animate")){
            item.autoAnimateFn = function(){
                clearInterval(item.autoAnimate);
                item.autoAnimate = setInterval(()=>{
                    if(item.autoAnimateOff){
                        animation();
                    }
                },4000); 
            }
            item.autoAnimateFn();
            item.addEventListener("mouseenter",function(){
                clearInterval(item.autoAnimate);
            });
            item.addEventListener("mouseleave",function(){
                item.autoAnimateFn();  
            });
        }
        function animation(){
            item.classList.remove("animation-start");
            item.classList.add("animation-start");
        }
    });
    function end(){
        // item.removeEventListener("animationend",end);
        this.classList.remove("animation-start");
    }
})();
/* 导航的下划线跟随 */
(function(){
    let indexNavs = document.querySelectorAll(".index-nav div");
    let lines = document.querySelectorAll(".index-nav .line");
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
        lines.forEach(line=>{
            mTween.stop(line);
            let l = el.offsetLeft - line.offsetParent.offsetLeft;
            mTween({
                el: line,
                fx: "backOut",
                duration: {
                    multiple: 4.5,
                    min: 400,
                    max: 1200
                },
                attrs: {
                    width: el.offsetWidth,
                    left: l
                },
                s: 1.1
            });
        });
    }
})();

/* 课程列表交互 */
window.addEventListener("load",function(){
    let courseList = document.querySelector(".course-list");
    let courseUl = courseList.querySelector("ul");
    let loadingBtn = courseList.querySelector(".course-list-more .btn");
    let loading = courseList.querySelector(".course-list-more .loading"); 
    let loadingTimer = 0;
    let loadingScrollTimer = 0;
    let coursePage = 0;
    let coursePageLength = 6;
    css(loading,"scale",1);
    css(loadingBtn,"scale",0);

    /* 初始化获取数据 */
    loadingBtn.autoAnimateOff = false;
    loading.classList.add("open");
    getCoursesData();
    
    /*点击获取数据 */
    loadingBtn.addEventListener("click",function(){
        loadingBtn.classList.remove("animation-start");
        loadingBtn.autoAnimateOff = false;
        clearInterval(loadingBtn.autoAnimate);
        mTween({
            el: loadingBtn,
            attrs: {
                scale: 0
            },
            fx: "backIn",
            duration: 300,
            s: 2.7
         }); 
         mTween({
            el: loading,
            attrs: {
                scale: 1
            },
            fx: "easeOutStrong",
            duration: 300,
            cb(){
                loading.classList.add("open"); 
                clearInterval(loadingTimer);
                loadingTimer = setTimeout(()=>{
                    getCoursesData()
                },400);
            }
        });  
    });
    /* 生成更多课程 */
    function getCoursesData(){
        let nowData = [];
        let openList = [];
        nowData = data.filter((item,index)=>{
            return index>=coursePage*coursePageLength&&index<(coursePage+1)*coursePageLength
        });
        coursePage++;
        coursePageLength = 3;
        nowData.forEach(item=>{
            let newLi = createMore(item);
            courseUl.appendChild(newLi);
            courseAnimate(newLi);
            openList.push(newLi);
        });
        moveScroll();
        setTimeout(()=>{
            loadingTimer = setInterval(()=>{
                if(openList.length == 0){
                    clearInterval(loadingTimer);
                    mTween({
                        el: loading,
                        attrs: {
                            scale: 0
                        },
                        fx: "backIn",
                        duration: 300,
                        s: 2.7
                     }); 
                    if(coursePage*coursePageLength < data.length){
                         mTween({
                            el: loadingBtn,
                            attrs: {
                                scale: 1
                            },
                            fx: "easeOutStrong",
                            duration: 300,
                            cb(){
                                loadingBtn.autoAnimateOff = false;
                                loadingBtn.autoAnimateFn();
                            }
                        });
                    }
                } else {
                    let moveEl = openList.shift();
                    moveEl.classList.add("show");
                }
            },80)
        },200);
    }
    function moveScroll(){
        clearInterval(loadingScrollTimer);
        let rect = courseList.getBoundingClientRect();
        let target = rect.top + document.documentElement.scrollTop + rect.height - window.innerHeight;
        console.log(target);
        loadingScrollTimer = setInterval(()=>{
            let nowTop = document.documentElement.scrollTop;
            if(Math.abs(target -nowTop)<=5){
                document.documentElement.scrollTop = target;
                clearInterval(loadingScrollTimer);
            } else {
                nowTop += Math.round((target -nowTop)/10);
                document.documentElement.scrollTop = nowTop;
            }
        },20);
    }
    function createMore(data){
        let li = document.createElement("li");
        li.innerHTML = `
            <div class="course">
                <img src="${data.img}" />
                <h2 class="course-title">${data.title}</h2>
                <nav class="course-mask clear">
                    ${data.marks.map(item=>`<mark>${item}</mark>`).join("")}
                </nav>
                <div class="clear">
                    <span class="watch-nub">${data.watch}</span>
                    <span class="price">${data.price}</span>
                </div>
            </div>`;
        return li;    
    }
});

/* 课程交互 */
function courseAnimate(course){
    const maxDeg = 10;
    const courseInner = course.children[0];
    css(courseInner,{
        rotateX: 0,
        rotateY: 0,
        translateZ: 0
    });  
    course.addEventListener("mouseenter",function(e){
        courseInner.style.transformOrigin = "center center";
        mTween.stop(courseInner);
        css(courseInner,{
            rotateX: 0,
            rotateY: 0,
            translateZ: 0
        });
        courseInner.style.transition = ".3s box-shadow";
        animation(e,3,300);
    });
    course.addEventListener("mousemove",function(e){
        courseInner.style.transition = "none";
        animation(e,3,0);
    });
    course.addEventListener("mouseup",function(e){
        courseInner.style.transition = ".3s box-shadow";
        animation(e,3,300);
    });
    course.addEventListener("mousedown",function(e){
        courseInner.style.transition = ".3s box-shadow";
        courseInner.style.boxShadow = "none";
        mTween.stop(courseInner);
        mTween({
            el: courseInner,
            fx: "easeOutStrong",
            duration: {
                multiple: 3,
                min: 300
            },
            attrs: {
                rotateX: 0,
                rotateY: 0,
                translateZ: -20
            }
        }); 
    });
    course.addEventListener("mouseleave",function(e){
        courseInner.style.transition = ".5s box-shadow";
        courseInner.style.boxShadow = "none";
        mTween.stop(courseInner);
        mTween({
            el: courseInner,
            fx: "easeOutStrong",
            duration: {
                multiple: 3,
                min: 500
            },
            attrs: {
                rotateX: 0,
                rotateY: 0,
                translateZ: 0
            }
        }); 
    });
    function animation(e,multiple,min){
        let cX = e.clientX;
        let cY = e.clientY;
        let center =  getElCenter(course);
        let degY = -(center.x - cX)/(course.offsetWidth/2)*maxDeg;
        let degX = (center.y - cY)/(course.offsetHeight/2)*maxDeg;
        let rad = Math.atan2(center.y - cY,center.x - cX);
        let xR = Math.cos(rad)*10;
        let yR = Math.sin(rad)*10;
        courseInner.style.boxShadow = `${xR}px ${yR}px 10px rgba(0,0,0,.1)`;
        //console.log(degX,degY);
        mTween({
            el: courseInner,
            fx: "easeOutStrong",
            duration: {
                multiple: multiple,
                min: min,
                max: 500
            },
            attrs: {
                rotateX: degX,
                rotateY: degY,
                translateZ: 20
            }
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