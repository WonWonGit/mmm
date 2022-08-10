import { IndexedDB } from "./indexedDB.js";

export class PlayListControl{
    constructor(){

        this.files = [];
        this.uploadMusicFiles = [];
        this.allPlayList = [];

        this.indexedDB = new IndexedDB();

        this.playList = document.querySelector('.nav-playList');
        this.playListBtn = document.querySelector('.listBtn');
        this.nav = document.querySelector('.nav');
        this.tracks = document.querySelector('.tracks');

        this.add = document.querySelector('.add');
        this.add.addEventListener('mouseover', this.showAddBtn.bind(this));
        this.add.addEventListener('mouseout', this.hideAddBtn.bind(this));
        this.addIcon = document.querySelector('.add-btn');
        this.musicIcon = document.querySelector('.music-btn');
        
        this.uploadIcon = document.querySelector('.upload-btn');
        this.uploadIcon.addEventListener('click', this.uploadFilesToIndexdDB.bind(this));

        this.cancleIcon = document.querySelector('.cancle-btn');
        this.cancleIcon.addEventListener('click', this.cancleUploadFileDisplay.bind(this));

        this.playListBtn.addEventListener('click',this.showPlayList.bind(this));

        this.playListUl = document.querySelector('.ul-playList');
        

        this.fileInput = document.querySelector('.file-input');
        this.fileName = document.querySelector('.file-name');
        this.fileInput.addEventListener('change',(event)=>{this.filesUpload(event)});

        this.init();
    }

    async init(){
        this.allPlayList = await this.indexedDB.getAllIndexedPlayList();
        
        while (this.playListUl.hasChildNodes()) {
            this.playListUl.removeChild(this.playListUl.firstChild);
        }

        this.tracks.innerHTML = `${this.allPlayList.length} tracks`;

        this.allPlayList.forEach((playList,index) => {
            var insertHtml = `<li class="li-playList" id=${playList.id}>
                                <div class="disc">
                                    <img src="/icon/compact-disc-solid.svg">
                                </div>
                                <div class="li-index">${(index+1).toString().length=== 1 ? `0${index+1}` : index+1 }</div>
                                <div class="li-name">${playList.name}</div>
                                <button id='${playList.id}'>delete</button>
                              </li>`
            this.playListUl.insertAdjacentHTML('beforeend',insertHtml);
            // document.getElementById(`${playList.id}`).addEventListener('click',(event)=>{this.playListDelete(event.target.id)});
        })
    }

    setUploadMusicFiles (uploadMusicFiles){
        this.uploadMusicFiles  = uploadMusicFiles ;
    }

    getUploadMusicFiles (){
        return this.uploadMusicFiles;
    }

    showPlayList(){
        this.playList.classList.toggle('playList-open');

        if([...this.nav.classList].includes('nav-open')){
            this.nav.classList.remove('nav-open');
        }
    }

    showAddBtn(){
        this.addIcon.classList.remove('fade-in');
        this.addIcon.classList.add('fade-out');
        this.musicIcon.classList.remove('fade-out');
        this.musicIcon.classList.add('fade-in');
        // [...this.addIcon.classList].includes('fade-in') ? [...this.addIcon.classList].add('fade-out') : [...this.addIcon.classList].add('fade-in');
    }

    hideAddBtn(){
        this.addIcon.classList.remove('fade-out');
        this.addIcon.classList.add('fade-in');
        this.musicIcon.classList.remove('fade-in');
        this.musicIcon.classList.add('fade-out');
    }

    async filesUpload (event){
        const fileArr = [...event.target.files];
        const files = await Promise.all(fileArr.map(file=>{return this.readAsDataURL(file)}));
        this.setUploadMusicFiles(files);
        event.target.files.length > 1 ? this.fileName.innerHTML = `${event.target.files.length} files` : this.fileName.innerHTML = event.target.files[0].name;
        if(event.target.value !== ''){
            this.uploadFileDisplay();
        }else{
            this.cancleUploadFileDisplay();
        }
    }

    readAsDataURL(file){
        return new Promise((resolve)=>{
			const fileReader = new FileReader();
 			fileReader.onload = function(){
				return resolve({src:fileReader.result, name:file.name});
			}
			fileReader.readAsDataURL(file);
		});
    }

    cancleUploadFileDisplay(){
        this.fileInput.value = '';
        this.fileName.innerHTML = '';
        this.uploadIcon.style.display = 'none';
        this.cancleIcon.style.display = 'none';
        this.add.classList.toggle('hide');
    }

    uploadFileDisplay(){
        this.uploadIcon.style.display = 'block';
        this.cancleIcon.style.display = 'block';
        this.add.classList.toggle('hide');
    }

    async uploadFilesToIndexdDB(){
        const writeResult = await this.indexedDB.writeIdxedDB(this.uploadMusicFiles)
        if(writeResult === 200){
            this.fileInput.value = '';
            this.cancleUploadFileDisplay();
            this.init();
        }else{
            alert('something happen!');
        }
    }

    playingMusic(nowPlayingMusicId){
        console.log(nowPlayingMusicId);
        var playListLi =  document.getElementsByClassName('li-playList');
        console.log(playListLi);
        [...playListLi].forEach((li) => {
            if(li.id == nowPlayingMusicId){
                li.style.backgroundColor = '#f3f3f3';
                li.classList.add('showDisc');
                // document.querySelector('.li-index').classList.toggle('showDisc');
            }else{
                li.style.backgroundColor = '#fff';
                li.classList.remove('showDisc');
            }
        })
        
    }
}

// window.onload = () => {
//     new PlayListControl();
// }