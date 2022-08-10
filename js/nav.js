export class NavControl{
    constructor(){
        this.menuBtn = document.querySelector('.menu-btn');
        this.nav = document.querySelector('.nav');
        this.lineOne = document.querySelector('.nav .menu-btn .line--1');
        this.lineTwo = document.querySelector('.nav .menu-btn .line--2');
        this.lineThree = document.querySelector('.nav .menu-btn .line--3');
        this.link = document.querySelector('.nav .nav-links');
        this.control = document.querySelector('.control');
        this.playList = document.querySelector('.nav-playList');

        this.menuBtn.addEventListener('click', this.showMenu.bind(this));
    }

    showMenu(){
        this.nav.classList.toggle('nav-open');
        this.lineOne.classList.toggle('line-cross');
        this.lineTwo.classList.toggle('line-fade-out');
        this.lineThree.classList.toggle('line-cross');
        this.link.classList.toggle('fade-in');
        if(this.control !== null){
            this.control.classList[1] == 'fade-in' ? this.control.classList = 'control fade-out' : this.control.classList = 'control fade-in';
        }
        if(this.playList != null && [...this.playList.classList].includes('playList-open')){
            this.playList.classList.remove('playList-open');
        }
    }
}