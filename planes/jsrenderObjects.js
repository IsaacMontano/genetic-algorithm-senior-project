class UIObject{
    constructor(posX, posY, cL, cR, cU, cD, autohandleClick, render, ID){
        this.posX = posX;
        this.posY = posY;
        this.cL = cL;
        this.cR = cR;
        this.cU = cU;
        this.cD = cD;
        this.autohandleClick = autohandleClick;
        this.render = render;
        this.ID = ID;
    }

    getID(){
        return(this.ID);
    }   

    draw(){
        console.log("ERROR- Undefined UI object tried to draw");
    }

    checkClick(MouseX, MouseY){
        
        if(this.autohandleClick == true && this.render == true){
            let tLeft = this.posX - this.cL;
            let tRight = this.posX + this.cR;
            let tUp = this.posY - this.cU;
            let tDown = this.posY + this.cD;
            if(MouseX > tLeft && MouseX < tRight && MouseY > tUp && MouseY < tDown){  
                this.handleClick(MouseX - this.posX, MouseY - this.posY);
                return(true);
            }
        }else{
            let tLeft = this.posX - this.cL;
            let tRight = this.posX + this.cR;
            let tUp = this.posY - this.cU;
            let tDown = this.posY + this.cD;
            if(MouseX > tLeft && MouseX < tRight && MouseY < tUp && MouseY > tDown){
                return(true);
            }
        }
    }

    handleClick(MouseXIn, MouseYIn){
        permCLog("ERROR- Undefined UI having a handled click");
    }

    updateSelf(){
        permCLog("WARNING- Undefined UI having an update");
    }
}    

const titleTextRatio = 40;
class planeTitle extends UIObject{
    constructor(relativePosX, relativePosY, title){
        super(0, 0, 0, 0, 0, 0, 0, 1, -1);
        this.relativePosX = relativePosX;
        this.relativePosY = relativePosY;
        this.title =  title;
    }

    draw(){
        GlobalCtx.font = ""+Math.round((GlobalCanvas.height + GlobalCanvas.width)/titleTextRatio)+"px serif"
        GlobalCtx.fillStyle = "rgb(0,0,0)";
        GlobalCtx.textBaseline = "top";
        GlobalCtx.textAlign = "center";
        GlobalCtx.fillText(this.title, this.posX, this.posY);
    }

    updateSelf(){
        this.posY = GlobalCanvas.height*this.relativePosY;
        this.posX = GlobalCanvas.width *this.relativePosX;
    }
}    

//window/size is the size of the slider 
const sliderSize = 35;
//wideness multiplier
const sliderWidth = 4;
const sliderTextRatio = 140;
class slider extends UIObject{
    constructor(relativePosX, relativePosY, min, max, step, start, title, unit){
        super(0, 0,0,0,0,0,true,true,-1);
        this.relativePosX = relativePosX;
        this.relativePosY = relativePosY;
        this.min = min;
        this.max = max;
        this.step = step;
        this.current = start;
        
        this.width = window.innerWidth/sliderSize;
        this.height = window.innerHeight/sliderSize;

        this.title = title;
        this.unit = unit;

        this.canv = new OffscreenCanvas(this.width, this.height);   
        this.ctx = this.canv.getContext("2d");
        this.updateSelf();
    }

