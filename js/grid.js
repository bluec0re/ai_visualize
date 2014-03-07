var Grid = Class.extend({
    construct: function(el) {
        this.el = el;
        this.size = 20;
        this.blocks = [];
        this.onselect = function(cell,x,y) {
            var type = $("input:radio[name ='cell_type']:checked").val();
            if(type == 'start') {
                if(this.startcell) {
                    this.startcell.attr('fill', 'white');
                }
                this.startcell = cell;
                this.startpos = {x:x,y:y};
                this.startcell.attr('fill', 'red');
            } else if(type == 'end') {
                if(this.endcell) {
                    this.endcell.attr('fill', 'white');
                }
                this.endcell = cell;
                this.endpos = {x:x,y:y};
                this.endcell.attr('fill', 'green');
            } else if(type == 'block') {
                cell.attr('fill', 'black');
                this.blocks.push({
                    x: x,
                    y: y
                });
            } else if(type == 'delete') {
                if(cell == this.startcell) {
                    this.startcell = null;
                    this.startpos = null;
                } else if(cell == this.endcell) {
                    this.endcell = null;
                    this.endpos = null;
                } else {
                    var idx = this.isBlocked(x, y);
                    if(idx != -1)
                        this.blocks.splice(idx, 1);
                }
                cell.attr('fill', 'white');
            }
        };
    },

    isBlocked: function(x, y) {
        for(var idx in this.blocks) {
            //noinspection JSUnfilteredForInLoop
            if(this.blocks[idx].x == x && this.blocks[idx].y == y) {
                //noinspection JSUnfilteredForInLoop
                return idx;
            }
        }
        return -1;
    },

    findCell: function(cell) {
        for(var y = 0; y < this.grid.length; y++) {
            var x = this.grid[y].indexOf(cell);
            if(x != -1) {
                return {
                    x: x,
                    y: y
                }
            }
        }

        return null;
    },

    attr: function() {
        var cell = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
        var idx = args[0].indexOf('/');
        if(idx != -1) {
            args[0] = args[0].substr(idx+1);
        }
        return cell.attr.apply(cell, args);
    },

    getNeighbors: function(cell) {
        var neighbors = [];
        var pos = this.findCell(cell);
        for(var y = pos.y-1; y < pos.y+2 && y < this.grid.length; y++) {
            for(var x = pos.x-1; x < pos.x+2 && x < this.grid[y].length; x++) {
                if(!(x == pos.x && y == pos.y) &&
                   this.isBlocked(x, y) == -1)
                    neighbors.push(this.grid[y][x]);
            }
        }
        return neighbors;
    },

    reset: function() {
        for(var y = 0; y < this.grid.length; y++) {
            for(var x = 0; x < this.grid[y].length; x++) {
                if(this.grid[y][x] != this.startcell &&
                   this.grid[y][x] != this.endcell && this.isBlocked(x, y) == -1)
                    this.attr(this.grid[y][x], 'fill', 'white');
            }
        }
    },

    buildGrid: function(width, height) {
        //noinspection JSPotentiallyInvalidConstructorUsage
        var svg = V('svg');
        var grid = [];
        var self = this;
        for(var y = 0; y < height; y++) {
            var row = [];
            for(var x = 0; x < width; x++) {

                //noinspection JSPotentiallyInvalidConstructorUsage
                var cell = V('<rect/>');
                cell.attr({
                    x: x*this.size,
                    y: y*this.size,
                    width: this.size,
                    height: this.size,
                    fill: 'white',
                    stroke: 'black'
                });
                svg.append(cell);
                row[x] = cell;
                cell.node.onclick = function(cell,x,y) {
                    return function() {
                        if(self.onselect)
                            self.onselect(cell,x,y);
                    };
                }(cell,x,y);
            }
            grid[y] = row;
        }
        this.grid = grid;
        $(this.el).append(svg.node);

        return grid;
    }
});
