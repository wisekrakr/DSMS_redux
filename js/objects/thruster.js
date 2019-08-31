const Thruster = function(game) {

    this.tag        = "Thruster";
    this.tagNr      = Math.random();
    this.color      = "#000000";
    this.width      = PLAYER_WIDTH/2;
    this.height     = PLAYER_HEIGHT/2;  
    this.x          = 0;
    this.y          = 0;
    this.angle      = 0;  
    this.game       = game;
    
    this.game.instance.gameEngine.gameEngine.addObject(this);
};

Thruster.prototype = {

  constructor : Thruster,
  various_colors: [
   'rgb(255,0,0)', //red
    'rgb(255,153,0)',  //orange
    'rgb(255,255,102)' //yellow
  ],

  update: function() {

      if(this.game.world.player !== null){
        this.angle = this.game.world.player.angle;

        this.x = this.game.world.player.x - this.game.world.player.width * Math.cos(-this.angle); 
        this.y = this.game.world.player.y + this.game.world.player.height * Math.sin(this.angle);  
      }else{
        this.game.instance.gameEngine.gameEngine.removeObject(this);
      }
  },    
};  

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}    