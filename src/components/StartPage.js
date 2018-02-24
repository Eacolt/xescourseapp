
class StartPage extends createjs.Container{
  constructor(){
    super();
    this.gamebg = null;
    this.on('added',this.addedToStage,this,false);
  }
  addedToStage(){
    // let soundBtn = new SoundBtn();
    // this.addChild(soundBtn)
  }
}
export default StartPage;
