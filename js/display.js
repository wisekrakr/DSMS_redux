/* David Damian 15/08/2019 */

/* This Display class contains the screen resize event handler and also handles
drawing colors to the buffer and then to the display. */

const Display = function(canvas, game) {

  this.buffer  = document.createElement("canvas").getContext("2d");
  this.context = canvas.getContext("2d");
  this.game    = game;

  let messageTime = 0;
  let counter = 0;

  this.buffer.fillStyle = "#e3e3e3";

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

  /**
   * Shows Game info when player is not null
   */
  this.showGameInfo = function(){
    this.buffer.fillStyle = "#e3e3e3";
    this.buffer.font = "small-caps bold " + TEXT_SIZE*1.5 + "px dejavu sans mono";
    this.buffer.textAlign = 'left';
    
    //Display time
    this.buffer.fillText(
      "Time: " + Math.round(this.game.world.timeKeeper), 
      30, this.game.world.height - 90
      );

    //Display Live left
    this.buffer.fillText(
      "Live: " + Math.round(this.game.world.player.live), 
      30, this.game.world.height - 65
      ); 

    //Display current score
    this.buffer.fillText(
      "Score: " + Math.round(this.game.world.score), 
      30, this.game.world.height - 40
      );
  }

  /**
   * Shows High Score
   */
  this.showHighScore = function(){    
    
    this.buffer.font = "small-caps bold " + TEXT_SIZE*2 + "px dejavu sans mono";
    this.buffer.textAlign = 'center';
    this.buffer.fillText(
      "High Score: " + Math.round(localStorage.getItem(WISE_HIGH_SCORES)), 
      this.game.world.width/2, 50      
    );
  }

  /**
   * Shows Game over text and time of death
   */
  this.showGameOver = function(){    
    this.buffer.fillStyle = "#e3e3e3";
    this.buffer.font = "small-caps bold " + TEXT_SIZE*4 + "px dejavu sans mono";
    this.buffer.textAlign = 'center';

    // Displays Game over text
    this.buffer.fillText(
      "GAME OVER", 
      this.game.world.width/2, this.game.world.height/2
      );   
  }  

  /**
   * Render the canvas and all the text.
   */
  this.render = function() { 
    
    // Clock to get the total time running
    let clock = (this.game.instance.spaceEngine.clock/1000); 

    // All in game text
    if(this.game.world.player !== null){     
      if(this.game.world.player.live > 0){

        counter = 0; // reset respawn counter
        
        // Show Game Info on left botton of the screen
        this.showGameInfo();
        // Show High Score in the center top of the screen
        this.showHighScore();

      }else{

        // Shows Game over text          
        this.showGameOver();  
        
        if(counter === 0){         
          counter = clock;       
        }
       
        // Displays Continue counter
        this.buffer.fillText(
          "Continue: " + Math.round(RESPAWN_TIME - (clock - counter)), 
          this.game.world.width/2, this.game.world.height/3.5
        );        
      }
    }

    // Game messages 
  
    if(this.game.world.sendMessage){    
            
      this.buffer.fillStyle = "rgba(168,207,254)";
      this.buffer.font = "small-caps bold " + TEXT_SIZE + "px arial sans mono";
      this.buffer.textAlign = 'center';

      // Messages given by objects are placed above them.
      this.buffer.fillText(
        this.game.world.text, 
        this.game.world.textObject.x, 
        this.game.world.textObject.y - this.game.world.textObject.height/2,
      );

      if(messageTime === 0){
        messageTime = clock 
      }      

      // After 3 seconds the message will vanish
      if(clock - messageTime >= MESSAGE_TIME){
        this.game.world.sendMessage = false;
      
        messageTime = 0;        
      }        
    }


    // Drawing the canvas (...last so that the rest gets placed on top)
    this.context.drawImage(
      this.buffer.canvas, 
      0, 0, 
      this.buffer.canvas.width, this.buffer.canvas.height, 
      0, 0, 
      this.context.canvas.width, this.context.canvas.height
    ); 
  };


 
  /**
   * Live resizing of the canvas (apply in main.js)
   * 
   * @param  {} width of the canvas
   * @param  {} height of the canvas
   * @param  {} height_width_ratio for the canvas
   */
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
  