import {
  Res,
  Tween,
  Utils,
  Sprite,
  ReactStore,
  Reg
} from '../EasyCreator';
import AdobeAn from '../AbstractComponents/AdobeAn'
import Keyboards from '../MovieClipComponents/KeyBoardAni'
import SuperContainer from '../AbstractComponents/SuperContainer'
import Kuang from './Kuang'

const createjs = window.createjs;
class KeyBoard extends SuperContainer {
  constructor() {
    super();
    this.focusTarget = null;
    this.actionState = "hidden";
    this.calculateNum = "";
    this.keyBoardState = "unshow";
    this.spreadBMP = null;
    this.actionMaps = [];
    this.privateAction_MoveDown = this.privateAction_MoveDown.bind(this);
    this.publicAction_MoveUp = this.publicAction_MoveUp.bind(this);
    this.on("added", this.addedToStage, this, false);

  }

  connectToInput(arr = []) {
    this.focusTarget = arr;
  }
  addedToStage() {
    const self = this;
    //doActions;
    this.setActions("MOVE_UP", self.privateAction_MoveDown);

    let keyboardAtlas = AdobeAn.getAtlas("SuperKeyBoard");
    this.spreadBMP = new createjs.Bitmap(Res.getRes("spread_png"));

    //keyboardAtlas.timeline.addChild(dd)
    this.myKeyBoard = new keyboardAtlas.superKeyboard();
    this.addChild(this.spreadBMP);
    this.addChild(this.myKeyBoard);

    this.myKeyBoard.x = 480;
    this.myKeyBoard.y = 850 + 250;
    //  this.moveDown(0);

    this.spreadBMP.cursor = "pointer";
    this.spreadBMP.x = 1455;
    this.spreadBMP.y = 920 + 250;
    // this.myKeyBoard.x = 480;
    // this.myKeyBoard.y = 850;
    for (let i = 0; i < 10; i++) {
      this.myKeyBoard["key" + i].cursor = "pointer";
      this.myKeyBoard["key" + i].name = i;
      this.myKeyBoard["key" + i].on("click", this.keyNumberClickListener, this, false);
    }
    this.myKeyBoard.keydel.on("click", this.keydelClickListener, this, false);
    this.myKeyBoard.keyclear.on("click", this.keyclearClickListener, this, false);

    this.spreadBMP.on("click", this.doActions("MOVE_UP"), this, false);
  }
  privateAction_MoveDown() {

    const self = this;
    if(self.keyBoardState == "showed"){
      for(let i=0;i<Kuang.kuangArr.length;i++){
        Kuang.kuangArr[i].unSelected();
      }
      self.keyBoardState = "playing";
      createjs.Tween.get(this).to({
        y: 250
      }, 300).call(()=>{
        self.keyBoardState = "unshow";
      })
    }

  }
  publicAction_MoveUp() {

    const self = this;
    if(self.keyBoardState == "unshow"){

      self.keyBoardState = "playing";
      createjs.Tween.get(this).to({
        y: -250
      }, 300).call(()=>{
       self.keyBoardState = "showed";
      })
    }


  }
  //doActions

  // setSpreadAction(cb,action){
  //    this.actionMoveDown = cb;
  //
  // }
  // setActionMoveUp(cb,action){
  //   this.actionMoveUp = cb;
  // }
  // doActionMoveUp(){
  //   if(this.actionMoveUp){
  //     this.actionMoveUp().call(()=>{
  //       alert(666)
  //     })
  //   }
  // }
  // moveDown(cb){
  //   if(this.actionMoveDown){
  //     this.actionMoveDown()
  //   }
  // }
  keyclearClickListener(event) {

    if (this.focusTarget && this.focusTarget.length > 0) {
      //  this.calculateNum+=event.currentTarget.name;
      this.focusTarget.forEach((item, index) => {
        //  item.
        item.clearNum()
      })
      //  this.focusTarget.setInputText("d");
    }
  }
  keydelClickListener(event) {
    if (this.focusTarget && this.focusTarget.length > 0) {
      //  this.calculateNum+=event.currentTarget.name;
      this.focusTarget.forEach((item, index) => {
        //  item.
        item.delNum()
      })
      //  this.focusTarget.setInputText("d");
    }
  }
  keyNumberClickListener(event) {

    if (this.focusTarget && this.focusTarget.length > 0) {
      //  this.calculateNum+=event.currentTarget.name;
      this.focusTarget.forEach((item, index) => {
        //  item.
        item.setInputText(event.currentTarget.name)
      })
      //  this.focusTarget.setInputText("d");
    }
  }
}
export default KeyBoard;
