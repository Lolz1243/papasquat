
/************************************************************************************/
/*                                                                                  */
/*        a player entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        game.data.player = this
        this._super(me.Entity, "init", [x, y , settings]);
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        // walking & jumping speed
        this.body.setVelocity(2.5, 2.5);
        this.body.setFriction(0.4,0.4);

        // set the display around our position
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

        // enable keyboard
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP,    "up");
        me.input.bindKey(me.input.KEY.DOWN,  "down");
        me.input.bindKey(me.input.KEY.A,  "left");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.W,    "up");
        me.input.bindKey(me.input.KEY.S,  "down");

        // the main player spritesheet
        var texture =  new me.video.renderer.Texture(
            { framewidth: 64, frameheight: 128 },
            me.loader.getImage("Papa_Squat-01")
        );

        // create a new sprite object
        this.renderable = texture.createAnimationFromName([0, 2, 4, 6, 8, 10, 12, 14]);
        // define an additional basic walking animation
        this.renderable.addAnimation ("simple_walk", [0, 2, 4, 6, 8, 10, 12]);

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, -1);
    },

    /* -----

        update the player pos

    ------            */
    update : function (dt) {
        game.data.urine += .03
        game.data.food -= .01

        if (game.data.momsus) {
            game.data.suspicion += 0.3;
        }
        if (game.data.sonsus) {
            game.data.suspicion += 0.1;
        }
        if (game.data.sussus) {
            game.data.suspicion += 0.1;
        }
        else if (!game.data.momsus && !game.data.sonsus && !game.data.sussus && game.data.suspicion >= 0.1) {
            game.data.suspicion -= 0.1;
        }

        if (game.data.suspicion >= 30) {
            me.audio.unmute("Panic Theme");
            me.audio.mute("Gameplay Theme (Day)");
            me.audio.mute("Gameplay Theme (Night)");
        }
        else {
            me.audio.mute("Panic Theme");
            me.audio.unmute("Gameplay Theme (Day)");
            me.audio.unmute("Gameplay Theme (Night)");
        }

        if (game.data.food < 0 || game.data.suspicion > 100){
            this.alive = false;
            me.state.change(me.state.GAMEOVER);
        }

        if ( game.data.urine > 100 ){
            var puddle = me.pool.pull("puddle", this.pos.x, this.pos.y, {});
            if(this.renderable.getOpacity() < 0.5){
                puddle = me.pool.pull("puddle", this.pos.x-24, this.pos.y+24, {});
            }

            me.audio.play("Piss", false, null, 0.5);
            me.audio.play("Sigh 2", false, null, 1.0);
            game.data.messages.push("you peed on the floor");
            me.game.world.addChild(puddle);
            game.data.urine = 1;
        }

        if (me.input.isKeyPressed("left")) {
            // update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        } else if (me.input.isKeyPressed("right")) {
            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        } else {
            this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed("up")) {
            // update the entity velocity
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        } else if (me.input.isKeyPressed("down")) {
            // update the entity velocity
            this.body.vel.y += this.body.accel.y * me.timer.tick;
        } else {
            this.body.vel.y = 0;
        }

        // apply physics to the body (this moves the entity)
        if (this.renderable.getOpacity() > 0.5){
            this.body.update(dt);

            //handle collisions against other shapes
            me.collision.check(this);
        }

        // check if we moved (an "idle" animation would definitely be cleaner)
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
            this._super(me.Entity, "update", [dt]);
            return true;
        }
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid

        switch(other.body.collisionType){
            case game.collisionTypes.PUDDLE:
             return false;
            case game.collisionTypes.FOOD:
            case game.collisionTypes.PLANT:
                return true;
            case game.collisionTypes.MOM:
                if (this.renderable.getOpacity() < 0.5){
                    return false;
                }
                me.state.change(me.state.GAMEOVER);
            default:
                return true
        }

    }
});

