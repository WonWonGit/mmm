import {CanvasControl} from "./canvasControl.js"
export class AudioControl {
  constructor(playList, ctx) {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.audioContext.resume().then(() => {
      this.init();
    });


    this.audio = document.getElementById("audio");

    this.ctx = ctx;

    this.barsStroke = [];
    this.barsRect = [];
    this.animation;

    this.index = 0;
    this.plyaListLength = playList.length;
    this.currentTime = 0;
    this.playList = playList;
    this.currentSong = document.getElementsByClassName('currnetSong')[0];
    this.currentName = '';


    this.informBtn = document.getElementById("informBtn");
    this.informBtn.addEventListener("click", (e) => this.startMusic(e));

    this.startBtn = document.getElementById("start");
    this.startBtn.addEventListener("click", (e) => this.startMusic(e));

    this.previousBtn = document.getElementById("previous");
    this.previousBtn.addEventListener("click", (e) => this.previousMusic(e));

    this.nextBtn = document.getElementById("next");
    this.nextBtn.addEventListener("click", (e) => this.nextMusic(e));

    this.canvas = document.querySelector("canvas");

    this.audio.addEventListener("ended", (e) => {
      if (this.index < this.plyaListLength - 1) {
        this.index += 1;
        this.audio.src = this.getPlayList()[this.index].src;
        this.audio.play();
      } else {
        this.index = 0;
        this.audio.src = this.getPlayList()[index].src;
        this.audio.play();
      }
    });

  }

  getPlayList() {
    return this.playList;
  }

  init() {
    this.analyser = this.audioContext.createAnalyser();
    this.source = this.audioContext.createMediaElementSource(this.audio);
    this.source.connect(this.analyser);
    this.source.connect(this.audioContext.destination);
    // this.analyser.fftSize = 1024;
    this.analyser.fftSize = 512;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
  }

  startMusic(e) {
    if (this.audio.paused) {
      this.audio.src = this.getPlayList()[this.index].src;
      this.currentSong.innerHTML = this.getPlayList()[this.index].name;
      this.audio.currentTime = this.currentTime;
      this.startBtn.innerHTML = "stop";
      this.audio.play();
      this.getDataArray();
      document.getElementsByClassName('inform')[0].style.visibility = 'hidden';
      document.getElementsByClassName('inform')[0].style.opacity = 0;
    } else {
      this.audio.pause();
      this.currentTime = this.audio.currentTime;
      this.startBtn.innerHTML = "start";
      cancelAnimationFrame(this.animation);
      setTimeout(()=>{
        document.getElementsByClassName('inform')[0].style.visibility = 'visible';
       document.getElementsByClassName('inform')[0].style.opacity = 1;
      }, 1800);
      this.getDataArray();
    //   this.canvasControl.test();
    }
  }

  getDataArray() {
    this.analyser.getByteFrequencyData(this.dataArray);
    for (let i = 0; i < this.bufferLength; i++) {
      this.canvasControl.update(this.bufferLength, this.dataArray);
    }
    this.animation = requestAnimationFrame(this.getDataArray.bind(this));
  }

  previousMusic(e) {
    if (this.index > 0) {
      this.index -= 1;
    } else {
      this.index = 0;
    }
    this.audio.src = this.getPlayList()[this.index].src;
    this.audio.src = this.getPlayList()[this.index].src;
    this.currentSong.innerHTML = this.getPlayList()[this.index].name;
    this.startBtn.innerHTML = "stop";
    this.audio.play();
  }

  nextMusic(e) {
    if (this.index < this.plyaListLength - 1) {
      this.index += 1;
    } else {
      this.index = 0;
    }
    this.audio.src = this.getPlayList()[this.index].src;
    this.currentSong.innerHTML = this.getPlayList()[this.index].name;
    this.startBtn.innerHTML = "stop";
    this.audio.play();
  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.canvasControl = new CanvasControl(this.ctx);
    this.draw();
  }

  draw(){
    //   console.log(this.ctx);
    // this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    // this.ctx.fillRect(0, 0, 150, 100);
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    let barWidth = 8.5;
    let barHeight;
    let x = 0;
    let rectCenterY = document.body.clientHeight / 2;

    for (let i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i];
      this.ctx.fillRect(
        x,
        rectCenterY,
        barWidth,
        barHeight / 10 - this.canvas.height / 25
      );
      this.ctx.fillRect(x, rectCenterY, barWidth, barHeight / 4);
      x += barWidth + (this.canvas.clientWidth)/10;
    }
  }
}
