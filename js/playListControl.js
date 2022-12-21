import { IndexedDB } from "./indexedDB.js";
import { OrderControl } from "./orderControl.js";

export class PlayListControl {
  constructor() {
    this.files = [];
    this.uploadMusicFiles = [];
    this.allPlayList = [];
    this.test = 0;
    this.audioControl;

    this.indexedDB = new IndexedDB();

    this.playListUl = document.querySelector(".ul-playList");
    this.playListNav = document.querySelector(".nav-playList");
    this.init();

    this.playList = document.querySelector(".nav-playList");
    this.playListBtn = document.querySelector(".listBtn");
    this.nav = document.querySelector(".nav");
    this.tracks = document.querySelector(".tracks");

    this.add = document.querySelector(".add");
    this.add.addEventListener("mouseover", this.showAddBtn.bind(this));
    this.add.addEventListener("mouseout", this.hideAddBtn.bind(this));
    this.addIcon = document.querySelector(".add-btn");
    this.musicIcon = document.querySelector(".music-btn");

    this.uploadIcon = document.querySelector(".upload-btn");
    this.uploadIcon.addEventListener(
      "click",
      this.uploadFilesToIndexdDB.bind(this)
    );

    this.cancleIcon = document.querySelector(".cancle-btn");
    this.cancleIcon.addEventListener(
      "click",
      this.cancleUploadFileDisplay.bind(this)
    );

    this.playListBtn.addEventListener("click", this.showPlayList.bind(this));

    this.fileInput = document.querySelector(".file-input");
    this.fileName = document.querySelector(".file-name");
    this.fileInput.addEventListener("change", (event) => {
      this.filesUpload(event);
    });

    this.playListEdit = document.querySelector(".edit");
    this.playListEdit.addEventListener("click", this.editPlayList.bind(this));

    // this.playListGrip = document.getElementsByClassName('li-grip');
    this.playListDelete = document.getElementsByClassName("li-delete");

    this.playListLi = document.getElementsByClassName("li-playList");

    this.playListOrder = document.getElementsByClassName("li-order");

    this.deleteIcons = document.getElementsByClassName("li-delete");
  }

  getAllPlayList() {
    return this.allPlayList;
  }

  setAllPlayList(allPlayList) {
    this.allPlayList = allPlayList;
  }

  setUploadMusicFiles(uploadMusicFiles) {
    this.uploadMusicFiles = uploadMusicFiles;
  }

  getUploadMusicFiles() {
    return this.uploadMusicFiles;
  }

  setAudioControl(audioControl) {
    this.audioControl = audioControl;
  }

  getAudioControl() {
    return this.audioControl;
  }

  async init() {
    var allPalyList = await this.indexedDB.getAllIndexedPlayList();
    allPalyList.sort((a, b) => {
      return a.id > b.id ? 1 : -1;
    });
    this.setAllPlayList(allPalyList);

    while (this.playListUl.hasChildNodes()) {
      this.playListUl.removeChild(this.playListUl.firstChild);
    }

    this.tracks.innerHTML = `${this.allPlayList.length} tracks`;

    this.getAllPlayList().forEach((playList, index) => {
      var insertHtml = `<li class="li-playList" id=${playList.id} keyIndex=${
        playList.key
      }>
                                <div class="li-order" id=${
                                  playList.id
                                } keyIndex=${playList.key}>
                                <div class="disc">
                                    <img src="../icon/compact-disc-solid.svg">
                                </div>
                                <div class="li-index">${
                                  (index + 1).toString().length === 1
                                    ? `0${index + 1}`
                                    : index + 1
                                }</div>
                                <div class="li-name">${playList.name}</div>
                                </div>
                                <div class="li-delete fade-out" id='${
                                  playList.id
                                }' keyIndex=${playList.key}>
                                    <img src="../icon/trash-can-solid.svg">
                                </div>
                              </li>`;
      this.playListUl.insertAdjacentHTML("beforeend", insertHtml);
    });
    [...this.deleteIcons].forEach((deleteIcon) => {
      deleteIcon.addEventListener("click", () => {
        this.deleteMusic(deleteIcon);
      });
    });
    this.orderControl = new OrderControl(
      this.getAllPlayList(),
      this.getAudioControl()
    );

    this.orderControl.positionItem();
  }

