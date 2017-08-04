const GIPHY_API_KEY = "203c2b20fd4d416b9c4ade385b90c0d9";
const DOGGOS = [
  { giphyId: "11MS2pksWxB8SA",
    name: "John Barkham",
    class: "Bard"
  },
  { giphyId: "t8yU2AkVhAJqM",
    name: "Sasha",
    class: "Thief"
  },
  { giphyId: "szdbkOn1K6iXu",
    name: "Boomer",
    class: "Fighter"
  },
  { giphyId: "mkZ78JB74isVO",
    name: "Coco",
    class: "Cleric"
  }
];

class Lightbox {
  constructor() {
    this.photos = [];
    this.template = document.querySelector("#lightbox-template");
    this.previewTemplate = document.querySelector("#lightbox-preview-template");
  }

  open() {
    this.el = document.createElement("div");
    this.el.appendChild(this.template.content.cloneNode(true));

    this.select(0);

    const previewAreaEl = this.el.querySelector(".lightbox-preview-area");

    this.photos.forEach((photo, index) => {
      const previewFragment =
        this.previewTemplate.content.querySelector(".lightbox-preview");
      previewFragment.dataset.index = index;
      previewFragment.querySelector(".lightbox-preview-image").src =
        photo.previewUrl;

      const previewEl = this.previewTemplate.content.cloneNode(true);
      previewAreaEl.appendChild(previewEl);
    });

    document.querySelector("body").appendChild(this.el);
  }

  close() {
    this.el.remove();
  }

  next() {
    if (this.selectedIndex < this.photos.length - 1) {
      this.select(this.selectedIndex += 1);
    }
  }

  previous() {
    if (this.selectedIndex > 0) {
      this.select(this.selectedIndex - 1);
    }
  }

  select(index) {
    index = parseInt(index);

    const titleEl = this.el.querySelector(".lightbox-title");
    titleEl.textContent = this.photos[index].title;

    const imageEl = this.el.querySelector(".lightbox-image");
    imageEl.src = "";
    imageEl.src = this.photos[index].url;

    this.selectedIndex = index;
  }

  addPhoto(photo) {
    this.photos.push(photo);
  }
}

function fetchGiphyGifs() {
  const doggoIds = DOGGOS.map(doggo => doggo.giphyId).join(",");
  const url = `http://api.giphy.com/v1/gifs?ids=${doggoIds}&api_key=${GIPHY_API_KEY}`;

  return fetch(url)
    .then(response => response.json())
}

const lightbox = new Lightbox();

fetchGiphyGifs()
  .then(results => {
    results.data.forEach(gif => {
      const doggo = DOGGOS.find(d => d.giphyId == gif.id);
      const doggoTitle = `${doggo.name} - ${doggo.class}`;

      lightbox.addPhoto({
        url: gif.images.original.url,
        previewUrl: gif.images.fixed_height_small_still.url,
        title: doggoTitle,
        id: gif.id
      });
    });
  });
