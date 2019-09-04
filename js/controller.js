
/**
 * The controller only alerts the user whenever they press a key,
 * but it also defines the ButtonInput class, which is used for tracking button states.
 */

const Controller = function() {
    
    this.left  = new Controller.ButtonInput();
    this.right = new Controller.ButtonInput();
    this.up    = new Controller.ButtonInput();   
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
            this.paused = true;            
            break;
        case 27:  // Escape to unpause
            this.paused = false;
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
  