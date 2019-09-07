

/**
 * This Display class contains the screen resize event handler and also handles
 * drawing colors to the buffer and then to the display.
 * 
 * @param  {} canvas html canvas
 * @param  {} game current game component
 * @param  {} controller current controller component
 */
const Display = function(canvas, game, controller) {

  this.buffer  = document.createElement("canvas").getContext("2d");
  this.context = canvas.getContext("2d");
  this.game    = game;
  this.control = controller;
};

Display.prototype = {

  constructor : Display,
  message_time : 0,
  counter : 0,

  /**
   * Drawing objects with four sides
   * 
   * @param  {} object represents
   */
  drawRectangle : function(object) {

    this.buffer.fillStyle = object.color;
    this.buffer.fillRect(object.x, object.y, object.width, object.height);
    this.buffer.fillRect(object.x + object.width/6, object.y + object.height, object.width/1.5, object.height/3);
    this.buffer.fillRect(object.x + object.width/2.5, object.y - object.height/3, object.width/5, object.height/2);
  },
 
  /**
   * Drawing objects with three sides
   * 
   * @param  {} object represents
   */
  drawTriangle : function(object){
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

  },  

  /**
   *  Drawing objects with multiple vertices
   * 
   * @param  {} object represents
   * @param  {} filled boolean to draw as filled or as stroke
   */
  drawPolygon : function(object, filled) {
    if(!filled){
      this.buffer.strokeStyle = object.color;
      this.buffer.lineWidth = object.width /10;
    }else{
      this.buffer.fillStyle = object.color;
    }

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

    if(!filled){
      this.buffer.stroke();  
    }else{
      this.buffer.fill();
    }
  },
  
   /**
   *  Drawing objects with a circle
   * 
   * @param  {} object represents
   * @param  {} filled boolean to draw as filled or as stroke
   */
  drawCircle : function(object, filled){
    if(filled){
      this.buffer.fillStyle = object.color;
      this.buffer.beginPath();
      this.buffer.arc(object.x, object.y, object.height, 0, Math.PI * 2, false); 
      this.buffer.fill();
    }else{
      this.buffer.strokeStyle = object.color;
      this.buffer.beginPath();
      this.buffer.arc(object.x, object.y, object.height, 0, Math.PI * 2, false); 
      this.buffer.stroke();
    }
  },

  /**
   * Function to fill the whole display 
   * 
   * @param  {} color
   */
  fill : function(color) {

    this.buffer.fillStyle = color;
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

  },

  /**
   * Function to quickly produce some text on the screen.
   * 
   * @param  {} fill_style color 
   * @param  {} text_size size of text
   * @param  {} text_align align with the display
   * @param  {} x position on x-axis
   * @param  {} y position on y-axis
   * @param  {} width max-width 
   * @param  {} message string text
   */
  drawInfo : function(fill_style, text_size, text_align, x, y, width, message){
    this.buffer.fillStyle = fill_style;
    this.buffer.font = "small-caps bold " + text_size + "px gamer";
    this.buffer.textAlign = text_align;

    this.buffer.fillText(message, x, y, width);
  },

  /**
   * Shows Game info when player is not null
   */
  showGameInfo : function(){
    
    //Display time
    this.drawInfo("#FFA500", TEXT_SIZE*1.5, 'left', 30, this.game.world.height - 65,
      150, "Time: " + Math.round(this.game.world.time_keeper));  
    
    //Display Live left  
    this.drawInfo("#FFA500", TEXT_SIZE*1.5, 'left', 30, this.game.world.height - 45,
      150, "Live: " + Math.round(this.game.world.player.live)); 

    //Display current score   
    this.drawInfo("#FFA500", TEXT_SIZE*1.5, 'left', 30, this.game.world.height - 25,
      150, "Score: " + Math.round(this.game.world.score));     
    
    // When a time trail initiates and the Player escorts the Froggy around, keeping it alive,
    // a timer start going for extra points
    // On top of the rest.
    if(this.game.world.froggy !== null){
      if(this.game.world.froggy.following){ 
        this.drawInfo("#FFA500", TEXT_SIZE*1.5, 'left', 30, this.game.world.height - 90,
          150, "Time Trial: " + Math.round(this.game.world.time_trial));   
      }      
      
      this.drawInfo("#FFA500", TEXT_SIZE*2, 'left', 30, 45, 250, 
        "Time Trial Best: " + Math.round(this.game.world.time_trial_high) + " seconds");      
      
      if(this.game.world.froggy.explode_time <= 0){
        this.drawInfo("#FFA500", TEXT_SIZE*2, 'left', 30, 70, 250, 
          "Froggy died... R.I.P. Froggy");  
      }
    }      
  },

  /**
   * Shows High Score
   */
  showHighScore : function(){     

    this.drawInfo("#FFA500", TEXT_SIZE*4, 'center', this.game.world.width/2, 50, this.game.world.width, 
      "High Score: " + Math.round(localStorage.getItem(DSMS_HIGH_SCORES)));  
  },

  /**
   * Shows Game over text and time of death
   */
  showGameOver : function(){       
      
    this.drawInfo("#e3e3e3", TEXT_SIZE*6, 'center', this.game.world.width/2, this.game.world.height/2, this.game.world.width,
      "GAME OVER"); 
  },  

  
  /**
   * Render the canvas and all the text.
   */
  render : function() { 

    if(this.game.world.start_game){
    
      if(!this.control.paused && !this.game.world.win){
      
        // Clock to get the total time running
        let clock = (this.game.spaceEngine.clock/1000); 

        // All in game text
        if(this.game.world.player !== null){     
          if(this.game.world.player.live > 0){

            this.counter = 0; // reset respawn counter
            
            // Show Game Info on left botton of the screen
            this.showGameInfo();
            // Show High Score in the center top of the screen
            this.showHighScore();  
            // Press P to Pause text  
            this.drawInfo("#CBCCCE", TEXT_SIZE, 'right', 
              this.game.world.width - 32, this.game.world.height - 50, this.game.world.width,
              "P to PAUSE");  
            // Press Backspace to go to start menu
            this.drawInfo("#CBCCCE", TEXT_SIZE, 'right', 
              this.game.world.width - 32, this.game.world.height - 25, this.game.world.width,
              "BACKSPACE to RESTART");

          }else{

            // Shows Game over text          
            this.showGameOver();   
            
            if(this.counter === 0){         
              this.counter = clock;       
            }  
            // Displays Continue counter      
        
            this.drawInfo("#e3e3e3", TEXT_SIZE*6, 'center', 
            this.game.world.width/2, this.game.world.height/3.5, this.game.world.width,
              "Continue: " + Math.round(RESPAWN_TIME - (clock - this.counter)));
          }
        }

        // Game messages 
        
        this.buffer.textAlign = 'center';

        // Messages given by objects are placed above them.
        for(let [message, object] of this.game.world.messages){ 
          
          // If the object is not on display, don't show its message
          if(!this.game.gameEngine.toBeRemoved.has(object)){

            if(message !== null){

              if(object instanceof WorldMessage){

                this.drawInfo(this.getGradient(), TEXT_SIZE*3, 'center', object.x, 
                  object.y - object.height/2, this.game.world.width, message);

              }else{             

                this.drawInfo("rgba(142,222,131)", TEXT_SIZE, 'center', object.x, 
                  object.y - object.height/2, 300, message);
              }            
            }

            if(this.message_time === 0){
              this.message_time = clock 
            }      

            // After 3 seconds the message will vanish
            if(clock - this.message_time >= 3){    
            
              this.game.world.messages.delete(message, object); // delete the current message

              object.send_message = false; // Now a new message can be received

              this.message_time = 0;        
            } 
          }       
        }       
      }else if(this.control.paused){
        // Draw Pause menu

        
        //Display time
        this.drawInfo("#FFA500", TEXT_SIZE*5, 'center', this.game.world.width/2,  225, this.game.world.width,
          "Time: " + Math.round(this.game.world.time_keeper));  
      
        //Display Live left  
        this.drawInfo("#FFA500", TEXT_SIZE*5, 'center', this.game.world.width/2, this.game.world.height /2, 
          this.game.world.width,"Live: " + Math.round(this.game.world.player.live)); 

        //Display current score   
        this.drawInfo("#FFA500", TEXT_SIZE*5, 'center', this.game.world.width/2, this.game.world.height - 225,
          this.game.world.width, "Score: " + Math.round(this.game.world.score)); 
        
        //Display press Esc to Unpause
    
        this.drawInfo("#cbccce", TEXT_SIZE, 'center',this.game.world.width/2, this.game.world.height - 25, 300,
          "Press Escape to Unpause"); 
        
      }else if(this.game.world.win){
        this.winScreen();
      }
    }else{
      // If the Game is first opened....Show Start screen.
      this.startScreen();
    }

    // Drawing the canvas (...last so that the rest gets placed on top)
    this.context.drawImage(
      this.buffer.canvas, 
      0, 0, 
      this.buffer.canvas.width, this.buffer.canvas.height, 
      0, 0, 
      this.context.canvas.width, this.context.canvas.height
    ); 
  },
 
  /**
   * Live resizing of the canvas (apply in main.js)
   * 
   * @param  {} width of the canvas
   * @param  {} height of the canvas
   * @param  {} height_width_ratio for the canvas
   */
  resize : function(width, height, height_width_ratio) {

    if (height / width > height_width_ratio) {
      this.context.canvas.height = width * height_width_ratio;
      this.context.canvas.width = width;
    } else {
      this.context.canvas.height = height;
      this.context.canvas.width = height / height_width_ratio;
    }

    this.context.imageSmoothingEnabled = false;
  },
  
  getGradient: function(){
    let gradient = this.buffer.createLinearGradient(0, 0, this.game.world.width, this.game.world.height);
    
    gradient.addColorStop(0.2, "rgb(194,47,3)"); 
    gradient.addColorStop(0.5, "rgb(255,167,0)");   
    gradient.addColorStop(0.8, "rgb(127,191,251)");   

    return gradient;
  },

  /**
   * Draws everything we need for a start screen.
   */
  startScreen : function(){
  
    this.drawInfo("rgba(206,14,45, 0.3)", TEXT_SIZE, 'left',  32, 32, this.game.world.width,
      "David Damian === github.com/wisekrakr");
    this.drawInfo("#ffffff", TEXT_SIZE * 1.5, 'left',  this.game.world.width/2 - 400, this.game.world.height/2 - 90, this.game.world.width,
      "Wisekrakr Games Presents:"); 
    this.drawInfo(this.getGradient(), TEXT_SIZE*6, 'center', this.game.world.width/2, this.game.world.height/2, this.game.world.width,
      "Don't Shoot Back"); 
    this.drawInfo(this.getGradient(), TEXT_SIZE*3, 'center', this.game.world.width/2, this.game.world.height/2 + 90, this.game.world.width,
      "A Space Passivist's Saga"); 
    this.drawInfo(this.game.colorPicker(["red","white","blue"]), TEXT_SIZE*2, 'center',this.game.world.width/2, this.game.world.height - 100, 500,
      "Press SPACE to Enter SPACE"); 
  },

  /**
   * Shows Game over text and time of death
   */
  winScreen : function(){    
      
    this.drawInfo(this.getGradient(), TEXT_SIZE*6, 'center', this.game.world.width/2, this.game.world.height/4, this.game.world.width,
      "You Win!"); 
    this.drawInfo(this.getGradient(), TEXT_SIZE*4, 'center', this.game.world.width/2, this.game.world.height/2, this.game.world.width,
      "Score: " + Math.round(this.game.world.score)); 
    this.drawInfo(this.game.colorPicker(["red","white","blue"]), TEXT_SIZE*3, 'center',
      this.game.world.width/2, this.game.world.height - 100, this.game.world.width,
      "Press BACKSPACE to Go BACK to SPACE");     
  },  

};
  