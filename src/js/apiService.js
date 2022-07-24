import axios from "axios";

// export default {
//   page: 1,
//   perPage: 40,
//   searchQuery: '',
//   key: '15482023-2b053900c18c0e4b941c4a2ed',
//   baseUrl: 'https://pixabay.com/api',
//
//   async fetchImages() {
//     const url = `${this.baseUrl}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&per_page=${this.perPage}&key=${this.key}&page=${this.page}`;
//     const response = await axios.get(url)
//     return response.data;
//   },
// }

export class PixabayApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '15482023-2b053900c18c0e4b941c4a2ed';

  constructor() {
    this.page = 1;
    this.query = null;
    this.per_page = 40;
  }

  fetchImagesByQuery() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        page: this.page,
        per_page: this.per_page,


      },
    })
  }
}