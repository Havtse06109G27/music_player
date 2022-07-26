const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Ánh sao và bầu trời",
      singer: "T.R.I x Cá",
      path: "./songs/anh-sao-va-bau-troi.mp3",
      image: "./imgs/anh-sao-va-bau-troi.jpg",
    },
    {
      name: "Cưới thôi",
      singer: "Masew x Masiu x B Ray x TAP",
      path: "./songs/cuoi-thoi.mp3",
      image: "./imgs/cuoi-thoi.jpg",
    },
    {
      name: "Tệ thật anh nhớ em",
      singer: "Thanh Hưng",
      path: "./songs/te-that-anh-nho-em.mp3",
      image: "./imgs/te-that-anh-nho-em.jpg",
    },
    {
      name: "Vì mẹ anh bắt chia tay",
      singer: "Miu Lê x Karik",
      path: "./songs/vi-me-anh-bat-chia-tay.mp3",
      image: "./imgs/vi-me-anh-bat-chia-tay.jpg",
    },
    {
      name: "Yêu đương khó quá thì chạy về khóc với anh",
      singer: "Erik",
      path: "./songs/yeu-duong-kho-qua-thi-ve-voi-anh.mp3",
      image: "./imgs/yeu-duong-kho-qua-thi-ve-voi-anh.jpg",
    },
    {
      name: "2 5",
      singer: "Táo x Masew",
      path: "./songs/2-5.mp3",
      image: "./imgs/2-5.jpg",
    },
    {
      name: "Blue Tequila",
      singer: "Táo",
      path: "./songs/blue-tequila.mp3",
      image: "./imgs/blue-tequila.jpg",
    },
    {
      name: "Cao ốc 20",
      singer: "Bray x Masew",
      path: "./songs/cao-oc-20.mp3",
      image: "./imgs/cao-oc-20.jpg",
    },
    {
      name: "Nhớ người hay nhớ ...",
      singer: "Sophia x Khói x Châu Đăng Khoa",
      path: "./songs/nho-nguoi-hay-nho.mp3",
      image: "./imgs/nho-nguoi-hay-nho.jpg",
    },
    {
      name: "Tháng 7 của anh, em và cô đơn",
      singer: "Khói",
      path: "./songs/thang-7-cua-anh-em-va-co-don.mp3",
      image: "./imgs/thang-7-cua-anh-em-va-co-don.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                        <div class="song ${
                          index === this.currentIndex ? "active" : ""
                        }" data-Index ="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;
    });
    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    // handle scale cd
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // handle CD rotate / pause
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });

    cdThumbAnimate.pause();
    // handle click button play
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // when song play
    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // when song pause
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // when song duration change
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime * 100) / audio.duration
        );
        progress.value = progressPercent;
      }
    };

    // handle when seek song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // when next song
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    };

    // when prev song
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    };

    // handle turn on/off random
    randomBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      randomBtn.classList.toggle("active", app.isRandom);
    };

    // handle repeat song
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      randomBtn.classList.toggle("active", app.isRepeat);
    };

    // handle next song when audio ended
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // listen click action in playlist
    playlist.onclick = function () {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // handle when click song
        if (songNode) {
          app.currentIndex = Number(songNode.dataset.index);
          app.loadCurrentSong();
          app.render();
          audio.play();
        }
        // handle when click on song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 500);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // Define properties for object
    this.defineProperties();

    // Listen events
    this.handleEvents();

    // Load first song information to UI when start app
    this.loadCurrentSong();

    // Render playlist
    this.render();
  },
};

app.start();
