import SuperContainer from '../AbstractComponents/SuperContainer'
import ImgContainer from '../AbstractComponents/ImgContainer'
import CargoBox from './CargoBox'
class TrashCan extends SuperContainer {
  constructor() {
    super();
    this.bg = null;
    this.hitArea = null;
    this.inspectMouse = false;
    this.isHitLeg = false;
    this.on("added", this.addedToStage, this, false);
  }
  addedToStage() {
    const self = this;
    this.bg = new ImgContainer('trashcan_png');
    this.addChild(this.bg)

    this.bg.imgLoaded(() => {

      self.setHitArea(-0.5 * this.bg.imgWidth, -0.5 * this.bg.imgHeight, this.bg.imgWidth, this.bg.imgHeight);
      self.stage.on("stagemousedown", () => {
        self.inspectMouse = true;
      });
      self.stage.on("stagemousemove", (event) => {
        if (self.getHitArea().getBounds().width > 0 && self.inspectMouse) {
        //  console.log(CargoBox.currentItem)
          if (CargoBox.currentItem.length > 0) {
            let p = self.globalToLocal(event.stageX, event.stageY);
            if (self.getHitArea().hitTest(p.x, p.y)) {
              self.isHitLeg = true;
            } else {
              self.isHitLeg = false;
            }

          }
        }
      });
      self.stage.on('stagemouseup', (event) => {

        if (self.isHitLeg && CargoBox.currentItem[0]) {

          if(CargoBox.currentPartItems=="cargoBox1"){
          //  console.log(CargoBox._globalCargos)
             let getIndex = CargoBox.currentItem[0].getName().replace("leg_png","");
              CargoBox.getCargoByIndex(0).deletedItem(Number(getIndex),"leg_png");
              CargoBox.currentItem = [];
          }
          if(CargoBox.currentPartItems=="cargoBox2"){
            //console.log(CargoBox._globalCargos)
           let getIndex = CargoBox.currentItem[0].getName().replace("leg_png","");
            CargoBox.getCargoByIndex(1).deletedItem(Number(getIndex),"leg_png");
            CargoBox.currentItem = [];
          }


        }

      })

    });

    self.showHitArea(false)

  }
}
export default TrashCan;
