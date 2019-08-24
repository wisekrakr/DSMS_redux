const Meteor = function(game,x, y) {

    this.tag        = "Meteor";
    this.tagNr      = Math.random();
    this.color      = "#e3e3e3";
    this.width      = AS_WIDTH/4;
    this.height     = AS_HEIGHT/4;
    this.velocity_x = Math.random() * (AS_SPEED * 4) / FPS;
    this.velocity_y = Math.random() * (AS_SPEED * 4) / FPS;
    this.angle      = 0;
    this.speed      = AS_SPEED * 4;       
    this.x          = x;
    this.y          = y;
    this.vertices   = Math.floor(Math.random() * (VERTICES + 1) + VERTICES /2);
    this.offset     = [];  
    this.game       = game;  

    this.game.instance.gameEngine.gameEngine.addObject(this);

    //Create the vertex offset array
    for(let i = 0; i < this.vertices; i++){
        this.offset.push(Math.random() * AS_RIDGE * 2 + 1 - AS_RIDGE);
    }
};

Meteor.prototype = {

    constructor : Meteor,    

    collide: function () {       
        return this.game.instance.gameEngine.gameEngine.collision(this);         
    },

    compareAngles: function(sourceAngle, otherAngle){

        // sourceAngle and otherAngle should be in the range -3 to 3
        let difference = otherAngle - sourceAngle;

        if(difference < -1){difference += 3;}            
        if(difference > 1){difference -= 3;}          

        if(difference > 0){return 1;}           
        if(difference < 0){return -1;}

        return 0;
    },
   
    update: function() {
         
        if(this.collide()){
            let attackAngle = this.game.instance.gameEngine.gameEngine.angleBetweenObjects(this, 
                this.game.instance.gameEngine.gameEngine.collisionObject(this));
            
            let dodgeAngle = this.compareAngles(this.angle, attackAngle);
        
            this.x += this.speed * Math.cos(-dodgeAngle) / this.game.world.fps; 
            this.y += this.speed * Math.sin(-dodgeAngle) / this.game.world.fps;  
                
        }else{
            //Set the appropriate speed and direction
            this.x += this.velocity_x; 
            this.y += this.velocity_y; 
        }
        
    },    

};  
  
  
    
    
  
 