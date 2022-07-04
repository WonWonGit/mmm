import { IndexedDB } from "./indexedDB.js";
var indexedDB;
window.onload = () => {
    indexedDB = new IndexedDB([]);
    document.getElementById('btn').addEventListener('click', indexedDB.getAllPlayList);
}