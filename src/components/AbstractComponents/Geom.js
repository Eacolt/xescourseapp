//绘图板
class Painter extends createjs.Container {
  constructor() {
    super();
    this.drawRectangle = null;
    this.ctnShape = null;//绘图区域
    this.maskShape = null;//遮罩
    this.showMaskShape = false;//是否展示绘画板区域;
    this.ctn = null;

    this.pathShape = null;
    this.pathShapeArr = [];

    this.drawMouse = {
      x: 0,
      y: 0,
      pencilWidth:1,
      pencilColor:"red",
      outOfArea: false
    }

    this.drawMouseData = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    }

    this.pencilMouseDownListener = null;
    this.pencilPressMoveListener = null;
    this.pencilPressUpListener = null;
    this.pencilMouseOutListener = null;
    this.pencilMouseOverListener = null;

    this.on("added", this.addedToStage, this, false);
  }
  addedToStage() {
    this.drawRectangle = new createjs.Rectangle(0, 0, 500, 500);

    this.ctn = new createjs.Container();
    this.ctnShape = new createjs.Shape();
    if(this.showMaskShape){
      this.ctnShape.graphics.beginFill("rgba(0,0,0,0.5)");
    }else{
      this.ctnShape.graphics.beginFill("rgba(255,255,255,0.01)");
    }

    this.ctnShape.graphics.drawRect(0, 0, 500, 500);
    this.ctnShape.graphics.endFill();
    this.maskShape = new createjs.Shape();
    this.maskShape.graphics.drawRect(0, 0, 500, 500);
    this.ctn.addChild(this.ctnShape)
    this.ctn.addChild(this.maskShape);
    this.ctn.mask = this.maskShape;
    this.addChild(this.ctn)
  }
  clearAllEventListener() {
    this.ctnShape.off("mousedown", this.pencilMouseDownListener);
    this.ctnShape.off("pressmove", this.pencilPressMoveListener);
    this.ctnShape.off("pressup", this.pencilPressUpListener);
    this.ctnShape.off("mouseout", this.pencilMouseOutListener);
    this.ctnShape.off("mouseover", this.pencilMouseOverListener);
  }
  clearPainter(){
    if(this.pathShapeArr.length>0){
        this.pathShapeArr.forEach((item,index)=>{
          item.graphics.clear();

        })
    }
    this.pathShapeArr = [];

  }
  //设置绘制区域的透明度
  setMaskShape(_b){

    this.showMaskShape = _b;
  }
  //设置画笔样式
  setPencilStyle(_color="red",_weight="3"){
    this.drawMouse.pencilColor = _color;
    this.drawMouse.pencilWidth = _weight;
  }
  //设置绘制区域大小
  setArea(rect) {
    if (this.ctn) {
      this.clearAllEventListener.call(this);
      this.ctn.removeAllChildren();
      this.removeAllChildren();

    }
    this.drawRectangle = new createjs.Rectangle(rect.x, rect.y, rect.width, rect.height);
    this.ctn = new createjs.Container();
    this.ctnShape = new createjs.Shape();
    if(this.showMaskShape){
      this.ctnShape.graphics.beginFill("rgba(0,0,0,0.5)");
    }else{
      this.ctnShape.graphics.beginFill("rgba(255,255,255,0.01)");
    }
    this.ctnShape.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
    this.ctnShape.graphics.endFill();
    this.maskShape = new createjs.Shape();
    this.maskShape.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
    this.ctn.addChild(this.ctnShape)
    this.ctn.addChild(this.maskShape);
    this.ctn.mask = this.maskShape;
    this.addChild(this.ctn);
    this.setPencilDraw();
  }
  setPencilDraw() {
    this.pencilMouseDownListener = this.ctnShape.on("mousedown", this.pencilMouseDownAction, this, false, this.drawMouseData);
    this.pencilPressMoveListener = this.ctnShape.on("pressmove", this.pencilPressMoveAction, this, false, this.drawMouseData);
    this.pencilPressUpListener = this.ctnShape.on("pressup", this.pencilPressUpAction, this, false, this.drawMouseData);
    this.pencilMouseOutListener = this.ctnShape.on("mouseout", this.pencilMouseOutAction, this, false, this.drawMouseData);
    this.pencilMouseOverListener = this.ctnShape.on("mouseover", this.pencilMouseOverAction, this, false, this.drawMouseData);
    this.ctnShape.on("tick", this.tickerAction, this, false);
  }
  tickerAction(event) {

    if (this.drawMouse.x <= this.drawRectangle.x || this.drawMouse.x >= this.drawRectangle.width || this.drawMouse.y <= this.drawRectangle.y || this.drawMouse.y >= this.drawRectangle.height) {
      this.drawMouse.outOfArea = true;
    } else {
      this.drawMouse.outOfArea = false;

    }
  }

  pencilPressUpAction(event, data) {
    let p = event.currentTarget.parent.globalToLocal(event.stageX, event.stageY);
    this.drawMouse.x = p.x;
    this.drawMouse.y = p.y;
    data.endX = p.x;
    data.endY = p.y;
  }
  pencilPressMoveAction(event, data) {
    if (this.drawMouse.outOfArea) {
      return;
    }
    let p = event.currentTarget.parent.globalToLocal(event.stageX, event.stageY);
    this.drawMouse.x = p.x;
    this.drawMouse.y = p.y;
    data.endX = p.x;
    data.endY = p.y;
    this.pathShape.graphics.lineTo(data.endX, data.endY);
    data.startX = data.endX;
    data.startY = data.endY;

  }
  pencilMouseOutAction(event, data) {
    //  data.outOfArea = true;
  }
  pencilMouseOverAction(event, data) {
    //  data.outOfArea = false;
  }
  pencilMouseDownAction(event, data) {
    let p = event.currentTarget.parent.globalToLocal(event.stageX, event.stageY);
    this.drawMouse.x = p.x;
    this.drawMouse.y = p.y;
    this.pathShape = new createjs.Shape();
    this.pathShape.graphics.setStrokeStyle(this.drawMouse.pencilWidth).beginStroke(this.drawMouse.pencilColor);
    data.startX = p.x;
    data.startY = p.y;
    this.pathShape.graphics.moveTo(data.startX, data.startY);
    this.ctn.addChild(this.pathShape)
    this.pathShapeArr.push(this.pathShape);

  }

}

