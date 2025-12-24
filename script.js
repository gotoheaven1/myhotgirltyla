/* =========================================
   1. CUSTOM CURSOR & HOVER
   ========================================= */
const cursorDot = document.querySelector('.cursor-dot');
const cursorCircle = document.querySelector('.cursor-circle');

if (cursorDot && cursorCircle) {
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorCircle.animate({
            left: `${e.clientX}px`, top: `${e.clientY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

document.querySelectorAll('.hover-effect').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});


/* =========================================
   2. INTRO BUBBLES & LYRICS
   ========================================= */
const canvas = document.getElementById('bubbleCanvas');
const introQuoteText = document.getElementById('intro-quote-text');

if (canvas && introQuoteText) { 
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let bubblesArray = [];
    const colors = ['rgba(207, 170, 101, 0.4)', 'rgba(235, 220, 178, 0.3)', 'rgba(255, 255, 255, 0.2)'];

    class Bubble {
        constructor() {
            this.radius = Math.random() * 20 + 5;
            this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
            this.y = canvas.height + this.radius;
            this.directionX = (Math.random() * .4) - .2;
            this.directionY = (Math.random() * 2) + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = 'rgba(207, 170, 101, 0.8)';
            ctx.stroke();
            ctx.closePath();
        }
        update() {
            this.y -= this.directionY;
            this.x += this.directionX;
            if (this.y < 0 - this.radius) {
                this.y = canvas.height + this.radius;
                this.x = Math.random() * canvas.width;
            }
            this.draw();
        }
    }

    function initBubbles() {
        bubblesArray = [];
        for (let i = 0; i < 60; i++) { bubblesArray.push(new Bubble()); }
    }
    function animateBubbles() {
        requestAnimationFrame(animateBubbles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bubblesArray.forEach(bubble => bubble.update());
    }
    initBubbles(); animateBubbles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight; initBubbles();
    });

    canvas.addEventListener('click', (e) => {
        const mouseX = e.clientX; const mouseY = e.clientY;
        bubblesArray.forEach((bubble, index) => {
            if (Math.hypot(mouseX - bubble.x, mouseY - bubble.y) - bubble.radius < 1) {
                bubblesArray.splice(index, 1); bubblesArray.push(new Bubble()); 
            }
        });
    });

    const introQuotes = [
        "Make me lose my breath, make me water.", "Deeper than the ocean, so you can't see the bottom.",
        "Can we play truth or dare?", "Giving me butterflies, got me flying high.",
        "Dancing on the moon, I'm floating.", "I'm a piece of art.",
        "Face card never declines, my God.", "Put her in chanel"
    ];
    let currentIntroQuoteIndex = 0;
    function displayNextIntroQuote() {
        introQuoteText.style.opacity = '0'; 
        setTimeout(() => {
            currentIntroQuoteIndex = (currentIntroQuoteIndex + 1) % introQuotes.length;
            introQuoteText.innerText = introQuotes[currentIntroQuoteIndex];
            introQuoteText.style.opacity = '1'; 
        }, 1000); 
    }
    introQuoteText.innerText = introQuotes[currentIntroQuoteIndex]; introQuoteText.style.opacity = '1'; 
    setInterval(displayNextIntroQuote, 10000); 

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            const intro = document.getElementById('intro-canvas-layer');
            const main = document.getElementById('main-content');
            if (intro && main && !intro.classList.contains('fade-out')) {
                intro.classList.add('fade-out'); main.classList.remove('hidden');
                setTimeout(() => main.classList.add('visible'), 100);
            }
        }
    });
}

/* =========================================
   3. YOUTUBE PLAYER
   ========================================= */
if (document.getElementById('youtube-player')) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player;
    const videoIds = ['mGyN2NMuS4A', 'xiZUf98A1Ts', 'uLK2r3sG4lE', 'n3s6lDf8Nq0', 'XoiOOiuH8iI'];
    let currentVideoId = videoIds[Math.floor(Math.random() * videoIds.length)];

    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('youtube-player', {
            height: '100%', width: '100%', videoId: currentVideoId,
            playerVars: { 'autoplay': 0, 'controls': 1, 'rel': 0, 'playsinline': 1, 'origin': window.location.origin },
            events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange }
        });
    };
    function onPlayerReady(event) { updateTitle(); }
    
    const playerSection = document.querySelector('.player-section');
    const titleText = document.getElementById('track-title');
    const playBtn = document.getElementById('play-pause-btn');

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            playerSection.classList.add('playing'); if(playBtn) playBtn.innerText = "일시정지"; updateTitle();
        } else if (event.data === YT.PlayerState.PAUSED) {
            playerSection.classList.remove('playing'); if(playBtn) playBtn.innerText = "재생";
        } else if (event.data === YT.PlayerState.ENDED) { playNextTrack(); }
    }
    function updateTitle() { if (player && player.getVideoData) titleText.innerText = player.getVideoData().title; }
    function playNextTrack() {
        let newId = videoIds[Math.floor(Math.random() * videoIds.length)];
        while(newId === currentVideoId) newId = videoIds[Math.floor(Math.random() * videoIds.length)];
        currentVideoId = newId; player.loadVideoById(currentVideoId);
    }
    if(playBtn) playBtn.addEventListener('click', () => {
        const state = player.getPlayerState(); (state === 1) ? player.pauseVideo() : player.playVideo();
    });
    const nextBtn = document.getElementById('next-track-btn');
    if(nextBtn) nextBtn.addEventListener('click', playNextTrack);
}

/* =========================================
   4. QUOTE GENERATOR
   ========================================= */
const quotes = [
    { text: "Make me sweat, make me hotter", source: "Water" },
    { text: "I'm the girl next door, but I'm not innocent", source: "Girl Next Door" },
    { text: "Johannesburg to the World", source: "Tyla" },
    { text: "Always been the one, been the muse", source: "Truth or Dare" },
    { text: "African music is going to take over", source: "Interview" },
    { text: "I just want to be a global star", source: "Tyla" },
    { text: "Can't get enough, I need more", source: "Safer" }
];
const quoteText = document.getElementById('quote-text');
const quoteSource = document.getElementById('quote-source');
const shuffleBtn = document.getElementById('shuffle-btn');

if (shuffleBtn && quoteText) {
    shuffleBtn.addEventListener('click', () => {
        quoteText.classList.add('fade-out'); quoteSource.classList.add('fade-out');
        setTimeout(() => {
            const random = Math.floor(Math.random() * quotes.length);
            quoteText.innerText = quotes[random].text;
            quoteSource.innerText = "- " + quotes[random].source + " -";
            quoteText.classList.remove('fade-out'); quoteSource.classList.remove('fade-out');
        }, 500);
    });
}

/* =========================================
   5. COUNTDOWN TIMER (THE SAND OF TIME)
   ========================================= */
function updateCountdown() {
    const daysEl = document.getElementById('days');
    if (!daysEl) return;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    let birthday = new Date(currentYear, 0, 30);
    if (now > birthday) birthday = new Date(currentYear + 1, 0, 30);

    const diff = birthday - now;
    const d = Math.floor(diff / 1000 / 60 / 60 / 24);
    const h = Math.floor((diff / 1000 / 60 / 60) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById('days').innerText = d < 10 ? '0' + d : d;
    document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
    document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
    document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;
}
setInterval(updateCountdown, 1000);
window.addEventListener('load', updateCountdown);
