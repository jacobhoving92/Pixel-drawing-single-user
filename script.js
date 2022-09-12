let data = {
  red: 0,
  green: 0,
  blue: 0,
  remaining: 16777216,
  drawnCount: 0,
  saveCounter: 0
};

let misRed = 0;
let misGreen = 0;
let misBlue = 0;
let missingCounter = 0;
let xCheck = 0;
let yCheck = 0;
let addingCount = 0;

var canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  pixelSize = 1;

// Add drawing listener //
document.onload = loadCanvas();
document.onload = addInfo();
canvas.addEventListener("mousemove", draw, false);

document.addEventListener('keypress', (event) => {
  var name = event.key;
  if (name === 's') {
 // get canvas data  
 var image = canvas.toDataURL();  
  
 // create temporary link  
 var tmpLink = document.createElement( 'a' );  
 tmpLink.download = data.drawnCount +'.png'; // set the name of the download file 
 tmpLink.href = image;  

 // temporarily add link to body and initiate the download  
 document.body.appendChild( tmpLink );  
 tmpLink.click();  
 document.body.removeChild( tmpLink );  
  }

});

document.addEventListener('keypress', (event) => {
  var name = event.key;
  if (name === 'b') {
    const el = document.querySelector('body');
    el.style.background = 'black';
  }

});

document.addEventListener('keyup', (event) => {
  var name = event.key;
  if (name === 'b') {
    const el = document.querySelector('body');
    el.style.background = 'white';
  }

});

document.addEventListener('keypress', (event) => {
  var name = event.key;
  if (name === 'r') {
    const el = document.querySelector('body');
    el.style.background = 'red';
  }

});

document.addEventListener('keyup', (event) => {
  var name = event.key;
  if (name === 'r') {
    const el = document.querySelector('body');
    el.style.background = 'white';
  }

});


//tijdelijk om missende pixels te tekenen
// canvas.addEventListener("mousemove", missingDraw, false);

// function missingDraw(e) {

//   var pos = getPosition(this);
//   var x = e.pageX - pos.x;
//   var y = e.pageY - pos.y;
//   var coord = "x=" + x + ", y=" + y;
//   var p = context.getImageData(x, y, 1, 1).data;

//   var pixel = getPixelSelected(e);

//     console.log("x: " + x + "y: " + y);
//   console.log("xCheck: " + xCheck + "yCheck: " + yCheck);

//   if (p[3] < 1 && (x != xCheck || y != yCheck)) {

//     console.log("adding count:" + addingCount);
//     addingCount = addingCount + 1;

//     context.fillStyle = "rgb(" + misRed + "," + misGreen + "," + misBlue + ")";
//     context.fillRect(pixel['x'], pixel['y'], pixelSize, pixelSize);

//     if (misGreen < 256) {
//       misGreen = misGreen + 1;
//     } 
//     if (misGreen == 256){
//       misRed = misRed + 1;
//       misGreen = 0;
//     }

//     xCheck = x;
//     yCheck = y;

//     missingCounter = missingCounter + 1;
//     console.log(missingCounter)
  
//     data.remaining = data.remaining - 1;
//     data.drawnCount = data.drawnCount + 1;
  
//   data.saveCounter = data.saveCounter + 1;
//     addInfo();
//     if (data.saveCounter == 510) {
//       data.saveCounter = 0;
//     store();
//     }
//     console.log(misRed + "," + misGreen + "," + misBlue)
  
//   }

// }

function draw(e) {

  var pos = getPosition(this);
  var x = e.pageX - pos.x;
  var y = e.pageY - pos.y;
  var coord = "x=" + x + ", y=" + y;
  var p = context.getImageData(x, y, 1, 1).data;
  console.log("x: " + x);
  console.log("xCheck: " + xCheck);

  var pixel = getPixelSelected(e);
console.log(p[3]);
  if (p[3] < 255 && (x != xCheck || y != yCheck)) {
    console.log("adding count");

    context.fillStyle = "rgb(" + data.red + "," + data.green + "," + data.blue + ")";
    context.fillRect(pixel['x'], pixel['y'], pixelSize, pixelSize);

  if (data.blue < 256) {
    data.blue = data.blue + 1;
  }

  if (data.blue == 256) {
    data.blue = 0;
    data.green = data.green + 1;
  }

  if (data.green == 256) {
    data.green = 0;
    data.red = data.red + 1;
  }

  if (data.red == 256) {
    return;
  }

  xCheck = x;
  yCheck = y;

  data.remaining = data.remaining - 1;
  data.drawnCount = data.drawnCount + 1;

data.saveCounter = data.saveCounter + 1;
  addInfo();
  if (data.saveCounter == 510) {
    data.saveCounter = 0;
  store();
  }
 
}

}

