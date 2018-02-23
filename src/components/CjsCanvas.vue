<template>
  <div ref="canvasArea" >
    <canvas style="position: absolute; display: block;width:100%;height:100%; background-color:rgba(0,0,0,0);margin:0 auto;left:0;right:0;"></canvas>
  </div>
</template>
<script>
  /**
   *createJS核心画布组件，封装了createJS常规的加载(不包含Atlas，需要此加载完成后调用)
   */
  import {mapState} from 'vuex';
  export default {
    name: 'app',
    props: {
      w: {
        type: Number,
        default: 1920
      },
      h: {
        type: Number,
        default: 1080
      },
      //制定常规资源加载的位置
      imgManifest: {
        type: String,
        default: "static/imgAssets.json"
      },

    },
    data() {
      return {
        _isLockedOverLay: false
      }
    },
    computed: {
      ...mapState(['assetAllComplete']),
      canvasGame(){
        return this.$refs.canvasArea;
      },
      anime_cta_style() {
        return {
          backgroundColor: "transparent",
        }
      },
      isLocked() {
        return {
          "pointerEvents": this.$store.state.overLayState
        }
      },
      dom_overlay_style() {
        return {
          overflow: "hidden",
          width: "12.2rem",
          height: "10.8rem",
          position: "absolute",
          left: "0px",
          top: "0px",
          display: "block"
        }
      },
      getLoadManifest() {
        return this.imgManifest
      }

    },
    methods: {
      gameInit(stage) {

        //仅当常规资源加载完成，并处罚INIT，这是保证安全。
        this.$emit("INIT", stage);
      }
    },
    mounted() {
      const self = this;
      var canvasArea = self.$refs.canvasArea;
      var fnStartAnimation, stage;
      var lib = {
        width: this.w,
        height: this.h,
        fps: 60,
      }
      var canvas = this.canvasGame.getElementsByTagName('canvas')[0]
      loadComplete();
      function loadComplete() {
        stage = new createjs.Stage(canvas)
        fnStartAnimation = function() {
          createjs.Ticker.setFPS(lib.fps);
          createjs.Ticker.addEventListener("tick", stage);
        }
        //Code to support hidpi screens and responsive scaling.
        function makeResponsive(isResp, respDim, isScale, scaleType) {
          var lastW, lastH, lastS = 1;

          window.addEventListener('resize', resizeCanvas);
          justifyWindow();
          function justifyWindow() {
            window.addEventListener('resize', onResize);
            onResize();
            function onResize() {
              let windowW = window.document.documentElement.clientWidth;
              let windowH = window.document.documentElement.clientHeight;
              if(windowW>lib.width){
                let scaleW = windowW/lib.width;
                let scaleH = windowH/lib.height;
                canvasArea.style.transform = "scale("+scaleW+","+scaleH +")";
                canvasArea.style.webkitTransform = "scale("+scaleW+","+scaleH +")";
                canvasArea.style.msTransform = "scale("+scaleW+","+scaleH +")";
                canvasArea.style.mozTransform = "scale("+scaleW+","+scaleH +")";
                canvasArea.style.msTransformOrigin = "center center";
                canvasArea.style.webkitTransformOrigin = "center center";
                canvasArea.style.transformOrigin = "center center";
              }
            }
          }
          resizeCanvas();
          function resizeCanvas() {
            var w = lib.width,
              h = lib.height;
            var iw = window.innerWidth,
              ih = window.innerHeight;
            var pRatio = window.devicePixelRatio || 1,
              xRatio = iw / w,
              yRatio = ih / h,
              sRatio = 1;
            if (isResp) {
              if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih)) {
                sRatio = lastS;
              } else if (!isScale) {
                if (iw < w || ih < h)
                  sRatio = Math.min(xRatio, yRatio);
              } else if (scaleType == 1) {
                sRatio = Math.min(xRatio, yRatio);
              } else if (scaleType == 2) {
                sRatio = Math.max(xRatio, yRatio);
              }
            }
            canvas.width = w * pRatio * sRatio;
            canvas.height = h * pRatio * sRatio;
            canvas.style.width  = w * sRatio + 'px';
            canvas.style.height  = h * sRatio + 'px';
            stage.scaleX = pRatio * sRatio;
            stage.scaleY = pRatio * sRatio;
            lastW = iw;
            lastH = ih;
            lastS = sRatio;
          }
        }
        makeResponsive(true, 'both', false, 1);
        fnStartAnimation();
        self.$watch(()=>{
          return self.assetAllComplete
        },(newstat,oldstat)=>{
          if(newstat==true){
            self.gameInit.call(self,stage);
            return;
          }
        })
      if(self.assetAllComplete){
          self.gameInit.call(self,stage)
      }
      }
    }
  }
</script>
<style>


</style>
