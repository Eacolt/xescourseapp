//最后更新：2017-12-5
//版本2.02
const createjs = window.createjs;
class VueStore {
  static vueStore = null;
  static setStore(x) {
    VueStore.vueStore = x;
  }
  static getStore() {
    return VueStore.vueStore;
  }
}

class Debug {
  static enableDebugger = false;
  static log() {
    if (Debug.enableDebugger == true) {
      let y = Array.prototype.join.apply(arguments);
      console.log(y)
    }
  }
}
class Scene {
  static _stage;
  static _scene_arr = [];
  constructor() {}
  static add($key, $scene) {
    let item = [$key, $scene];
    for (var i in Scene._scene_arr) {
      if (Scene._scene_arr[i] && Scene._scene_arr[i][0] == $key) {
        return;
      }
    }
    Scene._scene_arr.push(item);
  }
  static run($key) {
    let stageNumChild = Scene._stage.numChildren;
    Scene._stage.removeAllChildren();

    for (var i in Scene._scene_arr) {
      if (Scene._scene_arr[i] && Scene._scene_arr[i][0] == $key) {

        Scene._stage.addChildAt(Scene._scene_arr[i][1], 0);

      }
    }
  }
  static run2($key) {

    let stageNumChild = Scene._stage.numChildren;
    if (stageNumChild >= 2) {
      for (let i = 0; i < Scene._stage.numChildren; i++) {
        Scene._stage.getChildAt(i).mouseChildren = false;
      }
      for (var i in Scene._scene_arr) {
        if (Scene._scene_arr[i] && Scene._scene_arr[i][0] == $key) {
          Scene._stage.addChildAt(Scene._scene_arr[i][1], stageNumChild - 1);
          Scene._stage.getChildAt(stageNumChild - 1).mouseChildren = true;
        }
      }
      return;
    }
    for (var i in Scene._scene_arr) {
      if (Scene._scene_arr[i] && Scene._scene_arr[i][0] == $key) {
        Scene._stage.addChildAt(Scene._scene_arr[i][1], stageNumChild);

      }
    }
  }
  static setStage($stage) {
    Scene._stage = $stage;
  }

}
class Utils {
  static getRandomArr(arr, counts = 0) {
    let _arr = arr.concat();
    let _newarr = [];
    let times;
    times = (counts > 0 && counts <= _arr.length)
      ? counts
      : _arr.length;
    for (let i = 0; i < times; i++) {
      let randomIndex = Math.floor(Math.random() * _arr.length);
      _newarr.push(_arr[randomIndex])
      _arr.splice(randomIndex, 1);
    }
    return _newarr;

  }
  static degToRad(deg) {
    return deg * Math.PI / 180
  }
  static radToDeg(rad) {
    return rad * 180 / Math.PI
  }
}
//动画
class Tween {
  static setTweened(tweenObj, ufo_Pos, b_static = true, times = 300, delay = 0, FuncType = createjs.Ease.backOut,) {
    let myTween = createjs.Tween.get(tweenObj,);
    tweenObj.x = ufo_Pos[0].x;
    tweenObj.y = ufo_Pos[0].y
    function d() {
      if (b_static)
        return;
      myTween.wait(delay).to({
        x: ufo_Pos[1].x,
        y: ufo_Pos[1].y
      }, times, FuncType).call(function() {});
    }

    d();
    return myTween;

  }
  static to(tweenObj, properties) {

    let toObject = properties.toObj || {};
    let getObject = properties.getObj || {};
    let _delay = properties.delay || 0;
    let _time = properties.time || 300;
    let _type = properties.type || createjs.Ease.backOut;
    let myTween = createjs.Tween.get(tweenObj, getObject);
    myTween.wait(properties.delay).to(toObject, _time, _type);

    return myTween;

  }
}
//正则表达式
class Reg {
  static strToNum(x) {
    if (typeof x != "string")
      return;
    let reg = x.replace(/[A-Za-z]/g, "");
    return reg;
  }
}
class Res {
  constructor() {
    this.bitmapResArr = [];
    this.bitmapResCounts = 0;
  }
  static resArr = [];
  static soundArr = [];
  static imgPath = "static/img/"
  static img($key) {
    return Res.imgPath + $key;
  }
  static resImageArr = [];
  static getRes($key) {
    for (let i = 0; i < Res.resArr.length; i++) {
      if ($key == Res.resArr[i].id) {
        return Res.resArr[i].src
      }
    }
  }
  //加载所有当前场景Scence的实例
  pushImgRes($arr = []) {
    for (let i = 0; i < $arr.length; i++) {
      this.bitmapResArr.push($arr[i]);
    }
  }
  preloadImgRes($callback, $thisObj = this) {
    const self = this;
    for (let i = 0; i < self.bitmapResArr.length; i++) {
      //资源图片加载完后执行主要代码;
      self.bitmapResArr[i].image.onload = function() {
        self.bitmapResCounts++;
        if (self.bitmapResCounts >= self.bitmapResArr.length) {
          $callback.call($thisObj);
        }
      }
    }
  }
  getImgRes() {
    return this.bitmapResArr;
  }
  //加载审阅
  static soundLoad($completeCB,$src="./img") {
    const self = this;
    let soundCounts = 0
    createjs.Sound.alternateExtensions = ["mp3"];
    for (let i = 0; i < Res.soundArr.length; i++) {
      let uu = Res.soundArr[i].replace(/\.mp3$/g, "") + "_mp3";
      let soundURL = $src + Res.soundArr[i];

      createjs.Sound.registerSound(soundURL, uu);
    }
    createjs.Sound.on("fileload", soundOnFile);

    function soundOnFile(event) {
      soundCounts++;
      if (soundCounts >= Res.soundArr.length) {
        $completeCB.call(self);
      }
    }
  }
}
class Point extends createjs.Point {
  constructor() {
    super()
  }
  static getDistance(pt1, pt2) {
    let a = Math.pow((pt2.x - pt1.x), 2);
    let b = Math.pow((pt2.y - pt1.y), 2);
    let dist = Math.sqrt(a + b);
    return dist;
  }

}
//一个灵活的Container
class Sprite extends createjs.Container {
  constructor() {
    super();
    this.image = null; //public
    this.data = {}; //public properties;

    this.on("added", this.addedToStage, this, false);
  }
  addedToStage() {
    this.setRegCenter()
  }
  setRegCenter() {
    this.regX = this.image.width / 2 || 0;
    this.regY = this.image.height / 2 || 0;
  }
  //prototype
  setSkin($tgtBmp) {

    const self = this;
    if (self.contains($tgtBmp)) {
      self.removeChild($tgtBmp);
    }
    self.image = $tgtBmp.image;
    $tgtBmp.regX = $tgtBmp.width / 2;
    $tgtBmp.regY = $tgtBmp.height / 2;
    self.addChild($tgtBmp);
  }
  moveTo($rotation, $vector) {
    let rotation = Utils.degToRad($rotation);
    this.x += Math.cos(rotation) * $vector;
    this.y += Math.sin(rotation) * $vector;
  }
  moveToPoint($point, $vector, $callback = function() {}) {
    let vector = $vector;
    let mypoint = {
      x: this.x,
      y: this.y
    }
    let point = {
      x: $point.x,
      y: $point.y
    }
    let dx = point.x - this.x;
    let dy = point.y - this.y;
    let radian = Math.atan2(dy, dx);
    if (Point.getDistance(point, mypoint) < vector) {
      vector = 0;
      $callback.call(null);
      //  return;
    };
    this.x += Math.cos(radian) * vector;
    this.y += Math.sin(radian) * vector;

  }
}
export {
  Scene,
  Res,
  Utils,
  Sprite,
  Point,
  Reg,
  Tween,
  VueStore,
  Debug,

}
