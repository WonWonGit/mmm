import { IndexedDB } from "./indexedDB.js";
import {AudioControl} from "./audioControl.js";
class App{
    constructor(playList){

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'mainCanvas';
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        // this.leftCanvas = document.createElement('canvas');
        // this.leftCanvas.className = 'leftCanvas';
        // this.leftCtx = this.leftCanvas.getContext('2d');
        // document.body.appendChild(this.leftCanvas);

        // this.rightCanvas = document.createElement('canvas');
        // this.rightCanvas.className = 'rightCanvas';
        // this.rightCtx = this.rightCanvas.getContext('2d');
        // document.body.appendChild(this.rightCanvas);

        this.audioControl = new AudioControl(playList, this.ctx);


        // this.audioControl = new AudioControl(playList);

        window.addEventListener('resize', this.resize.bind(this), {
            once: false,
            passive: false,
            capture: false,
        });

        this.resize();
    }


    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
    
        this.canvas.width = this.stageWidth * 2;
        this.canvas.height = this.stageHeight * 2;

        this.ctx.scale(2, 2);

        this.audioControl.resize(this.stageWidth, this.stageHeight);
    }



}

window.onload = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        let indexedDB = new IndexedDB([]);
        indexedDB.getAllIndexedPlayList()
                       .then(result => {
                        const app = new App(result);
                       });
    }).catch(e => {
        console.error(`Audio permissions denied: ${e}`);
    });
}