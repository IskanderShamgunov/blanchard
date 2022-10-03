"use strict"
document.addEventListener('DOMContentLoaded', function() {
// global
  let focusable = document.querySelectorAll('[tabindex="0"]');

  focusable.forEach((e) => {
    e.addEventListener('keydown', function(k) {
      if (k.keyCode === 13) {
        this.click();
      }
    });
  });

  let focusControl = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {

        if (!entry.isIntersecting) {
          entry.target.setAttribute('inert', '');
          entry.target.setAttribute('aria-hidden', 'true');
        } else {
          entry.target.removeAttribute('inert');
          entry.target.removeAttribute('aria-hidden');
        }

    });
  });

// header
  // header burger menu
  let burgerBtn = document.querySelector('.header__burger');
  let burgerMenu = document.querySelector('.header__top-wrapper');
  let burgerMenuLinks = document.querySelectorAll('.header__top-wrapper a');
  let breaker = -1;

  burgerBtn.addEventListener('click', function() {

    document.body.classList.toggle('stop-scroll');

    burgerBtn.classList.toggle('header__burger--active');
    burgerBtn.setAttribute('aria-expanded', !JSON.parse(this.getAttribute('aria-expanded')));

    burgerMenu.classList.toggle('header__top-wrapper--active');

    if (breaker) {

      document.querySelector('.header__search-mobile-open').addEventListener('focus', function() {
        document.querySelector('.header__burger--active').focus();
      })

      breaker++;

    }

  })

  burgerMenuLinks.forEach((e) => {
    e.addEventListener('click', function() {

      document.body.classList.remove('stop-scroll');

      burgerBtn.classList.remove('header__burger--active');
      burgerBtn.setAttribute('aria-expanded', 'false')

      burgerMenu.classList.remove('header__top-wrapper--active');

    });
  });

  // header mobile search btn
  let searchOpenBtn = document.querySelector('.header__search-mobile-open');
  let searchCloseBtn = document.querySelector('.header__search-mobile-close');
  let searchContainer = document.querySelector('.header__search-mobile');
  let searchInput = document.querySelector('.header__search-mobile input');

  searchOpenBtn.addEventListener('click', function() {
    searchContainer.classList.add('header__search-mobile--active');
    searchInput.focus();
  });

  searchCloseBtn.addEventListener('click', function() {
    searchContainer.classList.remove('header__search-mobile--active');
  })

  // header dropdowns
  let dropdownBtns = document.querySelectorAll('.header__dropdown-btn');

  dropdownBtns.forEach((e) => {

    e.nextElementSibling.setAttribute('inert', '');

    e.addEventListener('click', function() {

      dropdownBtns.forEach((el) => {
        if (el !== e) {

          el.classList.remove('header__dropdown-btn--active');
          el.setAttribute('aria-expanded', 'false');
          el.nextElementSibling.classList.remove('header__dropdown-content-wrapper--active');
          el.nextElementSibling.setAttribute('inert', '');

        };
      });

      this.classList.toggle('header__dropdown-btn--active');
      this.setAttribute('aria-expanded', !JSON.parse(this.getAttribute('aria-expanded')));
      this.nextElementSibling.classList.toggle('header__dropdown-content-wrapper--active');
      this.nextElementSibling.toggleAttribute('inert')

    });
  });

  document.querySelectorAll('.simplebar-content-wrapper').forEach((e) => {
    e.setAttribute('aria-label', 'Прокручиваемый список');
  })

// hero
  // hero background change
  let heroBackground = document.querySelector('.hero__bg');
  let heroImgArray = ['var(--hero-bg-1)', 'var(--hero-bg-2)', 'var(--hero-bg-3)'];

  (function() {

    heroBackground.style.backgroundImage = `var(--hero-bg-1)`;
    let i = 2;

    setInterval(() => {
      if (i <= heroImgArray.length) {

        heroBackground.style.backgroundImage = `var(--hero-bg-${i})`;
        ++i;

        if (i === 4) i = 1;

      }
    }, 5000);

  })();

