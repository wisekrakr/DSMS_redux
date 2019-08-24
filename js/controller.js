/* David Damian 15/08/2019 */

/* The controller only alerts the user whenever they press a key,
but it also defines the ButtonInput class, which is used for tracking button states. */

const Controller = function() {
    
    this.left  = new Controller.ButtonInput();
    this.right = new Controller.ButtonInput();
    this.up    = new Controller.ButtonInput();
    this.debug = new Controller.ButtonInput();
  
    this.keyDownUp = function(type, key_code) {
  
      let down = (type == "keydown") ? true : false;
      
      switch(key_code) {
        
        case 65: case 37: 
            this.left.getInput(down);  
            break;
        case 87: case 38:
            this.up.getInput(down);    
            break;
        case 68: case 39:
            this.right.getInput(down); 
            break;   
        case 8: //backspace to set debug lines or not
            this.debug.getInput(down); 
            break;    
            
        default:
            console.error(key_code + ": This key is not yet defined")     
      }
    }; 

    this.mouseMoveHandler = function(x, y){
        let mouseX = mouse.clientX;
        let mouseY = mouse.clientY;

        x = mouseX;
        y = mouseY;
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
  