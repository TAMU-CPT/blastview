/**
 * Feature track that draws features using HTML5 canvas elements.
 */

define( [
            'dojo/_base/declare',
            'dojo/_base/event',
            'JBrowse/Util',
            'BlastView/View/Track/_FeatureDetailMixin',
            'JBrowse/View/Track/CanvasFeatures'
        ],
        function(
            declare,
            domEvent,
            Util,
            FeatureDetailMixin,
            CanvasFeatures
        ) {

return declare([CanvasFeatures, FeatureDetailMixin],
{

    // Again, entirely the same as  JBrowse/View/Track/CanvasFeatures.js except with additions to the menu.
    _defaultConfig: function() {
        return Util.deepUpdate(
            dojo.clone( this.inherited(arguments) ),
            {
            maxFeatureScreenDensity: 0.5,

            // default glyph class to use
            glyph: dojo.hitch( this, 'guessGlyphType' ),

            // maximum number of pixels on each side of a
            // feature's bounding coordinates that a glyph is
            // allowed to use
            maxFeatureGlyphExpansion: 500,

            // maximum height of the track, in pixels
            maxHeight: 600,

            histograms: {
                description: 'feature density',
                min: 0,
                height: 100,
                color: 'gray',
                clip_marker_color: 'red'
            },
            onClick: {
                action: "contentDialog",
                title: '{type} {name}',
                content: dojo.hitch( this, 'blastFeatureDetail' )
            },

            style: {
                // not configured by users
                _defaultHistScale: 4,
                _defaultLabelScale: 30,
                _defaultDescriptionScale: 120,

                showLabels: true,
                showTooltips: true,
                label: 'name,id',
                description: 'note, description',

                color: function(feature, variableName, glyphObject, track) {
                    var search_up = function self(sf, attr){
                        if(sf.get(attr) !== undefined){
                            return sf.get(attr);
                        }
                        if(sf.parent() === undefined) {
                            return;
                        }else{
                            return self(sf.parent(), attr);
                        }
                    };

                    var search_down = function self(sf, attr){
                        if(sf.get(attr) !== undefined){
                            return sf.get(attr);
                        }
                        if(sf.children() === undefined) {
                            return;
                        }else{
                            var kids = sf.children();
                            for(var child_idx in kids){
                                var x = self(kids[child_idx], attr);
                                if(x !== undefined){
                                    return x;
                                }
                            }
                            return;
                        }
                    };

                    var color = (search_up(feature, 'color') || search_down(feature, 'color') || this.config.style.alignmentColor || "#000000");
                    var score = (search_up(feature, 'score') || search_down(feature, 'score'));
                    var opacity = 0;
                    if(score == 0.0 || isNaN(score)) {
                        opacity = 1;
                    } else {
                        opacity = (20 - Math.log10(score)) / 180;
                        if(opacity === Infinity){
                            opacity = 1;
                        }
                    }

                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                    var red = parseInt(result[1], 16);
                    var green = parseInt(result[2], 16);
                    var blue = parseInt(result[3], 16);
                    if(isNaN(opacity) || opacity < 0){
                        opacity = 0;
                    }
                    return 'rgba(' + red + ',' + green + ',' + blue + ',' + opacity + ')';
                },

            },

            displayMode: 'normal',

            events: {
                contextmenu: function( feature, fRect, block, track, evt ) {
                    evt = domEvent.fix( evt );
                    if( fRect && fRect.contextMenu )
                        fRect.contextMenu._openMyself({ target: block.featureCanvas, coords: { x: evt.pageX, y: evt.pageY }} );
                    domEvent.stop( evt );
                }
            },

            menuTemplate: [
                { label: 'View details',
                  title: '{type} {name}',
                  action: 'contentDialog',
                  iconClass: 'dijitIconTask',
                  content: dojo.hitch(this, 'blastFeatureDetail' )
                }
            ]
        });
    },

});
});
