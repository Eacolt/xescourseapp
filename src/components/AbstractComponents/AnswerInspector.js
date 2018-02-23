class AnswerInsepctor {
    constructor() {
        this.userRightAnswer = null; //唯一
        this.userFirstRight = null; //1一次选对,0：一次选错
        this.userAnswer = null; //只有一个
        this.userAnswerType = 0;
        this.userAnswerTimes = 0;
        this._answerID = 0;
        this._answerRightnum = 0;
        this._answerWrongnum = 0;
        // this._answerArr = null;
    }
    static changeNumToABC($num) {
        let myselect = "";
        if ($num < 10) {
            switch ($num) {
                case 0:
                    myselect = "A"
                    break;
                case 1:
                    myselect = "B"
                    break;
                case 2:
                    myselect = "C"
                    break;
                case 3:
                    myselect = "D"
                    break;
                case 4:
                    myselect = "E"
                    break;
                default:
                    break;
            }
        }
        return myselect;
    }
    //设置用户答案;
    setAnswerUser($num) {
        this.userAnswer = $num;
    }
    setAnswerRightOne($num) {
        this.userRightAnswer = $num;
    }
    setAnswerType($num) {
        this.userAnswerType = $num;
    }
    //每次答对了加1
    setAnswerTimesAddedOnce() {
        this.userAnswerTimes++;
    }
    setAnswerID($num) {
        this._answerID = $num;
    }
    getAnswerObject() {
        const self = this;
        let answerTimes = this.userAnswerTimes;
        let _rightnum = 0;
        let _wrongnum = 0;

        if(self.userAnswer == self.userRightAnswer){
            _rightnum = self.userAnswerTimes==1 ? 1:0;
            _wrongnum = self.userAnswerTimes==1 ? 0:1;
            self.userFirstRight =  self.userAnswerTimes==1 ? 1:0;
        }else{
            _rightnum = 0;
            _wrongnum = 1;
            self.userFirstRight = 0;
        }

        let arr = {
            "id": self._answerID,
            "useranswer": self.userAnswer,
            "answer": self.userRightAnswer,
            "isright": self.userFirstRight,
            "times": self.userAnswerTimes,
            "type": self.userAnswerType,
            "rightnum": _rightnum,
            "wrongnum": _wrongnum
        };
        return arr;
    }
}
export default AnswerInsepctor;
