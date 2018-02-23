import ImgContainer from './AbstractComponents/ImgContainer'
class Scene1 extends createjs.Container{
  constructor(){
    super();
    this.gamebg = null;
    this.on('added',this.addedToStage,this,false);
  }
  addedToStage(){
  }
}
export default Scene1;