// gallery
  // gallery select
  const gellerySelect = document.querySelector('.filter-form__select');
  const galleryChoices = new Choices(gellerySelect, {
    searchEnabled: false,
    position: 'bottom',
    itemSelectText: '',
  });

  const choicesList = document.querySelector('.choices__list[role="listbox"]');

  let hideSelected = function() {
    let currentValue = galleryChoices.getValue('value');

    choicesList.childNodes.forEach(e => {
      e.removeAttribute('hidden');

      if (e.getAttribute('data-value') === currentValue) {
        e.setAttribute('hidden', 'true');
        e.removeAttribute('data-choice-selectable','');
      };
    });
  };

  hideSelected();

  gellerySelect.addEventListener('change', () => {
    hideSelected();
  });

  // gallery swiper
  const gallerySwiper = new Swiper('.gallery__swiper', {
    speed: 400,
    navigation: {
      nextEl: '.gallery__swiper-btn-next',
      prevEl: '.gallery__swiper-btn-prev',
    },
    a11y: {
      nextSlideMessage: "Следующая страница",
      prevSlideMessage: "Предыдущая страница",
      slideLabelMessage: "Слайд {{index}} из {{slidesLength}}",
      slideRole: "none",
    },
    breakpoints: {
      1025: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 50,
        allowTouchMove: false,
      },
      577: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 38,
        allowTouchMove: true,
      },
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 30,
        allowTouchMove: true,
      },
    },
  });
  gallerySwiper.wrapperEl.setAttribute('role', 'group');

  gallerySwiper.slides.forEach((slide) => {
    focusControl.observe(slide);
  })

  let countSwiperPages = function(swiper, pageDisplayClass = false) {

    let count = function() {

    let currentBP = swiper.currentBreakpoint;
    let slidesPerView = (swiper.originalParams.breakpoints[currentBP]).slidesPerGroup;

    let currentPage = Math.ceil(swiper.activeIndex / slidesPerView + 1);
    let maxPages = Math.ceil(swiper.slides.length / slidesPerView);

    if (pageDisplayClass) document.querySelector(pageDisplayClass).textContent = `${currentPage} / ${maxPages}`;

    swiper.wrapperEl.setAttribute('aria-label', `Страница ${currentPage} из ${maxPages}`);

    }

    count();

    swiper.on('breakpoint', count);
    swiper.on('slideChangeTransitionStart', count);

  };

  countSwiperPages(gallerySwiper, '.gallery__swiper-page');

  // gallery modal window
  let galleryModalWindow = document.querySelector('.gallery__modal');
  let galleryModalBtns = document.querySelectorAll('.gallery__modal-btn');

  gallerySwiper.slides.forEach((slide) => {
    slide.addEventListener('click', function() {

      galleryModalWindow.classList.add('gallery__modal--active');

      document.body.classList.add('stop-scroll');

      let targetModalItem = document.querySelector(`[data-swiper-modal="${slide.getAttribute('data-swiper-slide')}"]`);
      targetModalItem.classList.add('gallery__modal-item--active');

    });
  });

  galleryModalBtns.forEach((btn) => {

    btn.addEventListener('click', function() {

      galleryModalWindow.classList.remove('gallery__modal--active');

      document.body.classList.remove('stop-scroll');

      this.closest('.gallery__modal-item--active').classList.remove('gallery__modal-item--active');

    });
  });

// catalog
  // catalog accordion
  const catalogAccordion = new Accordion('.catalog__accordion', {
    showMultiple: true,
    beforeOpen: (el) => {
      el.children[1].removeAttribute('inert');
      el.children[1].setAttribute('aria-hidden', 'false');
    },
    beforeClose: (el) => {
      el.children[1].setAttribute('inert', '');
      el.children[1].setAttribute('aria-hidden', 'true');
    },
  });

  (function() {
    let accordionItems = document.querySelectorAll('.catalog__accordion-item');

    accordionItems.forEach((e) => {

      if (!e.classList.contains('is-active')) {
        e.children[1].setAttribute('inert', '');
      };

    });

  })();


  let catalogContentItems = document.querySelectorAll('.catalog__content');
  let catalogUnknown = document.querySelector('.catalog-unknown');
  let catalogBtns = document.querySelectorAll('.catalog__accordion-list-item-btn');


  catalogBtns.forEach((e) => {
    e.addEventListener('click', function(btn) {

      catalogBtns.forEach((elem) => {
        elem.classList.remove('catalog__accordion-list-item-btn--active');
      });
      btn.currentTarget.classList.add('catalog__accordion-list-item-btn--active');

      catalogContentItems.forEach((item) => {
        item.classList.remove('catalog__content--active');
      });

      let catalogTargetContent = document.querySelector(`[data-catalog-content="${e.textContent}"]`);

      if (catalogTargetContent) {
        catalogTargetContent.classList.add('catalog__content--active');

        if (window.screen.width <= 576) {
          catalogTargetContent.scrollIntoView();
        }

      } else {
        catalogUnknown.classList.add('catalog__content--active');
      };

    });
  });

