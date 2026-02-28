const rvTrack = document.getElementById('rv-track');
const rvNext = document.getElementById('rv-nextBtn');
const rvPrev = document.getElementById('rv-prevBtn');
const rvDots = document.querySelectorAll('.rv-dot');
const rvCards = document.querySelectorAll('.rv-card-item');

let rvIndex = 0; 

const totalSteps = rvDots.length; 

function updateRvCarousel() {
  const moveAmount = rvIndex * 100; 
  
  rvTrack.style.transform = `translateX(-${moveAmount}%)`;
  
  rvDots.forEach(dot => dot.classList.remove('active'));
  if (rvDots[rvIndex]) {
    rvDots[rvIndex].classList.add('active');
  }
}

rvNext.addEventListener('click', () => {
  if (rvIndex < totalSteps - 1) {
    rvIndex++;
  } else {
    rvIndex = 0; 
  }
  updateRvCarousel();
});

rvPrev.addEventListener('click', () => {
  if (rvIndex > 0) {
    rvIndex--;
  } else {
    rvIndex = totalSteps - 1; 
  }
  updateRvCarousel();
});

rvDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    rvIndex = index;
    updateRvCarousel();
  });
});