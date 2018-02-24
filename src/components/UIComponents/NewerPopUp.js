//新人指示动画
import ImgContainer from '../AbstractComponents/ImgContainer'
import SuperContainer from '../AbstractComponents/SuperContainer'
class NewerPopUp extends createjs.Container{
  constructor(){
    super();
    this.bgCtn = null;
    this.panzi = null;
    this.leg = null;
    this.hand = null;

    this.motionMC = null;
    this.on("added",this.addedToStage,this,false);
  }
  addedToStage(){

    this.bgCtn  = new createjs.Container();
    let bgShape = new createjs.Shape();
    bgShape.graphics.beginFill('rgba(0,0,0,0.6)')
    bgShape.graphics.drawRect(0,0,1920,1080);
    bgShape.graphics.endFill();
    this.bgCtn.addChild(bgShape)
    this.addChild(this.bgCtn);

    this.motionMC = new createjs.MovieClip(null, 0, true, {start:0});

    this.panzi = new ImgContainer('panzi_png');
    this.addChild(this.panzi);
    this.panzi.x = 1680;
    this.panzi.y = 850;

    this.leg = new ImgContainer('leg_png');
    this.addChild(this.leg);
    this.leg.x = 1680;
    this.leg.y = 780;
    this.leg.scaleX = this.leg.scaleY = 1.4;

    this.hand = new ImgContainer('myhand_png');

    this.addChild(this.hand);

    let m1 = createjs.Tween.get(this.hand).to({x:1600,y:800},0).wait(3).to({
      x:1650,
      y:770
    },20).wait(3).to({
      y:500
    },36);
    let m2 = createjs.Tween.get(this.leg).wait(24).to({
      y:480
    },37).wait(11);
    this.motionMC.timeline.addTween(m1);
    this.motionMC.timeline.addTween(m2);
    this.motionMC.gotoAndPlay('start');
    this.addChild(this.motionMC);
    this.motionMC.y += 80;

    this.on('click',this.deleteme,this,false);


  }
  deleteme(event){

    if(this.bgCtn){

      event.currentTarget.removeAllEventListeners();
      this.mouseChildren = false;
      this.parent.removeChild(this);
    }
  }
}
export default NewerPopUp;