    updateSelf(){
        this.width = (window.innerWidth/sliderSize)*sliderWidth;
        this.height = window.innerHeight/sliderSize;
        this.stepSizePX = (((4 * this.width) / 6) / ((this.max - this.min)/this.step));
        this.stepSizeOffset = (this.width/6);

        this.posY = GlobalCanvas.height*this.relativePosY;
        this.posX = GlobalCanvas.width *this.relativePosX;

        this.cL = 0;
        this.cR = this.width;
        this.cU = 0;
        this.cD = this.height;

        this.canv.width = this.width;
        this.canv.height = this.height;
        this.ctx.clearRect(0, 0, this.width, this.height);


        let offsetFromLeft = this.width/6;
        let offsetFromRight = 5 * (this.width/6);
        //Draw outer border
        this.ctx.strokeStyle = "rgb(0,0,80)";
        this.ctx.lineWidth = Math.max(Math.round((this.height + this.width)/64), 1);
        this.ctx.beginPath();
        this.ctx.moveTo(offsetFromLeft, this.height - this.ctx.lineWidth);
        this.ctx.lineTo(offsetFromRight, this.height - this.ctx.lineWidth);
        this.ctx.lineTo(this.width - this.ctx.lineWidth, this.height/2);
        //upper outline, starts from right this time
        this.ctx.lineTo(offsetFromRight, this.ctx.lineWidth);
        this.ctx.lineTo(offsetFromLeft, this.ctx.lineWidth);

        this.ctx.moveTo(offsetFromRight, this.ctx.lineWidth);
        this.ctx.lineTo(offsetFromLeft, this.ctx.lineWidth);
        this.ctx.lineTo(this.ctx.lineWidth, this.height/2);
        this.ctx.lineTo(offsetFromLeft, this.height - this.ctx.lineWidth);
        this.ctx.lineTo(offsetFromRight, this.height -this.ctx.lineWidth);
        this.ctx.fillStyle = "rgb(180,230,180)";
        this.ctx.fill();
        this.ctx.stroke();


        //this.ctx.strokeStyle = "rgb(0,0,80)";
        this.ctx.fillStyle = "rgb(0,150,250)";
        this.ctx.beginPath();
        this.ctx.ellipse(this.stepSizeOffset + (this.stepSizePX * ((this.current-this.min)/this.step)),this.height/2,this.height * .40, this.height * .40, 0,0,Math.PI * 2, false);
        //this.ctx.stroke();
        this.ctx.fill();

        /*//tick marks on the slider itself
        for(let cTick = 0; cTick < (this.max - this.min)/this.step; cTick++){
            //dclog(this.stepSizeOffset + (this.stepSizePX * cTick))
            this.ctx.strokeRect(this.stepSizeOffset + (this.stepSizePX * cTick), this.ctx.lineWidth, 1, this.ctx.height - this.ctx.lineWidth);
        }*/
    }

    draw(){
        GlobalCtx.fillStyle = "rgb(0,0,0)";
        GlobalCtx.font = ""+Math.round((GlobalCanvas.height + GlobalCanvas.width)/sliderTextRatio)+"px serif"
        GlobalCtx.textBaseline = "bottom";
        GlobalCtx.textAlign = "center";
        GlobalCtx.fillText(this.title, Math.round(this.posX + (this.width/2)), Math.round(this.posY - 4));
        GlobalCtx.textBaseline = "top";
        GlobalCtx.font = ""+((GlobalCanvas.height + GlobalCanvas.width)/(sliderTextRatio*1.2))+"px serif"
        GlobalCtx.fillText(""+this.min+""+this.unit, Math.round(this.posX), Math.round(this.posY +this.height + 4));
        GlobalCtx.fillText(""+this.max+""+this.unit, Math.round(this.posX + this.width), Math.round(this.posY +this.height + 4));
        GlobalCtx.drawImage(this.canv, this.posX,this.posY);
    }

    handleClick(MouseXIn, MouseYIn){
        this.current = Math.max(Math.min(((Math.round((MouseXIn - this.stepSizeOffset)/this.stepSizePX)*this.step)+this.min),this.max),this.min);
        this.updateSelf();
    }

}



class pageswitchArrow extends UIObject{
    static arrowSize = 25;
    constructor(relativePosX, relativePosY, leftRight){
        super(0,0,0,0,0,0,true,true,-1);
        this.relativePosX = relativePosX;
        this.relativePosY = relativePosY;
        this.leftRight = leftRight;

        this.width = window.innerWidth/pageswitchArrow.arrowSize;
        this.height = window.innerHeight/pageswitchArrow.arrowSize;

        this.canv = new OffscreenCanvas(this.width, this.height);   
        this.ctx = this.canv.getContext("2d");
    }


    updateSelf(){
        this.width = window.innerWidth/pageswitchArrow.arrowSize;
        this.height = window.innerHeight/pageswitchArrow.arrowSize;
        this.canv.width = this.width;
        this.canv.height = this.height;

        this.posY = Math.round((GlobalCanvas.height*this.relativePosY));
        this.posX = Math.round((GlobalCanvas.width*this.relativePosX));
        this.cL = 0;
        this.cR = this.width;
        this.cU = 0;
        this.cD = this.height;

        this.ctx.fillStyle = "rgb(20,20,130)";
        if(this.leftRight == 1){            
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.height/3);
            this.ctx.lineTo(Math.round(this.width * 2/3), Math.round(this.height/3));
            this.ctx.lineTo(Math.round(this.width * 2/3), 0);
            this.ctx.lineTo(Math.round(this.width), Math.round(this.height * (1/2)));
            this.ctx.lineTo(Math.round(this.width * 2/3), this.height);
            this.ctx.lineTo(Math.round(this.width * 2/3), Math.round(this.height * (2/3)));
            this.ctx.lineTo(0, Math.round(this.height * (2/3)));
            this.ctx.lineTo(0, Math.round(this.height/3));
            this.ctx.fill();
        }else{
            this.ctx.beginPath();
            this.ctx.moveTo(this.width, this.height/3);
            this.ctx.lineTo(this.width * 1/3, this.height/3);
            this.ctx.lineTo(this.width * 1/3, 0);
            this.ctx.lineTo(0, this.height * (1/2));
            this.ctx.lineTo(this.width * 1/3, this.height);
            this.ctx.lineTo(this.width * 1/3, this.height * (2/3));
            this.ctx.lineTo(this.width, this.height * (2/3));
            this.ctx.lineTo(this.width, this.height/3);
            this.ctx.fill();
        }
        
    }


    draw(){
        GlobalCtx.drawImage(this.canv, this.posX,this.posY);
    }

    handleClick(){
        
        if(this.leftRight){
            curPlane++;
            if(curPlane > PlaneList.length - 1){
                curPlane = 0;
            }
        }else{
            curPlane--;
            if(curPlane <0){
                curPlane = PlaneList.length - 1;
            }
        }
        PlaneList[curPlane].plane.refreshSelf();
    }
}


