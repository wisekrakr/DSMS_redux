/* David Damian (wisekrakr) 15/08/2019 */

/**
 * This is a fixed clock step game loop. It will make sure
 * that the game is updated at a consistent rate. The same experience for all users.
 * */  

const Engine = function(delta, update, render) {
    
    this.animationFrameRequest = undefined,// reference to the Animation Frame Request
    this.elapsedTime = 0; // Amount of clock that's accumulated since the last update.
    this.clock = undefined, // The most recent timestamp of loop execution.
    this.delta = delta, // 1000/30 = 30 frames per second
  
    this.updated = false;// Whether or not the update function has been called since the last cycle.
  
    this.update = update; // The update function
    this.render = render; // The render function
  
    this.run = function(time) { // This is one cycle of the game loop

      this.animationFrameRequest = window.requestAnimationFrame(this.handleRun);
  
      this.elapsedTime += time - this.clock;
      this.clock = time;

      /* Prevent game freezes */
      if (this.elapsedTime >= this.delta * 3) {

        this.elapsedTime = this.delta;

      };

   
      /* See if enough time has passed to update.  */
      while(this.elapsedTime >= this.delta) {
  
        this.elapsedTime -= this.delta;
  
        this.update(time);
  
        this.updated = true;// If the game has updated, we need to draw it again.
  
      };
  
      /* This allows us to only draw when the game has updated. */
      if (this.updated) {
  
        this.updated = false;
        this.render(time);
  
      };
  
    };
  
    this.handleRun = (delta) => { this.run(delta); };
  
  };
  
  Engine.prototype = {
  
    constructor:Engine,
  
    start:function() {
  
      this.elapsedTime = this.delta;
      this.clock = window.performance.now();
      this.animationFrameRequest = window.requestAnimationFrame(this.handleRun);
  
    },
  
    stop:function() { window.cancelAnimationFrame(this.animationFrameRequest); }
  
  };
  