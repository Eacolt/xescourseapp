const createjs = window.createjs;
import TimeTicker from './TimeTicker'
class SuperContainer extends createjs.Container{
  constructor(){
    super();
    this._name = "";
    this._hitAreaShape = null;
    this._showHitArea = false;


    this.actionMaps = [];

    this.bgCtn = null;

  }


  setButtonMode(_c=null){
    this.cursor = "pointer";

  }
  setName($name){
    this._name = $name;
  }
  getName(){
    return this._name;
  }
  getLocal(_stageX,_stageY){
    let p = this.globalToLocal(_stageX,_stageY);
    return p;
  }
  getGlobal(_localX,_localY){
    let p = this.localToGlobal(_localX,_localY);
    return p;
  }

  toTopDepth(){
    this.parent.setChildIndex(this, this.parent.numChildren - 1)
  }


  setHitArea($x=0,$y=0,$width=200,$height=200){

    const self = this;
    // let globalP;
    // if(self.parent){
    //   globalP = self.localToGlobal(self.x,self.y);
    // }
    // console.log(globalP)


    let bgClr = "rgba(111,111,111,0.5)";
    this._hitAreaShape = new createjs.Shape();
    this._hitAreaShape.graphics.beginFill(bgClr);
    this._hitAreaShape.graphics.drawRect(0,0,$width,$height);
    this._hitAreaShape.graphics.endFill();
    this._hitAreaShape.x = $x;
    this._hitAreaShape.y = $y;
    this.addChild(this._hitAreaShape);
    this._hitAreaShape.setBounds($x,$y,$width,$height);
  }
  getHitArea(){

    if(this._hitAreaShape){
      return this._hitAreaShape;
    }
  }
  showHitArea(_b=true){
    const self = this;
  //  this._hitAreaShape.alpha = _b==true ? 1 : 0.01 ;
    let t = new TimeTicker();
    t.start(d);
    function d(){
      if(self._hitAreaShape){

        if(_b){
          self._hitAreaShape.alpha=1;
          console.log("bu touming")
        }else{
          self._hitAreaShape.alpha = 0.02;
        }
        t.stop();
      }
    }

  }

  setActions(actionName,actionFunc){
    let checkName = Array.prototype.some.call(this.actionMaps,(item,index)=>{
      return item.name == actionName
    })
    // alert("重复了!")
    if(checkName)return;
     this.actionMaps.push({
       name:actionName,
       action:actionFunc
     });

  }
  doActions(actionName){
    const self = this;
    let myaction = null;
    let checkActionName = Array.prototype.some.call(this.actionMaps,(item,index)=>{
      return item.name == actionName
    })

    if(checkActionName){
      self.actionMaps.forEach((item,index)=>{
        if(item.name == actionName){

          myaction =  item.action;
        }
      })
    }
    return myaction;
  }
}
export default SuperContainer;
