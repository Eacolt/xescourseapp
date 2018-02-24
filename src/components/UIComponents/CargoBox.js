//存放物体的抽屉
import SuperContainer from '../AbstractComponents/SuperContainer'
import ImgContainer from '../AbstractComponents/ImgContainer'
import DraggableContainer from '../AbstractComponents/DraggableContainer'
class CargoBox extends SuperContainer {
  static currentItem = [];
  static currentPartItems = null;
  static _globalCargos = [];


  constructor(_x = 0, _y = 0, _width = 100, _height = 100) {

    super();
    this._cargoName = null;
    this._cargoX = _x;
    this._cargoY = _y;
    this._cargoWidth = _width;
    this._cargoHeight = _height;
    this.cargoArr = [];
    this._cargoArea = null;
    this._otherCargo = null;

    this.getGlobals = null;
    this.on("added", this.addedToStage, this, false);
  }
  addedToStage() {
    this._cargoArea = this.setHitArea(this._cargoX, this._cargoY, this._cargoWidth, this._cargoHeight);
    this.addChild(this._cargoArea);

    //this.getGlobals = this.getGlobal();
  }
  static pushInCargos(cargo=[]){
    CargoBox._globalCargos.push(cargo);
  }
  static getCargoByIndex(n=0){
    return CargoBox._globalCargos[n];
  }
  getCargoArea() {
    return this.getHitArea();
  }
  setOhterCargo(cargo) {
    this._otherCargo = cargo;
  }
  getOtherCargo() {
    if (this._otherCargo) {
      return this._otherCargo;
    }

  }
  setName($name){
    this._cargoName = $name;
  }
  getName($name){
    return this._cargoName;
  }
  addItem($name) {
    let item = new DraggableContainer($name);

    this.addChild(item);
    this.cargoArr.push(item);

    item.setCenterMouse(true);

    item.setName($name + Number(this.cargoArr.length-1));

    if (this._otherCargo) {

      item.setHitTestObject([this._otherCargo.getCargoArea()]);
      //  leg.dragPosition
      item.setCallbackHitObjectMoving(() => {

      })
      item.setCallbackPickUp((event)=>{

        CargoBox.currentPartItems = event.currentTarget.parent.parent.getName();//当前选择的是哪一个CargoBox;名字判断：
        //console.log(item.getName())
        if(CargoBox.currentItem.length>0 ){

          CargoBox.currentItem = [];
        }
        CargoBox.currentItem.push(item);


      })
      item.setCallbackHitObjectPressUp((hittedTarget,event,data) => {

        let getIndex = event.currentTarget.parent.getName().replace($name,"");


        this.deletedItem(Number(getIndex),$name);
      //  console.log(getId)
        this._otherCargo.addItem($name);

        CargoBox.currentItem = [];

      })
    }

    for (var i = 0; i < this.cargoArr.length; i++) {
      this.cargoArr[i].x = this._cargoX + i * 120 + 80;
      this.cargoArr[i].y = this._cargoY + 140;
    }

  }
  deletedItem(_index,$name) {
    if(this.cargoArr[_index] && this.cargoArr.length>0){
      this.cargoArr[_index].destroy();
      this.cargoArr.splice(_index,1)
    }
    this.formatItems($name);
  }
  clearCargo(){
    for (var i = 0; i < this.cargoArr.length; i++) {
      this.cargoArr[i].destroy();

    }
    this.cargoArr = [];
  }
  formatItems($name){
    //重新排序;
    for (var i = 0; i < this.cargoArr.length; i++) {
      this.cargoArr[i].setName($name + i);
      this.cargoArr[i].x = this._cargoX + i * 120 + 80;
      this.cargoArr[i].y = this._cargoY + 140;
    }
  }
}
export default CargoBox;