const planeStatsTitle = "Estimated Performance";
const planeStatsAgility = "Agility";
const planeStatsSpeed = "Speed";
const planeStatsGlide = "Endurance";
const planeStatsTitleRatio = 80;
const planeStatsTextRatio = 120;
const planeStatsMaxVal = 4;
const planeStatsMinVal = 1;
class planeStats extends UIObject{
    constructor(){
        super(0,0,0,0,0,0,true,true,-1);

        //This being a bigger box of /things/, it should just be a box that fits up in the upper left
        this.width = window.innerWidth/2;
        this.height = window.innerHeight/2;

        this.agility = 2;
        this.speed = 1.6;
        this.glide = 2.9;


        this.canv = new OffscreenCanvas(this.width, this.height);   
        this.ctx = this.canv.getContext("2d");
    }

    getColour(attribute){
        let red = attribute - planeStatsMaxVal;
        red = red/(-planeStatsMinVal);
        return("rgb("+(red * 255)+","+(attribute/planeStatsMaxVal*255)+",0)")
    }

    updateSelf(){
        this.width = window.innerWidth/2;
        this.height = window.innerHeight/2;
        this.canv.width = this.width;
        this.canv.height = this.height;


        this.ctx.font = ""+Math.round((GlobalCanvas.height + GlobalCanvas.width)/planeStatsTitleRatio)+"px serif"
        this.ctx.textBaseline = "bottom";
        this.ctx.textAlign = "center";
        this.ctx.fillText(planeStatsTitle, Math.round(this.width/2), Math.round((6* this.height/18)));


        this.ctx.fillStyle = "rgb(0,25,125)";
        this.ctx.beginPath();
        this.ctx.moveTo(Math.round(this.width/2), Math.round((6* this.height/18)));
        this.ctx.lineTo(Math.round(this.width/3), Math.round((10* this.height/18)));
        this.ctx.lineTo(Math.round(this.width/2), Math.round((14* this.height/18)));
        this.ctx.lineTo(Math.round(2*this.width/3), Math.round((10* this.height/18)));
        this.ctx.lineTo(Math.round(this.width/2), Math.round((6* this.height/18)));
        this.ctx.fill();
        this.ctx.fillStyle = "rgb(255,255,255)";


        this.ctx.font = ""+Math.round((GlobalCanvas.height + GlobalCanvas.width)/planeStatsTextRatio)+"px serif"
        this.ctx.fillText(planeStatsSpeed, Math.round(this.width/2), Math.round((8* this.height/18)));

        this.ctx.fillText(planeStatsAgility, Math.round(this.width/2), Math.round((10* this.height/18)));

        this.ctx.fillText(planeStatsGlide, Math.round(this.width/2), Math.round((12* this.height/18)));

        this.ctx.fillStyle = this.getColour(this.speed);
        this.ctx.fillText(""+this.speed, Math.round(this.width/2), Math.round((9* this.height/18)));

        this.ctx.fillStyle = this.getColour(this.agility);
        this.ctx.fillText(""+this.agility, Math.round(this.width/2), Math.round((11* this.height/18)));

        this.ctx.fillStyle = this.getColour(this.glide);
        this.ctx.fillText(""+this.glide, Math.round(this.width/2), Math.round((13* this.height/18)));
    }


    draw(){
        GlobalCtx.drawImage(this.canv, this.posX,this.posY);
    }

}


const generatorTitleTextRatio = 100;
const generatorInnerTextRatio = 140;
class aiGeneratorSettings extends UIObject{
    constructor(){
        super(0,0,0,0,0,0,true,true,-1);
        
        this.speedSlider = new slider(2.5/30,20/30,0,10,1,5,"Speed","");
        this.agilitySlider = new slider(2.5/30,22.5/30,0,10,1,5,"Agility","");
        this.glideSlider = new slider(2.5/30,25/30,0,10,1,5,"Glide","");
        this.generateButton = new aiGenButton(this);
        this.updateSelf();
    }


