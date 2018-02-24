<template>
  <CjsCanvas @INIT="gameInit"/>
</template>
<script>
  import StartPage from './StartPage'
  import GamePage from './GamePage'
  import {mapActions} from 'vuex'
  import {Scene, Res, VueStore} from "./AbstractComponents/EasyCreator";
  import CjsCanvas from './CjsCanvas'

  export default {
    components: {CjsCanvas},
    methods: {
      ...mapActions(['SET_GAMECOMPLETE', 'SET_GAMECONFIG']),
      gameInit(stage) {
        const self = this;
        createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        Scene.setStage(stage);
        Scene.add('startPage', new StartPage());
        Scene.add('gamePage',new GamePage());
        if(VueStore.getStore().state.gameConfig.showFirstPage){
          Scene.run('startPage');
        }else{
          Scene.run('gamePage');
        }

      }
    },
    beforeMount() {
      VueStore.setStore(this.$store);
    },
    mounted() {
      const self = this;
      let imgLoader = new createjs.LoadQueue();
      let gameConfigLoader = new createjs.LoadQueue();
      gameConfigLoader.loadFile('static/gameConfig.json');
      gameConfigLoader.on('fileload', (event) => {
        self.SET_GAMECONFIG(event.result);
      })
      gameConfigLoader.on('complete', (event) => {
        imgLoader.loadFile("static/imgAssets.json");
        imgLoader.on("fileload", (event) => {
          for (let i = 0; i < event.result.length; i++) {
            let item = event.result[i];
            Res.resArr.push(item);
          };
        });
        imgLoader.on("complete", (event) => {
          self.SET_GAMECOMPLETE(true);
        });
      });
    }
    //you code

  }

</script>
<style scoped>

</style>

