import {VueStore} from '../AbstractComponents/EasyCreator'
class SoundButton extends createjs.Container {
  constructor() {
    super();
    this.audioSrc = null;
    this.myAudio = null;
    this.isPlaying = false;
    this.on("added", this.addedToStage, this, false);
  }
  addedToStage() {
    this.audioSrc = VueStore.getStore().state.gameConfig.soundButton.audio;
    createjs.Sound.registerSound(this.audioSrc, "tipsSound");
    createjs.Sound.on('fileload', soundAlready, this);
    function soundAlready() {
      this.myAudio = createjs.Sound.play(this.audioSrc, {loop: 0});
      this.myAudio.stop();
      var soundData = {
        images: ["./static/img/soundAtlas.png"],
        frames: {
          width: 70,
          height: 70
        },
        animations: {
          play: {
            frames: [
              0, 1, 2
            ],
            speed: 0.05
          },
          stand: {
            frames: [0]
          }
        }
      };
      var soundSpriteSheet = new createjs.SpriteSheet(soundData);
      var soundBtn = new createjs.Sprite(soundSpriteSheet);
      soundBtn.cursor = "pointer";
      this.addChild(soundBtn);
      soundBtn.on("click", this.playSound, this, false);
      soundBtn.x = VueStore.getStore().state.gameConfig.soundButton.posX;
      soundBtn.y = VueStore.getStore().state.gameConfig.soundButton.posY;

      this.myAudio.on("complete", this.soundCompleted, this);
    }

  }
  soundCompleted() {
    console.log("completed")
    this.isPlaying = false;
  }
  playSound(event) {
    if (event.currentTarget.currentFrame == 0) {
      event.currentTarget.gotoAndPlay("play");

    }

    if (this.isPlaying == false) {
      this.myAudio.play();
      this.isPlaying = true;
    }

  }

}
export default SoundButton;
