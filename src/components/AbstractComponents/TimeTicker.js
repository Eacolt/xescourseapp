
//工具类;模拟一个空的setTimeout
class TimeTicker{
  constructor(framerate=1){
    this._framerate  = framerate;
    this._cancel = false;
  }
  stop(){
    this._cancel = true;
  }
  start(_dosomething=function(){}){
    const self = this;
    let _cancel = this.cancel;
    let close = false;
    let s = () => {
      let counts = setTimeout(function(){
        if(self._cancel==true){
          clearTimeout(counts)
          return;
        }
        _dosomething.call(self);
        s();
      },self._framerate);
    };
    s();
  }
}
export default TimeTicker;
