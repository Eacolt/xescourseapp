import {
    Scene,
    Res,
    Stage,
    Tween,
    Utils,
    Sprite,
    ReactStore,
    Debug,
    Reg
} from '../EasyCreator';

import ImgContainer from '../AbstractComponents/ImgContainer'
const createjs = window.createjs;
class Kuang extends createjs.Container{
    static kuangArr = [];
    static KeyBoardCtn = null;

    constructor(){
        super();
        this.bgBMP = null;
        this.bgContainer = null;
        this.selectContainer = null;
        this.inputTextContent =  "";
        this.kuangIsPlaying = false;

        this.maxBit = 4;//最大数字位数;

        this.keyName = "";
        this._src = null;
        //react;
        this.receivedKey = false;
        this.textInput = null;
        this.calculateNum = "0";
        this.numberContent = null;//是否有数字
        this.on("added",this.addedToStage,this,false);
    }
    setName($name){
        this.keyName = $name;
    }
    getName(){
        return this.keyName;
    }
    srcTo(src){
        this._src = src;
    }
    addedToStage(){

        this.bgContainer = new ImgContainer('defaultkuang_png');
        this.selectContainer  = new ImgContainer("defaultkuang_png");
        this.bgContainer.scaleX = this.selectContainer.scaleX = 1.3;
        Kuang.kuangArr.push(this);

        this.addChild(this.bgContainer);
        this.addChild(this.selectContainer);
        this.init.call(this);
        this.addChild(this.textInput);
        this.selectContainer.alpha = 0;
        this.cursor = 'pointer';
        this.on("click",this.onFocused,this,false);

    }
    init(){
        const self = this;
        this.bgContainer.imgLoaded(()=>{
            self.textInput = new createjs.Text();
        self.textInput.text = "";
        self.textInput.textAlign = "center";
        self.textInput.font = "56px Microsoft YaHei";
        self.textInput.color = "#823f12";
        self.textInput.regX = self.bgContainer.imgWidth/2;
        self.textInput.regY = self.bgContainer.imgHeight/2;
        self.textInput.textBaseline = "alphabetic";
        self.textInput.x = self.bgContainer.imgWidth/2;
        self.textInput.y = self.bgContainer.imgHeight/2+20;
        self.addChild(self.textInput)
    })
    }
    onCheck($numbers,$newBoolean=true){
        let p = [];
        for(let i=0;i<$numbers.length;i++){
            if(this.getNumberText()==$numbers[i]){
                p.push($numbers[i]);
            }
        }
        if(!(p.length>0 && $newBoolean)){
            this.onWrongAni();
        }

        return p.length>0 && $newBoolean;
    }
    //选错的情况摇动一下;
    onWrongAni(){
        const self = this;

        if(this.kuangIsPlaying==false){
            this.kuangIsPlaying = true;
            createjs.Tween.get(this).to({x:'-20'},80).to({x:'+38'},80).to({x:'-20'},80).call(()=>{
                self.kuangIsPlaying = false;
        });
        }


    }
    onFocused(event){
        const self = this;

        Kuang.kuangArr.forEach((item,index)=>{
            if(item.getName()!=event.currentTarget.getName()){
            item.receivedKey = false;
            item.unSelected();
        }
    });


        if(Kuang.KeyBoardCtn){

            self.selected();
            this.receivedKey = true;
            // Kuang.KeyBoardCtn.doActionMoveUp();
            //  Kuang.KeyBoardCtn.publicAction_MoveUp();
//      alert(Kuang.KeyBoardCtn.publicAction_MoveUp)
            Kuang.KeyBoardCtn.publicAction_MoveUp();
        }

    }
    setInputText(x=10){
        if(!this.receivedKey)return;
        if(String(this.inputTextContent).length>=this.maxBit)return;
        let num = String(this.inputTextContent)+String(x);

        this.inputTextContent=Number(num);
        this.textInput.text =Number(this.inputTextContent);
        if(String(this.textInput.text)==""){
            this.numberContent = null;
        }else{
            this.numberContent = this.textInput.text;
        }

    }
    getNumberText(){
        let num;
        if(String(this.inputTextContent)==''){
            num = -100;
        }else{
            num = Number(this.inputTextContent)
        }
        return num;
    }
    delNum(){


        if(!this.receivedKey )return;
        if(String(this.inputTextContent).length>=0){
            let len = String(this.inputTextContent).length;
            this.inputTextContent = String(this.inputTextContent).slice(0,len-1);
            this.textInput.text = Number(this.inputTextContent)==0?"":Number(this.inputTextContent);
            if(this.textInput.text==0){
                this.numberContent = null;
            }

        }
    }
    clearNum(){
        if(!this.receivedKey)return;
        if(String(this.inputTextContent).length>=0){
            //let len = this.inputTextContent.length;
            this.inputTextContent = ''
            this.textInput.text = '';
        }
        this.numberContent = null;
    }
    selected(){
        this.selectContainer.alpha=1;
        this.bgContainer.alpha=0;
    }
    unSelected(){
        this.selectContainer.alpha=0;
        this.bgContainer.alpha=1;
    }

}
export default Kuang;
