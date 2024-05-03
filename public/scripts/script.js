let text = document.querySelector(".parallax_text")
let body = document.querySelector("body")
let treeLeft = document.querySelector(".trees_left")
let treeRight = document.querySelector(".trees_right")

window.addEventListener("scroll", () => {
    let value = window.scrollY
    text.style.marginTop = value * .5 + "px"
    treeLeft.style.left = ((value - 500) * -0.5) + "px"
    treeRight.style.left = `calc(50% + ${(value + 1000) * 0.5}px)`

})