    draw(){
        //Background box, cyan
        GlobalCtx.fillStyle = "rgb(100, 150, 240)";
        GlobalCtx.fillRect(
        (1.5/30)* window.innerWidth,
        (17.5/30)* window.innerHeight,
        (5.5/30)* window.innerWidth,
        (10/30)* window.innerHeight
        );
        //title card
        GlobalCtx.fillStyle = "rgb(0,0,0)";
        GlobalCtx.font = ""+Math.round((GlobalCanvas.height + GlobalCanvas.width)/generatorTitleTextRatio)+"px serif"
        GlobalCtx.textBaseline = "bottom";
        GlobalCtx.textAlign = "center";
        GlobalCtx.fillText("AI Generation Settings", (4.25/30)* window.innerWidth,(17.4/30)* window.innerHeight);

        
        this.generateButton.draw()
        this.speedSlider.draw();
        this.agilitySlider.draw();
        this.glideSlider.draw();
    }
    
    updateSelf(){
        this.generateButton.updateSelf();
        this.speedSlider.updateSelf();
        this.agilitySlider.updateSelf();
        this.glideSlider.updateSelf();
    }

    checkClick(MouseX, MouseY){
        this.generateButton.checkClick(MouseX, MouseY);
        this.speedSlider.checkClick(MouseX, MouseY);
        this.agilitySlider.checkClick(MouseX, MouseY);
        this.glideSlider.checkClick(MouseX, MouseY);
    }
}

class aiGenButton extends UIObject{
    constructor(parent){
        super(0,0,0,0,0,0,true,true,-1);
        this.parent = parent;
        this.canv = new OffscreenCanvas((3.5/30)* window.innerWidth, (1/30)* window.innerHeight);   
        this.ctx = this.canv.getContext("2d");
        this.updateSelf();
    }

    updateSelf(){
        this.posX = (2.5/30)* window.innerWidth;
        this.posY = (18/30)* window.innerHeight;
        this.width = (3.5/30)* window.innerWidth;
        
        this.height = (1/30)* window.innerHeight;
        this.canv.width = this.width;
        this.canv.height = this.height;
        this.cR = this.width;
        this.cD = this.height;

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = "rgb(0,25,125)";
        this.ctx.fillRect(0,0,this.width,this.height);
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.textBaseline = "middle";
        this.ctx.font = ""+Math.round((GlobalCanvas.height + GlobalCanvas.width)/generatorInnerTextRatio)+"px serif"
        this.ctx.textAlign = "center";
        this.ctx.fillText("Generate", this.width/2,this.height/2);
    }

    draw(){
        GlobalCtx.drawImage(this.canv, this.posX,this.posY);
    }

    handleClick(){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "", false);
        xhr.overrideMimeType("text/plain");
        xhr.setRequestHeader("Content-Type", PlaneList[curPlane].title);
        let message = ""+this.parent.speedSlider.current+" "+this.parent.agilitySlider.current+" "+this.parent.glideSlider.current+"\0";
        xhr.send(message);
        var response = structuredClone(xhr.responseText);
        
        var curAttribute = 0;
        var curLen = 0;
        for(var cChar = 0; cChar < response.length; cChar++){
            //edge case for no more attributes, and thus no more commas to shoot for.
            //if(curAttribute == 8){
            //    PlaneList[curPlane].plane.sliderSet[curAttribute].current = parseInt(response);
            //    PlaneList[curPlane].plane.sliderSet[curAttribute].updateSelf();
            //}
            if(response[cChar] != ","){
                curLen++;
            }
            else{
                dclog("Was "+ PlaneList[curPlane].plane.sliderSet[curAttribute].current)
                PlaneList[curPlane].plane.sliderSet[curAttribute].current = parseInt(response.substring(0,curLen));
                dclog("Adding attribute " + curAttribute + ": " + PlaneList[curPlane].plane.sliderSet[curAttribute].current)
                PlaneList[curPlane].plane.sliderSet[curAttribute].updateSelf();
                
                response = response.substring(curLen + 1);
                curAttribute++;
                cChar = -1;
                curLen = 0;
            }
        }

        //curAttribute++;
        //PlaneList[curPlane].plane.sliderSet[curAttribute].current = parseInt(response);
        //PlaneList[curPlane].plane.sliderSet[curAttribute].updateSelf();

        PlaneList[curPlane].plane.refreshSelf();
    }
}