import { IndexedDB } from "./indexedDB.js";
export class OrderControl{
    constructor(allPlayList){
        this.position = {x:null, y:null};
        this.diff = {x:null, y:null};
        this.mouseDown = false;
        this.seletedLi = null;
        this.resetTransition = false;
        this.trasitonTime = 400;

        this.playListUl = document.querySelector('.ul-playList');

        this.playListLi = document.getElementsByClassName('li-playList');

        this.playListNav = document.querySelector('.nav-playList');
        
        [...this.playListLi].forEach((li, index) => {
            li.setAttribute('order', index+1);
            li.addEventListener('mousedown',(e)=>{ this.seletedPlayListLi(e, li)});
            li.addEventListener('mouseup', (e)=>{ this.doneSelectedPlayList(e)});
        });

        this.playListNav.addEventListener('mousemove', (e)=>{this.setMousePosition(e)});
        
        this.allPlayList = allPlayList;

        this.indexedDB = new IndexedDB();
    }

    seletedPlayListLi(e, li){

        console.log('select');

        if(!this.position.x || this.resetTransition) return;
        
        this.mouseDown = true;
        this.seletedLi = li;
        this.seletedLi.zIndex = '1000';
        this.diff.y = this.position.y - this.seletedLi.offsetTop;
        this.diff.x = this.position.x - this.seletedLi.offsetLeft; 
        
        const offsetY = this.position.y - this.diff.y;
        const offsetX = this.position.x - this.diff.x;

        this.seletedLi.style.top = `${offsetY}px`;
        this.seletedLi.style.left = `${offsetX}px`;
        this.seletedLi.classList.add('selected');

        
        this.seletedLi.setAttribute('selected','yes');
        this.orderOfSelectedItem = Number(this.seletedLi.getAttribute('order'));
    }

    doneSelectedPlayList(e){
        this.mouseDown = false;
        this.seletedLi.classList.remove('selected');
        // this.positionItem(); 
        this.postionItemsInOrder();
        
    }

    setMousePosition(e){

        // console.log('move');

        this.position.x = e.clientX - this.playListUl.offsetLeft;
        this.position.y = e.clientY - (this.playListUl.offsetTop - this.playListUl.scrollTop);

        if(!this.mouseDown) return;
        const offsetY = this.position.y - this.diff.y;
        const offsetX = this.position.x - this.diff.x;

        this.seletedLi.style.top = `${offsetY}px`;
        this.seletedLi.style.left = `${offsetX}px`;

        this.orderOfSelectedItem = Number(this.seletedLi.getAttribute('order'));


        if(this.orderOfSelectedItem !== 1){
            var beforeItem = document.querySelector(`.li-playList[order *= "${this.orderOfSelectedItem-1}"]`);
            var beforeMiddle = this.position.y < beforeItem.offsetTop + (beforeItem.clientHeight/2);
            if(beforeMiddle){
                this.positionItem(this.orderOfSelectedItem - 1);
                this.seletedLi.setAttribute('order', this.orderOfSelectedItem - 1 );
                return;
            }
        }


        if(this.orderOfSelectedItem !== this.playListLi.length){
            var afterItem = document.querySelector(`.li-playList[order *= "${this.orderOfSelectedItem+1}"]`);
            var afterMiddle = this.position.y > afterItem.offsetTop + (afterItem.clientHeight/2);

            if(afterMiddle){
                this.positionItem(this.orderOfSelectedItem + 1);
                this.seletedLi.setAttribute('order' , this.orderOfSelectedItem + 1);
                return;
            }
        }


    }

    positionItem(insertIndex = null){
        var playListItems = [...this.playListLi];
        
        playListItems = playListItems.filter((item) => item.getAttribute('selected') !== 'yes');
        var indexCounter = 0;
        playListItems.forEach((item) => {
            if(insertIndex === indexCounter+1){
                indexCounter ++;
            }
            //60 19
            
            item.style.top = (60 * indexCounter) + 'px';
            item.setAttribute('order', indexCounter+1);
            indexCounter++;
        });


    }

    postionItemsInOrder(){
        var playListItems = [...this.playListLi];
        playListItems.sort((a, b) =>{
            return Number(a.getAttribute('order')) > Number(b.getAttribute('order')) ? 1 : -1;
        });
        playListItems.forEach((item, index) => {
            if(item.getAttribute('selected') === 'yes'){
                item.removeAttribute('selected');
                item.style.left = 0;
                setTimeout(() => {
                    item.style.zIndex = '0';
                }, this.trasitonTime);
            }
            //60 19
            item.style.top = (60 * index) + 'px';
            item.setAttribute('order', index+1);
        });

        this.resetTransition = true;

        setTimeout(() => {
            while(this.playListUl.firstChild){
                this.playListUl.removeChild(this.playListUl.lastChild);
            }

            playListItems.forEach((item) => {
                this.playListUl.append(item);
            });
            this.resetTransition = false;
        }, this.trasitonTime);
        this.playListLi = playListItems;
        this.test();
    }

    test(){
        var playListItems = [...this.playListLi];
        var test = [];

        // console.log(this.allPlayList);/

        this.allPlayList.forEach((item, index) => {
            console.log(item.id , playListItems[index].id);
            if(item.id !== Number(playListItems[index].id)){
                this.indexedDB.updatePlayListId(item.id);
            }
        });
        // filter 에서 변경되어야할 리스트랑 화면의 순서대로 보이는 아이디값도 같이 전달
        // 변경되어야할 리스트의 아이디값으로 update 해줌
        //
        // console.log(test);
    
    }
}