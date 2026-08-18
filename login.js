document.addEventListener('DOMContentLoaded', () => {

  // FEATURE 1: Audio Play/Pause Toggle
  const musicBtn = document.getElementById('musicToggleBtn');
  const audio = document.getElementById('birthdayAudio');
  const musicIcon = document.getElementById('musicIcon');
  const musicText = document.getElementById('musicText');
  let isPlaying = false;

  if (musicBtn && audio) {
    musicBtn.addEventListener('click', () => {
      if (!isPlaying) {
        audio.play();
        musicIcon.textContent = '⏸️';
        musicText.textContent = 'Pause Music';
        isPlaying = true;
      } else {
        audio.pause();
        musicIcon.textContent = '🎵';
        musicText.textContent = 'Play Song';
        isPlaying = false;
      }
    });
  }

  // FEATURE 2: Confetti Cannon Blast
  const confettiBtn = document.getElementById('confettiBtn');
  if (confettiBtn && typeof confetti === 'function') {
    confettiBtn.addEventListener('click', () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    });
  }

  // FEATURE 3: Random Birthday Wish Generator
  const wishes = [
    "May your year ahead be filled with laughter and endless blessings! 🌟",
    "Wishing you strength, happiness, and peace in all that you do! 🙏",
    "May all your dreams and prayers come true this year! ✨",
    "Keep shining bright and bringing joy to everyone around you! 💖",
    "Stay healthy, blessed, and always smiling! Happy Birthday! 🎉"
  ];
  const wishBtn = document.getElementById('wishBtn');
  const wishText = document.getElementById('wishText');

  if (wishBtn && wishText) {
    wishBtn.addEventListener('click', () => {
      const randomIndex = Math.floor(Math.random() * wishes.length);
      wishText.textContent = `"${wishes[randomIndex]}"`;
    });
  }

  // FEATURE 4: Blow Out Cake Candles
  const cakeWrapper = document.getElementById('cakeWrapper');
  const candleFlame = document.getElementById('candleFlame');

  if (cakeWrapper && candleFlame) {
    cakeWrapper.addEventListener('click', () => {
      candleFlame.classList.toggle('extinguished');
      if (typeof confetti === 'function') {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.4 } });
      }
    });
  }

  // FEATURE 5: Balloon Burst Effect on Click
  const balloons = document.querySelectorAll('.pop-balloon');
  balloons.forEach(balloon => {
    balloon.addEventListener('click', (e) => {
      balloon.style.transition = 'transform 0.15s ease, opacity 0.15s ease';
      balloon.style.transform = 'scale(1.8)';
      balloon.style.opacity = '0';
      setTimeout(() => {
        balloon.remove();
      }, 150);
    });
  });

});