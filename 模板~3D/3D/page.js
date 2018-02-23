$(document).on('keydown',function(e){
    var link = window.location.href;
    var common = link.slice(0,link.length-13);
    var subStr = link.slice(link.length-13,link.length-11);
    var indexNumber = Number(subStr);
    if(e.keyCode === 34){
        // if(indexNumber<16){
            indexNumber++;console.log(indexNumber)
            if(indexNumber < 10){
               window.location.href = common+'0'+indexNumber+'/index.html'; 
            }else{
                window.location.href = common+indexNumber+'/index.html';   
            }
        // }
    }else if(e.keyCode === 33){
        if(indexNumber > 0){
            indexNumber--;
            if(indexNumber<10){
                window.location.href = common+'0'+indexNumber+'/index.html';  
            }else{
                window.location.href = common+indexNumber+'/index.html'; 
            } 
        }
    }

})