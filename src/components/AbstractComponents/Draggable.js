class Draggable{
   constructor(){
     this.isCenter = true;
     this.dragTarget = null;

     this.dragMouseDownActionListener = null;
     this.dragPressUpActionListener = null;
     this.dragPressMoveActionListener = null;

     this.mouseOffsetX = 0;
     this.mouseOffsetY = 0;
   }
   setTarget(target){
     this.dragTarget = target;
     this.dragTarget.cursor = "pointer"
   }
   startDrag(_isCentre=true){
     const self = this;

     if(this.dragTarget){
       this.isCenter = _isCentre;
       this.dragMouseDownActionListener = this.dragTarget.on("mousedown",this.dragMouseDownAction,this,false);
       this.dragPressUpActionListener  = this.dragTarget.on("pressup",this.dragPressUpAction,this,false);
       this.dragPressMoveActionListener = this.dragTarget.on("pressmove",this.dragPressMoveAction,this,false)
     }
   }
   stopDrag(){
     this.dragMouseDownActionListener.off("mousedown",this.dragMouseDownAction)
     this.dragPressMoveActionListener.off('pressmove',this.dragPressMoveAction);
     this.dragPressUpActionListener.off("pressup",this.dragPressUpAction)
   }
   dragMouseDownAction(event){
     const self =this;
     if(this.dragTarget){
       let p = self.dragTarget.parent.globalToLocal(event.stageX,event.stageY);
       if(self.isCenter){
          let distX = (p.x - event.currentTarget.x)*-1;
          let distY = (p.y - event.currentTarget.y)*-1;
          event.currentTarget.x = p.x+distX;
          event.currentTarget.y = p.y+distY
           self.mouseOffsetX = distX;
           self.mouseOffsetY = distY;
       }else{
         event.currentTarget.x = p.x;
         event.currentTarget.y = p.y
       }

     }
   }
   dragPressMoveAction(event){
     const self = this;
     if(self.dragTarget){
       let p = self.dragTarget.parent.globalToLocal(event.stageX,event.stageY);
       console.log(self.isCenter)
       if(self.isCenter){
          event.currentTarget.x = p.x+self.mouseOffsetX;
          event.currentTarget.y = p.y+self.mouseOffsetY
       }else{
         event.currentTarget.x = p.x;
         event.currentTarget.y = p.y
       }
     }
   }
   dragPressUpAction(event){}
}
export default Draggable;
