import {IndexedDB} from './indexedDB.js';

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
            this.playListUl.insertAdjacentHTML('beforeend', `<li>${playList.name}</li>`);
        })
    }

}

window.onload = () => {
    indexedDB = new IndexedDB();
    playList = new PlayList();


}


// uploadDocuments = async (event, files) => {
//     const filePromises = files.map((file) => {
//       // Return a promise per file
//       return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = async () => {
//           try {
//             const response = await this.submitFile(
//               reader.result,
//               file.name,
//               fileType
//             );
//             // Resolve the promise with the response value
//             resolve(response);
//           } catch (err) {
//             reject(err);
//           }
//         };
//         reader.onerror = (error) => {
//           reject(error);
//         };
//         reader.readAsDataURL(file);
//       });
//     });
  
//     // Wait for all promises to be resolved
//     const fileInfos = await Promise.all(filePromises);
  
//     console.log('COMPLETED');
  
//     // Profit
//     return fileInfos;
//   };
//   Share
  

// const fileToBlob = () => {

    // files.map(file => {
    //     const reader = new FileReader();

    //     reader.onload = () => {
    //         var dataURL = reader.result;
    //         playList.push({name: file.name, src : dataURL});
    //     };

    //     reader.readAsDataURL(file);
    // });

    // console.log(playList);

    // localStorage.setItem('playList', JSON.stringify(playList));

    // console.log(localStorage.getItem('playList'));
// }

// const filesUpload = (event) => {
//     const fileArr = Array.from(event.target.files);
//     fileArr.forEach(file => files.push(file));
//     // localStorage.setItem('playList', JSON.stringify(files));
//     // files = event.target.files;
//     // console.log(document.getElementById('audioFile').value);
// }

// const addAudio = () => {
//     const audioInput = document.getElementById('audioFile');
//         if(audioInput.value === ''){
//             alert('파일 선택해주세요')
//         }else{
//            fileToBlob(); 
//         }  
// }



    // function fileUpload(event){
    //     let file = event.target.files[0];
    //     let reader = new FileReader();

    //     reader.onload = function(){
    //         var dataURL = reader.result;
    //         var output = document.getElementById('test');
    //         output.src = dataURL;
    //         localStorage.setItem('test',dataURL);
    //     };
    //     reader.readAsDataURL(file);
    // }
