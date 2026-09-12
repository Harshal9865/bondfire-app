// ==============================================================================
// CARD REVEAL & KINETIC INTERACTIONS
// Handles GSAP-powered kinetic word reveals, live vote bars, and 3D card flips
// ==============================================================================

export function initKineticWordReveal(containerId) {
  if (!window.gsap) return;
  const container = document.getElementById(containerId);
  if (!container) return;

  const text = container.innerText;
  container.innerHTML = '';
  
  // Split text into words for kinetic reveal
  const words = text.split(' ');
  words.forEach(word => {
    const span = document.createElement('span');
    span.innerText = word + ' ';
    span.style.opacity = 0;
    span.style.display = 'inline-block';
    span.style.transform = 'translateY(10px) rotate(-5deg)';
    container.appendChild(span);
  });

  window.gsap.to(container.children, {
    opacity: 1,
    y: 0,
    rotation: 0,
    duration: 0.5,
    stagger: 0.05,
    ease: "back.out(1.7)",
  });
}

export function initLiveVoteBars(containerId, results) {
  if (!window.gsap) return;
  const container = document.getElementById(containerId);
  if (!container) return;

  // Assuming container has child elements with class .vote-bar and data-target width
  const bars = container.querySelectorAll('.vote-bar');
  
  bars.forEach((bar, index) => {
    const targetWidth = results[index] || 0;
    window.gsap.fromTo(bar, 
      { width: '0%' },
      { 
        width: `${targetWidth}%`, 
        duration: 1.2, 
        ease: "elastic.out(1, 0.5)",
        delay: index * 0.2
      }
    );
  });
}

export function init3DCardFlip(cardId) {
  if (!window.gsap) return;
  const card = document.getElementById(cardId);
  if (!card) return;

  // Setup GSAP 3D perspective
  window.gsap.set(card, { transformPerspective: 1000 });
  
  window.gsap.to(card, {
    rotationY: 360,
    duration: 1.5,
    ease: "power2.inOut",
    onUpdate: function() {
      // Add a shine effect during flip if there is a shine element
      const shine = card.querySelector('.card-shine');
      if (shine) {
        const progress = this.progress();
        shine.style.backgroundPosition = `${progress * 200}% 50%`;
      }
    }
  });
}

export function bindCardRevealInteractions() {
  // Bind global reveal interactions if needed
}
