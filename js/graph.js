/**
 * Created by blue0re on 06.03.14.
 */

var Graph = (function(){

    var self = {
        onadd: null,
        ondelete: null,
        onchange: null,
        onselect: null
    };

    var graph = new joint.dia.Graph;

    var paper = new joint.dia.Paper({

        el: $('#graph-container'),
        width: 2000,
        height: 2000,
        gridSize: 1,
        model: graph
    });

    // Just give the viewport a little padding.
    //noinspection JSPotentiallyInvalidConstructorUsage
    V(paper.viewport).translate(20, 20);

    function layout() {
        joint.layout.DirectedGraph.layout(graph, {
            setLinkVertices: false,
            rankDir: 'BT'
        });
    }

    $("#add_button").click(function() {
        var el = makeElement($("#title1").val());
        if(self.onadd)
            self.onadd(self, el);
        graph.addCell(el);
        layout();
    });

    $("#layout").click(function() {
        layout();
    });

    // connect by d&d
    paper.on('cell:pointerup', function(cellView, evt, x, y) {

        // Find the first element below that is not a link nor the dragged element itself.
        var elementBelow = graph.get('cells').find(function(cell) {
            if (cell instanceof joint.dia.Link) return false; // Not interested in links.
            if (cell.id === cellView.model.id) return false; // The same element as the dropped one.

            return cell.getBBox().containsPoint(g.point(x, y));
        });

        // If the two elements are connected already, don't
        // connect them again (this is application specific though).
        if (elementBelow && !_.contains(graph.getNeighbors(elementBelow), cellView.model)) {

            graph.addCell(new joint.dia.Link({
                source: { id: cellView.model.id }, target: { id: elementBelow.id },
                attrs: { '.marker-source': { d: 'M 10 0 L 0 5 L 10 10 z' } }
            }));
            // relayout
            layout();
        }
    });

    paper.on('cell:pointerdown', function(cellView) {
        self.selectedCell = cellView.model;
        if(self.onselect)
            self.onselect(self.selectedCell);

        $("#title2").val(self.selectedCell.attr('text/text'));
        $("#edit_form").removeClass("hidden");
    });

    paper.on('blank:pointerdown', function() {
        self.selectedCell = null;
        $("#edit_form").addClass("hidden");
    });

    $("#delete_button").click(function() {
        if(self.ondelete)
            self.ondelete(self);
        if (self.selectedCell) self.selectedCell.remove();
        self.selectedCell = null;
        $("#edit_form").addClass("hidden");
    });

    $("#change_button").click(function() {
        if(self.onchange)
            self.onchange(self);
        if (self.selectedCell) self.selectedCell.attr('text/text', $("#title2").val());
        self.selectedCell = null;
        $("#edit_form").addClass("hidden");
    });

    self.reset = function() {
        $.each(graph.getElements(), function(i, el) {
            el.attr('rect/fill', '#ffffff');
        });
    };

    self.getNeighbors = function(cell) {
        var neighbors = [];
        var self = this;
        $.each(this.graph.getConnectedLinks(cell, {inbound: true}), function(idx, link) {
            neighbors.push(self.graph.get('cells').get(link.get('source').id));
        });

        return neighbors;
    };


    self.attr = function() {
        var cell = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
        return cell.attr.apply(cell, args);
    };

    self.paper = paper;
    self.graph = graph;
    self.layout = layout;

    graph.resetCells(buildGraphFromAdjacencyList({
        'a': [
            'b', 'c'
        ],
        'b': [
            'd', 'e'
        ],
        'c': [
            'f', 'g'
        ],
        'd': [],
        'e': [],
        'f': [],
        'g': []
    }));

    layout();

    return self;
})();