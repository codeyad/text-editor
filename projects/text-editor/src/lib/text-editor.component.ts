import { Renderer2 } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'lib-text-editor',
  template: `
  <div>
  <div class="insert-text">
    <input type="text" [(ngModel)]="insertText">
    <button (click)="onInsertText()" [disabled]="insertText === ''">Insert text</button>
  </div>
  <button (click)="onBold()" style="font-style:'bold'">B</button>
  <button (click)="onItalic()" style="font-style:'italic'">I</button>
  <button (click)="onUnderline()" style="font-style:'underline'">U</button>
  <button style="float:right" (click)="print()">Print</button>
  <p #texteditor 
  (mouseup)="showSelectedText()"
  (keypress)="onKeyPress($event)" 
  contenteditable="true" 
  class="editable-text-view">
    
  </p>
  </div>
  `,
  styles: [
    `.editable-text-view{
      border: black;
      border-width: 2px;
      border-style: outset;
      min-height: 20em;
    }`,
    `
    @media print {
      .editable-text-view {
        background: white;
        display: block;
        margin: 0 auto;
        margin-bottom: 0.5cm;
        box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
        width: 21cm;
        height: 29.7cm; 
      }
    }`,
      `@media print{
        .insert-text, button{
          display: none;
        }
      }
    }
    `
  ]
})
export class TextEditorComponent{
  
  @ViewChild('texteditor') editorEl: ElementRef<HTMLInputElement>;
  selectedText: string = '';
  
  constructor(private renderer: Renderer2) { }
  insertText: string = '';
  
  showSelectedText() {
    let text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.getSelection()) {
      text = document.getSelection().toString();
    }
    this.selectedText = text;
  }
  
  onKeyPress(event: KeyboardEvent){
    let code = event.code;
    this.inserElementByPosition(code, event.key);
    
    return false;
    
  }
  
  inserElementByPosition(code:string, text){
    
    let selected = window.getSelection();
    let range = selected.getRangeAt(0);
    
    if(selected.focusNode.nodeName === 'DIV') return false;
    
    //create new node with the text nserted
    let newElement = document.createElement('span');
    
    if(code === 'Enter') {
      newElement.insertAdjacentHTML('afterbegin', '<br />');
    }else{
      newElement.append( code === 'Space' ? '\u00A0': text);
    }
    
    let preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(this.editorEl.nativeElement);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    
    let position = this.getTextLength(this.editorEl.nativeElement, range.startContainer, range.startOffset);
    
    //delete text if selected
    selected.deleteFromDocument();
    range.insertNode(newElement);
    
    let children: HTMLCollection = this.editorEl.nativeElement.children;
    let elem: Element;
    if(children.length === position){
      elem = children[position-1].insertAdjacentElement('afterend', newElement);
    }else{
      elem = children[position].insertAdjacentElement('beforebegin', newElement);
    }
    
    let lastChildAdded: ChildNode = this.editorEl.nativeElement.lastChild;
    range.setStartAfter(elem);
    range.collapse(true);
    
    return true;
  }
  
  getTextLength(parent, node, offset) {
    var textLength = 0;
    
    if (node.nodeName == '#text')
    textLength += offset;
    else for (var i = 0; i < offset; i++)
    textLength += this.getNodeTextLength(node.childNodes[i]);
    
    if (node != parent)
    textLength += this.getTextLength(parent, node.parentNode, this.getNodeOffset(node));
    
    return textLength;
  }
  
  getNodeOffset = function (node) {
    return node == null ? -1 : 1 + this.getNodeOffset(node.previousSibling);
  }
  
  getNodeTextLength(node) {
    var textLength = 0;
    
    if (node.nodeName == 'BR')
    textLength = 1;
    else if (node.nodeName == '#text')
    textLength = node.nodeValue.length;
    else if (node.childNodes != null)
    for (var i = 0; i < node.childNodes.length; i++)
    textLength += this.getNodeTextLength(node.childNodes[i]);
    
    return textLength;
  }
  
  onBold(){
    this.setStyle('B');
  }
  
  onItalic(){
    this.setStyle('I');
  }
  
  onUnderline(){
    this.setStyle('U');
  }
  
  setStyle(style: 'B' | 'I' | "U"){
    let nodes = this.editorEl.nativeElement.childNodes;
    nodes.forEach((node: HTMLElement) => {
      if(document.getSelection()){
        //document.getSelection().containsNode(node);
        let selected = document.getSelection().containsNode(node, true); //get selected node
        if(node.tagName === 'SPAN' && selected){
          switch (style) {
            case 'B':
            node.style.fontWeight === 'bold' ? node.style.removeProperty('font-weight') : node.style.setProperty('font-weight', 'bold');
            break;
            case 'I':
            node.style.fontStyle === 'italic' ? node.style.removeProperty('font-style') : node.style.setProperty('font-style', 'italic');
            break;
            case 'U':
            node.style.textDecoration === 'underline' ? node.style.removeProperty('text-decoration') : node.style.setProperty('text-decoration', 'underline');
            break;
          }
        }
      }
    })
  }
  
  onInsertText(){
    let textArray: string[] = this.insertText.split('');
    let result = false;
    textArray.forEach(char => {
      if(char === ' '){
        result = this.inserElementByPosition('Space', char);
      }else{
        result = this.inserElementByPosition('', char);
      }
    });
    if(result) this.insertText = '';
    
  }

  print(){
    window.print();
  }
  
}