function getPixelSelected(e) {
  var rect = canvas.getBoundingClientRect(),
    pixel = new Array;

  pixel['x'] = Math.floor((e.clientX - rect.left) / pixelSize) * pixelSize;
  pixel['y'] = Math.floor((e.clientY - rect.top) / pixelSize) * pixelSize;

  return pixel;
}

function getPosition(obj) {
  var curleft = 0, curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return { x: curleft, y: curtop };
  }
  return undefined;
}

function addInfo() {
  document.getElementById("pixelsDrawn").textContent = data.drawnCount;
  document.getElementById("pixelsRemaining").textContent = data.remaining;
  document.getElementById("red").textContent = data.red;
  document.getElementById("green").textContent = data.green;
  document.getElementById("blue").textContent = data.blue;
}

// test save canvas localstorage

function store() {
  const imgSrc = canvas.toDataURL("img/png");
  localStorage.setItem("storedCanvas", imgSrc);
  localStorage.setItem("storedData", JSON.stringify(data));
}

// localStorage();

function loadCanvas() {
  const dataURL = localStorage.getItem("storedCanvas");
 

  const incomingData = localStorage.getItem("storedData");
 console.log(dataURL);
  if (dataURL && incomingData) {
    const img = new Image();
    img.src = dataURL;
    img.onload = function () {
      context.drawImage(img, 0, 0);
    };
    data = JSON.parse(incomingData);
  } else {
    console.log('No data');
  }
}

function finish() {
   // get canvas data  
   var image = canvas.toDataURL();  
  
   // create temporary link  
   var tmpLink = document.createElement( 'a' );  
   tmpLink.download = data.drawnCount +'.png'; // set the name of the download file 
   tmpLink.href = image;  
 
   // temporarily add link to body and initiate the download  
   document.body.appendChild( tmpLink );  
   tmpLink.click();  
   document.body.removeChild( tmpLink ); 
   context.clearRect(0, 0, canvas.width, canvas.height);
   data.red = 0;
   data.green = 0;
   data.blue = 0;
   data.remaining = 16777216;
   data.drawnCount = 0;
   data.saveCounter = 0;
   addInfo();
    store();
}

var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);

    
    const onDown = (e) => {

      if(e.ctrlKey && e.key === 'u'){
                  
          e.preventDefault();
                  
          document.getElementById('imageLoader').click();
                  
      }
  }
  
  window.addEventListener('keydown', onDown);



// upload image and adjust at what current color pixel I am

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]); 
    data.red = 0;
    data.green = 0;
    data.blue = 0;
    data.remaining = 16777216;
    data.drawnCount = 0;
    data.saveCounter = 0;

    const [file] = e.target.files
    let uploadPixels = file.name;
    console.log(uploadPixels);
    uploadPixels = uploadPixels.substring(0, uploadPixels.lastIndexOf('.')) || uploadPixels;
    console.log(uploadPixels);

    for (let i = 0; i < uploadPixels; i++) {
      
      if (data.blue < 256) {
        data.blue = data.blue + 1;
      }
    
      if (data.blue == 256) {
        data.blue = 0;
        data.green = data.green + 1;
      }
    
      if (data.green == 256) {
        data.green = 0;
        data.red = data.red + 1;
      }
    
      if (data.red == 256) {
        return;
      }
    
      data.remaining = data.remaining - 1;
      data.drawnCount = data.drawnCount + 1;
    
    data.saveCounter = data.saveCounter + 1;
    
      }

    addInfo();


}
