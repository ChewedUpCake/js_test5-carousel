
class Carousel {
    constructor(s) {
      let settings = this.initConfig(s);

        this.container = document.querySelector(settings.continerID);
        this.slides = this.container.querySelectorAll(settings.slideID);

        this.interval = settings.interval;
    }
        initConfig(o) {
        // let settings = {
        //     continerID: '#carousel',
        //     slideID: '.slide',
        //     interval: 5000,
        // };
        //
        // if (typeof 0 !== 'undefined') {
        //     settings.continerID = o.continerID || settings.continerID;
        //     settings.slideID = o.slideID || settings.slideID;
        //     settings.interval = o.interval || settings.interval;
        // }
        //
        // return settings;

        let p = {continerID: '#carousel', slideID: '.slide', interval: 5000,};

        return {...p, ...o};

        }


    _initProps() {
        this.currentSlide = 0;
        this.slidesCount = this.slides.length;
        this.isPlaying = true;
        this.timerID = null;
        // this.swipeStartX = null;
        // this.swipeEndX = null;

        this.LEFT_ARROW = 'ArrowLeft';
        this.RIGHT_ARROW = 'ArrowRight';
        this.SPACE = ' ';
        this.FA_PLAY = '<i class="far fa-play-circle"></i>';
        this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
        this.FA_PREV = '<i class="fas fa-angle-left"></i>';
        this.FA_NEXT = '<i class="fas fa-angle-right"></i>'
    }

    _initControls() {
        const controls = document.createElement('div');
        const PREV = `<span id="prev-btn" class="control control-prev">${this.FA_PREV}</span>`;
        const NEXT = `<span id="next-btn" class="control control-next">${this.FA_NEXT}</span>`;
        const PAUSE = `<span id="pause-btn" class="control control-pause">${this.FA_PAUSE}</span>`

        controls.setAttribute('class', 'controls');
        controls.innerHTML = PAUSE + PREV + NEXT;

        this.container.appendChild(controls);

        this.pauseBtn = this.container.querySelector('#pause-btn');
        this.prevBtn = this.container.querySelector('#prev-btn');
        this.nextBtn = this.container.querySelector('#next-btn');

    }

    _initIndicators() {
        const indicators = document.createElement('ol');

        indicators.setAttribute('class', 'indicators');
        indicators.setAttribute('id', 'indicators-container');

        for (let i = 0, n = this.slidesCount; i < n; i++) {
            const indicator = document.createElement('li');

            indicator.setAttribute('class', 'indicator');
            indicator.dataset.slideTo = `${i}`;
            i === 0 && indicator.classList.add('active');
            indicators.appendChild(indicator);
        }

        this.container.appendChild(indicators);

        this.indicatorsContainer = this.container.querySelectorAll('#indicators-container');
        this.indicators = this.container.querySelectorAll('.indicator');
    }

    _initListeners() {
        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.indicatorsContainer.addEventListener('click', this.indicate.bind(this));
        document.addEventListener('keydown', this.pressKey.bind(this));
    }

    gotoNth(n) {
        console.log(n);
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
        this.currentSlide = (n + this.slidesCount) % this.slidesCount;
        this.indicators[this.currentSlide].classList.toggle('active');
        this.slides[this.currentSlide].classList.toggle('active');
    }

    gotoPrev() {
        this.gotoNth(this.currentSlide - 1);
    }

    gotoNext() {
        this.gotoNth(this.currentSlide + 1);
    }

    pause() {
        if (this.isPlaying) {
            clearInterval(this.timerID);
            this.pauseBtn.innerHTML = this.FA_PLAY;
            this.isPlaying = false;
        }
    }

    play() {
        this.timerID = setInterval(() => this.gotoNext(), this.interval);
        this.pauseBtn.innerHTML = this.FA_PAUSE;
        this.isPlaying = true;
    }

    pausePlay() {
        this.isPlaying ? this.pause() : this.play();
    }

    next() {
        this.pause();
        this.gotoNext();
    }

    prev() {
        this.pause();
        this.gotoPrev();
    }

    indicate(e) {
        let target = e.target;

        if (target.classList.contains('indicator')) {
            this.pause();
            this.gotoNth(+target.dataset.slideTo);
        }
    }

    pressKey(e) {
        if (e.key === this.LEFT_ARROW) this.prev();
        if (e.key === this.RIGHT_ARROW) this.next();
        if (e.key === this.SPACE) this.pausePlay();
    }

    init() {
        this._initProps();
        this._initControls();
        this._initIndicators();
        this._initListeners();

        this.timerID = setInterval(() => this.gotoNext(), this.interval);
    }
}

class SwipeCarousel extends Carousel {
    _initListeners() {
        super._initListeners();
        this.container.addEventListener('touchstart', this.swipeStart.bind(this));
        this.container.addEventListener('touchend', this.swipeEnd.bind(this));
    }

    swipeStart(e) {
        this.swipeStartX = e.changedTouches[0].pageX;
    }

    swipeEnd(e) {
        this.swipeEndX = e.changedTouches[0].pageX;
        this.swipeStartX - this.swipeEndX > 100 && this.next();
        this.swipeStartX - this.swipeEndX < 100 && this.prev();
    }
}