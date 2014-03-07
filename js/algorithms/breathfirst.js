/**
 * Created by blue0re on 06.03.14.
 */

var BreathFirst = Class.extend({
    construct: function(graph) {
        this.currentnode = null;
        this.nodes = [];
        this.graph = graph;
    },

    getNextNode: function() {
        return this.nodes.shift();
    },

    addNode: function(cell) {
        var curcol = this.graph.attr(cell,'rect/fill');
        if(cell == this.graph.endcell)
            this.graph.attr(cell, 'rect/fill', '#00cc00');
        else if(cell == this.graph.startcell)
            this.graph.attr(cell, 'rect/fill', '#cc0000');
        else if(curcol == '#00ffff' || curcol == '#00cccc')
            this.graph.attr(cell, 'rect/fill', '#00cccc');
        else
            this.graph.attr(cell, 'rect/fill', '#aaaaaa');
        this.nodes.push(cell);
    },

    getControlPanel: function() {
        return 'Startnode: <span id="rootnode" style="cursor:pointer;">select...</span><br>' +
               'Goalnode: <span id="goalnode" style="cursor:pointer;">select...</span><br>' +
               'Currentnode: <span id="currentnode"></span><br>' +
               '<button id="resetsearch">Reset</button><button id="next_step">Next</button>';
    },


    nodeselect: function(element, callback) {
        var self = this;
        $(element).click(function(){
            $(element).text("Select cell from above")
                .removeData("cell");
            self.graph.onselect = function(cell) {
                $(element).text(self.graph.attr(cell, 'text/text'));
                callback(element, cell);
                self.graph.onselect = null;
            };
        });
    },

    performNextStep: function() {
        if(!this.currentnode) {
            this.currentnode = this.graph.startcell;
        } else {
            if(this.currentnode == this.graph.startcell) {
                this.graph.attr(this.currentnode, 'rect/fill', '#ff0000');
            } else {
                this.graph.attr(this.currentnode,'rect/fill', '#00ffff');
            }
            this.currentnode = this.getNextNode();
        }
        if(!this.currentnode)
            alert('No goal found!');
        else if(this.currentnode == this.graph.endcell) {
            this.graph.attr(this.currentnode,'rect/fill', '#00ff00');
            alert('Goal found!');
        } else {
            $("#currentnode").text(this.graph.attr(this.currentnode,"text/text"));
            this.graph.attr(this.currentnode,'rect/fill', '#ffa43f');
            var self = this;
            $.each(this.graph.getNeighbors(this.currentnode), function(idx, next) {
                self.addNode(next);
            });
        }
    },

    reset: function() {
        this.currentnode = null;
        this.nodes = [];
        this.graph.reset();
        $("#currentnode").text('');

        this.graph.attr(this.graph.startcell, 'rect/fill', '#ff0000');
        this.graph.attr(this.graph.endcell, 'rect/fill', '#00ff00');
    },

    setup: function() {
        var self = this;
        $("#controlpanel").html(this.getControlPanel());

        this.nodeselect("#rootnode", function(el, cell){
            self.graph.startcell = cell;
            self.graph.attr(cell,'rect/fill', '#ff0000');
        });
        this.nodeselect("#goalnode", function(el, cell){
            self.graph.endcell = cell;
            self.graph.attr(cell, 'rect/fill', '#00ff00');
        });

        $("#resetsearch").click(function() {
            self.reset();
        });

        $("#next_step").click(function() {
            self.performNextStep();
        });
    }
});

algorithms['BreathFirst'] = BreathFirst;