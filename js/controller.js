
/**
 * The controller only alerts the user whenever they press a key,
 * but it also defines the ButtonInput class, which is used for tracking button states.
 */

const Controller = function(game) {
    
    this.game  = game;
    this.left  = new Controller.ButtonInput();
    this.right = new Controller.ButtonInput();
    this.up    = new Controller.ButtonInput();   
    this.power = new Controller.ButtonInput();  
    this.paused= false;
     
    this.keyDownUp = function(type, key_code) {
  
      let down = (type == "keydown") ? true : false;
      
      switch(key_code) {
        
        case 65: case 37: //A and Left Arrow
            this.left.getInput(down);  
            break;
        case 87: case 38: //W and Up Arrow
            this.up.getInput(down);    
            break;
        case 68: case 39: //D and Right Arrow
            this.right.getInput(down); 
            break;  
        case 80:     // P to pause   
            if(this.game.world.start_game && !this.game.world.win){     
                this.paused = true;  
                this.game.gameAudio.play(700, 0.3, "sine").setFrequency(550, 0.3).stop(0.8); 
            }       
            break;
        case 27:  // Escape to unpause
            if(this.game.world.start_game && !this.game.world.win){
                this.paused = false;
                this.game.gameAudio.play(550, 0.3, "sine").setFrequency(700, 0.3).stop(0.8); 
            } 
            break;
        case 32:  // Space to Start the Game
            if(!this.game.world.start_game){
                this.game.world.start_game = true;   
            }
            break;
        case 8: // Backspace to Start Menu            
            this.game.world.start_game = false; 
            this.game.world.win = false;            
            this.game.world.destroyWorld();     
            break;
        case 16: //Left shift to power up            
            this.power.getInput(down);             
            break;
        default:
            console.error(key_code + ": This key is not yet defined")     
      }
    }; 
};

Controller.prototype = {

    constructor : Controller

};

Controller.ButtonInput = function() {

    this.active = this.down = false;

};

Controller.ButtonInput.prototype = {

    constructor : Controller.ButtonInput,

    getInput : function(down) {

        if (this.down != down) this.active = down;
        this.down = down;

    }

};
  