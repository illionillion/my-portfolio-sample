const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const gallerySlides = [...document.querySelectorAll('.gallery__slide')];
const dotsContainer = document.querySelector('.gallery__dots');
const caption = document.querySelector('.photo-caption');
const backToTop = document.querySelector('.back-to-top');
const topbar = document.querySelector('.topbar');
let currentSlide = 0;
let autoAdvance;

function setTheme(theme) {
	root.dataset.theme = theme;
	localStorage.setItem('web-card-theme', theme);
	themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
}

themeToggle.addEventListener('click', () => {
	setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

const dots = gallerySlides.map((_, index) => {
	const dot = document.createElement('button');
	dot.className = 'gallery__dot';
	dot.type = 'button';
	dot.setAttribute('role', 'tab');
	dot.setAttribute('aria-label', `${index + 1}枚目の写真を表示`);
	dot.addEventListener('click', () => showSlide(index));
	dotsContainer.append(dot);
	return dot;
});

function showSlide(index) {
	currentSlide = (index + gallerySlides.length) % gallerySlides.length;
	gallerySlides.forEach((slide, slideIndex) => {
		slide.classList.toggle('is-active', slideIndex === currentSlide);
	});
	dots.forEach((dot, dotIndex) => {
		dot.setAttribute('aria-selected', String(dotIndex === currentSlide));
	});
	caption.textContent = `${currentSlide === 0 ? 'CAFE TIME' : 'ACTIVITY SNAP'} / 0${currentSlide + 1}-03`;
}

function restartAutoplay() {
	clearInterval(autoAdvance);
	autoAdvance = setInterval(() => showSlide(currentSlide + 1), 5000);
}

document.querySelector('.gallery__button--previous').addEventListener('click', () => {
	showSlide(currentSlide - 1);
	restartAutoplay();
});
document.querySelector('.gallery__button--next').addEventListener('click', () => {
	showSlide(currentSlide + 1);
	restartAutoplay();
});

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
	restartAutoplay();
}

const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add('is-visible');
			observer.unobserve(entry.target);
		}
	});
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

function updateScrollControls() {
	const hasScrolled = window.scrollY > 240;
	backToTop.hidden = !hasScrolled;
	topbar.classList.toggle('is-stuck', hasScrolled);
}

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', updateScrollControls, { passive: true });
document.addEventListener('scroll', updateScrollControls, { passive: true });
updateScrollControls();
setTheme(root.dataset.theme);
showSlide(0);
// 空の雛形です。
// /web-card スキルが要件を聞いてから、このファイルを丸ごと書き換えます。
