import {Res} from '../EasyCreator'
import ImgContainer from './ImgContainer'
import SuperContainer from './SuperContainer'
import TimeTicker from './TimeTicker'
const createjs = window.createjs;
class DraggableContainer extends SuperContainer {
  constructor($dragname) {
    super();
    this.isCenter = false;
    this.mouseOffsetX = 0; //鼠标拖动物体的中心位置
    this.mouseOffsetY = 0;
    this._gobackAni = true; //是否会回到原来的位置可选项目;
    this._gobackAniTime = 300;

    this.dragImgName = $dragname;
    this.dragEnabled = true;
    this.dragObject = null;

    this._hitTestTargetList = []; //碰撞物体;

    this.callbackHitObjectMoving = function() {};
    this.callbackHitObjectPressUp = function() {};
    this.callbackPickUp = function(){};

    this.targetPos = {
      x: 0,
      y: 0,
      originX: 0,
      originY: 0
    }
    this.ctn = null;
    this.mouseDownActionListener = null;
    this.pressMoveActionListener = null;
    this.pressUpActionListener = null;
    this.on("added", this.addedToStage, this, false);
  }
  //碰撞物体;
  addedToStage() {
    if (this.dragImgName) {
      this.dragObject = new ImgContainer();
      this.dragObject.srcTo(this.dragImgName);
      this.addChild(this.dragObject);
      this.mouseDownActionListener = this.dragObject.on("mousedown", this.mouseDownAction, this, false, this.targetPos);
      this.pressMoveActionListener = this.dragObject.on("pressmove", this.pressMoveAction, this, false, this.targetPos);
      this.pressUpActionListener = this.dragObject.on("pressup", this.pressUpAction, this, false, this.targetPos);
    }
    this.cursor = "pointer";
  }

  srcTo($dragname){
    if (this.dragObject) {
      this.dragObject.destory();
    }
    this.dragObject = new ImgContainer();
    this.dragObject.srcTo($dragname);

    this.addChild(this.dragObject);
    this.mouseDownActionListener = this.dragObject.on("mousedown", this.mouseDownAction, this, false, this.targetPos);
    this.pressMoveActionListener = this.dragObject.on("pressmove", this.pressMoveAction, this, false, this.targetPos);
    this.pressUpActionListener = this.dragObject.on("pressup", this.pressUpAction, this, false, this.targetPos);
  }
  destroy(){
    if(this.dragObject){
      this.dragObject.off("mousedown",this.mouseDownActionListener);
      this.dragObject.off("pressmove",this.pressMoveActionListener);
      this.dragObject.off("pressup",this.pressUpActionListener);

      this.parent.removeChild(this);
    }

  }
  enableDrag(){
    this.dragEnabled = true;
  }
  disableDrag(){
    this.dragEnabled = false;

  }
  setGoBack(_b=true){
    this._gobackAni = _b;
  }
  setGoBackAniTime($time=300){
    this._gobackAniTime = $time;
  }
  setCallbackHitObjectMoving(_cb) {
    this.callbackHitObjectMoving = _cb;
  }
  setCallbackHitObjectPressUp(_cb) {
    this.callbackHitObjectPressUp = _cb;
  }
  setCallbackPickUp(_cb) {
    this.callbackPickUp = _cb;
  }
  setCenterMouse(_b = false) {
    this.isCenter = _b;
  }
  setHitTestObject(_targets=[]) {
    for(let i=0;i<_targets.length;i++){
        this._hitTestTargetList.push(_targets[i])
    }

  }
  getHitTestObject(){
    if(this._hitTestTargetList){
      return this._hitTestTargetList;
    }
  }
  setDragSrc($name) {
    this.dragImgName = $name;
    if (this.dragObject == null) {
      this.dragObject = new ImgContainer();
      this.dragObject.srcTo(this.dragImgName);
      this.addChild(this.dragObject);
    } else {
      this.dragObject.srcTo($name);
    }
    this.mouseDownActionListener = this.dragObject.on("mousedown", this.mouseDownAction, this, false, this.targetPos);
    this.pressMoveActionListener = this.dragObject.on("pressmove", this.pressMoveAction, this, false, this.targetPos);
    this.pressUpActionListener = this.dragObject.on("pressup", this.pressUpAction, this, false, this.targetPos);
  }
  pressUpAction(event, data) {
    if(this.dragEnabled==false)return;
    const self = this;



    let p = this.getLocal(event.stageX,event.stageY);

    let hitP = this.getGlobal(self.dragObject.x, self.dragObject.y);
    let localP = self.parent.globalToLocal(hitP.x,hitP.y);//转换为在拖曳对象负父亲坐标


    // let targetP = this._hitTestTargetList.parent.globalToLocal()
    //console.log(this._hitTestTargetList)
    if(this._hitTestTargetList.length>0){
      for(let i=0;i<this._hitTestTargetList.length;i++){


        if(this._hitTestTargetList[i].hitTest(localP.x,localP.y)){

            this.callbackHitObjectPressUp.call(this,this._hitTestTargetList[i],event,data);
        }

      }
    }
    data.x = p.x;
    data.y = p.y
    if (self._gobackAni) {
      createjs.Tween.get(event.currentTarget).to({
        x: data.originX,
        y: data.originY
      }, self._gobackAniTime, createjs.Ease.backOut)
    }
    //  console.log(this._hitTestTargetList.x,hitP.x);
  }
  pressMoveAction(event,data) {
    if(this.dragEnabled==false)return;
    const self = this;
    let p = this.getLocal(event.stageX,event.stageY);

    if (this.isCenter) {
      event.currentTarget.x = p.x;
      event.currentTarget.y = p.y
    } else {
      event.currentTarget.x = p.x + this.mouseOffsetX * -1;
      event.currentTarget.y = p.y + this.mouseOffsetY * -1;
    }
    let hitP = this.getGlobal(self.dragObject.x, self.dragObject.y);
    let localP = self.parent.globalToLocal(hitP.x,hitP.y);//转换为在拖曳对象负父亲坐标


    //console.log(this._hitTestTargetList[0].x,localP.x)
    if(this._hitTestTargetList.length>0){
      for(let i=0;i<this._hitTestTargetList.length;i++){

        if(this._hitTestTargetList[i].hitTest(localP.x,localP.y)){
            this.callbackHitObjectMoving.call(this,this._hitTestTargetList[i],event,data);
        }

      }
    }
    data.x = p.x;
    data.y = p.y;

  }
  mouseDownAction(event,data) {
    if(this.dragEnabled==false)return;
    const self = this;
    this.toTopDepth();
    let p = event.currentTarget.parent.globalToLocal(event.stageX, event.stageY);
    let distX = (p.x - event.currentTarget.x) * 1;
    let distY = (p.y - event.currentTarget.y) * 1;
    this.mouseOffsetY = distY;
    this.mouseOffsetX = distX;
    this.callbackPickUp.call(this,event,data);

  }
}
export default DraggableContainer;
