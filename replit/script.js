let canvas = document.getElementById("canvas")
// I found this gets rid of the horizontal scrollbar
canvas.height = document.documentElement.clientHeight 
canvas.width = document.documentElement.clientWidth
// canvas.height = document.body.clientWidth
// canvas.width = document.body.clientWidth
let ctx = canvas.getContext("2d")
ctx.lineWidth = 5

function getImg() {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    let img_data = ctx.getImageData(0, 0, w, h, { colorSpace: "srgb" });
    // An array of numbers. R, G, B, A. I'm guessing left to right, top to bottom
    // [0, 255, 255, 255, 13, 60, 100, 255]. Each group of 4 is one pixel
    let pixels = img_data.data;
    let data = []
    let n = pixels.length

    for (let i = 0; i < n; i+=4) {
      // grayscale value
      let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3
      data.push(avg)
    }
  
    // img[h][w]
    let img = []
    let row = []
    for (let pixel of data) {
      row.push(pixel)
      if (row.length == w) {
        img.push(row);
        row = [];
      }
    }
    var myJsonString = JSON.stringify(img);
    sendDataToFlask(myJsonString)
    return img
}

function sendDataToFlask(data) {
  // Send the data to the Flask server using SocketIO
  var socket = io();
  socket.on('connect', function() {
        socket.emit('my event', {data: data});
  });
}

let prevX = null
let prevY = null

let draw = false

let clrs = document.querySelectorAll(".clr")
clrs = Array.from(clrs)
clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        ctx.strokeStyle = clr.dataset.clr
    })
})

const colorSelector = document.querySelector('.clr_input');
colorSelector.addEventListener("change", () => {
  console.log(colorSelector.value);
  ctx.strokeStyle = colorSelector.value;
});


let clearBtn = document.querySelector(".clear")
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})

let saveBtn = document.querySelector(".save")
saveBtn.addEventListener("click", () => {
    getImg()
    // let data = canvas.toDataURL("imag/png")
    // let a = document.createElement("a")
    // a.href = data
    // a.download = "sketch.png"
    // a.click()
})

window.addEventListener("mousedown", (e) => draw = true)
window.addEventListener("mouseup", (e) => draw = false)

window.addEventListener("mousemove", function(e){
    if(prevX == null || prevY == null || !draw){
        prevX = e.clientX
        prevY = e.clientY
        return
    }

    let mouseX = e.clientX
    let mouseY = e.clientY
    ctx.beginPath()
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(mouseX, mouseY)
    ctx.stroke()

    prevX = e.clientX
    prevY = e.clientY
})