class Line {
  constructor() {
    this.config = {
      width: 2,
      color: "#F00"
    };
    this.p1 = {};
    this.p2 = {};
    this.lines = null;
  }
  setConfig(linew = 2, color = "#F00") {
    this.config.width = linew;
    this.config.color = color;
  }
  clearLine() {
    if (this.lines) {
      this.lines.graphics.clear();
    }
  }
  setPtA(x, y) {
    this.p1.x = x;
    this.p1.y = y;
  }
  setPtB(x, y) {
    this.p2.x = x;
    this.p2.y = y;
  }
  draw() {
    if (this.lines) {
      this.lines.graphics.clear();
    }
    this.lines = new createjs.Shape();
    this.lines.graphics.setStrokeStyle(this.config.width).beginStroke(this.config.color);
    this.lines.graphics.moveTo(this.p1.x, this.p1.y);
    this.lines.graphics.lineTo(this.p2.x, this.p2.y);
    this.lines.graphics.endStroke();
    return this.lines;
  }
  //线段求交点
  static segmentsIntr(l1, l2) {
    let a = l1.p1;
    let b = l1.p2;
    let c = l2.p1;
    let d = l2.p2;

    // 三角形abc 面积的2倍
    var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);

    // 三角形abd 面积的2倍
    var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);

    // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
    if (area_abc * area_abd >= 0) {
      return false;
    }

    // 三角形cda 面积的2倍
    var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
    // 三角形cdb 面积的2倍
    // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
    var area_cdb = area_cda + area_abc - area_abd;
    if (area_cda * area_cdb >= 0) {
      return false;
    }

    //计算交点坐标
    var t = area_cda / (area_abd - area_abc);
    var dx = t * (b.x - a.x),
      dy = t * (b.y - a.y);
    return {
      x: a.x + dx,
      y: a.y + dy
    };

  }
  //射线求交点
  static Intersect2lines(l1, l2) {
    var mypt = null;
    var p1 = l1.p1,
      p2 = l1.p2,
      p3 = l2.p1,
      p4 = l2.p2;
    var denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
    if (denominator == 0)
      return null;
    var ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
    var ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator;
    var x = p1.x + ua * (p2.x - p1.x);
    var y = p1.y + ua * (p2.y - p1.y);
    if (ua > 0 && ub > 0) {
      mypt = {
        x: x,
        y: y
      }

    }
    return mypt;
  }

}

export {Line, Painter};
