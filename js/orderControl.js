import { IndexedDB } from "./indexedDB.js";
import { AudioControl } from "./audioControl.js";
export class OrderControl {
  constructor(allPlayList, audioControl) {
    this.position = { x: null, y: null };
    this.diff = { x: null, y: null };
    this.mouseDown = false;
    this.seletedLi = null;
    this.resetTransition = false;
    this.trasitonTime = 400;

    this.playListUl = document.querySelector(".ul-playList");

    this.playListLi = document.getElementsByClassName("li-playList");

    this.playListOrder = document.getElementsByClassName("li-order");
    this.playListNav = document.querySelector(".nav-playList");

    [...this.playListLi].forEach((li, index) => {
      li.setAttribute("order", index + 1);
      // li.addEventListener('mousedown',(e)=>{ this.seletedPlayListLi(e, li)});
      // li.addEventListener('mouseup', (e)=>{ this.doneSelectedPlayList(e)});
    });

    [...this.playListOrder].forEach((li) => {
      li.addEventListener("mousedown", (e) => {
        this.seletedPlayListLi(e, li, li.id);
      });
      li.addEventListener("mouseup", (e) => {
        this.doneSelectedPlayList(e);
      });
    });

    this.playListNav.addEventListener("mousemove", (e) => {
      this.setMousePosition(e);
    });

    this.allPlayList = allPlayList;

    this.indexedDB = new IndexedDB();
    this.audioControl = audioControl;
    // this.audioControl = new AudioControl(this.allPlayList);

    this.audion = document.querySelector("audio");
  }

  seletedPlayListLi(e, li, id) {
    console.log(id);

    if (!this.position.x || this.resetTransition) return;

    this.mouseDown = true;
    this.seletedLi = document.getElementById(id);
    this.seletedLi.zIndex = "1000";
    this.diff.y = this.position.y - this.seletedLi.offsetTop;
    this.diff.x = this.position.x - this.seletedLi.offsetLeft;

    const offsetY = this.position.y - this.diff.y;
    const offsetX = this.position.x - this.diff.x;

    this.seletedLi.style.top = `${offsetY}px`;
    this.seletedLi.style.left = `${offsetX}px`;
    this.seletedLi.classList.add("selected");

    this.seletedLi.setAttribute("selected", "yes");
    this.orderOfSelectedItem = Number(this.seletedLi.getAttribute("order"));
  }

  doneSelectedPlayList(e) {
    this.mouseDown = false;
    this.seletedLi.classList.remove("selected");
    // this.positionItem();
    this.postionItemsInOrder();
  }

  setMousePosition(e) {
    // console.log('move');

    this.position.x = e.clientX - this.playListUl.offsetLeft;
    this.position.y =
      e.clientY - (this.playListUl.offsetTop - this.playListUl.scrollTop);

    if (!this.mouseDown) return;
    const offsetY = this.position.y - this.diff.y;
    const offsetX = this.position.x - this.diff.x;

    this.seletedLi.style.top = `${offsetY}px`;
    this.seletedLi.style.left = `${offsetX}px`;

    this.orderOfSelectedItem = Number(this.seletedLi.getAttribute("order"));

    if (this.orderOfSelectedItem !== 1) {
      var beforeItem = document.querySelector(
        `.li-playList[order *= "${this.orderOfSelectedItem - 1}"]`
      );
      var beforeMiddle =
        this.position.y < beforeItem.offsetTop + beforeItem.clientHeight / 2;
      if (beforeMiddle) {
        this.positionItem(this.orderOfSelectedItem - 1);
        this.seletedLi.setAttribute("order", this.orderOfSelectedItem - 1);
        return;
      }
    }

    if (this.orderOfSelectedItem !== this.playListLi.length) {
      var afterItem = document.querySelector(
        `.li-playList[order *= "${this.orderOfSelectedItem + 1}"]`
      );
      var afterMiddle =
        this.position.y > afterItem.offsetTop + afterItem.clientHeight / 2;

      if (afterMiddle) {
        this.positionItem(this.orderOfSelectedItem + 1);
        this.seletedLi.setAttribute("order", this.orderOfSelectedItem + 1);
        return;
      }
    }
  }

  positionItem(insertIndex = null) {
    var playListItems = [...this.playListLi];

    playListItems = playListItems.filter(
      (item) => item.getAttribute("selected") !== "yes"
    );
    var indexCounter = 0;
    playListItems.forEach((item) => {
      if (insertIndex === indexCounter + 1) {
        indexCounter++;
      }
      //60 19

      item.style.top = 60 * indexCounter + "px";
      item.setAttribute("order", indexCounter + 1);
      item.setAttribute("id", indexCounter);
      // item.setAttribute('key', this.allPlayList[indexCounter].key)
      indexCounter++;
    });
  }

  postionItemsInOrder() {
    var playListItems = [...this.playListLi];
    var playListNumber = document.getElementsByClassName("li-index");

    playListItems.sort((a, b) => {
      return Number(a.getAttribute("order")) > Number(b.getAttribute("order"))
        ? 1
        : -1;
    });

    playListItems.forEach((item, index) => {
      if (item.getAttribute("selected") === "yes") {
        item.removeAttribute("selected");
        item.style.left = 0;
        setTimeout(() => {
          item.style.zIndex = "0";
        }, this.trasitonTime);
      }
      //60 19
      item.style.top = 60 * index + "px";
      item.setAttribute("order", index + 1);
      item.setAttribute("id", index);
    });

    this.resetTransition = true;

    setTimeout(() => {
      while (this.playListUl.firstChild) {
        this.playListUl.removeChild(this.playListUl.lastChild);
      }

      playListItems.forEach((item, index) => {
        this.playListUl.append(item);
        index < 10
          ? (item.querySelector(".li-index").innerHTML = `0${index + 1}`)
          : index + 1;
      });
      this.resetTransition = false;
    }, this.trasitonTime);

    this.playListLi = playListItems;
    //audio 재정렬
    this.updateId();
  }

  async updateId() {
    var playListItems = [...this.playListLi];

    playListItems.sort((a, b) => {
      return Number(a.getAttribute("keyIndex")) >
        Number(b.getAttribute("keyIndex"))
        ? 1
        : -1;
    });

    this.allPlayList.sort((a, b) => {
      return a.key > b.key ? 1 : -1;
    });

    this.allPlayList.forEach((item, index) => {
      item.id = playListItems[index].id;
    });

    await Promise.all(
      this.allPlayList.map((palyList) => {
        return this.indexedDB.updatePlayListId(palyList);
      })
    ).then((result) => {
      this.updateAudioOrder();
    });
  }

  async updateAudioOrder() {
    console.log("test2");
    var allIndexedPlayList = await this.indexedDB.getAllIndexedPlayList();
    allIndexedPlayList.sort((a, b) => {
      return a.id > b.id ? 1 : -1;
    });
    this.audioControl.setPlayList(allIndexedPlayList);
  }
}
