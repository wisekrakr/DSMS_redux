/* David Damian 15/08/2019 */

/* This is a fixed clock step game loop. It can be used for any game and will ensure
that game state is updated at the same rate across different devices which is important
for uniform gameplay. You can do things like frame dropping
and interpolation with a fixed step loop */

const Engine = function(delta, update, render) {

    this.elapsedTime = 0;// Amount of clock that's accumulated since the last update.
    this.animationFrameRequest = undefined,// reference to the AFR
    this.clock = undefined,// The most recent timestamp of loop execution.
    this.delta = delta,// 1000/30 = 30 frames per second
  
    this.updated = false;// Whether or not the update function has been called since the last cycle.
  
    this.update = update; // The update function
    this.render = render; // The render function
  
    this.run = function(time) {// This is one cycle of the game loop
  
      this.elapsedTime += time - this.clock;
      this.clock = time;

      /* Prevent game freezes */
      if (this.elapsedTime >= this.delta * 3) {

        this.elapsedTime = this.delta;

      }

   
      /* See if enough has passed to update.  */
      while(this.elapsedTime >= this.delta) {
  
        this.elapsedTime -= this.delta;
  
        this.update(time);
  
        this.updated = true;// If the game has updated, we need to draw it again.
  
      }
  
      /* This allows us to only draw when the game has updated. */
      if (this.updated) {
  
        this.updated = false;
        this.render(time);
  
      }
  
      this.animationFrameRequest = window.requestAnimationFrame(this.handleRun);
  
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
  