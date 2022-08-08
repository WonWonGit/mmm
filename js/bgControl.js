export class BgControl{
    constructor(){

        this.paletteBtns = document.getElementsByClassName('palette');

        for(let i=0;i<this.paletteBtns.length;i++){
            this.paletteBtns[i].addEventListener('click',(event)=>{this.clickBg(event)});
        }

        this.background = document.getElementsByClassName('background')[0];
        this.currentBackground = window.localStorage.getItem('bg');

        this.init();
        
    }

    clickBg(event){
        window.localStorage.setItem('bg',event.target.classList[1]);
        document.getElementsByClassName('choose')[0].className = 'check';
        document.getElementsByClassName(window.localStorage.getItem('bg'))[0].firstElementChild.classList.add('choose');
        this.background.className = `background ${window.localStorage.getItem('bg')}-color`;
    }

    init(){
        console.log('ggg');
        if(this.currentBackground !== null){
            this.background.className = `background ${window.localStorage.getItem('bg')}-color`;
            document.getElementsByClassName('choose')[0].className = 'check';
            document.getElementsByClassName(this.currentBackground)[0].firstElementChild.classList.add('choose');
        }else{
            this.background.className = `background primary-color`;
        }
        
    }
}
