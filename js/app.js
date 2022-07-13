import { IndexedDB } from "./indexedDB.js";

class App{
    constructor(playList){

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioContext.resume().then(() => {
            this.init();
        });

        // this.indexedDB = new IndexedDB([]);
        this.playList = playList;
        this.playListLegnth = playList.length;

        this.audio = document.getElementById('audio');

        this.index = 0;
        this.plyaListLength = this.getPlayList().length;
        this.currentTime = 0;

        this.startBtn = document.getElementById('start');
        this.startBtn.addEventListener('click', e => this.startMusic(e));

        this.previousBtn = document.getElementById('previous');
        this.previousBtn.addEventListener('click', e => this.previousMusic(e));
        
        this.nextBtn = document.getElementById('next');
        this.nextBtn.addEventListener('click', e => this.nextMusic(e));

        this.audio.addEventListener('ended',(e)=>{
            if(this.index < this.plyaListLength-1){
                this.index += 1;
                this.audio.src = this.getPlayList()[this.index].src;
                this.audio.play();
            }else{
                this.index = 0;
                this.audio.src = this.getPlayList()[index].src;
                this.audio.play();
            }
    });

    }

    getPlayList(){
        return this.playList;
    }

    init(){
        this.analyser = this.audioContext.createAnalyser();
        this.source = this.audioContext.createMediaElementSource(this.audio);
        this.source.connect(this.analyser);
        this.source.connect(this.audioContext.destination);
        this.analyser.fftSize = 64;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
    }

    startMusic(e){
        if(this.audio.paused){
            this.audio.src = this.getPlayList()[this.index].src;
            this.audio.currentTime = this.currentTime;
            this.startBtn.innerHTML = 'stop';
            this.audio.play();
        }else{
            this.audio.pause();
            this.currentTime = this.audio.currentTime;
            this.startBtn.innerHTML = 'start';
        }
    }

    previousMusic(e){    
        if(this.index > 0){
            this.index -= 1;
        }else{
            this.index = 0;
        }
        this.audio.src = this.getPlayList()[this.index].src;
        this.audio.play();
    }

    nextMusic(e){
        if(this.index < this.plyaListLength-1){
            this.index += 1;
        }else{
            this.index = 0;
        }
        this.audio.src = this.getPlayList()[this.index].src;
        this.audio.play();
    }
}

window.onload = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        let indexedDB = new IndexedDB([]);
        indexedDB.getAllIndexedPlayList()
                       .then(result => {
                        const app = new App(result);
                        // app.init();
                       });
    }).catch(e => {
        console.error(`Audio permissions denied: ${e}`);
    });
    // indexedDB = new IndexedDB([]);
    // document.getElementById('btn').addEventListener('click', indexedDB.getAllPlayList);
}