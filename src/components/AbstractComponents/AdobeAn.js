//AdobeAn by lzt
//快捷的将FLASH导出的CANVAS动画变成MovieClip对象
//注意在MovieClip（FLASH生成的脚本中，manifest修改一下，只要其数组的元素）
//var soldierman = new AdobeAn.getAtlas("soldierman");//soldierman是id
//var SoldierMc = new soldierman.Soldier();//Soldier是Movieclip
//SoldierMc.gotoAndStop...
class AdobeAn {
  static stage = null;
  static atlasArr = [];
  //添加Atlas
  static addAtlas($name, $comp) {
    for (let i = 0; i <
      AdobeAn.atlasArr.length; i++) {
      if (AdobeAn.atlasArr[i][0] && AdobeAn.atlasArr[i][0] == $name) return;
    }
    AdobeAn.atlasArr.push([$name, $comp])
  }
  //获取Atlas(Comp.library)
  static getAtlas($key) {
    for (let i = 0; i < AdobeAn.atlasArr.length; i++) {
      if (AdobeAn.atlasArr[i][0] == $key) {
        return AdobeAn.atlasArr[i][1];
      }
    }
  }
  //第3步骤的加载，加载完声音后加载Atlas动画，这是最终加载，必须在常规加载后调动
  static atlasLoad($atlasarr, $completeCB) {
    var atlasArr = $atlasarr;
    var completeCB = $completeCB;
    var atlasComps = [];
    var manifestArr = [];
    for (let i = 0; i < atlasArr.length; i++) {
      atlasComps.push(atlasArr[i].an.getComposition());
    }
    var loader = new createjs.LoadQueue(false);
    loader.addEventListener("fileload", function(evt) {
      handleFileLoad(evt, atlasComps)

    });
    loader.addEventListener("complete", function(evt) {
      handleComplete(evt, atlasComps)
    });

    for (let i = 0; i < atlasComps.length; i++) {
      manifestArr.push(atlasComps[i].getLibrary().properties.manifest);
    }
    loader.loadManifest(manifestArr);

    function handleFileLoad(evt, comp) {
      for (let i = 0; i < comp.length; i++) {
        let image = comp[i].getImages();
        if (evt && (evt.item.type == "image")) {
          image[evt.item.id] = evt.result;
        }
      }
    }


    function handleComplete(evt, comp) {
      for (let i = 0; i < comp.length; i++) {
        var animator = comp[i].getLibrary();
        var ss = comp[i].getSpriteSheet();
        var queue = evt.target;
        var ssMetadata = animator.ssMetadata;
        for (let i = 0; i < ssMetadata.length; i++) {
          ss[ssMetadata[i].name] = new createjs.SpriteSheet({
            "images": [queue.getResult(ssMetadata[i].name)],
            "frames": ssMetadata[i].frames
          })
        }
        AdobeAn.addAtlas(animator.properties.id, animator);
      }
      completeCB();
    }
  }
  //////////////
  static bootstrapSupport(lib, p, an, img, ss) {
    // bootstrap callback support:

    (lib.Stage = function(canvas) {
      createjs.Stage.call(this, canvas);
    }).prototype = p = new createjs.Stage();

    p.setAutoPlay = function(autoPlay) {
      this.tickEnabled = autoPlay;
    }
    p.play = function() {
      this.tickEnabled = true;
      this.getChildAt(0).gotoAndPlay(this.getTimelinePosition())
    }
    p.stop = function(ms) {
      if (ms) this.seek(ms);
      this.tickEnabled = false;
    }
    p.seek = function(ms) {
      this.tickEnabled = true;
      this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000);
    }
    p.getDuration = function() {
      return this.getChildAt(0).totalFrames / lib.properties.fps * 1000;
    }

    p.getTimelinePosition = function() {
      return this.getChildAt(0).currentFrame / lib.properties.fps * 1000;
    }

    an.bootcompsLoaded = an.bootcompsLoaded || [];
    if (!an.bootstrapListeners) {
      an.bootstrapListeners = [];
    }

    an.bootstrapCallback = function(fnCallback) {
      an.bootstrapListeners.push(fnCallback);
      if (an.bootcompsLoaded.length > 0) {
        for (var i = 0; i < an.bootcompsLoaded.length; ++i) {
          fnCallback(an.bootcompsLoaded[i]);
        }
      }
    };


    an.compositions = {
      getStage: function() {
        return exportRoot.getStage();
      },
      getLibrary: function() {
        return lib;
      },
      getSpriteSheet: function() {
        return ss;
      },
      getImages: function() {
        return img;
      }
    };

    an.compositionLoaded = function(id) {
      an.bootcompsLoaded.push(id);
      for (var j = 0; j < an.bootstrapListeners.length; j++) {
        an.bootstrapListeners[j](id);
      }
    }

    an.getComposition = function() {
      return an.compositions;
    }


  }
}
export default AdobeAn;
