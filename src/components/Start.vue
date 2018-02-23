<template>
  <CjsCanvas @INIT="gameInit"/>
</template>
<script>
  import Scene1 from './Scene1'
  import {mapActions} from 'vuex'
  import {Scene, Res} from "./AbstractComponents/EasyCreator";
  import CjsCanvas from './CjsCanvas'

  export default {
    components: {CjsCanvas},
    methods: {
      ...mapActions(['SET_GAMECOMPLETE']),
      gameInit(stage) {
        const self = this;
        createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        let imgLoader = new createjs.LoadQueue();
        imgLoader.loadFile("static/imgAssets.json");
        imgLoader.on("fileload", (event) => {
          for (let i = 0; i < event.result.length; i++) {
            let item = event.result[i];
            Res.resArr.push(item);

          };
          console.log(Res.resArr)
        });
        imgLoader.on("complete",(event)=>{
          sceneBegin.call(self,stage);
        });
        function sceneBegin(stage) {
          Scene.setStage(stage);
          Scene.add('scene1', new Scene1());
          Scene.run('scene1')
        }

      }
    },
    mounted() {
      this.SET_GAMECOMPLETE(true);

    }

    //you code

  }

</script>
<style scoped>

</style>