// events
  // events swiper
  const eventsSwiper = new Swiper('.events__swiper', {
    speed: 400,
    navigation: {
      nextEl: '.events__swiper-btn-next',
      prevEl: '.events__swiper-btn-prev',
    },
    pagination: {
      el: '.events__swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    a11y: {
      nextSlideMessage: "Следующая страница",
      prevSlideMessage: "Предыдущая страница",
      paginationBulletMessage: "Перейти к странице {{index}}",
      slideLabelMessage: "Слайд {{index}} из {{slidesLength}}",
      slideRole: "none",
    },
    breakpoints: {
      1025: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 50,
        allowTouchMove: false,
      },
      875: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 27,
        allowTouchMove: true,
      },
      577: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 34,
        allowTouchMove: true,
      },
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 30,
        allowTouchMove: true,
      },
    },
  });

  eventsSwiper.wrapperEl.setAttribute('role', 'group');

  countSwiperPages(eventsSwiper);

  let eventsSlides = document.querySelectorAll('.events__item');

  eventsSlides.forEach((slide) => {
    focusControl.observe(slide);
  });

// projects
  // projects tooltips
  tippy(document.querySelectorAll('.projects-descr-tooltip'), {
    trigger: 'click',
    onTrigger(instance, event) {
      instance.reference.classList.add('projects-descr-tooltip--active');
    },
    onHide(instance) {
      instance.reference.classList.remove('projects-descr-tooltip--active');
    },
    content: (reference) => reference.getAttribute('data-tooltip-content'),
  })

  // projects swiper
  const projectsSwiper = new Swiper('.projects__swiper', {
    speed: 400,
    navigation: {
      nextEl: '.projects__swiper-btn-next',
      prevEl: '.projects__swiper-btn-prev',
    },
    a11y: {
      nextSlideMessage: "Следующая страница",
      prevSlideMessage: "Предыдущая страница",
      slideLabelMessage: "Слайд {{index}} из {{slidesLength}}",
      slideRole: "none",
    },
    breakpoints: {
      1025: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 50,
        allowTouchMove: false,
      },
      875: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 50,
        allowTouchMove: true,
      },
      577: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 34,
        allowTouchMove: true,
      },
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 30,
        allowTouchMove: true,
      },
    },
  });

  projectsSwiper.wrapperEl.setAttribute('role', 'group');

  countSwiperPages(projectsSwiper);

  let projectsSlides = document.querySelectorAll('.projects__item');

  projectsSlides.forEach((slide) => {
    focusControl.observe(slide);
  });

// contacts
  // contacts validator and mask
  var tel = document.querySelector('input[type="tel"]');

  var telMask = new Inputmask('+7(999) 999-99-99');
  telMask.mask(tel);

  const validator = new JustValidate('.contacts__form', {
    focusInvalidField: true,
    lockForm: true,
    errorFieldCssClass: 'is-invalid',
  });

  validator
    .addField('.contacts__form-name', [
      {
        rule: 'required',
        errorMessage: 'Это обязательное поле',
      },
      {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Имя слишком короткое',
      },
      {
        validator: (value) => {
          return !/[^A-Za-zА-Яа-я \s]/.test(value);
        },
        errorMessage: 'Недопустимый формат',
      }
      ])
    .addField('.contacts__form-tel', [
      {
        rule: 'required',
        errorMessage: 'Это обязательное поле',
      },
      {
        validator: () => {
          const phone = tel.inputmask.unmaskedvalue();
          return Number(phone) && phone.length === 10;
        },
        errorMessage: 'Недопустимый формат',
      },
    ]);

    let contactsInputs = this.querySelectorAll('.contacts__form-input');

    contactsInputs.forEach((input) => {
      input.addEventListener('input', function() {
        this.style.backgroundColor = 'white';
      });
      input.addEventListener('blur', function() {
        this.style.backgroundColor = '';
      });
    });

  // contacts send form
  const contactsForm = document.querySelector('.contacts__form');
  contactsForm.addEventListener('submit', formSend);

    async function formSend(e) {
      e.preventDefault();

      let formData = new FormData(contactsForm);

      let response = await fetch('sendmail.php', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        let result = await response.json();
        alert(result.message);
        contactsForm.reset();
      } else {
        alert('Ошибка');
      }

    };

  // contacts map
  var YaMap;

  ymaps.ready(init);

  function init () {
    YaMap = new ymaps.Map('map', {
        center: [55.758468, 37.601088],
        zoom: 14,
    }, {
        searchControlProvider: 'yandex#search'
    });
    YaMap.behaviors.disable('scrollZoom');

    var Placemark = new ymaps.Placemark([55.758468, 37.601088], {}, {
      iconLayout: 'default#image',
      iconImageHref: 'img/contacts/map-marker.svg',
      iconImageSize: [20, 20],
      iconImageOffset: [0, 0],
    });
    YaMap.geoObjects.add(Placemark);
  };

});
