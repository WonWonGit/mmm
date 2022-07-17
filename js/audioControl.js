
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
    this.analyser.fftSize = 1024;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
  }

  startMusic(e) {
    if (this.audio.paused) {
      this.audio.src = this.getPlayList()[this.index].src;
      this.audio.currentTime = this.currentTime;
      this.startBtn.innerHTML = "stop";
      this.audio.play();
      this.getDataArray();
      document.getElementsByClassName('inform')[0].style.display = 'none';
    } else {
      this.audio.pause();
      this.currentTime = this.audio.currentTime;
      this.startBtn.innerHTML = "start";
      cancelAnimationFrame(this.animation);
      document.getElementsByClassName('inform')[0].style.display = 'block';
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);  
    }
  }

  getDataArray() {
    this.analyser.getByteFrequencyData(this.dataArray);
    for (let i = 0; i < this.bufferLength; i++) {
      this.update();
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
    this.audio.play();
  }

  nextMusic(e) {
    if (this.index < this.plyaListLength - 1) {
      this.index += 1;
    } else {
      this.index = 0;
    }
    this.audio.src = this.getPlayList()[this.index].src;
    this.audio.play();
  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    // this.draw();
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    let barWidth = (this.canvas.width / this.bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    let rectCenterY = this.canvas.height / 3.8;

    for (let i = 0; i < this.bufferLength; i++) {
      barHeight = this.dataArray[i];
      this.ctx.fillRect(
        x,
        rectCenterY,
        barWidth,
        barHeight / 10 - this.canvas.height / 25
      );
      this.ctx.fillRect(x, rectCenterY, barWidth, barHeight / 4);
      x += barWidth +( this.canvas.width / 2) / 32;
    }
  }
}
