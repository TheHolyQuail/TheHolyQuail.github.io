// hi!
document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
    if (isIOS) {
      body.classList.add("ios-device");
    //   root.style.setProperty("--can-render-pdf", "false");
    } else {
      body.classList.add("pdf-supported");
    //   root.style.setProperty("--can-render-pdf", "true");
    }
  });