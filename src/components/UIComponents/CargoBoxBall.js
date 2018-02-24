//存放物体的抽屉
import SuperContainer from '../AbstractComponents/SuperContainer'
import ImgContainer from '../AbstractComponents/ImgContainer'
import DraggableContainer from '../AbstractComponents/DraggableContainer'
class CargoBoxBall extends SuperContainer {
  static currentItem = [];
  static currentPartItems = null;
  static _globalCargos = [];

  constructor(_x = 0, _y = 0, _width = 100, _height = 100) {

    super();
    this.areaX = _x;
    this.areaY = _y;
    this.areaWidth = _width;
    this.areaHeight = _height;
    this._boxItems = [];
    this.hitTestItem = [];

    this.on("added", this.addedToStage, this, false);
  }
  addedToStage() {
      this.setHitArea(this.areaX,this.areaY,this.areaWidth,this.areaHeight)
  }
  setHitTestItem(obj){
    console.log(obj)
    this.hitTestItem.push(obj);
  }
  addItem(){
    let item = new DraggableContainer("leg_png");
    console.log(this.hitTestItem[0])
    item.setHitTestObject([this.hitTestItem[0]]);
    item.setCallbackHitObjectMoving(()=>{
      console.log('hit it ');
    })

    this._boxItems.push(item);
    this.arrangeItem();
    this.addChild(item)


  }
  removeItem($index){
   //this._boxItems[this._boxItems.length-1].destroy();

    this._boxItems.splice($index,1);
    this.arrangeItem();


  }
  getItems(){
    return this._boxItems;
  }
  arrangeItem(){
    const self = this;
   // let globalP = self.localToGlobal(self.x,self.y);

    if(this._boxItems.length==0)return;
    for(let i=0;i<this._boxItems.length;i++){
        this._boxItems[i].x = i*60+30;
        this._boxItems[i].y = 50
        this._boxItems.indexNum = i;

    }
  }
  arrangeItem2(){
    const self = this;

    for(let i=0;i<this._boxItems.length;i++){
      this._boxItems[i].x = i*60+30+self.x;
      this._boxItems[i].y = 50+self.y;

    }
  }

}
export default CargoBoxBall;
