//noinspection JSUnusedGlobalSymbols
/**
 * Created by blue0re on 06.03.14.
 */

var DepthFirst = BreathFirst.extend({
    getNextNode: function() {
        return this.nodes.pop();
    }
});


algorithms['DepthFirst'] = DepthFirst;


//noinspection JSUnusedGlobalSymbols
var LimitedDepthFirst = DepthFirst.extend({
    construct: function(graph) {
        arguments.callee.$.construct.call(this, graph);
        this.limit = 10;
        this.currentdepth = 0;
    },

    getControlPanel: function() {
        return 'Startnode: <span id="rootnode" style="cursor:pointer;">select...</span><br>' +
            'Goalnode: <span id="goalnode" style="cursor:pointer;">select...</span><br>' +
            'Currentnode: <span id="currentnode"></span><br>' +
            'Limit: <input id="limit" type="number" value="' + this.limit + '"><br>' +
            '<button id="resetsearch">Reset</button><button id="next_step">Next</button>';
    },

    setup: function() {
        arguments.callee.$.setup.call(this);

        var self = this;
        $('#limit').change(function() {
            self.limit = parseInt($(this).val());
        })
    },

    reset: function() {
        arguments.callee.$.reset.call(this);
        this.currentdepth = 0;

        var self = this;
        $('#limit').change(function() {
            self.limit = parseInt($(this).val());
        });
    },

    getNextNode: function() {
        var node = this.nodes.pop();
        if(!node)
            return node;
        this.currentdepth = node.depth;
        return node.cell;
    },

    addNode: function(cell) {
        if(this.currentdepth >= this.limit)
            return;
        var curcol = this.graph.attr(cell,'rect/fill');
        if(cell == this.graph.endcell)
            this.graph.attr(cell, 'rect/fill', '#00cc00');
        else if(cell == this.graph.startcell)
            this.graph.attr(cell, 'rect/fill', '#cc0000');
        else if(curcol == '#00ffff' || curcol == '#00cccc')
            this.graph.attr(cell, 'rect/fill', '#00cccc');
        else
            this.graph.attr(cell, 'rect/fill', '#aaaaaa');
        this.nodes.push({
            depth: this.currentdepth + 1,
            cell: cell
        });
    }
});

algorithms['LimitedDepthFirst'] = LimitedDepthFirst;

//noinspection JSUnusedGlobalSymbols
var IterativeDepthFirst = LimitedDepthFirst.extend({
    getNextNode: function() {
        var next = arguments.callee.$.getNextNode.call(this);
        if(!next) {
            if(this.currentdepth >= this.limit) {
                this.limit += 1;
                $('#limit').val(this.limit);
                this.reset();
            }
        }

        return next;
    }
});
algorithms['IterativeDepthFirst'] = IterativeDepthFirst;