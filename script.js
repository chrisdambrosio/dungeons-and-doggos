const GIPHY_API_KEY = "203c2b20fd4d416b9c4ade385b90c0d9";
const DOGGOS = [
  { giphyId: "11MS2pksWxB8SA",
    name: "John Barkham",
    class: "Bard",
    classIcon: "bard.svg"
  },
  { giphyId: "t8yU2AkVhAJqM",
    name: "Sasha",
    class: "Thief",
    classIcon: "thief.svg"
  },
  { giphyId: "szdbkOn1K6iXu",
    name: "Boomer",
    class: "Fighter",
    classIcon: "fighter.svg"
  },
  { giphyId: "mkZ78JB74isVO",
    name: "Coco",
    class: "Cleric",
    classIcon: "cleric.svg"
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

    this.select(0);

    this.onkeydown = (event => {
      if (event.key == "Escape") {
        this.close();
      }
      else if (event.key == "ArrowRight") {
        this.next();
      }
      else if (event.key == "ArrowLeft") {
        this.previous();
      }
    }).bind(this);

    document.addEventListener("keydown", this.onkeydown)
    document.querySelector("body").appendChild(this.el);
  }

  close() {
    document.removeEventListener("keydown", this.onkeydown);
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
    this.selectedIndex = index;

    const titleEl = this.el.querySelector(".lightbox-title");
    titleEl.textContent = this.photos[index].title;

    const imageEl = this.el.querySelector(".lightbox-image");
    imageEl.src = "";
    imageEl.src = this.photos[index].url;

    this.el.querySelectorAll(`[data-index]`)
      .forEach(el => el.classList.remove("lightbox-preview-active"));

    this.el.querySelector(`[data-index='${index}'`)
      .classList.add("lightbox-preview-active");

    this.el.querySelectorAll(`.lightbox-button`)
      .forEach(el => el.classList.remove("lightbox-button-disabled"));

    if (index < 1) {
      this.el.querySelector(".lightbox-previous-button")
        .classList.add("lightbox-button-disabled");
    }

    if (index >= this.photos.length - 1) {
      this.el.querySelector(".lightbox-next-button")
        .classList.add("lightbox-button-disabled");
    }
  }

  addPhoto(photo) {
    this.photos.push(photo);
  }
}

function fetchGiphyGifs() {
  const doggoIds = DOGGOS.map(doggo => doggo.giphyId).join(",");
  const url = `https://api.giphy.com/v1/gifs?ids=${doggoIds}&api_key=${GIPHY_API_KEY}`;

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
        previewUrl: "img/" + doggo.classIcon,
        title: doggoTitle,
        id: gif.id
      });
    });
  });
