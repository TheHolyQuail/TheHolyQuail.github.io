// hi!
document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isIPAD = navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2;

    if (isIOS || isIPAD)  {
      body.classList.add("ios-device");
    //   root.style.setProperty("--can-render-pdf", "false");
    } else {
      body.classList.add("pdf-supported");
    //   root.style.setProperty("--can-render-pdf", "true");
    }
  });

// fade the navbar waves when scrolling
const waves = document.getElementById('navbarWaves');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const fadeStart = 50;  // start fading after 50px
  const fadeEnd = 150;   // fully faded at 150px

  let opacity = 1;
  if (scrollY > fadeStart) {
    opacity = 1 - Math.min((scrollY - fadeStart) / (fadeEnd - fadeStart), 1);
  }
  waves.style.opacity = opacity;
});

// fade the navbar waves when collapsing menu
const collapse = document.getElementById('navbarNavAltMarkup');

collapse.addEventListener('show.bs.collapse', () => {
  waves.style.transition = 'none';  // no smooth fade-out
  // waves.style.transitionDelay = "0s"; // no delay for fade-out
  waves.style.opacity = 0;  // fade out
});

// collapse.addEventListener('hidden.bs.collapse', () => {
collapse.addEventListener('hide.bs.collapse', () => {
  waves.style.transition = 'opacity 0.4s ease';  // smooth fade-in
  waves.style.transitionDelay = "0.3s";
  waves.style.opacity = 1;  // fade back in
});

  // Background starfield effect:
const container = document.getElementById("idex_content");
const numConstellations = 14;        // how many clumps of stars
const starsPerConstellation = 7;    // stars per clump

for (let i = 0; i < numConstellations; i++) {
  // pick a random central position for this constellation
  const clusterX = Math.random() * 100;  // percentage
  const clusterY = Math.random() * 100;

  for (let j = 0; j < starsPerConstellation; j++) {
    const star = document.createElement("div");
    star.classList.add("star");

    // random offset around the cluster center
    const offsetX = (Math.random() - 0.5) * 10; // spread in %
    const offsetY = (Math.random() - 0.5) * 10;

    // randomize size, twinkle speed, and delay
    const size = Math.random() * 2 + 1; // 1–3 px
    const duration = (Math.random() * 4 + 4).toFixed(1) + "s";
    const delay = (Math.random() * 4).toFixed(1) + "s";

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `calc(${clusterX}% + ${offsetX}%)`;
    star.style.top  = `calc(${clusterY}% + ${offsetY}%)`;
    star.style.setProperty("--twinkle-duration", duration);
    star.style.setProperty("--twinkle-delay", delay);

    container.appendChild(star);
  }
}