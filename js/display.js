/* David Damian 15/08/2019 */

/* This Display class contains the screen resize event handler and also handles
drawing colors to the buffer and then to the display. */

const Display = function(canvas, game) {

  const debug = true;  
  
  this.buffer  = document.createElement("canvas").getContext("2d");
  this.context = canvas.getContext("2d");
  this.game    = game;

  let messageTime = 0;
  let alpha = 1.0;
  
  // Drawing text on screen
  // this.drawText = function(text, x, y){
  
  //   this.buffer.fillStyle = "rgba(255, 255, 255 " + textAlpha + ")";
  //   this.buffer.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
  //   this.buffer.fillText(text, x, y);
  //   textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);    
  // }

  // Drawing objects with four sides
  this.drawRectangle = function(object) {

    this.buffer.fillStyle = object.color;
    this.buffer.fillRect(object.x, object.y, object.width, object.height);
    this.buffer.fillRect(object.x + object.width/6, object.y + object.height, object.width/1.5, object.height/3);
    this.buffer.fillRect(object.x + object.width/2.5, object.y - object.height/3, object.width/5, object.height/2);
  };

  // Drawing objects with three sides
  this.drawTriangle = function(object){
    this.buffer.strokeStyle = object.color;
    this.buffer.lineWidth = object.width /10;

    this.buffer.beginPath();
    //Ship's front
    this.buffer.moveTo(
      object.x + (4/3 * object.width) * Math.cos(object.angle),
      object.y - (4/3 * object.height) * Math.sin(object.angle),
    );
    //Ship's rear left
    this.buffer.lineTo(
      object.x - object.width * (2/3 * Math.cos(object.angle) + Math.sin(object.angle)),
      object.y + object.height * (2/3 * Math.sin(object.angle) - Math.cos(object.angle)),
    );
     //Ship's rear right
    this.buffer.lineTo(
      object.x - object.width * (2/3 * Math.cos(object.angle) - Math.sin(object.angle)),
      object.y + object.height * (2/3 * Math.sin(object.angle) + Math.cos(object.angle)),
    );
    this.buffer.closePath();
    this.buffer.stroke();  

  }  

  // Drawing objects with multiple vertices
  this.drawPolygon = function(object) {
    this.buffer.strokeStyle = object.color;
    this.buffer.lineWidth = object.width /10;

    let vertices = object.vertices;
    let offset = object.offset;

    this.buffer.beginPath();
 
    this.buffer.moveTo(
      object.x + object.width * offset[0] * Math.cos(object.angle),
      object.y + object.height * offset[0]  * Math.sin(object.angle)
    );
    // Draw the polygon
    for(let i = vertices; i > 0; i--){
      this.buffer.lineTo(
        object.x + object.width * offset[i] * Math.cos(object.angle + i * Math.PI * 2 / vertices),
        object.y + object.height * offset[i] * Math.sin(object.angle + i * Math.PI * 2 / vertices)
      );
    }
    this.buffer.closePath();
    this.buffer.stroke();  

  };
  
  this.debugBounds = function(object){
    if(debug){
      this.buffer.strokeStyle = "#3efffa";
      this.buffer.beginPath();

      if(object.tag === "Enemy"){
        this.buffer.arc(object.x + object.width/2, object.y + object.height/2, object.height, 0, Math.PI * 2, false);
      }else{        
        this.buffer.arc(object.x, object.y, object.height * 2, 0, Math.PI * 2, false);        
      }
      this.buffer.stroke();
    }
  };
  
  this.drawCircle = function(object){
    this.buffer.fillStyle = object.color;
    this.buffer.beginPath();
    this.buffer.arc(object.x, object.y, object.height, 0, Math.PI * 2, false); 
    this.buffer.fill();
  }

  this.fill = function(color) {

    this.buffer.fillStyle = color;
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

  };

  // Shows Time on screen
  this.showTime = function(delta){

    this.buffer.fillStyle = "#e3e3e3";
    this.buffer.font = "small-caps bold " + TEXT_SIZE + "px dejavu sans mono";
    this.buffer.fillText(
      "Time: " + delta, 
      30, this.game.world.height - 90
      );
  }

  // Shows the percentage that is left for the player
  this.showPlayerLive = function(){
    
    this.buffer.fillStyle = "#e3e3e3";
    this.buffer.font = "small-caps bold " + TEXT_SIZE + "px dejavu sans mono";
    this.buffer.fillText(
      "Live: " + Math.round(this.game.world.player.live), 
      30, this.game.world.height - 70
      );    
  }

  // Shows Score on the screen
  this.showScore = function(){
    this.buffer.fillStyle = "#e3e3e3";
    this.buffer.font = "small-caps bold " + TEXT_SIZE + "px dejavu sans mono";
    this.buffer.fillText(
      "Score: " + Math.round(this.game.world.score), 
      30, this.game.world.height - 50
    );
  }

  // Shows High Score on the screen
  this.showHighScore = function(){
    
    this.buffer.fillStyle = "#ffffff";
    this.buffer.font = "small-caps bold " + TEXT_SIZE*2 + "px dejavu sans mono";
    this.buffer.fillText(
      "High Score: " + Math.round(localStorage.getItem(WISE_HIGH_SCORES)), 
      this.game.world.width/3, 50
    );
  }

  // Shows Game Over text
  this.showGameOver = function(){
    
    this.buffer.fillStyle = "#ffffff";
    this.buffer.font = "small-caps bold " + TEXT_SIZE*4 + "px dejavu sans mono";
    this.buffer.fillText(
      "GAME OVER", 
      this.game.world.width/4, this.game.world.height/2
      );
    
  }  

  //Show Death time
  this.showDeathTime = function(){
    this.buffer.fillStyle = "#ffffff";
    this.buffer.font = "small-caps bold " + TEXT_SIZE + "px dejavu sans mono";
    this.buffer.fillText(
      "Continue: " + Math.round(this.game.world.deathTime), 
      30, this.game.world.height - 70
    );
  }
  

  this.render = function() { 

    // The time spend in this game. Not total play time.
    let time = Math.round(this.game.world.timeKeeper);
    // Clock to get the total time running
    let clock = (this.game.instance.spaceEngine.clock/1000); 

    // GUI
    if(this.game.world.player !== null){
      if(this.game.world.player.live > 0){
        // Show Time on screen
        this.showTime(time);
        // Show Player Live percentage on screen
        this.showPlayerLive();
        // Show score on screen
        this.showScore();
        // Show High Score on screen
        this.showHighScore();

        alpha = 1.0;
      }else{
        // Shows Game over text
       
        if(alpha > 0){
         
          this.showGameOver();
          alpha -= (1.0 / TEXT_FADE_TIME / this.game.world.fps);            
        }

        this.buffer.fillStyle = "#ffffff";
        this.buffer.font = "small-caps bold " + TEXT_SIZE*2 + "px dejavu sans mono";
        this.buffer.fillText(
          "Continue: " + Math.round(RESPAWN_TIME - alpha * -this.game.world.fps/10 - 7), 
          this.game.world.width/4, this.game.world.height/4
        );
      }
    }


    // Game messages 
    let textAlpha =  this.game.world.textAlpha;
   
    if(textAlpha > 0){
      if(this.game.world.sendMessage){    
              
        this.buffer.fillStyle = "rgba(168,207,254 " + textAlpha + ")";
        this.buffer.font = "small-caps bold " + TEXT_SIZE + "px arial sans mono";

        if(!(this.game.world.textObject instanceof Player)){
          this.buffer.fillText(
            this.game.world.text, 
            this.game.world.textObject.x - ((this.game.world.textObject.width * 4) /2) + this.game.world.textObject.width/2, 
            this.game.world.textObject.y - 35,
            this.game.world.textObject.width * 4
          );
        }else{
          this.buffer.fillText(
            this.game.world.text, 
            this.game.world.textObject.x - ((this.game.world.textObject.width * 8) /2) + this.game.world.textObject.width/2, 
            this.game.world.textObject.y - 35,
            this.game.world.textObject.width * 8
          );
        }

        

        if(messageTime === 0){
          messageTime = clock     
        }      

        if(clock - messageTime >= MESSAGE_TIME){
          this.game.world.sendMessage = false;
        
          messageTime = 0;        
        }
        
      }
      textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);     
    }else{
      
    }
       
    this.context.drawImage(
      this.buffer.canvas, 
      0, 0, 
      this.buffer.canvas.width, this.buffer.canvas.height, 
      0, 0, 
      this.context.canvas.width, this.context.canvas.height
    ); 

    
  };

  this.resize = function(width, height, height_width_ratio) {

    if (height / width > height_width_ratio) {
      this.context.canvas.height = width * height_width_ratio;
      this.context.canvas.width = width;
    } else {
      this.context.canvas.height = height;
      this.context.canvas.width = height / height_width_ratio;
    }

    this.context.imageSmoothingEnabled = false;

  };

};

Display.prototype = {

  constructor : Display

};
  