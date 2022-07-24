import './sass/main.scss';
import {PixabayApi} from './js/apiService';
import card from './templates/imageCard.hbs';

import {Notify} from "notiflix";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  input: document.querySelector('input[name="searchQuery"]'),
  form: document.querySelector('form[id="search-form"]'),
  gallery: document.querySelector('.gallery'),
}

refs.form.addEventListener('submit', handleForm);

const pixabayApi = new PixabayApi;


async function handleForm(e) {
  e.preventDefault();

  pixabayApi.query = refs.input.value;
  refs.gallery.innerHTML = '';
  pixabayApi.page = 1;

  if (pixabayApi.query.length === "") {
    return;
  }

  try {
    const response = await pixabayApi.fetchImagesByQuery()

    if (response.data.totalHits === 0) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
    }

    if (response.data.totalHits < pixabayApi.page * pixabayApi.per_page) {
      // Notify.failure("We're sorry, but you've reached the end of search results.");
      observer.unobserve(document.querySelector('.target-element'));
    }

    // if (pixabayApi.page > 1) {
    //   Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    // }
    Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    renderCard(response.data.hits);
    simple.refresh();

    observer.observe(document.querySelector('.target-element'));
    // observer.unobserve(document.querySelector('.target-element'));

  } catch (error) {
    // Notify.failure(error.message)
    console.log(error);
  }
}

async function handleLoadMore() {
  pixabayApi.page += 1;

  try {
    const response = await pixabayApi.fetchImagesByQuery()

    if (response.data.totalHits === 0) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
    }

    if (response.data.totalHits < pixabayApi.page * pixabayApi.per_page) {
      // Notify.failure("We're sorry, but you've reached the end of search results.");
      observer.unobserve(document.querySelector('.target-element'));
    }

    // if (pixabayApi.page > 1) {
    //   Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    // }

    renderCard(response.data.hits);
    simple.refresh();

    // observer.unobserve(document.querySelector('.target-element'));
    observer.observe(document.querySelector('.target-element'));
  } catch (error) {
    // Notify.failure(error.message)
    console.log(error);
  }
}

function renderCard(images) {
  const markup = card(images);
  return refs.gallery.insertAdjacentHTML('beforeend', markup);
}

const simple = new SimpleLightbox('.gallery a', {
  scaleImageToRatio: true,
  captionsData: 'alt',
});


const observer = new IntersectionObserver(
  (entries, observer) => {
    if (entries[0].isIntersecting) {
      handleLoadMore();
    }
  },
  {
    root: null,
    rootMargin: '600px',
    threshold: 1,
  }
);
