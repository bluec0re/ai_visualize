/**
 * Created by blue0re on 07.03.14.
 */


function Node(x, y, cell) {
    if(typeof cell == 'undefined') {
        cell = y;
        y = x.y;
        x = x.x;
    }

    this.x = x;
    this.y = y;
    this.pos = {
        x: this.x,
        y: this.y
    };
    this.cell = cell;
}
Node.prototype.toString = function() {
    return ''+this.x+'x'+this.y;
};

//noinspection ReservedWordAsName
var Set = Class.extend({
    construct: function() {
        this.values = [];
    },

    clear: function() {
        this.values = []
    },

    add: function(value) {
        if(this.indexOf(value) == -1) {
            this.values.push(value);
        }
    },

    delete: function(value) {
        var idx = this.indexOf(value);
        if(idx != -1) {
            this.values.splice(idx,1);
        }
    },

    indexOf: function(value) {
        for(var i in this.values) {
            //noinspection JSUnfilteredForInLoop
            if(this.values[i].toString() == value.toString())
                //noinspection JSUnfilteredForInLoop
                return i;
        }
        return -1;
    },

    has: function(value) {
        return this.indexOf(value) != -1;
    }
});

var AStar = Class.extend({
    construct: function(graph) {
        this.closednodes = new Set();
        this.opennodes = new Set();
        this.graph = graph;
        this.g = {};
        this.f = {};
    },

    getNextNode: function() {
        var best = null;
        var result = null;
        for(var i in this.opennodes.values) {
            //noinspection JSUnfilteredForInLoop
            var node = this.opennodes.values[i];
            if(best === null || best > this.f[node]) {
                result = node;
                best = this.f[node];
            }
        }
        return result;
    },

    addNode: function(node) {
        var curcol = this.graph.attr(node.cell,'rect/fill');
        if(node.cell == this.graph.endcell)
            this.graph.attr(node.cell, 'rect/fill', '#00cc00');
        else if(node.cell == this.graph.startcell)
            this.graph.attr(node.cell, 'rect/fill', '#cc0000');
        else if(curcol == '#00ffff' || curcol == '#00cccc')
            this.graph.attr(node.cell, 'rect/fill', '#00cccc');
        else
            this.graph.attr(node.cell, 'rect/fill', '#aaaaaa');
        this.opennodes.add(node);
    },

    getControlPanel: function() {
        return '<button id="resetsearch">Reset</button><button id="next_step">Next</button>';
    },

    estimatedCost: function(cell1, cell2) {
        var pos1 = cell1.pos;
        var pos2 = null;

        if(typeof cell2 == 'undefined') {
            pos2 = this.graph.endpos;
        } else {
            pos2 = cell2.pos;
        }

        var y = Math.abs(pos1.y - pos2.y);
        var x = Math.abs(pos1.x - pos2.x);
        return x*x + y*y;
    },

    performNextStep: function() {
        if(!this.currentnode) {
            this.currentnode = new Node(this.graph.startpos, this.graph.startcell);
            this.opennodes.add(this.currentnode);
            this.g[this.currentnode] = 0;
            this.f[this.currentnode] = this.estimatedCost(this.currentnode);
        } else {
            if(this.currentnode.cell == this.graph.startcell) {
                this.graph.attr(this.currentnode.cell, 'rect/fill', '#ff0000');
            } else {
                this.graph.attr(this.currentnode.cell,'rect/fill', '#00ffff');
            }
            this.currentnode = this.getNextNode();
        }
        if(!this.currentnode)
            alert('No goal found!');
        else if(this.currentnode.cell == this.graph.endcell) {
            this.graph.attr(this.currentnode.cell,'rect/fill', '#00ff00');
            alert('Goal found!');
        } else {
            this.opennodes.delete(this.currentnode);
            this.closednodes.add(this.currentnode);
            this.graph.attr(this.currentnode.cell,'rect/fill', '#ffa43f');
            var self = this;
            $.each(this.graph.getNeighbors(this.currentnode.cell), function(idx, next) {
                var pos = self.graph.findCell(next);
                next = new Node(pos, next);
                if(self.closednodes.has(next))
                    return;
                var g = self.g[self.currentnode] + self.estimatedCost(self.currentnode, next);
                if(!self.opennodes.has(next) || g < self.g[next]) {
                    self.g[next] = g;
                    self.f[next] = g + self.estimatedCost(next);
                    self.addNode(next);
                }
            });
        }
    },

    reset: function() {
        this.currentnode = null;
        this.closednodes.clear();
        this.opennodes.clear();
        this.g = {};
        this.f = {};
        this.graph.reset();
        $("#currentnode").text('');

        this.graph.attr(this.graph.startcell, 'rect/fill', '#ff0000');
        this.graph.attr(this.graph.endcell, 'rect/fill', '#00ff00');
    },

    setup: function() {
        var self = this;
        $("#controlpanel").html(this.getControlPanel());

        $("#resetsearch").click(function() {
            self.reset();
        });

        $("#next_step").click(function() {
            self.performNextStep();
        });
    }
});

algorithms['A*'] = AStar;