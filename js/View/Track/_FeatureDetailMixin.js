/**
 * Mixin with methods for parsing making default feature detail dialogs.
 */
define([
            'dojo/_base/declare',
            'dojo/_base/array',
            'dojo/dom-construct',
            'JBrowse/View/Track/_FeatureDetailMixin'
        ],
        function(
            declare,
            array,
            domConstruct,
            FeatureDetailMixin
        ) {

return declare(FeatureDetailMixin, {

    /**
     * Make a default feature detail page for the given feature.
     * @returns {HTMLElement} feature detail page HTML
     */
    blastFeatureDetail: function(/** JBrowse.Track */ track, /** Object */ f, /** HTMLElement */ featDiv, /** HTMLElement */ container) {
        container = container || dojo.create('div', { className: 'detail feature-detail feature-detail-'+track.name.replace(/\s+/g, '_').toLowerCase(), innerHTML: '' });

        this._renderCoreDetails( track, f, featDiv, container );

        this._renderAlignmentDetail(track, f, featDiv, container);

        this._renderAdditionalTagsDetail(track, f, featDiv, container);

        //this._renderUnderlyingReferenceSequence( track, f, featDiv, container );

        return container;
    },

    _renderAdditionalTagsDetail: function( track, f, featDiv, container ) {
        var additionalTags = array.filter( f.tags(), function(t) {
            return ! this._isReservedTag( t );
        },this);

        if( additionalTags.length ) {
            var atElement = domConstruct.create(
                'div',
                { className: 'additional',
                  innerHTML: '<h2 class="sectiontitle">Attributes</h2>'
                },
                container );
            array.forEach( additionalTags.sort(), function(t) {
                // Custom
                if(t!= "Blast_sseq" && t!=="Blast_mseq" && t!=="Blast_qseq"){
                    this.renderDetailField( container, t, f.get(t), f );
                }
            }, this );
        }
    },

    _renderAlignmentDetail: function(track, f, featDiv, container) {
        var additionalTags = array.filter(f.tags(), function(t) {
            return ! this._isReservedTag(t);
        }, this);

        if(additionalTags.length) {
            var atElement = domConstruct.create(
                'div',
                { className: 'additional',
                  innerHTML: '<h2 class="sectiontitle">Alignment</h2>'
                },
                container
            );

            var alignmentContainer = domConstruct.create(
                'div',
                {
                    className: 'alignment_container',
                    innerHTML: '<pre>Query: ' + f.get("Blast_qseq") + "\nMatch: " + f.get("Blast_mseq") + "\nSbjct: " + f.get("Blast_sseq")  + '</pre>',
                },
                atElement
            );
        }
    },
});
});
