import EventEmitter from "events";
import React from "react";



export default class DragEventSignle extends EventEmitter{
    static instance: DragEventSignle
    static getInstance() {
        this.instance ??= new DragEventSignle();

        return this.instance;
    }

    constructor() {
        super();
        this.initBind();
        this.initEvent();
        
    }
    initBind() {
        this.onDrag = this.onDrag.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
    }
    initEvent() {
        document.addEventListener('drag', this.onDrag, false);
        document.addEventListener('drop', this.onDrop, false);
        document.addEventListener('dragstart', this.onDragStart, false);
        document.addEventListener('dragend', this.onDragEnd, false);
        document.addEventListener('dragenter', this.onDragEnter, false);
        document.addEventListener('dragover', this.onDragOver, false);
    }
    onDrag(event: Event) {
        this.emit('drag', event);
    }
    onDrop(event: Event) {
        this.emit('drop', event);
    }
    onDragStart(event: Event) {
        this.emit('dragStart', event);
    }
    onDragEnd(event: Event) {
        this.emit('dragEnd', event);
    }
    onDragEnter(event: Event) {
        this.emit('dragEnter', event);
    }
    onDragOver(event: Event) {
        this.emit('dragOver', event);
    }


    destroy() {
        document.removeEventListener('drag', this.onDrag);
        document.removeEventListener('dragstart', this.onDragStart);
        document.removeEventListener('dragend', this.onDragEnd);
        document.removeEventListener('dragenter', this.onDragEnter);
        document.removeEventListener('dragover', this.onDragOver);
    }

}


