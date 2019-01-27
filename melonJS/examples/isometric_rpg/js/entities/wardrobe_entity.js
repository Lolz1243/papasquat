
/************************************************************************************/
/*                                                                                  */
/*        a wardrobe entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.WardrobeEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        
        this._super(me.Entity, "init", [x, y , {width:64, height:32}]);
        this.body.collisionType = game.collisionTypes.PLANT;

        
        var texture =  new me.video.renderer.Texture(
            { framewidth: 128, frameheight: 128 },
            me.loader.getImage("wardrobe")
        );

        // create a new sprite object
        this.renderable = texture.createAnimationFromName([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        // define an additional basic walking animation
        
        this.renderable.addAnimation ("static", [10]);
        this.renderable.addAnimation ("get in", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        this.renderable.addAnimation ("get out", [7, 6, 5, 4, 3, 2, 1, 0]);

        this.renderable.setCurrentAnimation(["static"]);
        
        this.state = "empty";

        // set the renderable position to bottom center
        this.anchorPoint.set(0, -.7);
        
        me.input.registerPointerEvent("pointerdown", this, this.onMouseDown.bind(this));
    },

    /* -----

        update the player pos

    ------            */
    update : function (dt) {
        this._super(me.Entity, "update", [dt]);
        
    },
    
    onMouseDown : function() {
        console.log("clicked");
        if (this.state === "empty") {
            this.state = "transition";
            // set touch animation
            this.renderable.setCurrentAnimation("get in");
            game.data.player.pos.x = this.pos.x - 24;
            game.data.player.pos.y = this.pos.y + 24;
            game.data.player.renderable.setOpacity(0)
           
            me.audio.play("Cabinet Open", false, null, .5);
            var that = this
            setTimeout(function() {
                that.renderable.setCurrentAnimation("static");
                that.state = "full"
            }, 700);

           
            return false;

        }
        if (this.state === "full") {
            this.state = "empty";
            // set touch animation
            this.renderable.setCurrentAnimation("get out");
            // make it flicker
            //this.renderable.flicker(75);
            
            me.audio.play("Cabinet Close", false, null, .5);
            var that = this
            setTimeout(function() {
                that.renderable.setCurrentAnimation("static");
                that.state = "empty"
                game.data.player.pos.x = that.pos.x - 24;
                game.data.player.pos.y = that.pos.y + 24;
                game.data.player.renderable.setOpacity(1)
            }, 700);
            


           
            return false;

        }
        
},

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (/*response, other*/) {
        // Make all other objects solid
        return false;
    }
});

