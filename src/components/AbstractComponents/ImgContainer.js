import {Res} from './EasyCreator'
import SuperContainer from './SuperContainer'
import TimeTicker from './TimeTicker'
const createjs = window.createjs;
//仅限图片
class ImgContainer extends SuperContainer {
  static assetsArr = []; //所有资源文件;
  constructor($url = null) {
    super();
    this.initUrl = $url;
    this.imgIsload = false;
    this.currentImgName = null;

    this.imgCtn = null;
    this._width = null;
    this._height = null;
    this.on("added", this.addedToStage, this, false);
  }
  static allAssetsLoaded(_callback = function() {}) {
    const self = this;
    let num = 0;
    console.log(ImgContainer.assetsArr)
    for (let i = 0; i < ImgContainer.assetsArr.length; i++) {
      let assets = new createjs.Bitmap(Res.getRes(ImgContainer.assetsArr[i]));
      assets.image.onload = function() {

        if (num >= ImgContainer.assetsArr.length - 1) {
          _callback.call(self);
        }
        num++;
      }
    }
  }
  static someAssetsLoaded(someArr = [],_callback=function(){}) {
    const  self = this;
    let num = 0;
    for (let i = 0; i < someArr.length; i++) {

      if (ImgContainer.assetsArr.indexOf(someArr[i]) != -1) {
        let assets = new createjs.Bitmap(Res.getRes(someArr[i]));
        assets.image.onload = function(){
          num++;
          if (num >= someArr.length) {
            console.log("is loaded"+num)

            _callback.call(self);
          }
        }
      }

    }
  }
  _isAssetAtArr(strname) {
    let b = ImgContainer.assetsArr.indexOf(strname);
    if (b == -1) {
      return false;
    } else {
      return true;
    }
  }
  addedToStage() {
    this.imgCtn = new createjs.Container();
    this.addChild(this.imgCtn);
    if (this.initUrl) {
      this.srcTo.call(this, this.initUrl);

      if (!this._isAssetAtArr(this.initUrl)) {
        ImgContainer.assetsArr.push(this.initUrl);
      }
    }
  }
  destory() {
    if (this.imgCtn) {
      this.removeAllChildren();
      this.parent.removeChild(this);
    }
  }

  srcTo(name) {
    const self = this;
    if (this.currentImgName) {
      if (this.currentImgName === "2000" + name) {
        return;
      }
    }
    self.imgIsload = false;
    let s = new TimeTicker();
    s.start(() => {
      createdSrc.call(self);
    });
    function createdSrc() {
      if (!self.imgCtn)
        return;
      if (self.imgCtn.numChildren > 0) {
        self.imgCtn.removeAllChildren();
      }
      let newImg = new createjs.Bitmap(Res.getRes(name));
      if (!self._isAssetAtArr(self.initUrl)) {
        ImgContainer.assetsArr.push(self.initUrl);
      }
      newImg.image.onload = function() {
        newImg.regX = newImg.image.width / 2;
        newImg.regY = newImg.image.height / 2;
        self._width = newImg.image.width;
        self._height = newImg.image.height;
        self.imgIsload = true;
        self.imgCtn.addChild(newImg);
        s.stop();
        self.currentImgName = "2000" + name;

      }
    }

  }
  imgLoaded(_callback) {
    const self = this;
    let s = new TimeTicker();
    s.start(() => {
      timeCallBack.call(self);
    });
    function timeCallBack() {
      if (self.imgIsload) {
        _callback.call(this, self);
        s.stop();
      }
    }
  }
  setAnchor(regX = null, regY = null) {
    const self = this;
    let anchorX = regX || 0;
    let anchorY = regY || 0;

    let s = new TimeTicker();
    s.start(() => {
      doAnchor.call(self);
    });

    function doAnchor(_callback) {
      if (self.imgCtn == null) {
        return;
      }
      if (self.imgCtn.numChildren > 0) {
        self.imgCtn.regX = anchorX;
        self.imgCtn.regY = anchorY;
        s.stop();
      }
    }
  }
  setWH($width, $height) {
    const self = this;
    let s = new TimeTicker();
    s.start(() => {
      doSetWH.call(self);
    });
    function doSetWH() {
      if (self.imgCtn == null) {

        return;
      }
      if (self.imgCtn.numChildren > 0) {
        self.imgCtn.scaleX = $width / self.imgWidth;
        self.imgCtn.scaleY = $height / self.imgWidth; //Math.floor(($width/self.imgWidth)/100*self.imgWidth).toFixed(2);
        s.stop();

      }
    }
  }
  setWidth($width) {
    const self = this;

    let s = new TimeTicker();
    s.start(() => {
      doSetWidth.call(self);
    });

    function doSetWidth() {
      if (self.imgCtn == null) {
        return;
      }
      if (self.imgCtn.numChildren > 0) {

        self.imgCtn.scaleX = $width / self.imgWidth;
        //Math.floor(($width/self.imgWidth)/100*self.imgWidth).toFixed(2);
        s.stop();
      }
    }
  }
  setHeight($height) {
    const self = this;
    let s = new TimeTicker();
    s.start(() => {
      doSetHeight.call(self);
    });
    function doSetHeight(_callback) {
      if (self.imgCtn == null) {
        return;
      }
      if (self.imgCtn.numChildren > 0) {

        self.imgCtn.scaleY = $height / self.imgWidth; //Math.floor(($width/self.imgWidth)/100*self.imgWidth).toFixed(2);
        s.stop();
      }
    }
  }
  get imgWidth() {
    return this._width || 0;
  }
  get imgHeight() {
    return this._height || 0;
  }
}
export default ImgContainer;