  showPlayList() {
    this.playList.classList.toggle("playList-open");

    if ([...this.nav.classList].includes("nav-open")) {
      this.nav.classList.remove("nav-open");
    }
  }

  showAddBtn() {
    this.addIcon.classList.remove("fade-in");
    this.addIcon.classList.add("fade-out");
    this.musicIcon.classList.remove("fade-out");
    this.musicIcon.classList.add("fade-in");
  }

  hideAddBtn() {
    this.addIcon.classList.remove("fade-out");
    this.addIcon.classList.add("fade-in");
    this.musicIcon.classList.remove("fade-in");
    this.musicIcon.classList.add("fade-out");
  }

  async filesUpload(event) {
    const fileArr = [...event.target.files];
    const files = await Promise.all(
      fileArr.map((file, index) => {
        return this.readAsDataURL(file, index);
      })
    );
    this.setUploadMusicFiles(files);
    event.target.files.length > 1
      ? (this.fileName.innerHTML = `${event.target.files.length} files`)
      : (this.fileName.innerHTML = event.target.files[0].name);
    if (event.target.value !== "") {
      this.uploadFileDisplay();
    } else {
      this.cancleUploadFileDisplay();
    }
  }

  readAsDataURL(file, index) {
    // console.log(this.indexedDB.getAllPlayList())
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      var id = this.indexedDB.getAllPlayList().length + index;
      fileReader.onload = function () {
        return resolve({ src: fileReader.result, name: file.name, id: id });
      };
      fileReader.readAsDataURL(file);
    });
  }

  cancleUploadFileDisplay() {
    this.fileInput.value = "";
    this.fileName.innerHTML = "";
    this.uploadIcon.style.display = "none";
    this.cancleIcon.style.display = "none";
    this.add.classList.toggle("hide");
  }

  uploadFileDisplay() {
    this.uploadIcon.style.display = "block";
    this.cancleIcon.style.display = "block";
    this.add.classList.toggle("hide");
  }

  async uploadFilesToIndexdDB() {
    const writeResult = await this.indexedDB.writeIdxedDB(
      this.uploadMusicFiles
    );
    if (writeResult === 200) {
      this.fileInput.value = "";
      this.cancleUploadFileDisplay();
      this.init();
      var all = await this.indexedDB.getAllIndexedPlayList();
      this.audioControl.setPlayList(all);
    } else {
      alert("something happen!");
    }
  }

  playingMusic(nowPlayingMusicKey) {
    [...this.playListLi].forEach((li) => {
      if (li.getAttribute("keyIndex") == nowPlayingMusicKey) {
        li.style.backgroundColor = "#f3f3f3";
        li.classList.add("showDisc");
      } else {
        li.style.backgroundColor = "#fff";
        li.classList.remove("showDisc");
      }
    });
  }

  editPlayList() {
    var editInnerHtml = this.playListEdit.innerHTML;

    if (editInnerHtml === "edit") {
      this.playListEdit.innerHTML = "done";

      [...this.playListDelete].forEach((trash) => {
        trash.classList.remove("fade-out");
        trash.classList.add("fade-in");
      });
    } else {
      this.playListEdit.innerHTML = "edit";

      [...this.playListDelete].forEach((trash) => {
        trash.classList.remove("fade-in");
        trash.classList.add("fade-out");
      });

      [...this.playListLi].forEach((li) => {
        li.style.zIndex = "999";
      });
    }
  }

  async deleteMusic(deleteIcon) {
    const deleteResult = await this.indexedDB.playListDelete(
      Number(deleteIcon.getAttribute("keyIndex"))
    );
    if (deleteResult === 200) {
      this.getAllPlayList();
      this.init();
      var all = await this.indexedDB.getAllIndexedPlayList();
      this.audioControl.setPlayList(all);
      this.playListEdit.innerHTML = "edit";
    } else {
      alert("something happen!");
    }
  }
}
