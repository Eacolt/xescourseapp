import {Res, VueStore} from '../EasyCreator'
import ImgContainer from '../AbstractComponents/ImgContainer'
import TimeTicker from '../AbstractComponents/TimeTicker'
class AnswerBtn extends ImgContainer {
  static clickEnabled = true;
  constructor() {
    super();
    this.animeState = "stop";
    this.soundState = "stop";
    this.ctn = null;
    this.myname = null;
    this.on("on", this.addedToStage, this, false);
  }
  addedToStage() {
    this.ctn = new ImgContainer();
    this.addChild(this.ctn);
  }
  selectRight(){
    if(AnswerBtn.clickEnabled==false)return;
    const self = this;
    let rightIcon = new ImgContainer('righticon_png');
    this.addChild(rightIcon);
    rightIcon.x = 100;
    rightIcon.y = -30;
    AnswerBtn.clickEnabled = false;

  }
  selectWrong() {
    if(AnswerBtn.clickEnabled==false)return;
    const self = this;

    if (this.animeState == "stop") {
      this.animeState = "playing";
      createjs.Tween.get(this).to({
        x: "-30"
      }, 100).to({
        x: "+40"
      }, 100).to({
        x: this.x
      }, 100).call(() => {
        self.animeState = "stop";
      })
    }
  }
  playAudio(name) {
    const self = this;
    if (this.soundState == "stop") {
      self.soundState = "play";
      let t = createjs.Sound.play(name);
      t.on("complete", function() {
        self.soundState = "stop";
      })
    }
  }
  nameTo($name) {
    const self = this;
    let t = new TimeTicker();

    t.start(d);
    function d() {
      if (self.ctn) {
        self.ctn.srcTo($name);
        t.stop();
      }
    }
  }
  selected($answer) {
    if (this.myname) {
      this.ctn.srcTo(this.myname)
    }
  }
}
export default AnswerBtn;
