import {IndexedDB} from './indexedDB.js';
import {BgControl} from './bgControl.js';

let playList;
let indexedDB;

export class PlayList{
    constructor(){
        this.files = [];
        this.playList = [];
        
        this.fileInput = document.getElementById('audioFile');
        this.fileInput.addEventListener('change',(event)=>{this.filesUpload(event)});

        this.addPlayListBtn = document.getElementById('addBtn');
        this.addPlayListBtn.addEventListener('click',this.clickTest.bind(this));

        this.playListUl = document.getElementById('playListUl');
        
        this.getAllPlayList();
        
    }

    setFiles(file){
        this.files = file;
    }

    getFiles(){
        return this.files;
    }

    setPalyList(playList){
        this.playList = playList;
    }

    getPlayList(){
        return this.playList;
    }

    async filesUpload (event){
        const fileArr = [...event.target.files];
        //[1,2,3]
        const files = await Promise.all(fileArr.map(file=>{return this.readAsDataURL(file)}));
        this.setPalyList(files);
    }

    //** 노션에 정리하기
    readAsDataURL(file){
        return new Promise((resolve, reject)=>{
			let fileReader = new FileReader();
			fileReader.onload = function(){
				return resolve({src:fileReader.result, name:file.name});
			}
			fileReader.readAsDataURL(file);
		});
    }

   clickTest(){
    indexedDB.writeIdxedDB(this.playList);
    this.getAllPlayList();
    this.fileInput.value = '';
    }

   async getAllPlayList(){
       let allIndexedPlayList = await indexedDB.getAllIndexedPlayList();

       while (this.playListUl.hasChildNodes()) {
        this.playListUl.removeChild(this.playListUl.firstChild);
        }
       allIndexedPlayList.forEach(playList => {
            this.playListUl.insertAdjacentHTML('beforeend', `<li>${playList.name}<button id='${playList.id}'>delete</button></li>`);
            document.getElementById(`${playList.id}`).addEventListener('click',(event)=>{this.playListDelete(event.target.id)});
        })
    }

    async playListDelete(id){
        const deleteResult = await indexedDB.playListDelete(id);
        if(deleteResult === 200){
            this.getAllPlayList();
        }else{
            alert('something happen!');
        }
    }

}

window.onload = () => {
    indexedDB = new IndexedDB();
    playList = new PlayList();
    new BgControl();



}
