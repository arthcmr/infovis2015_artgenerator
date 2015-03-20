//ARTGEN UMD module

(function(root, factory) {
    if (typeof define === 'function') {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.ARTGEN = factory();
    }
}(this, function() {


//Brushes collection

//starts a collection
function Collection (base) {
    this._base = base;
};

/* 
 * adds a new item to the set
 * @param {String} name Name of the new item
 * @param {String|Object} extend Name of item to extend from
 * @param {Object} methods Methods of the new item
 * @param {Object} object for meta_information
 */
Collection.prototype.add = function(name, extend, methods, meta_info) {
    
    //start collection if not existing
    this._items = this._items || {};

    //should it extend or not?
    var from;
    if (_.isUndefined(methods)) {
        methods = extend;
        from = this._base;
    } else {
        from = this._items[extend];
    }

    //clone meta_info
    for(var i in meta_info) {
        meta_info[i] = (!_.isUndefined(methods[i])) ? _.cloneDeep(methods[i]) : meta_info[i];
    }

    //add item
    var new_item = function() {};
    new_item.prototype = _.clone(_.extend({}, from.prototype, methods));
    new_item.prototype.constructor = from.prototype.constructor;
    this._items[name] = new_item;
}

/* 
 * removes an item from the collection
 * @param {String} name Name of the new item
 */
Collection.prototype.remove = function(name) {
    delete this._items[name];
}

/* 
 * gets an item from the collection
 * @param {String} name Name of the new item
 * @returns {Object} the item
 */
Collection.prototype.get = function(name) {
    return this._items[name];
}
//Base brush

/* 
 * base brush constructor
 * @param {Object} canvas canvas object
 * @param {Object} ctx Canvas context
 */
var baseBrush = function() {}

/* 
 * initializes a painter
 */
baseBrush.prototype.init = function(ctx) {
    this.isDrawing = false;
    //general settings
    this._settings = _.extend({
        COLOR: "rgba(255,255,255,0)",
        LINE_WIDTH: 1,
        WRAP_CANVAS: false
    }, (this._settings || {}));
};

/* 
 * start method
 */
baseBrush.prototype.start = function(x, y) {
    this.isDrawing = true;
};

/* 
 * stop method
 */
baseBrush.prototype.stop = function() {
    this.isDrawing = false;
};

/* 
 * choose brush color
 */
baseBrush.prototype.setColor = function(color) {
    this.color = color;
};

/*
 * set target for brushes extending flock
 */
baseBrush.prototype.setTarget = function(x, y) {
    this._settings.TARGET_POSITION = new Vector(x, y);
};

/*
 * draw with a transparent color
 */
baseBrush.prototype.disable = function() {
    this._enabled = false;
    this._settings.COLOR = "rgba(255,255,255,0)";
};

/*
 * set brush color
 */
baseBrush.prototype.setColor = function(color) {
    this.color = color;
    if (this._enabled) this._settings.COLOR = color;
};

/*
 * Stop drawing transparency
 */
baseBrush.prototype.enable = function() {
    this._enabled = true;
    this._settings.COLOR = this.color;
};

/*
 * Override required
 */
baseBrush.prototype.setPosition = function(x, y) {
    // Nothing
};
//Base painter

/* 
 * base painter constructor
 * @param {Object} canvas canvas object
 * @param {Object} ctx Canvas context
 */
var basePainter = function() {};

/* 
 * empty set of brushes
 */
basePainter.prototype.brushes = [];

/* 
 * initializes a painter
 */
basePainter.prototype.init = function(canvas, ctx, options) {
    this.canvas = canvas;
    this.ctx = ctx;
    for (var i = 0; i < this.brushes.length; i++) {
        var brush = ARTGEN._brushes.get(this.brushes[i]);
        this.brushes[i] = new brush();
        this.brushes[i].init(ctx);
    };

    if (this.options) {
        //compute defaults
        var defaults = {};
        _.forIn(this.options, function(value, key) {
            defaults[key] = value.options[0];
        });

        options = (_.isPlainObject(options)) ? options : {};

        this.options = _.extend(defaults, options);
    }
};

/* 
 * setup bruhes
 */
basePainter.prototype.setup = function() {
    //placeholder method
};

/* 
 * gets one of the brushes that this painter uses
 */
basePainter.prototype.getBrush = function(name) {
    return this.brushes[name];
};
//VERONOI LIBRARY

/*!
Copyright (C) 2010-2013 Raymond Hill: https://github.com/gorhill/Javascript-Voronoi
MIT License: See https://github.com/gorhill/Javascript-Voronoi/LICENSE.md
*/
;
function Voronoi(){this.vertices=null;this.edges=null;this.cells=null;this.toRecycle=null;this.beachsectionJunkyard=[];this.circleEventJunkyard=[];
this.vertexJunkyard=[];this.edgeJunkyard=[];this.cellJunkyard=[]}Voronoi.prototype.reset=function(){if(!this.beachline){this.beachline=new this.RBTree()
}if(this.beachline.root){var a=this.beachline.getFirst(this.beachline.root);while(a){this.beachsectionJunkyard.push(a);a=a.rbNext
}}this.beachline.root=null;if(!this.circleEvents){this.circleEvents=new this.RBTree()}this.circleEvents.root=this.firstCircleEvent=null;
this.vertices=[];this.edges=[];this.cells=[]};Voronoi.prototype.sqrt=Math.sqrt;Voronoi.prototype.abs=Math.abs;Voronoi.prototype.ε=Voronoi.ε=1e-9;
Voronoi.prototype.invε=Voronoi.invε=1/Voronoi.ε;Voronoi.prototype.equalWithEpsilon=function(d,c){return this.abs(d-c)<1e-9
};Voronoi.prototype.greaterThanWithEpsilon=function(d,c){return d-c>1e-9};Voronoi.prototype.greaterThanOrEqualWithEpsilon=function(d,c){return c-d<1e-9
};Voronoi.prototype.lessThanWithEpsilon=function(d,c){return c-d>1e-9};Voronoi.prototype.lessThanOrEqualWithEpsilon=function(d,c){return d-c<1e-9
};Voronoi.prototype.RBTree=function(){this.root=null};Voronoi.prototype.RBTree.prototype.rbInsertSuccessor=function(e,a){var d;
if(e){a.rbPrevious=e;a.rbNext=e.rbNext;if(e.rbNext){e.rbNext.rbPrevious=a}e.rbNext=a;if(e.rbRight){e=e.rbRight;while(e.rbLeft){e=e.rbLeft
}e.rbLeft=a}else{e.rbRight=a}d=e}else{if(this.root){e=this.getFirst(this.root);a.rbPrevious=null;a.rbNext=e;e.rbPrevious=a;
e.rbLeft=a;d=e}else{a.rbPrevious=a.rbNext=null;this.root=a;d=null}}a.rbLeft=a.rbRight=null;a.rbParent=d;a.rbRed=true;var c,b;
e=a;while(d&&d.rbRed){c=d.rbParent;if(d===c.rbLeft){b=c.rbRight;if(b&&b.rbRed){d.rbRed=b.rbRed=false;c.rbRed=true;e=c}else{if(e===d.rbRight){this.rbRotateLeft(d);
e=d;d=e.rbParent}d.rbRed=false;c.rbRed=true;this.rbRotateRight(c)}}else{b=c.rbLeft;if(b&&b.rbRed){d.rbRed=b.rbRed=false;c.rbRed=true;
e=c}else{if(e===d.rbLeft){this.rbRotateRight(d);e=d;d=e.rbParent}d.rbRed=false;c.rbRed=true;this.rbRotateLeft(c)}}d=e.rbParent
}this.root.rbRed=false};Voronoi.prototype.RBTree.prototype.rbRemoveNode=function(f){if(f.rbNext){f.rbNext.rbPrevious=f.rbPrevious
}if(f.rbPrevious){f.rbPrevious.rbNext=f.rbNext}f.rbNext=f.rbPrevious=null;var e=f.rbParent,g=f.rbLeft,b=f.rbRight,d;if(!g){d=b
}else{if(!b){d=g}else{d=this.getFirst(b)}}if(e){if(e.rbLeft===f){e.rbLeft=d}else{e.rbRight=d}}else{this.root=d}var a;if(g&&b){a=d.rbRed;
d.rbRed=f.rbRed;d.rbLeft=g;g.rbParent=d;if(d!==b){e=d.rbParent;d.rbParent=f.rbParent;f=d.rbRight;e.rbLeft=f;d.rbRight=b;b.rbParent=d
}else{d.rbParent=e;e=d;f=d.rbRight}}else{a=f.rbRed;f=d}if(f){f.rbParent=e}if(a){return}if(f&&f.rbRed){f.rbRed=false;return
}var c;do{if(f===this.root){break}if(f===e.rbLeft){c=e.rbRight;if(c.rbRed){c.rbRed=false;e.rbRed=true;this.rbRotateLeft(e);
c=e.rbRight}if((c.rbLeft&&c.rbLeft.rbRed)||(c.rbRight&&c.rbRight.rbRed)){if(!c.rbRight||!c.rbRight.rbRed){c.rbLeft.rbRed=false;
c.rbRed=true;this.rbRotateRight(c);c=e.rbRight}c.rbRed=e.rbRed;e.rbRed=c.rbRight.rbRed=false;this.rbRotateLeft(e);f=this.root;
break}}else{c=e.rbLeft;if(c.rbRed){c.rbRed=false;e.rbRed=true;this.rbRotateRight(e);c=e.rbLeft}if((c.rbLeft&&c.rbLeft.rbRed)||(c.rbRight&&c.rbRight.rbRed)){if(!c.rbLeft||!c.rbLeft.rbRed){c.rbRight.rbRed=false;
c.rbRed=true;this.rbRotateLeft(c);c=e.rbLeft}c.rbRed=e.rbRed;e.rbRed=c.rbLeft.rbRed=false;this.rbRotateRight(e);f=this.root;
break}}c.rbRed=true;f=e;e=e.rbParent}while(!f.rbRed);if(f){f.rbRed=false}};Voronoi.prototype.RBTree.prototype.rbRotateLeft=function(b){var d=b,c=b.rbRight,a=d.rbParent;
if(a){if(a.rbLeft===d){a.rbLeft=c}else{a.rbRight=c}}else{this.root=c}c.rbParent=a;d.rbParent=c;d.rbRight=c.rbLeft;if(d.rbRight){d.rbRight.rbParent=d
}c.rbLeft=d};Voronoi.prototype.RBTree.prototype.rbRotateRight=function(b){var d=b,c=b.rbLeft,a=d.rbParent;if(a){if(a.rbLeft===d){a.rbLeft=c
}else{a.rbRight=c}}else{this.root=c}c.rbParent=a;d.rbParent=c;d.rbLeft=c.rbRight;if(d.rbLeft){d.rbLeft.rbParent=d}c.rbRight=d
};Voronoi.prototype.RBTree.prototype.getFirst=function(a){while(a.rbLeft){a=a.rbLeft}return a};Voronoi.prototype.RBTree.prototype.getLast=function(a){while(a.rbRight){a=a.rbRight
}return a};Voronoi.prototype.Diagram=function(a){this.site=a};Voronoi.prototype.Cell=function(a){this.site=a;this.halfedges=[];
this.closeMe=false};Voronoi.prototype.Cell.prototype.init=function(a){this.site=a;this.halfedges=[];this.closeMe=false;return this
};Voronoi.prototype.createCell=function(b){var a=this.cellJunkyard.pop();if(a){return a.init(b)}return new this.Cell(b)};
Voronoi.prototype.Cell.prototype.prepareHalfedges=function(){var a=this.halfedges,b=a.length,c;while(b--){c=a[b].edge;if(!c.vb||!c.va){a.splice(b,1)
}}a.sort(function(e,d){return d.angle-e.angle});return a.length};Voronoi.prototype.Cell.prototype.getNeighborIds=function(){var a=[],b=this.halfedges.length,c;
while(b--){c=this.halfedges[b].edge;if(c.lSite!==null&&c.lSite.voronoiId!=this.site.voronoiId){a.push(c.lSite.voronoiId)}else{if(c.rSite!==null&&c.rSite.voronoiId!=this.site.voronoiId){a.push(c.rSite.voronoiId)
}}}return a};Voronoi.prototype.Cell.prototype.getBbox=function(){var i=this.halfedges,d=i.length,a=Infinity,g=Infinity,c=-Infinity,b=-Infinity,h,f,e;
while(d--){h=i[d].getStartpoint();f=h.x;e=h.y;if(f<a){a=f}if(e<g){g=e}if(f>c){c=f}if(e>b){b=e}}return{x:a,y:g,width:c-a,height:b-g}
};Voronoi.prototype.Cell.prototype.pointIntersection=function(a,h){var b=this.halfedges,c=b.length,f,g,e,d;while(c--){f=b[c];
g=f.getStartpoint();e=f.getEndpoint();d=(h-g.y)*(e.x-g.x)-(a-g.x)*(e.y-g.y);if(!d){return 0}if(d>0){return -1}}return 1};
Voronoi.prototype.Vertex=function(a,b){this.x=a;this.y=b};Voronoi.prototype.Edge=function(b,a){this.lSite=b;this.rSite=a;
this.va=this.vb=null};Voronoi.prototype.Halfedge=function(d,e,a){this.site=e;this.edge=d;if(a){this.angle=Math.atan2(a.y-e.y,a.x-e.x)
}else{var c=d.va,b=d.vb;this.angle=d.lSite===e?Math.atan2(b.x-c.x,c.y-b.y):Math.atan2(c.x-b.x,b.y-c.y)}};Voronoi.prototype.createHalfedge=function(b,c,a){return new this.Halfedge(b,c,a)
};Voronoi.prototype.Halfedge.prototype.getStartpoint=function(){return this.edge.lSite===this.site?this.edge.va:this.edge.vb
};Voronoi.prototype.Halfedge.prototype.getEndpoint=function(){return this.edge.lSite===this.site?this.edge.vb:this.edge.va
};Voronoi.prototype.createVertex=function(a,c){var b=this.vertexJunkyard.pop();if(!b){b=new this.Vertex(a,c)}else{b.x=a;b.y=c
}this.vertices.push(b);return b};Voronoi.prototype.createEdge=function(e,a,d,b){var c=this.edgeJunkyard.pop();if(!c){c=new this.Edge(e,a)
}else{c.lSite=e;c.rSite=a;c.va=c.vb=null}this.edges.push(c);if(d){this.setEdgeStartpoint(c,e,a,d)}if(b){this.setEdgeEndpoint(c,e,a,b)
}this.cells[e.voronoiId].halfedges.push(this.createHalfedge(c,e,a));this.cells[a.voronoiId].halfedges.push(this.createHalfedge(c,a,e));
return c};Voronoi.prototype.createBorderEdge=function(d,c,a){var b=this.edgeJunkyard.pop();if(!b){b=new this.Edge(d,null)
}else{b.lSite=d;b.rSite=null}b.va=c;b.vb=a;this.edges.push(b);return b};Voronoi.prototype.setEdgeStartpoint=function(b,d,a,c){if(!b.va&&!b.vb){b.va=c;
b.lSite=d;b.rSite=a}else{if(b.lSite===a){b.vb=c}else{b.va=c}}};Voronoi.prototype.setEdgeEndpoint=function(b,d,a,c){this.setEdgeStartpoint(b,a,d,c)
};Voronoi.prototype.Beachsection=function(){};Voronoi.prototype.createBeachsection=function(a){var b=this.beachsectionJunkyard.pop();
if(!b){b=new this.Beachsection()}b.site=a;return b};Voronoi.prototype.leftBreakPoint=function(e,f){var a=e.site,m=a.x,l=a.y,k=l-f;
if(!k){return m}var n=e.rbPrevious;if(!n){return -Infinity}a=n.site;var h=a.x,g=a.y,d=g-f;if(!d){return h}var c=h-m,j=1/k-1/d,i=c/d;
if(j){return(-i+this.sqrt(i*i-2*j*(c*c/(-2*d)-g+d/2+l-k/2)))/j+m}return(m+h)/2};Voronoi.prototype.rightBreakPoint=function(b,c){var d=b.rbNext;
if(d){return this.leftBreakPoint(d,c)}var a=b.site;return a.y===c?a.x:Infinity};Voronoi.prototype.detachBeachsection=function(a){this.detachCircleEvent(a);
this.beachline.rbRemoveNode(a);this.beachsectionJunkyard.push(a)};Voronoi.prototype.removeBeachsection=function(b){var a=b.circleEvent,j=a.x,h=a.ycenter,e=this.createVertex(j,h),f=b.rbPrevious,d=b.rbNext,l=[b],g=Math.abs;
this.detachBeachsection(b);var m=f;while(m.circleEvent&&g(j-m.circleEvent.x)<1e-9&&g(h-m.circleEvent.ycenter)<1e-9){f=m.rbPrevious;
l.unshift(m);this.detachBeachsection(m);m=f}l.unshift(m);this.detachCircleEvent(m);var c=d;while(c.circleEvent&&g(j-c.circleEvent.x)<1e-9&&g(h-c.circleEvent.ycenter)<1e-9){d=c.rbNext;
l.push(c);this.detachBeachsection(c);c=d}l.push(c);this.detachCircleEvent(c);var k=l.length,i;for(i=1;i<k;i++){c=l[i];m=l[i-1];
this.setEdgeStartpoint(c.edge,m.site,c.site,e)}m=l[0];c=l[k-1];c.edge=this.createEdge(m.site,c.site,undefined,e);this.attachCircleEvent(m);
this.attachCircleEvent(c)};Voronoi.prototype.addBeachsection=function(l){var j=l.x,n=l.y;var p,m,v,q,o=this.beachline.root;
while(o){v=this.leftBreakPoint(o,n)-j;if(v>1e-9){o=o.rbLeft}else{q=j-this.rightBreakPoint(o,n);if(q>1e-9){if(!o.rbRight){p=o;
break}o=o.rbRight}else{if(v>-1e-9){p=o.rbPrevious;m=o}else{if(q>-1e-9){p=o;m=o.rbNext}else{p=m=o}}break}}}var e=this.createBeachsection(l);
this.beachline.rbInsertSuccessor(p,e);if(!p&&!m){return}if(p===m){this.detachCircleEvent(p);m=this.createBeachsection(p.site);
this.beachline.rbInsertSuccessor(e,m);e.edge=m.edge=this.createEdge(p.site,e.site);this.attachCircleEvent(p);this.attachCircleEvent(m);
return}if(p&&!m){e.edge=this.createEdge(p.site,e.site);return}if(p!==m){this.detachCircleEvent(p);this.detachCircleEvent(m);
var h=p.site,k=h.x,i=h.y,t=l.x-k,r=l.y-i,a=m.site,c=a.x-k,b=a.y-i,u=2*(t*b-r*c),g=t*t+r*r,f=c*c+b*b,s=this.createVertex((b*g-r*f)/u+k,(t*f-c*g)/u+i);
this.setEdgeStartpoint(m.edge,h,a,s);e.edge=this.createEdge(h,l,undefined,s);m.edge=this.createEdge(l,a,undefined,s);this.attachCircleEvent(p);
this.attachCircleEvent(m);return}};Voronoi.prototype.CircleEvent=function(){this.arc=null;this.rbLeft=null;this.rbNext=null;
this.rbParent=null;this.rbPrevious=null;this.rbRed=false;this.rbRight=null;this.site=null;this.x=this.y=this.ycenter=0};Voronoi.prototype.attachCircleEvent=function(i){var r=i.rbPrevious,o=i.rbNext;
if(!r||!o){return}var k=r.site,u=i.site,c=o.site;if(k===c){return}var t=u.x,s=u.y,n=k.x-t,l=k.y-s,f=c.x-t,e=c.y-s;var v=2*(n*e-l*f);
if(v>=-2e-12){return}var h=n*n+l*l,g=f*f+e*e,m=(e*h-l*g)/v,j=(n*g-f*h)/v,b=j+s;var q=this.circleEventJunkyard.pop();if(!q){q=new this.CircleEvent()
}q.arc=i;q.site=u;q.x=m+t;q.y=b+this.sqrt(m*m+j*j);q.ycenter=b;i.circleEvent=q;var a=null,p=this.circleEvents.root;while(p){if(q.y<p.y||(q.y===p.y&&q.x<=p.x)){if(p.rbLeft){p=p.rbLeft
}else{a=p.rbPrevious;break}}else{if(p.rbRight){p=p.rbRight}else{a=p;break}}}this.circleEvents.rbInsertSuccessor(a,q);if(!a){this.firstCircleEvent=q
}};Voronoi.prototype.detachCircleEvent=function(b){var a=b.circleEvent;if(a){if(!a.rbPrevious){this.firstCircleEvent=a.rbNext
}this.circleEvents.rbRemoveNode(a);this.circleEventJunkyard.push(a);b.circleEvent=null}};Voronoi.prototype.connectEdge=function(l,a){var b=l.vb;
if(!!b){return true}var c=l.va,p=a.xl,n=a.xr,r=a.yt,d=a.yb,o=l.lSite,e=l.rSite,i=o.x,h=o.y,k=e.x,j=e.y,g=(i+k)/2,f=(h+j)/2,m,q;
this.cells[o.voronoiId].closeMe=true;this.cells[e.voronoiId].closeMe=true;if(j!==h){m=(i-k)/(j-h);q=f-m*g}if(m===undefined){if(g<p||g>=n){return false
}if(i>k){if(!c||c.y<r){c=this.createVertex(g,r)}else{if(c.y>=d){return false}}b=this.createVertex(g,d)}else{if(!c||c.y>d){c=this.createVertex(g,d)
}else{if(c.y<r){return false}}b=this.createVertex(g,r)}}else{if(m<-1||m>1){if(i>k){if(!c||c.y<r){c=this.createVertex((r-q)/m,r)
}else{if(c.y>=d){return false}}b=this.createVertex((d-q)/m,d)}else{if(!c||c.y>d){c=this.createVertex((d-q)/m,d)}else{if(c.y<r){return false
}}b=this.createVertex((r-q)/m,r)}}else{if(h<j){if(!c||c.x<p){c=this.createVertex(p,m*p+q)}else{if(c.x>=n){return false}}b=this.createVertex(n,m*n+q)
}else{if(!c||c.x>n){c=this.createVertex(n,m*n+q)}else{if(c.x<p){return false}}b=this.createVertex(p,m*p+q)}}}l.va=c;l.vb=b;
return true};Voronoi.prototype.clipEdge=function(d,i){var b=d.va.x,l=d.va.y,h=d.vb.x,g=d.vb.y,f=0,e=1,k=h-b,j=g-l;var c=b-i.xl;
if(k===0&&c<0){return false}var a=-c/k;if(k<0){if(a<f){return false}if(a<e){e=a}}else{if(k>0){if(a>e){return false}if(a>f){f=a
}}}c=i.xr-b;if(k===0&&c<0){return false}a=c/k;if(k<0){if(a>e){return false}if(a>f){f=a}}else{if(k>0){if(a<f){return false
}if(a<e){e=a}}}c=l-i.yt;if(j===0&&c<0){return false}a=-c/j;if(j<0){if(a<f){return false}if(a<e){e=a}}else{if(j>0){if(a>e){return false
}if(a>f){f=a}}}c=i.yb-l;if(j===0&&c<0){return false}a=c/j;if(j<0){if(a>e){return false}if(a>f){f=a}}else{if(j>0){if(a<f){return false
}if(a<e){e=a}}}if(f>0){d.va=this.createVertex(b+f*k,l+f*j)}if(e<1){d.vb=this.createVertex(b+e*k,l+e*j)}if(f>0||e<1){this.cells[d.lSite.voronoiId].closeMe=true;
this.cells[d.rSite.voronoiId].closeMe=true}return true};Voronoi.prototype.clipEdges=function(e){var a=this.edges,d=a.length,c,b=Math.abs;
while(d--){c=a[d];if(!this.connectEdge(c,e)||!this.clipEdge(c,e)||(b(c.va.x-c.vb.x)<1e-9&&b(c.va.y-c.vb.y)<1e-9)){c.va=c.vb=null;
a.splice(d,1)}}};Voronoi.prototype.closeCells=function(p){var g=p.xl,d=p.xr,m=p.yt,j=p.yb,q=this.cells,a=q.length,n,e,o,c,b,l,k,i,f,h=Math.abs;
while(a--){n=q[a];if(!n.prepareHalfedges()){continue}if(!n.closeMe){continue}o=n.halfedges;c=o.length;e=0;while(e<c){l=o[e].getEndpoint();
i=o[(e+1)%c].getStartpoint();if(h(l.x-i.x)>=1e-9||h(l.y-i.y)>=1e-9){switch(true){case this.equalWithEpsilon(l.x,g)&&this.lessThanWithEpsilon(l.y,j):f=this.equalWithEpsilon(i.x,g);
k=this.createVertex(g,f?i.y:j);b=this.createBorderEdge(n.site,l,k);e++;o.splice(e,0,this.createHalfedge(b,n.site,null));c++;
if(f){break}l=k;case this.equalWithEpsilon(l.y,j)&&this.lessThanWithEpsilon(l.x,d):f=this.equalWithEpsilon(i.y,j);k=this.createVertex(f?i.x:d,j);
b=this.createBorderEdge(n.site,l,k);e++;o.splice(e,0,this.createHalfedge(b,n.site,null));c++;if(f){break}l=k;case this.equalWithEpsilon(l.x,d)&&this.greaterThanWithEpsilon(l.y,m):f=this.equalWithEpsilon(i.x,d);
k=this.createVertex(d,f?i.y:m);b=this.createBorderEdge(n.site,l,k);e++;o.splice(e,0,this.createHalfedge(b,n.site,null));c++;
if(f){break}l=k;case this.equalWithEpsilon(l.y,m)&&this.greaterThanWithEpsilon(l.x,g):f=this.equalWithEpsilon(i.y,m);k=this.createVertex(f?i.x:g,m);
b=this.createBorderEdge(n.site,l,k);e++;o.splice(e,0,this.createHalfedge(b,n.site,null));c++;if(f){break}l=k;f=this.equalWithEpsilon(i.x,g);
k=this.createVertex(g,f?i.y:j);b=this.createBorderEdge(n.site,l,k);e++;o.splice(e,0,this.createHalfedge(b,n.site,null));c++;
if(f){break}l=k;f=this.equalWithEpsilon(i.y,j);k=this.createVertex(f?i.x:d,j);b=this.createBorderEdge(n.site,l,k);e++;o.splice(e,0,this.createHalfedge(b,n.site,null));
c++;if(f){break}l=k;f=this.equalWithEpsilon(i.x,d);k=this.createVertex(d,f?i.y:m);b=this.createBorderEdge(n.site,l,k);e++;
o.splice(e,0,this.createHalfedge(b,n.site,null));c++;if(f){break}default:throw"Voronoi.closeCells() > this makes no sense!"
}}e++}n.closeMe=false}};Voronoi.prototype.quantizeSites=function(c){var b=this.ε,d=c.length,a;while(d--){a=c[d];a.x=Math.floor(a.x/b)*b;
a.y=Math.floor(a.y/b)*b}};Voronoi.prototype.recycle=function(a){if(a){if(a instanceof this.Diagram){this.toRecycle=a}else{throw"Voronoi.recycleDiagram() > Need a Diagram object."
}}};Voronoi.prototype.compute=function(i,j){var d=new Date();this.reset();if(this.toRecycle){this.vertexJunkyard=this.vertexJunkyard.concat(this.toRecycle.vertices);
this.edgeJunkyard=this.edgeJunkyard.concat(this.toRecycle.edges);this.cellJunkyard=this.cellJunkyard.concat(this.toRecycle.cells);
this.toRecycle=null}var h=i.slice(0);h.sort(function(n,m){var o=m.y-n.y;if(o){return o}return m.x-n.x});var b=h.pop(),l=0,f,e,k=this.cells,a;
for(;;){a=this.firstCircleEvent;if(b&&(!a||b.y<a.y||(b.y===a.y&&b.x<a.x))){if(b.x!==f||b.y!==e){k[l]=this.createCell(b);b.voronoiId=l++;
this.addBeachsection(b);e=b.y;f=b.x}b=h.pop()}else{if(a){this.removeBeachsection(a.arc)}else{break}}}this.clipEdges(j);this.closeCells(j);
var c=new Date();var g=new this.Diagram();g.cells=this.cells;g.edges=this.edges;g.vertices=this.vertices;g.execTime=c.getTime()-d.getTime();
this.reset();return g};
//adapted from https://github.com/hornairs/blog/blob/master/assets/coffeescripts/flocking/vector.coffee
var Vector = (function() {
  var name, _fn, _i, _len, _ref;

  _ref = ['add', 'subtract', 'multiply', 'divide'];

  _fn = function(name) {
    return Vector[name] = function(a, b) {
      return a.duplicate()[name](b);
    };
  };

  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    name = _ref[_i];
    _fn(name);
  }

  function Vector(x, y) {

    if (x == null) 
      x = 0;
    
    if (y == null) 
      y = 0;

    this.x = x, this.y = y;
  }

  Vector.prototype.duplicate = function() {
    return new Vector(this.x, this.y);
  };

  Vector.prototype.magnitude = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vector.prototype.normalize = function() {
    var m;

    m = this.magnitude();

    if (m > 0) 
      this.divide(m);

    return this;
  };

  Vector.prototype.limit = function(max) {
    if (this.magnitude() > max) {
      this.normalize();

      return this.multiply(max);
    } else {

      return this;
    }
  };

  Vector.prototype.heading = function() {
    return -1 * Math.atan2(-1 * this.y, this.x);
  };

  Vector.prototype.eucl_distance = function(other) {
    var dx, dy;

    dx = this.x - other.x;
    dy = this.y - other.y;

    return Math.sqrt(dx * dx + dy * dy);
  };

  Vector.prototype.distance = function(other, dimensions) {
    var dx, dy;

    if (dimensions == null) 
      dimensions = false;
    

    dx = Math.abs(this.x - other.x);
    dy = Math.abs(this.y - other.y);

    if (dimensions) {
      dx = dx < dimensions.width / 2 ? dx : dimensions.width - dx;
      dy = dy < dimensions.height / 2 ? dy : dimensions.height - dy;
    }

    return Math.sqrt(dx * dx + dy * dy);
  };

  Vector.prototype.subtract = function(other) {
    this.x -= other.x;
    this.y -= other.y;

    return this;
  };

  Vector.prototype.add = function(other) {
    this.x += other.x;
    this.y += other.y;

    return this;
  };

  Vector.prototype.divide = function(n) {
    this.x = this.x/n, this.y = this.y/n;

    return this;
  };

  Vector.prototype.multiply = function(n) {
    this.x = this.x*n, this.y = this.y*n;

    return this;
  };

  Vector.prototype.dot = function(other) {
    return this.x * other.x + this.y * other.y;
  };

  Vector.prototype.projectOnto = function(other) {
    return other.duplicate().multiply(this.dot(other));
  };

  Vector.prototype.wrapRelativeTo = function(location, dimensions) {
    var a, d, key, map_d, v, _ref1;

    v = this.duplicate();
    _ref1 = {
      x: "width",
      y: "height"
    };

    for (a in _ref1) {
      key = _ref1[a];
      d = this[a] - location[a];
      map_d = dimensions[key];
      if (Math.abs(d) > map_d / 2) {
        if (d > 0) {
          v[a] = (map_d - this[a]) * -1;
        } else {
          v[a] = this[a] + map_d;
        }
      }
    }
    return v;
  };

  Vector.prototype.invalid = function() {
    return (this.x === Infinity) || isNaN(this.x) || this.y === Infinity || isNaN(this.y);
  };

  return Vector;

})();
//main file

var ARTGEN = {};

//starts the collection of brushes
ARTGEN._brushes = new Collection(baseBrush);

//starts the collection of painters
ARTGEN._painters = new Collection(basePainter);

//meta information about brushes
ARTGEN.info_brushes = {};

//meta information about painters
ARTGEN.info_painters = {};

//logs messages
ARTGEN.log = function(msg) {
    //console.log(msg);
}

/* 
 * adds a new brush to the collection
 * Alias for ARTGEN.brushes.add
 * @param {String} name Name of the new brush
 * @param {String|Object} extend Name of brush to extend from or methods
 * @param {Object} methods Methods of the new brush
 */
ARTGEN.addBrush = function(name, extend, method) {
    //store meta information reference
    this.info_brushes[name] = {};
    this._brushes.add(name, extend, method, this.info_brushes[name]);
};

/* 
 * adds a new painter to the collection
 * Alias for ARTGEN.painters.add
 * @param {String} name Name of the new painter
 * @param {String|Object} extend Name of painter to extend from or methods
 * @param {Object} methods Methods of the new painter
 */
ARTGEN.addPainter = function(name, extend, method) {

    //store meta information reference
    this.info_painters[name] = {
        title: "",
        description: "",
        tags: [],
        data_values: {},
        options: {}
    };
    this._painters.add(name, extend, method, this.info_painters[name]);
};

/* 
 * starts the art generator
 */
ARTGEN.init = function(canvas_id, painter, options) {
    this.log("Starting ARTGEN on", canvas_id);

    var instance = {};
    //set up the canvas
    instance._canvas = document.getElementById(canvas_id);
    instance._ctx = instance._canvas.getContext('2d');

    instance._canvas.width = parseInt(instance._canvas.offsetWidth, 10);
    instance._canvas.height = parseInt(instance._canvas.offsetHeight, 10);

    //get the painter from the collection and initialize it
    var p = this._painters.get(painter);
    instance.painter = new p();
    instance.painter.init(instance._canvas, instance._ctx, options);
    instance.data = [null];

    //browser animation
    requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame
    })();

    cancelAnimFrame = window.cancelAnimationFrame;

    //public API for this instance

    /*
     * Start paining, which animates
     */
    instance.paint = function(time) {

        if (!time) {
            time = new Date().getTime();
        }
        var _this = this;
        this._animationFrame = requestAnimFrame(function() {
            _this.paint(new Date().getTime());
        });

        instance.painter.paint(time, instance.data);
    }
    
    /*
     * Stop paining
     */
    instance.stop = function() {
        cancelAnimFrame(this._animationFrame);
    }

    return instance;
};

ARTGEN.addBrush('cannon', {
    init: function() {
        //initial values
        this.minspeed = 0.1;
        this.maxspeed = 2; // too large and you'll get loose dots
        //acceleration and change of speed
		this.bullets = [];
		this.dying = [];// Dead bullets storage for special drawing
    
        this.explosionRadius = 15;
        
        this.xBoom = null;
		this.yBoom = null;
		this.superColor = "rgba(255,255,255,0.1)";
		
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 10;
		this.speakingCountMax = 10;
		
    },
    update: function(canvas, ctx, data) {
		if (typeof data == "undefined") {
			return;
		}
		if (data == 0) {
			this.silenceCounter++;
		} else if (data == 1) {
			this.speakingCounter++;
		}
		else{}
		
		if (this.silenceCounter >= this.silenceCountMax) {
			this.addBullet("down",0.1,15*Math.random());
			this.silenceCounter = 0;
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			this.addBullet("up",0.1,15*Math.random());
			this.speakingCounter = 0;
		}
		this.moveBullets(canvas);
		this.explode(ctx);
    },
    draw: function(ctx) {
        this.drawBullets(ctx);
    },
    start: function(ctx,canvas) {
		this.xBoom = 0;
		this.yBoom = canvas.height/2;
		ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "black";
		ctx.fill();
    },
	addBullet: function(way, gravity, speed){
		this.bullets.push({
			x: this.xBoom,
			xLast: this.xBoom,
			y: this.yBoom,
			yLast: this.yBoom,
			xSpeed: speed,
			ySpeed: 0, 
			way: way,
			gravity: gravity
		});
	},
	moveBullets: function(canvas){
		for (key in this.bullets){
			// Whay way will gravity be?
			if (this.bullets[key].way == "up"){
				var multip = -1;
			} else if (this.bullets[key].way == "down") {
				var multip = 1;
			}
			else{ console.log('No way'); }
			
			// Push positions to old positions
			this.bullets[key].xLast = this.bullets[key].x;
			this.bullets[key].yLast = this.bullets[key].y;
			
			//var oldXspeed = this.bullets[key].xSpeed;
			var oldYspeed = this.bullets[key].ySpeed;
			
			//this.bullets[key].xSpeed = oldXspeed;
			this.bullets[key].ySpeed = oldYspeed + multip * this.bullets[key].gravity;
			
			this.bullets[key].x += this.bullets[key].xSpeed;
			this.bullets[key].y += this.bullets[key].ySpeed;
			//keep the bullet within the canvas
			if (this.bullets[key].x > canvas.width) {
				this.bullets[key].x = canvas.width;
				this.dying.push(this.bullets[key]);
				this.bullets.splice(key,1);
			}
			if (this.bullets[key].y > canvas.height) {
				this.bullets[key].y = canvas.height;
				this.dying.push(this.bullets[key]);
				this.bullets.splice(key,1);				
			}
			if (this.bullets[key].x < 0) {
				this.bullets[key].x = 0;
				this.dying.push(this.bullets[key]);
				this.bullets.splice(key,1);				
			}
			if (this.bullets[key].y < 0) {
				this.bullets[key].y = 0;
				this.dying.push(this.bullets[key]);
				this.bullets.splice(key,1);			
			}
			//if (this.x > canvas.width) this.x -= canvas.width;
			//if (this.y > canvas.height) this.y -= canvas.height;
			//if (this.x < 0) this.x += canvas.width;
			//if (this.y < 0) this.y += canvas.height;
		}
	},
	drawBullets: function(ctx) {
		for (key in this.bullets) {
			//ctx.save();
			//ctx.translate(this.bullets[key].x, this.bullets[key].y);
			
			ctx.beginPath();
			ctx.moveTo(this.bullets[key].xLast,this.bullets[key].yLast);
			ctx.lineTo(this.bullets[key].x,this.bullets[key].y);
			ctx.strokeStyle = this.superColor;
			ctx.lineWidth = 3;
			ctx.stroke();
			
			//ctx.restore();
		}
	},
	explode: function(ctx){
		for (key in this.dying){
			ctx.save();
			ctx.translate(this.dying[key].x, this.dying[key].y);
			
			ctx.arc(0, 0, this.explosionRadius, 0, Math.PI * 2, true);
			ctx.fillStyle = this.superColor;
			ctx.fill();
			
			ctx.restore();
		}
		this.dying = [];
	},
});
ARTGEN.addBrush('circles', {

    init: function(c){

        //context
        this.ctx = c;
        //include enable/disable method
        this._enabled = false;

        //general settings
        this._settings = _.extend({
            COLOR: "rgba(52, 152, 219,0.1)",
        }, (this._settings || {}) );

        //Positions
        this.positionX;
        this.positionY;
        this.prevX = 0;
        this.prevY = 0;
        this.points = [ ];
        this.radius = 15;
        this.radius = Math.floor(Math.random() * (16)) + 5;
        this.opacity = Math.random();
    },

    start: function(x, y){
        this.positionX = x;
        this.positionY = y;
    },

    setTarget: function(x, y){
        this.positionX = x;
        this.positionY = y;
    },

    enable: function() {
        this._enabled = true;
        this._settings.COLOR = this.color;
    },

    disable: function() {
        this._enabled = false;
        this._settings.COLOR = "rgba(255,255,255,0)";
    },

    setColor: function(color) {
        this.color = color;
        if (this._enabled) this._settings.COLOR = color;
    },

    update: function(){
        this.points.push({ 
            x: this.positionX,
            y: this.positionY,
            radius: Math.floor(Math.random() * (21)) + 10,
            opacity: Math.random()
        });

    },

    draw: function(){
        //if(Math.abs(this.prevX-this.positionX)>10 || Math.abs(this.prevY-this.positionY)>10){

            this.ctx.lineJoin = this.ctx.lineCap = 'round';
            this.ctx.fillStyle = this.color;
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            for (var i = 0; i < this.points.length; i++) {
                this.ctx.beginPath();
                this.ctx.globalAlpha = this.points[i].opacity;
                this.ctx.arc(
                  this.points[i].x, this.points[i].y, this.points[i].radius, 
                  false, Math.PI * 2, false);
                this.ctx.fill();
            }
            
            this.prevX = this.positionX;
            this.prevY = this.positionY;
        //}
    },

});
ARTGEN.addBrush('colorose', {
    init: function() {
		
		this.generation1 = 20;
		this.minThickness = 1;
		this.minOpacity = 0.04;
		this.minOpacityBackground = 0.0035;
		this.birthRate = 0.06;
		
		this.RGBank = [
			[	// 0 - Violets
				[100, 47, 120],
				[45, 66, 134],
				[43, 51, 86],
				[25, 18, 52],
				[7, 31, 70],
				[5, 11, 46],
				[42, 87, 167],
			], [ // 1 - Dragons & fire
				[255, 147, 21],
				[24, 34, 36],
				[44, 23, 12],
				[72, 55, 52],
				[36, 37, 36],
				[203, 11, 6],
				[46, 47, 44],
				[16, 21, 19],
			], [ // 2 - Rainbow
				[255, 0, 0],
				[255, 127, 0],
				[255, 255, 0],
				[0, 255, 0],
				[0, 0, 255],
				[75, 0, 130],
				[143, 0, 255]
			], [ // 3 - Forest
				[106,64,28],
				[121,72,33],
				[97,58,26],
				[74,54,26],
				[29,30,10],
				[67,84,6],
				[205,213,140],
				[222,229,203],
				[167,180,84],
				[66,80,14],
				[94,110,33],
				[99,107,51],
				[86,98,55],
				[162,170,109],
				[169,181,157],
				
			]
		];
		this.activeRGBank = 0;// Change to explore other color sets
		
		this.around = [];
		this.flying = [];

		this.bigRadius = null;
		this.bigCenterX = null;
		this.bigCenterY = null;
		this.maxDist = null;
		
		/** Delayers **/
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 1;
		this.speakingCountMax = 3;
		
		/** Angle **/
		this.angAcc = 0;
		this.minAngAcc = -20;
		this.maxAngAcc = 20;
		this.angAccSmooth = 10000;
		/*this.initAngSpeed = 0.0002;
		this.minAngSpeed = 0.0002;
		this.maxAngSpeed = 0.0006;*/
		this.initAngSpeed = 0.007;
		this.minAngSpeed = 0.001;
		this.maxAngSpeed = 0.007;
		this.angSpeedNaturalDecrease = 0.001;// Additive, 0.01 is huge
		
		/** Radius **/
		this.repulsion = 0;
		this.minRep = 0;
		this.maxRep = 50;
		this.maxRepScale = 30;//px
		this.minRspeed = -3;
		this.maxRspeed = 3;
		this.rSpeedNaturalDecrease = 0.3;// Multiplicator Should remain [0,1] 0.3 is very very high
		
		/** Simulated expressiveness **/
		this.expCounter = 0;
		this.expressivenessVar = 500;
		this.expressiveness = 0.5;

		/**Adjust Number of Particles**/
		this.hasAddedParticles=false;

		/**Adjust Number of Colors**/
		this.emotionIndex=0;

    },
    update: function(canvas, ctx, data) {
		if (typeof data == "undefined") {
			return;
		}
		if (data[0] == 0) {
		//if (data == 0) {
			this.silenceCounter++;
		} else if (data[0] == 1) {
		//} else if (data == 1) {
			this.speakingCounter++;
		} else {}
		

		if (this.silenceCounter >= this.silenceCountMax) {
			this.angAcc--;
			this.repulsion--;
			if(this.angAcc <= this.minAngAcc) {
				this.angAcc = this.minAngAcc;
			}
			if(this.repulsion <= this.minRep) {
				this.repulsion = this.minRep;
			}
			this.silenceCounter = 0;
			
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			this.angAcc++;
			this.repulsion++;
			if(this.angAcc >= this.maxAngAcc) {
				this.angAcc = this.maxAngAcc;
			}
			if(this.repulsion >= this.maxRep) {
				this.repulsion = this.maxRep;
			}
			this.speakingCounter = 0;
		}
		
		this.simulateExpressiveness(data);
		this.naturalRepulsionDecrease();
		//var howMany = Math.floor(Math.random()*(1+1*this.expressiveness));// 1 in ?
		var howMany = Math.floor(Math.random()*(1 + this.birthRate+this.expressiveness));// 1 in ?
		
		this.emotionIndex= Math.floor(parseFloat(data[2])*6);

		this.feed(howMany);
		this.detach(howMany);

		if (this.expressiveness>0.6){
			// if(!this.hasAddedParticles){
				this.feed(this.generation1*0.3);	
				this.detach (this.generation1*0.3);
				this.hasAddedParticles=true;
			// }	
		} 
		// else if (this.expressiveness<0.5 ){
		// 	if (this.hasAddedParticles){
		// 		this.feed(this.generation1*0.3);
		// 		this.hasAddedParticles=false;
		// 	}
		// }

				
		this.moveBullets(canvas);
    },
    draw: function(ctx) {
        this.drawBullets(ctx);
    },
    start: function(ctx, canvas,data) {
		this.bigRadius = 0.45 * Math.min(canvas.height, canvas.width);
		this.bigCenterX = canvas.width/2;
		this.bigCenterY = canvas.height/2;
		this.maxDist = 0.5 * Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));
		/*ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fill();*/
		
		this.feed(this.generation1);
		
    },
	simulateExpressiveness: function(data) {
		this.expCounter++;
		// Full range
		//this.expressiveness = 0.5 + 0.5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
		
		// Low values
		//this.expressiveness = 0.2 + 0.2*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
		
		// Highvalues with sunburst effect
		//this.expressiveness = 0.8 + 0.2*1/5*Math.floor(5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI));
		
		// Full range with sunburst effect
		//this.expressiveness = 0.5 + 0.5*1/3*Math.floor(3*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI));
		
		// Live data with sunburst effect
		this.expressiveness = 1/7 * Math.floor(7 * parseFloat(data[1]));
		//this.expressiveness = parseFloat(data[1]);
		// Blur the thresholds a little
		this.expressiveness += 0.02*Math.random();
		//console.log(this.expressiveness);
	},
	naturalRepulsionDecrease: function(){
		this.repulsion -= 1-0.95;
		if (this.repulsion <= this.minRep) {
			this.repulsion = this.minRep;
		}
	},
	addBullet: function(way) {
		var rad = this.bigRadius * (0.2 + 0.8 * this.expressiveness);
		var angle = 2*Math.PI*Math.random();
		var colorIndex = Math.floor(Math.random() * this.RGBank[this.activeRGBank].length);


		this.around.push({
			r: rad,
			rLast: rad,
			rSpeed: 0,
			ang: angle,
			angLast: angle,
			angSpeed: this.initAngSpeed,
			way: way,
			rgb: this.RGBank[this.activeRGBank][colorIndex]
		});
	},
	moveBullets: function(canvas) {
		// In around
		for (key in this.around) {
			// Whay way will motion happen?
			if (this.around[key].way == "clockwise") {
				var multip = -1;
			} else if (this.around[key].way == "anticlockwise") {
				var multip = 1;
			}
			else { console.log('No way'); }
			
			/** Angle **/
			// New angle speed
			var oldAngSpeed = this.around[key].angSpeed;
			this.around[key].angSpeed = oldAngSpeed + (multip * this.angAcc / this.angAccSmooth);
			// Natural decrease (additive)
			this.around[key].angSpeed -= this.angSpeedNaturalDecrease;
			// Well, careful
			this.around[key].angSpeed = Math.min(Math.max(this.around[key].angSpeed, this.minAngSpeed), this.maxAngSpeed);
			// New angle
			this.around[key].angLast = this.around[key].ang;
			this.around[key].ang += this.around[key].angSpeed;
			
			/** Radius **/
			// New radius with repulsion
			// Memorize last r (if you don't, the brush becomes 'vortex')
			// this.around[key].rLast = this.around[key].r;
			this.around[key].rSpeed += (2*Math.random()-1) * (this.maxRepScale * (this.repulsion-this.minRep)/(this.maxRep-this.minRep));
			// Natural decrease (multiplicative)
			this.around[key].rSpeed *= (1 - this.rSpeedNaturalDecrease);
			// Careful!
			this.around[key].rSpeed = Math.min(Math.max(this.around[key].rSpeed, this.minRspeed), this.maxRspeed);
			
			this.around[key].r += this.around[key].rSpeed;
			// Careful you too!
			this.around[key].r = Math.max(0, this.around[key].r);
		}
		
		// In flying
		for (key2 in this.flying) {
			/*
			//keep the bullet within the canvas
			if (this.flying[key2].x > canvas.width) {
				this.flying[key2].x = canvas.width;
				this.dying.push(this.flying[key2]);
				this.flying.splice(key2, 1);
			}
			if (this.flying[key2].y > canvas.height) {
				this.flying[key2].y = canvas.height;
				this.dying.push(this.flying[key2]);
				this.flying.splice(key2, 1);				
			}
			if (this.flying[key2].x < 0) {
				this.flying[key2].x = 0;
				this.dying.push(this.flying[key2]);
				this.flying.splice(key2, 1);				
			}
			if (this.flying[key2].y < 0) {
				this.flying[key2].y = 0;
				this.dying.push(this.flying[key2]);
				this.flying.splice(key2, 1);			
			}
			*/
			var bullet = this.flying[key2];
			bullet.rLast = bullet.r;
			bullet.r += 15;
			bullet.x = this.bigCenterX + bullet.r * Math.cos(bullet.ang);
			bullet.y = this.bigCenterY + bullet.r * Math.sin(bullet.ang);
			bullet.xLast = this.bigCenterX + bullet.rLast * Math.cos(bullet.angLast);
			bullet.yLast = this.bigCenterY + bullet.rLast * Math.sin(bullet.angLast);
			bullet.thickness = Math.pow(bullet.r / 125, 2.5);
			
			if (bullet.r > this.maxDist) {
				this.flying.splice(key2, 1);
			}
		}
		
	},
	drawBullets: function(ctx) {
		/*ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "rgba(0,0,0,0.002)";
		ctx.fill();*/
		
		for (key in this.around) {
			//var x = this.bigCenterX + this.around[key].r * Math.cos(this.around[key].ang);
			//var y = this.bigCenterY + this.around[key].r * Math.sin(this.around[key].ang);
			//var xLast = this.bigCenterX + this.around[key].rLast * Math.cos(this.around[key].angLast);
			//var yLast = this.bigCenterY + this.around[key].rLast * Math.sin(this.around[key].angLast);
			var XYR = this.deform(this.around[key]);
			var xLast = XYR.xLast;
			var yLast = XYR.yLast;
			var x = XYR.x;
			var y = XYR.y;
			var expander = Math.sqrt(this.around[key].r/30);
			var opa = this.minOpacity * expander;
			var rgb = this.around[key].rgb;
			ctx.strokeStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opa + ")";
			ctx.lineWidth = this.minThickness * expander;
			ctx.beginPath();
			ctx.moveTo(xLast,yLast);
			ctx.lineTo(x,y);
			ctx.stroke();
		}
		
		for (key2 in this.flying) {
			var expander = Math.sqrt(this.flying[key2].r/30);
			var opa = this.minOpacityBackground * expander * this.expressiveness;
			var rgb = this.flying[key2].rgb;
			
			ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opa + ")";
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.arc(this.flying[key2].x, this.flying[key2].y, this.flying[key2].thickness, 0, Math.PI * 2, true);
			ctx.fill();
		}
		
	},
	deform: function(bullet) {
		var r = bullet.r;
		var rLast = bullet.rLast;
		
		// Operations on radii
		//rLast = r * 0.99;
		
		var x = this.bigCenterX + r * Math.cos(bullet.ang);
		var y = this.bigCenterY + r * Math.sin(bullet.ang);
		var xLast = this.bigCenterX + rLast * Math.cos(bullet.angLast);
		var yLast = this.bigCenterY + rLast * Math.sin(bullet.angLast);
		
		return { 
			xLast: xLast, 
			yLast: yLast, 
			x: x, 
			y: y
		};
	},
	feed: function(howMany) {
		// Add bullets to around array
		for (var i = 0; i < howMany; i++) {
			this.addBullet("anticlockwise");
		}
	},
	detach: function(howMany) {
		// Moves bullets from around array to flying array
		// Gives them a bunch of new properties
		var targetDist = 10;
		for (var i = 0; i < howMany; i++) {
			var newFlyer = this.around.shift();
			
			newFlyer.x = this.bigCenterX + newFlyer.r * Math.cos(newFlyer.ang);
			newFlyer.y = this.bigCenterY + newFlyer.r * Math.sin(newFlyer.ang);
			newFlyer.xLast = newFlyer.x;
			newFlyer.yLast = newFlyer.y;
			newFlyer.xTarget = this.bigCenterX + targetDist * newFlyer.r * Math.cos(newFlyer.ang);
			newFlyer.yTarget = this.bigCenterY + targetDist * newFlyer.r * Math.sin(newFlyer.ang);
			newFlyer.thickness = 1;
			
			this.flying.push(newFlyer);
			console.log(newFlyer.rgb);
		}
	},
});
ARTGEN.addBrush('flock', {

    //code adapted from http://codepen.io/ferronsays/pen/gcfph

    init: function(c) {

        //context
        this.ctx = c;
        this._enabled = false;

        //general settings
        this._settings = _.extend({
            COLOR: "rgba(255,255,255,0)",
            BOIDS: 100,
            MAX_SPEED: 20,
            MAX_FORCE: 20,
            MAX_SIZE: 2,
            DESIRED_SEPARATION: 2,
            NEIGHBOR_RADIUS: 150,
            SEPARATION_WEIGHT: 500,
            ALIGNMENT_WEIGHT: 1,
            COHESION_WEIGHT: 2,
            TARGET_POSITION: new Vector(c.canvas.width / 2, c.canvas.height / 2),
            TARGET_SIGN: 1,
            TARGET_FORCE: 2000,
            TARGET_COHESION: 0.1,
            BOID_STYLE: 0,
            DRAW_TRAILS: false,
            LINE_WIDTH: 1,
            WRAP_CANVAS: false
        }, (this._settings || {}) );

        this.boids = [];

    },
    update: function(canvas, data) {
        for (i in this.boids) {
            this.boids[i].step(this.boids);
        }
    },
    draw: function(ctx) {
        for (i in this.boids) {
            this.boids[i].draw();
        }
    },
    setTarget: function(x, y) {
        this._settings.TARGET_POSITION = new Vector(x, y);
    },
    disable: function() {
        this._enabled = false;
        this._settings.COLOR = "rgba(255,255,255,0)";
    },
    setColor: function(color) {
        this.color = color;
        if (this._enabled) this._settings.COLOR = color;
    },
    enable: function() {
        this._enabled = true;
        this._settings.COLOR = this.color;
    },
    setPosition: function(x, y) {
        for (var i = 0; i < this.boids.length; i++) {
            var new_x = x + 2 * (Math.random() * this._settings.MAX_FORCE) - this._settings.MAX_FORCE;
            var new_y = y + 2 * (Math.random() * this._settings.MAX_FORCE) - this._settings.MAX_FORCE;
            this.boids[i].loc = new Vector(new_x, new_y);
        }
    },
    start: function(x, y) {

        var settings = this._settings;
        var BoidStyleEnum = {
            Square: 0,
            Line: 1,
            Circle: 2
        };

        var Boid = function(location, velocity, ctx) {
            this.init(location, velocity, ctx);
        };

        Boid.prototype.init = function(location, velocity, ctx) {
            this.loc = location.duplicate();
            this.velocity = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
            this.ctx = ctx;
        };

        Boid.prototype.step = function(neighbors) {
            var acceleration = this.flock(neighbors).add(this.influence());
            this.velocity.add(acceleration).limit(settings.MAX_SPEED);
            this.loc.add(this.velocity);
            this.wrapToCanvasBounds();
        };

        Boid.prototype.wrapToCanvasBounds = function() {
            if(settings.WRAP_CANVAS) {
                this.loc.x = this.loc.x < 0 ? this.ctx.canvas.width : this.loc.x;
                this.loc.x = this.loc.x > this.ctx.canvas.width ? 0 : this.loc.x;
                this.loc.y = this.loc.y < 0 ? this.ctx.canvas.height : this.loc.y;
                this.loc.y = this.loc.y > this.ctx.canvas.height ? 0 : this.loc.y;
            }
        };

        Boid.prototype.flock = function(neighbors) {
            var separation = this.separate(neighbors).multiply(settings.SEPARATION_WEIGHT);
            var alignment = this.align(neighbors).multiply(settings.ALIGNMENT_WEIGHT);
            var cohesion = this.cohere(neighbors).multiply(settings.COHESION_WEIGHT);

            return separation.add(alignment).add(cohesion);
        };

        Boid.prototype.cohere = function(neighbors) {
            var sum = new Vector(0, 0);
            var count = 0;

            for (boid in neighbors) {
                var d = this.loc.distance(neighbors[boid].loc);
                if (d > 0 && d < settings.NEIGHBOR_RADIUS) {
                    sum.add(neighbors[boid].loc);
                    count++;
                }
            }

            if (count > 0)
                return this.steer_to(sum.divide(count));
            else
                return sum;
        };

        Boid.prototype.steer_to = function(target) {
            var desired = Vector.subtract(target, this.loc);
            var d = desired.magnitude();
            var steer;

            if (d > 0) {
                desired.normalize();

                if (d < 100)
                    desired.multiply(settings.MAX_SPEED * (d / 100));
                else
                    desired.multiply(settings.MAX_SPEED);

                steer = desired.subtract(this.velocity);
                steer.limit(settings.MAX_FORCE);
            } else {
                steer = new Vector(0, 0);
            }

            return steer;
        };

        Boid.prototype.align = function(neighbors) {
            var mean = new Vector();
            var count = 0;
            for (boid in neighbors) {
                var d = this.loc.distance(neighbors[boid].loc);
                if (d > 0 && d < settings.NEIGHBOR_RADIUS) {
                    mean.add(neighbors[boid].velocity);
                    count++;
                }
            }

            if (count > 0)
                mean.divide(count)

            mean.limit(settings.MAX_FORCE);

            return mean;
        };

        Boid.prototype.separate = function(neighbors) {
            var mean = new Vector();
            var count = 0;

            for (boid in neighbors) {
                var d = this.loc.distance(neighbors[boid].loc);
                if (d > 0 && d < settings.DESIRED_SEPARATION) {
                    mean.add(Vector.subtract(this.loc, neighbors[boid].loc).normalize().divide(d));
                    count++;
                }
            }

            if (count > 0)
                mean.divide(count);

            return mean;
        };

        Boid.prototype.influence = function() {
            var g = new Vector();
            var target = Vector.subtract(settings.TARGET_POSITION, this.loc);
            d = settings.TARGET_COHESION;
            g.add(target.normalize().divide(d * d).multiply(settings.TARGET_SIGN).limit(settings.TARGET_FORCE));
            return g;
        };

        Boid.prototype.draw = function() {

            var vv = (Math.abs(this.velocity.x) + Math.abs(this.velocity.y)) / 2;
            var color = settings.COLOR;
            switch (settings.BOID_STYLE) {
                case BoidStyleEnum.Square:
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(this.loc.x, this.loc.y, Math.min(vv * 5, settings.MAX_SIZE), Math.min(vv * 5, settings.MAX_SIZE));
                    break;
                case BoidStyleEnum.Line:
                    this.ctx.lineWidth = settings.LINE_WIDTH;
                    this.ctx.strokeStyle = color;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.loc.x, this.loc.y);
                    this.ctx.lineTo(this.loc.x + Math.min(this.velocity.x * 5, settings.MAX_SIZE), this.loc.y + Math.min(this.velocity.y * 5, settings.MAX_SIZE));
                    this.ctx.stroke();
                    break;
                case BoidStyleEnum.Circle:
                    this.ctx.beginPath();
                    this.ctx.arc(this.loc.x, this.loc.y, Math.min(vv * 3, settings.MAX_SIZE), 0, 2 * Math.PI, false);
                    this.ctx.fillStyle = color;
                    this.ctx.fill();
                    break;
                default:
                    this.ctx.beginPath();
                    this.ctx.arc(this.loc.x, this.loc.y, Math.min(vv * 3, settings.MAX_SIZE), 0, 2 * Math.PI, false);
                    this.ctx.fillStyle = color;
                    this.ctx.fill();
                    break;
            }
        };

        this.boids = [];
        for (var i = 0; i < this._settings.BOIDS; i++) {

            //random around the same area
            var new_x = x + 2 * (Math.random() * this._settings.MAX_FORCE) - this._settings.MAX_FORCE;
            var new_y = y + 2 * (Math.random() * this._settings.MAX_FORCE) - this._settings.MAX_FORCE;

            var boid = new Boid(
                new Vector(new_x, new_y),
                new Vector(Math.random(10), Math.random(10)),
                this.ctx);

            this.boids.push(boid);
        }
    }
});
ARTGEN.addBrush('hairy', 'flock', {

	//general settings
        _settings: {
            BOIDS: 25,
            BOID_STYLE: 1,
            LINE_WIDTH: 1, 
            MAX_FORCE: 0.5,
            DESIRED_SEPARATION: 1,
        }

});
ARTGEN.addBrush('ink', {

    _settings: {
        COLOR: "rgba(255,255,255,0)"
    },

    init: function(c) {

        this.ctx = c;
        this.ctx.lineJoin = this.ctx.lineCap = 'round';

    },
    update: function() {


    },
    draw: function() {

        this.ctx.beginPath();
        var x1 = this._prevPOS.x;
        var y1 = this._prevPOS.y;
        var x2 = this._settings.TARGET_POSITION.x;
        var y2 = this._settings.TARGET_POSITION.y;
        this.ctx.moveTo(x1, y1);
        this.ctx.lineWidth = _.random(3,6);
        this.ctx.strokeStyle = this._settings.COLOR;
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

    },
    setTarget: function(x, y) {
        this._prevPOS = this._settings.TARGET_POSITION;
        this._settings.TARGET_POSITION = new Vector(x, y);
    },
    start: function(x, y, m) {
        this.setTarget(x, y);
        this._prevPOS = this._settings.TARGET_POSITION;
    }
});
ARTGEN.addBrush('marker', 'flock', {

	//general settings
        _settings: {
            SEPARATION_WEIGHT: 100,
            ALIGNMENT_WEIGHT: 100,
            TARGET_SIGN: 20,
            MAX_SPEED: 10,
            MAX_FORCE: 1,
            TARGET_COHESION: 0.01,
        }

});
ARTGEN.addBrush('pencil', {

    init: function(c){

        //context
        this.ctx = c;
        //include enable/disable method
        this._enabled = false;

        //general settings
        this._settings = _.extend({
            COLOR: "rgba(52, 152, 219,0.1)",
        }, (this._settings || {}) );

        //Positions
        this.positionX;
        this.positionY;
    },

    start: function(x, y){
        this.positionX = x;
        this.positionY = y;
    },

    setTarget: function(x, y){
        this.positionX = x;
        this.positionY = y;
    },

    enable: function() {
        this._enabled = true;
        this._settings.COLOR = this.color;
    },

    disable: function() {
        this._enabled = false;
        this._settings.COLOR = "rgba(255,255,255,0)";
    },

    setColor: function(color) {
        this.color = color;
        if (this._enabled) this._settings.COLOR = color;
    },

    update: function(){
             

    },

    draw: function(){
        this.ctx.lineJoin = this.ctx.lineCap = 'round';
        this.ctx.lineTo(this.positionX, this.positionY);
        this.ctx.stroke();
    },

});
ARTGEN.addBrush('poneytail', {
    init: function() {
		
		this.generation1 = 20;
		this.minThickness = 1;
		this.minOpacity = 0.04;
		this.minOpacityBackground = 0.0035;
		this.birthRate = 0.06;
		this.afterlifeOpacity = 0.012;
		this.afterlifeDecline = 0.008;
		
		this.RGBank = [
			[	// 0 - Violets
				[42, 87, 167],
				[100, 47, 120],
				[43, 51, 86],
				[7, 31, 70],
				[25, 18, 52],
				[45, 66, 134],
				[5, 11, 46]
			], [ // 1 - Dragons & fire
				[255, 147, 21],
				[24, 34, 36],
				[44, 23, 12],
				[72, 55, 52],
				[36, 37, 36],
				[203, 11, 6],
				[46, 47, 44],
				[16, 21, 19],
			], [ // 2 - Rainbow
				[255, 0, 0],
				[255, 127, 0],
				[255, 255, 0],
				[0, 255, 0],
				[0, 0, 255],
				[75, 0, 130],
				[143, 0, 255]
			], [ // 3 - Forest
				[106,64,28],
				[121,72,33],
				[97,58,26],
				[74,54,26],
				[29,30,10],
				[67,84,6],
				[205,213,140],
				[222,229,203],
				[167,180,84],
				[66,80,14],
				[94,110,33],
				[99,107,51],
				[86,98,55],
				[162,170,109],
				[169,181,157],
				
			]
		];
		this.activeRGBank = 1;// Change to explore other color sets
		
		this.around = [];
		this.flying = [];
		this.afterlife = [];

		this.bigRadius = null;
		this.bigCenterX = null;
		this.bigCenterY = null;
		this.maxDist = null;
		
		/** Delayers **/
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 1;
		this.speakingCountMax = 3;
		
		/** Angle **/
		this.angAcc = 0;
		this.minAngAcc = -20;
		this.maxAngAcc = 20;
		this.angAccSmooth = 10000;
		/*this.initAngSpeed = 0.0002;
		this.minAngSpeed = 0.0002;
		this.maxAngSpeed = 0.0006;*/
		this.initAngSpeed = 0.007;
		this.minAngSpeed = 0.001;
		this.maxAngSpeed = 0.007;
		this.angSpeedNaturalDecrease = 0.001;// Additive, 0.01 is huge
		
		/** Radius **/
		this.repulsion = 0;
		this.minRep = 0;
		this.maxRep = 50;
		this.maxRepScale = 30;//px
		this.minRspeed = -3;
		this.maxRspeed = 3;
		this.rSpeedNaturalDecrease = 0.3;// Multiplicator Should remain [0,1] 0.3 is very very high
		
		/** Simulated expressiveness **/
		this.expCounter = 0;
		this.expressivenessVar = 500;
		this.expressiveness = 0.5;

		/**Adjust Number of Particles**/
		this.hasAddedParticles=false;

    },
    update: function(canvas, ctx, data) {
		if (typeof data == "undefined") {
			return;
		}
		if (data[0] == 0) {
		//if (data == 0) {
			this.silenceCounter++;
		} else if (data[0] == 1) {
		//} else if (data == 1) {
			this.speakingCounter++;
		} else {}
		

		if (this.silenceCounter >= this.silenceCountMax) {
			this.angAcc--;
			this.repulsion--;
			if(this.angAcc <= this.minAngAcc) {
				this.angAcc = this.minAngAcc;
			}
			if(this.repulsion <= this.minRep) {
				this.repulsion = this.minRep;
			}
			this.silenceCounter = 0;
			
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			this.angAcc++;
			this.repulsion++;
			if(this.angAcc >= this.maxAngAcc) {
				this.angAcc = this.maxAngAcc;
			}
			if(this.repulsion >= this.maxRep) {
				this.repulsion = this.maxRep;
			}
			this.speakingCounter = 0;
		}
		
		this.simulateExpressiveness(data);
		this.naturalRepulsionDecrease();
		//var howMany = Math.floor(Math.random()*(1+1*this.expressiveness));// 1 in ?
		var howMany = Math.floor(Math.random()*(1 + this.birthRate + this.expressiveness));// 1 in ?
		
		this.feed(howMany);
		this.detach(howMany);

		if (this.expressiveness > 0.6) {
			if(!this.hasAddedParticles) {
				this.detach(this.generation1 * 0.3);
				this.hasAddedParticles = true;
			}
		} else if (this.expressiveness < 0.5) {
			if (this.hasAddedParticles) {
				this.feed(this.generation1 * 0.3);
				this.hasAddedParticles = false;
			}
		}
				
		this.moveBullets(canvas);
    },
    draw: function(ctx) {
        this.drawBullets(ctx);
    },
    start: function(ctx, canvas,data) {
		this.bigRadius = 0.45 * Math.min(canvas.height, canvas.width);
		this.bigCenterX = canvas.width/2;
		this.bigCenterY = canvas.height/2;
		this.maxDist = 0.5 * Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));
		/*ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fill();*/
		
		this.feed(this.generation1);
		
    },
	simulateExpressiveness: function(data) {
		this.expCounter++;
		// Full range
		//this.expressiveness = 0.5 + 0.5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
		
		// Low values
		//this.expressiveness = 0.2 + 0.2*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
		
		// Highvalues with sunburst effect
		//this.expressiveness = 0.8 + 0.2*1/5*Math.floor(5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI));
		
		// Full range with sunburst effect
		//this.expressiveness = 0.5 + 0.5*1/3*Math.floor(3*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI));
		
		// Live data with sunburst effect
		this.expressiveness = 1/7 * Math.floor(7 * parseFloat(data[1]));
		//this.expressiveness = parseFloat(data[1]);
		// Blur the thresholds a little
		this.expressiveness += 0.02*Math.random();
		//console.log(this.expressiveness);
	},
	naturalRepulsionDecrease: function(){
		this.repulsion -= 1-0.95;
		if (this.repulsion <= this.minRep) {
			this.repulsion = this.minRep;
		}
	},
	addBullet: function(way) {
		var rad = this.bigRadius * (0.2 + 0.8 * this.expressiveness);
		var angle = 2*Math.PI*Math.random();
		var colorIndex = Math.floor(Math.random() * this.RGBank[this.activeRGBank].length);
		this.around.push({
			r: rad,
			rLast: rad,
			rSpeed: 0,
			ang: angle,
			angLast: angle,
			angSpeed: this.initAngSpeed,
			way: way,
			rgb: this.RGBank[this.activeRGBank][colorIndex]
		});
	},
	moveBullets: function(canvas) {
		// In around
		for (key in this.around) {
			// Whay way will motion happen?
			if (this.around[key].way == "clockwise") {
				var multip = -1;
			} else if (this.around[key].way == "anticlockwise") {
				var multip = 1;
			}
			else { console.log('No way'); }
			
			/** Angle **/
			// New angle speed
			var oldAngSpeed = this.around[key].angSpeed;
			this.around[key].angSpeed = oldAngSpeed + (multip * this.angAcc / this.angAccSmooth);
			// Natural decrease (additive)
			this.around[key].angSpeed -= this.angSpeedNaturalDecrease;
			// Well, careful
			this.around[key].angSpeed = Math.min(Math.max(this.around[key].angSpeed, this.minAngSpeed), this.maxAngSpeed);
			// New angle
			this.around[key].angLast = this.around[key].ang;
			this.around[key].ang += this.around[key].angSpeed;
			
			/** Radius **/
			// New radius with repulsion
			// Memorize last r (if you don't, the brush becomes 'vortex')
			// this.around[key].rLast = this.around[key].r;
			this.around[key].rSpeed += (2*Math.random()-1) * (this.maxRepScale * (this.repulsion-this.minRep)/(this.maxRep-this.minRep));
			// Natural decrease (multiplicative)
			this.around[key].rSpeed *= (1 - this.rSpeedNaturalDecrease);
			// Careful!
			this.around[key].rSpeed = Math.min(Math.max(this.around[key].rSpeed, this.minRspeed), this.maxRspeed);
			
			this.around[key].r += this.around[key].rSpeed;
			// Careful you too!
			this.around[key].r = Math.max(0, this.around[key].r);
		}
		
		// In flying
		for (key2 in this.flying) {
			
			var bullet = this.flying[key2];
			bullet.rLast = bullet.r;
			bullet.r += 15;
			bullet.x = this.bigCenterX + bullet.r * Math.cos(bullet.ang);
			bullet.y = this.bigCenterY + bullet.r * Math.sin(bullet.ang);
			bullet.xLast = this.bigCenterX + bullet.rLast * Math.cos(bullet.angLast);
			bullet.yLast = this.bigCenterY + bullet.rLast * Math.sin(bullet.angLast);
			//bullet.thickness = Math.pow(bullet.r / 125, 2.5);
			bullet.thickness = bullet.r/125;
			
			// Kill bullets that reach the edges of the canvas
			/*
			if (bullet.x > canvas.width) {
				bullet.x = canvas.width;
				bullet.edge = "right";
				this.afterlife.push(bullet);
				this.flying.splice(key2, 1);
			}
			if (bullet.y > canvas.height) {
				bullet.y = canvas.height;
				bullet.edge = "bottom";
				this.afterlife.push(bullet);
				this.flying.splice(key2, 1);				
			}
			if (bullet.x < 0) {
				bullet.x = 0;
				bullet.edge = "left";
				this.afterlife.push(bullet);
				this.flying.splice(key2, 1);				
			}
			if (bullet.y < 0) {
				bullet.y = 0;
				bullet.edge = "top";
				this.afterlife.push(bullet);
				this.flying.splice(key2, 1);			
			}
			*/
			if (bullet.x > canvas.width || bullet.y > canvas.height || bullet.x < 0 || bullet.y < 0) {
				bullet.x = 0;
				bullet.yy = Math.random();
				bullet.y = canvas.height * (0.4 + 0.2 * bullet.yy);
				// LifeSpan override
				//bullet.lifeSpan = 10 * Math.pow(Math.sin(2*Math.PI*bullet.yy), 2);
				bullet.lifeSpan = 10/2 * (1 - Math.cos(2*Math.PI*bullet.yy / 0.5));
				bullet.edge = "left";
				
				this.afterlife.push(bullet);
				this.flying.splice(key2, 1);
				
			}
			
		}
		
		// In afterlife
		for (key3 in this.afterlife) {
			var bullet = this.afterlife[key3];
			bullet.life -= this.afterlifeDecline; // Linear decrease
			
			var tail = this.poneyTail(bullet);
			var par = tail.par;
			var orth = tail.orth;
			
			// Grow
			if (bullet.edge == "top") {
				bullet.y += bullet.growth;
				bullet.y += orth;
				bullet.x += par;
			} else if (bullet.edge == "bottom") {
				bullet.y -= bullet.growth;
				bullet.y -= orth;
				bullet.x -= par;
			} else if (bullet.edge == "left") {
				bullet.x += bullet.growth;
				bullet.x += orth;
				bullet.y += par;
			} else if (bullet.edge == "right") {
				bullet.x -= bullet.growth;
				bullet.x -= orth;
				bullet.y -= par;
			}
			
			// If dead, die.
			if (bullet.life <= 0) {
				this.afterlife.splice(key3, 1);
			}
			
		}
		
	},
	poneyTail: function(bullet) {
		// Shape poneytail
		// Natural oscillators
		var calmDown1 = 5;
		var osc1 = Math.sin(2*Math.PI * bullet.life / (calmDown1 * bullet.afterlifeRandom1));
		var calmDown2 = 10;
		var osc2 = Math.sin(2*Math.PI * bullet.life / (calmDown2 * bullet.afterlifeRandom2));
		var calmDown3 = 5 + 7.5 * bullet.yy;
		var osc3 = Math.sin(2*Math.PI * bullet.life / (calmDown3));
		
		// Exponents
		var exponent = bullet.yy + 0.5; // Linear
		
		// Option 3
		var T = 3 * (1 + 8 * (bullet.yy - 0.5)*(bullet.yy - 0.5));
		var t = bullet.lifeSpan - bullet.life;
		var h = 0.5 * (- Math.cos(2*Math.PI*t/T));// Integral of sine function (because we sum up)
		
		var result = {
			// Orthogonal motion
			orth: 0,
			// Parallel motion
			//par: 0.2 * Math.pow(t, exponent)
			par: (bullet.yy < 0.5 ? -h : h)
		}
		
		return result;
	},
	drawBullets: function(ctx) {
		/*ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "rgba(0,0,0,0.002)";
		ctx.fill();*/
		
		// In around
		for (key in this.around) {
			//var x = this.bigCenterX + this.around[key].r * Math.cos(this.around[key].ang);
			//var y = this.bigCenterY + this.around[key].r * Math.sin(this.around[key].ang);
			//var xLast = this.bigCenterX + this.around[key].rLast * Math.cos(this.around[key].angLast);
			//var yLast = this.bigCenterY + this.around[key].rLast * Math.sin(this.around[key].angLast);
			var XYR = this.deform(this.around[key]);
			var xLast = XYR.xLast;
			var yLast = XYR.yLast;
			var x = XYR.x;
			var y = XYR.y;
			var expander = Math.sqrt(this.around[key].r/30);
			var opa = this.minOpacity * expander;
			var rgb = this.around[key].rgb;
			ctx.strokeStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opa + ")";
			ctx.lineWidth = this.minThickness * expander;
			ctx.beginPath();
			ctx.moveTo(xLast,yLast);
			ctx.lineTo(x,y);
			ctx.stroke();
		}
		
		// In flying
		/*for (key2 in this.flying) {
			var expander = Math.sqrt(this.flying[key2].r/30);
			var opa = this.minOpacityBackground * expander * this.expressiveness;
			var rgb = this.flying[key2].rgb;
			
			ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opa + ")";
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.arc(this.flying[key2].x, this.flying[key2].y, this.flying[key2].thickness, 0, 2*Math.PI, true);
			ctx.fill();
		}*/
		
		// In afterlife
		for (key3 in this.afterlife) {
			var bullet = this.afterlife[key3];
			var opa = this.afterlifeOpacity * bullet.life;
			//var thick = bullet.lifeSpan/2;
			var thick = 2 * bullet.life/10;
			var rgb = bullet.rgb;
			
			ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opa + ")";
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.arc(bullet.x, bullet.y, thick, 0, 2*Math.PI, true);
			ctx.fill();
		}
		
	},
	deform: function(bullet) {
		var r = bullet.r;
		var rLast = bullet.rLast;
		
		// Operations on radii
		//rLast = r * 0.99;
		
		var x = this.bigCenterX + r * Math.cos(bullet.ang);
		var y = this.bigCenterY + r * Math.sin(bullet.ang);
		var xLast = this.bigCenterX + rLast * Math.cos(bullet.angLast);
		var yLast = this.bigCenterY + rLast * Math.sin(bullet.angLast);
		
		return { 
			xLast: xLast, 
			yLast: yLast, 
			x: x, 
			y: y
		};
	},
	feed: function(howMany) {
		// Add bullets to around array
		for (var i = 0; i < howMany; i++) {
			this.addBullet("anticlockwise");
		}
	},
	detach: function(howMany) {
		// Moves bullets from around array to flying array
		// Gives them a bunch of new properties
		var targetDist = 10;// Not used
		for (var i = 0; i < howMany; i++) {
			var newFlyer = this.around.shift();
			
			newFlyer.x = this.bigCenterX + newFlyer.r * Math.cos(newFlyer.ang);
			newFlyer.y = this.bigCenterY + newFlyer.r * Math.sin(newFlyer.ang);
			newFlyer.xLast = newFlyer.x;
			newFlyer.yLast = newFlyer.y;
			newFlyer.xTarget = this.bigCenterX + targetDist * newFlyer.r * Math.cos(newFlyer.ang);// Not used
			newFlyer.yTarget = this.bigCenterY + targetDist * newFlyer.r * Math.sin(newFlyer.ang);// Not used
			newFlyer.thickness = 1;
			newFlyer.lifeSpan =  10 * Math.random() ;// How long the afterlife will be (not used in flying phase)
			newFlyer.life =  newFlyer.lifeSpan;// Remaining life (not used in flying phase)
			newFlyer.growth = 0.5;// Growth speed in the afterlife (not used in flying phase)
			newFlyer.afterlifeRandom1 = Math.random();// Random parameter for growing (not used in flying phase)
			newFlyer.afterlifeRandom2 = Math.random();// Random parameter for growing (not used in flying phase)
			
			this.flying.push(newFlyer);
		}
	},
});
ARTGEN.addBrush('splash', {

    init: function(c){

        //context
        this.ctx = c;
        //include enable/disable method
        this._enabled = false;

        //general settings
        this._settings = _.extend({
            COLOR: "rgba(52, 152, 219,0.1)",
        }, (this._settings || {}) );

        this.particles = [];

        this.delta = 0;
        this.last = Date.now();

        //Positions
        this.positionX;
        this.positionY;
    },

    start: function(x, y){
        this.positionX = x;
        this.positionY = y;
    },

    setTarget: function(x, y){
        this.positionX = x;
        this.positionY = y;
    },

    enable: function() {
        this._enabled = true;
        this._settings.COLOR = this.color;
    },
    disble: function() {
        this._enabled = false;
        this._settings.COLOR = "rgba(52, 152, 219, 0)" ;
    },

    setColor: function(color) {
        this.color = color;
        if (this._enabled) this._settings.COLOR = color;
    },

    update: function(){
       for (var i = 0; i < _.random(30,100); i++){
            this.particles.push({
                x: this.positionX,
                y: this.positionY + margin,
                angle: i * 5,
                size: 5 + Math.random() * 3,
                life: 200 + Math.random() * 50
            });
        }
       
        this.delta = Date.now() - this.last;
        this.last = Date.now();
        for (var i = 0; i < this.particles.length; i++)
        {
            var p = this.particles[i];
            p.x += Math.cos(p.angle) * 4 + Math.random() * 2 - Math.random() * 2;
            p.y += Math.sin(p.angle) * 4 + Math.random() * 2 - Math.random() * 2;
            p.life -= this.delta;
            p.size -= this.delta / 50;
            
            if (p.size <= 0)
            {
                p.life = 0;
            }
            
            if (p.life <= 0)
            {
                this.particles.splice(i--, 1);
                continue;
            }
        }
    },

    draw: function(){
        this.ctx.fillStyle = this._settings.COLOR;    
        
        for (var i = 0; i < this.particles.length; i++)
        {
            if (Math.random() < 0.1)
            {
                continue;
            }
            var p = this.particles[i];
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
            this.ctx.fill();
        }
    },

});
ARTGEN.addBrush('spray', 'flock', {

	//general settings
        _settings: {
            BOIDS: 50,
            BOID_STYLE: 1,
            LINE_WIDTH: 10,                       
        }

});
ARTGEN.addBrush('spray_new', {

    init: function(c){

        //context
        this.ctx = c;
        //include enable/disable method
        this._enabled = false;

        //general settings
        this._settings = _.extend({
            COLOR: "rgba(52, 152, 219,0.1)",
        }, (this._settings || {}) );

        //Positions
        this.positionX;
        this.positionY;
        this.density = 50;
        this.radius = 10;
    },

    start: function(x, y){
        this.positionX = x;
        this.positionY = y;
    },

    setTarget: function(x, y){
        this.positionX = x;
        this.positionY = y;
    },

    enable: function() {
        this._enabled = true;
        this._settings.COLOR = this.color;
    },

    disable: function() {
        this._enabled = false;
        this._settings.COLOR = "rgba(255,255,255,0)";
    },

    setColor: function(color) {
        this.color = color;
        if (this._enabled) this._settings.COLOR = color;
    },

    update: function(){
        this.ctx.moveTo(this.positionX, this.positionY);   

    },

    draw: function(){
        this.ctx.lineWidth = 50;
        this.ctx.lineJoin = this.ctx.lineCap = 'round';
        this.ctx.fillStyle= this.color;
        for (var i = this.density; i--; ) {
          var offsetX = Math.floor(Math.random() * (2*this.radius + 1)) -this.radius
          var offsetY = Math.floor(Math.random() * (2*this.radius + 1)) -this.radius
          this.ctx.fillRect(this.positionX + offsetX, this.positionY + offsetY, 1, 1);
        }
    },

});

ARTGEN.addBrush('stellar', {
    init: function() {
	
        this.explosionRadius = 15;
        
		this.superColor = "rgba(200,235,255,0.02)";
		
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 1;
		this.speakingCountMax = 2;
		
		this.repulsion = 0;
		this.minRep = 0;
		this.maxRep = 50;
		this.maxRepScale = 50;//px
		this.acceleration = 5;
		this.accelerationSmooth = 100000;
		this.minAcc = -10;
		this.maxAcc = 10;
		this.minAngSpeed = -10;
		this.maxAngSpeed = 10;
		
		this.expCounter = 0;
		this.expressivenessVar = 5000;
		this.expressiveness = 0;
		
		this.around = [];
		this.flying = [];
		this.bigRadius = null;
		this.bigCenterX = null;
		this.bigCenterY = null;
		
    },
    update: function(canvas, ctx, data) {
		if (typeof data == "undefined") {
			return;
		}
		//if (data == 0) {
		if (data[0] == 0) {
			this.silenceCounter++;
		//} else if (data == 1) {
		} else if (data[0] == 1) {
			this.speakingCounter++;
		}
		else{}
		
		if (this.silenceCounter >= this.silenceCountMax) {
			/*this.acceleration--;
			if(this.acceleration <= this.minAcc) {
				this.acceleration = this.minAcc;
			}
			this.silenceCounter = 0;*/
			this.repulsion--;
			if(this.repulsion <= this.minRep) {
				this.repulsion = this.minRep;
			}
			this.silenceCounter = 0;
			
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			/*this.acceleration++;
			if(this.acceleration >= this.maxAcc) {
				this.acceleration = this.maxAcc;
			}
			this.speakingCounter = 0;*/
			this.repulsion++;
			if(this.repulsion >= this.maxRep) {
				this.repulsion = this.maxRep;
			}
			this.speakingCounter = 0;
		}
		
		this.simulateExpressiveness(data);
		this.naturalAccelerationDecrease();
		this.naturalRepulsionDecrease();
		var howMany = Math.floor(Math.random()*(1+1*this.expressiveness));
		//howMany = 1;
		this.feed(howMany);
		this.detach(howMany);
		this.moveBullets(canvas);
    },
    draw: function(ctx) {
        this.drawBullets(ctx);
    },
    start: function(ctx, canvas) {
		this.bigRadius = 0.45 * Math.min(canvas.height, canvas.width);
		this.bigCenterX = canvas.width/2;
		this.bigCenterY = canvas.height/2;
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fill();
		
		this.feed(50);
    },
	simulateExpressiveness: function(data) {
		this.expCounter++;
		//this.expressiveness = 0.5 + 0.5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
		this.expressiveness=parseFloat(data[1]);
	},
	naturalAccelerationDecrease: function(){
		this.acceleration -= 0.01;
		if (this.acceleration <= 0) {
			this.acceleration = 0;
		}
	},
	naturalRepulsionDecrease: function(){
		this.repulsion -= 1-0.95;
		if (this.repulsion <= this.minRep) {
			this.repulsion = this.minRep;
		}
	},
	addBullet: function(way) {
		var rad = this.bigRadius + 10*Math.random();
		var angle = 2*Math.PI*Math.random();
		this.around.push({
			r: rad,
			rLast: rad,
			ang: angle,
			angLast: angle,
			angSpeed: 0.005,
			way: way
		});
	},
	moveBullets: function(canvas) {
		// In around
		for (key in this.around) {
			// Whay way will motion happen?
			if (this.around[key].way == "clockwise") {
				var multip = -1;
			} else if (this.around[key].way == "anticlockwise") {
				var multip = 1;
			}
			else { console.log('No way'); }
			
			// New angle speed
			var oldAngSpeed = this.around[key].angSpeed;
			this.around[key].angSpeed = oldAngSpeed + (multip * this.acceleration / this.accelerationSmooth);
			// Well, careful
			this.around[key].angSpeed = Math.min(Math.max(this.around[key].angSpeed, this.minAngSpeed), this.maxAngSpeed);
			// New angle
			this.around[key].angLast = this.around[key].ang;
			this.around[key].ang += this.around[key].angSpeed;
			
			// New radius with repulsion
			// Memorize last r (if you don't, the brush becomes 'vortex'
			this.around[key].rLast = this.around[key].r;
			this.around[key].r += (2*Math.random()-1) * (this.maxRepScale * (this.repulsion-this.minRep)/(this.maxRep-this.minRep));
		}
		/*
		// In flying
		for (key2 in this.flying) {
			//keep the bullet within the canvas
			if (this.around[key].x > canvas.width) {
				this.around[key].x = canvas.width;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);
			}
			if (this.around[key].y > canvas.height) {
				this.around[key].y = canvas.height;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);				
			}
			if (this.around[key].x < 0) {
				this.around[key].x = 0;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);				
			}
			if (this.around[key].y < 0) {
				this.around[key].y = 0;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);			
			}
		}
		*/
	},
	drawBullets: function(ctx) {
		/*ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "rgba(0,0,0,0.002)";
		ctx.fill();*/
		ctx.strokeStyle = this.superColor;
		ctx.lineWidth = 2;
		for (key in this.around) {
			var x = this.bigCenterX + this.around[key].r * Math.cos(this.around[key].ang);
			var y = this.bigCenterY + this.around[key].r * Math.sin(this.around[key].ang);
			var xLast = this.bigCenterX + this.around[key].rLast * Math.cos(this.around[key].angLast);
			var yLast = this.bigCenterY + this.around[key].rLast * Math.sin(this.around[key].angLast);
			ctx.beginPath();
			ctx.moveTo(xLast,yLast);
			ctx.lineTo(x,y);
			ctx.stroke();
		}
		/*
		for (key2 in this.flying) {
			ctx.beginPath();
			ctx.moveTo(this.bullets[key].xLast,this.bullets[key].yLast);
			ctx.lineTo(this.bullets[key].x,this.bullets[key].y);
			ctx.strokeStyle = this.superColor;
			ctx.lineWidth = 3;
			ctx.stroke();
		}
		*/
	},
	feed: function(howMany){
		// Add bullets to around array
		for (var i = 0; i < howMany; i++) {
			this.addBullet("clockwise");
		}
	},
	detach: function(howMany) {
		// Moves bullets from around array to flying array
		// Gives them a bunch of new properties
		for (var i = 0; i < howMany; i++) {
			var newFlyer = this.around.shift();
		/*
			newFlyer.x = 
			newFlyer.y = 
			newFlyer.xLast = 
			newFlyer.yLast = 
			newFlyer.xTarget = 
			newFlyer.yTarget = 
			newFlyer.mass = 
		*/
			this.flying.push(newFlyer);
		}
	},
});
ARTGEN.addBrush('sunburst', {
    init: function() {
		
		this.generation1 = 25;
		
		this.minThickness = 1;
		this.minOpacity = 0.01;
		this.around = [];
		this.flying = [];
		this.bigRadius = null;
		this.bigCenterX = null;
		this.bigCenterY = null;
		
		/** Delayers **/
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 1;
		this.speakingCountMax = 3;
		
		/** Angle **/
		this.angAcc = 0;
		this.minAngAcc = -20;
		this.maxAngAcc = 20;
		this.angAccSmooth = 10000;
		this.initAngSpeed = 0.007;
		this.minAngSpeed = 0.001;
		this.maxAngSpeed = 0.007;
		this.angSpeedNaturalDecrease = 0.001;// Additive, 0.01 is huge
		
		/** Radius **/
		this.repulsion = 0;
		this.minRep = 0;
		this.maxRep = 50;
		this.maxRepScale = 30;//px
		this.minRspeed = -3;
		this.maxRspeed = 3;
		this.rSpeedNaturalDecrease = 0.3;// Multiplicator Should remain [0,1] 0.3 is very very high
		
		/** Simulated expressiveness **/
		this.expCounter = 0;
		this.expressivenessVar = 500;
		this.expressiveness = 0.5;

    },
    update: function(canvas, ctx, data) {
		if (typeof data == "undefined") {
			return;
		}
		if (data[0] == 0) {
		//if (data == 0) {
			this.silenceCounter++;
		} else if (data[0] == 1) {
		//} else if (data == 1) {
			this.speakingCounter++;
		} else {}
		

		if (this.silenceCounter >= this.silenceCountMax) {
			this.angAcc--;
			this.repulsion--;
			if(this.angAcc <= this.minAngAcc) {
				this.angAcc = this.minAngAcc;
			}
			if(this.repulsion <= this.minRep) {
				this.repulsion = this.minRep;
			}
			this.silenceCounter = 0;
			
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			this.angAcc++;
			this.repulsion++;
			if(this.angAcc >= this.maxAngAcc) {
				this.angAcc = this.maxAngAcc;
			}
			if(this.repulsion >= this.maxRep) {
				this.repulsion = this.maxRep;
			}
			this.speakingCounter = 0;
		}
		
		this.simulateExpressiveness(data);
		this.naturalRepulsionDecrease();
		//var howMany = Math.floor(Math.random()*(1+1*this.expressiveness));// 1 in ?
		var howMany = Math.floor(Math.random()*(1+0.08));// 1 in ?
		this.feed(howMany);
		this.detach(howMany);
		this.moveBullets(canvas);
    },
    draw: function(ctx) {
        this.drawBullets(ctx);
    },
    start: function(ctx, canvas) {
		this.bigRadius = 0.45 * Math.min(canvas.height, canvas.width);
		this.bigCenterX = canvas.width/2;
		this.bigCenterY = canvas.height/2;
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fill();
		
		this.feed(this.generation1);
    },
	simulateExpressiveness: function(data) {
		this.expCounter++;
		// Full range
		//this.expressiveness = 0.5 + 0.5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
		
		// Low values
		//this.expressiveness = 0.2 + 0.2*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
		
		// Highvalues with sunburst effect
		//this.expressiveness = 0.8 + 0.2*1/5*Math.floor(5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI));
		
		// Full range with sunburst effect
		
		//this.expressiveness = 0.5 + 0.5*1/3*Math.floor(3*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI));
		this.expressiveness=parseFloat(data[1]);

	},
	naturalRepulsionDecrease: function(){
		this.repulsion -= 1-0.95;
		if (this.repulsion <= this.minRep) {
			this.repulsion = this.minRep;
		}
	},
	addBullet: function(way) {
		var rad = this.bigRadius * (0.35 + 0.65 * this.expressiveness);
		var angle = 2*Math.PI*Math.random();
		this.around.push({
			r: rad,
			rLast: rad,
			rSpeed: 0,
			ang: angle,
			angLast: angle,
			angSpeed: this.initAngSpeed,
			way: way
		});
	},
	moveBullets: function(canvas) {
		// In around
		for (key in this.around) {
			// Whay way will motion happen?
			if (this.around[key].way == "clockwise") {
				var multip = -1;
			} else if (this.around[key].way == "anticlockwise") {
				var multip = 1;
			}
			else { console.log('No way'); }
			
			/** Angle **/
			// New angle speed
			var oldAngSpeed = this.around[key].angSpeed;
			this.around[key].angSpeed = oldAngSpeed + (multip * this.angAcc / this.angAccSmooth);
			// Natural decrease (additive)
			this.around[key].angSpeed -= this.angSpeedNaturalDecrease;
			// Well, careful
			this.around[key].angSpeed = Math.min(Math.max(this.around[key].angSpeed, this.minAngSpeed), this.maxAngSpeed);
			// New angle
			this.around[key].angLast = this.around[key].ang;
			this.around[key].ang += this.around[key].angSpeed;
			
			/** Radius **/
			// New radius with repulsion
			// Memorize last r (if you don't, the brush becomes 'vortex')
			//this.around[key].rLast = this.around[key].r;
			this.around[key].rSpeed += (2*Math.random()-1) * (this.maxRepScale * (this.repulsion-this.minRep)/(this.maxRep-this.minRep));
			// Natural decrease (multiplicative)
			this.around[key].rSpeed *= (1 - this.rSpeedNaturalDecrease);
			// Careful!
			this.around[key].rSpeed = Math.min(Math.max(this.around[key].rSpeed, this.minRspeed), this.maxRspeed);
			
			this.around[key].r += this.around[key].rSpeed;
		}
		/*
		// In flying
		for (key2 in this.flying) {
			//keep the bullet within the canvas
			if (this.around[key].x > canvas.width) {
				this.around[key].x = canvas.width;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);
			}
			if (this.around[key].y > canvas.height) {
				this.around[key].y = canvas.height;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);				
			}
			if (this.around[key].x < 0) {
				this.around[key].x = 0;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);				
			}
			if (this.around[key].y < 0) {
				this.around[key].y = 0;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);			
			}
		}
		*/
	},
	drawBullets: function(ctx) {
		/*ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "rgba(0,0,0,0.002)";
		ctx.fill();*/
		
		for (key in this.around) {
			var x = this.bigCenterX + this.around[key].r * Math.cos(this.around[key].ang);
			var y = this.bigCenterY + this.around[key].r * Math.sin(this.around[key].ang);
			var xLast = this.bigCenterX + this.around[key].rLast * Math.cos(this.around[key].angLast);
			var yLast = this.bigCenterY + this.around[key].rLast * Math.sin(this.around[key].angLast);
			var expander = Math.sqrt(this.around[key].r/30);
			var opa = this.minOpacity * expander;
			ctx.strokeStyle = "rgba(255,255,255,"+opa+")";
			ctx.lineWidth = this.minThickness * expander;
			ctx.beginPath();
			ctx.moveTo(xLast,yLast);
			ctx.lineTo(x,y);
			ctx.stroke();
		}
		/*
		for (key2 in this.flying) {
			ctx.beginPath();
			ctx.moveTo(this.bullets[key].xLast,this.bullets[key].yLast);
			ctx.lineTo(this.bullets[key].x,this.bullets[key].y);
			ctx.strokeStyle = this.superColor;
			ctx.lineWidth = 3;
			ctx.stroke();
		}
		*/
	},
	feed: function(howMany){
		// Add bullets to around array
		for (var i = 0; i < howMany; i++) {
			this.addBullet("anticlockwise");
		}
	},
	detach: function(howMany) {
		// Moves bullets from around array to flying array
		// Gives them a bunch of new properties
		for (var i = 0; i < howMany; i++) {
			var newFlyer = this.around.shift();
		/*
			newFlyer.x = 
			newFlyer.y = 
			newFlyer.xLast = 
			newFlyer.yLast = 
			newFlyer.xTarget = 
			newFlyer.yTarget = 
			newFlyer.mass = 
		*/
			this.flying.push(newFlyer);
		}
	},
});
ARTGEN.addBrush('thin_marker', {

    init: function(c){

        //context
        this.ctx = c;
        //include enable/disable method
        this._enabled = false;

        //general settings
        this._settings = _.extend({
            COLOR: "rgba(52, 152, 219,0.1)",
        }, (this._settings || {}) );

        //Positions
        this.positionX;
        this.positionY;
        this.points = [ ];
        this.midX;
        this.midY;
        this.p1;
        this.p2;

    },

    start: function(x, y){
        this.positionX = x;
        this.positionY = y;
    },

    setTarget: function(x, y){
        this.positionX = x;
        this.positionY = y;
    },

    enable: function() {
        this._enabled = true;
        this._settings.COLOR = this.color;
    },

    disable: function() {
        this._enabled = false;
        this._settings.COLOR = "rgba(255,255,255,0)";
    },

    setColor: function(color) {
        this.color = color;
        if (this._enabled) this._settings.COLOR = color;
    },

    update: function(){
        this.points.push({ 
            x: this.positionX,
            y: this.positionY,
        });

    },

    draw: function(){
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.strokeStyle = this.color;
        this.p1 = this.points[0];
        this.p2 = this.points[1];
        this.ctx.lineWidth=5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.p1.x, this.p1.y);

        for (var i = 1, len = this.points.length; i < len; i++) {
            // we pick the point between pi+1 & pi+2 as the
            // end point and p1 as our control point
            this.midX=this.p1.x + (this.p2.x - this.p1.x) / 2
            this.midY=this.p1.y + (this.p2.y - this.p1.y) / 2
            this.ctx.quadraticCurveTo(this.p1.x, this.p1.y, this.midX, this.midY);
            this.p1 = this.points[i];
            this.p2 = this.points[i+1];
        }
        // Draw last line as a straight line while
        // we wait for the next point to be able to calculate
        // the bezier control point
        this.ctx.lineTo(this.p1.x, this.p1.y);
        this.ctx.stroke();
    },

});
ARTGEN.addBrush('thunderbolt', {
    init: function() {
		
		this.generation1perBolt = 20;// Times the number of beams in bolts[]
		this.boltsNb = 10;
		this.beamOpacity = 0.05;
		this.fallingParticlesOpacity = 0.025;
		this.birthRate = 2.0;
		this.deathRateBasis = 1.6;
		this.spokenRateToDeathRate = 0.1;
		this.energyToPositronRadiusRate = 5;// Max rad will be 5
		this.inverseOfStickiness = 0.02;
		this.minAngleDeg = -90;
		this.maxAngleDeg = 90;
		
		this.bolts = [];// Will contain arrays
		this.falling = [];// Will contain arrays
		this.boltsNb;
		
		/** Delayers **/
		// Only for spoken rate
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 1;
		this.speakingCountMax = 3;
		// Required for expressiveness and energy as well if real data
		
		/** spokenRate **/
		this.spokenRate = 0;
		this.minSpokenRate = 0;
		this.maxSpokenRate = 50;
		
		/** Expressiveness **/
		this.expressiveness = 0.5;
		this.expCounter = 0;
		this.expressivenessVar = 500;
		
		/** Energy **/
		this.energy = .5;
		this.energyCounter = 0;
		this.energyVar = 500;
		
		/** Positrons **/
		this.positrons = [];
		
		this.splitThisBolt = 0;

    },
    update: function(canvas, ctx, data, color) {


    	this.expressiveness = data[0]/100; //getting 0 to 100
    	this.energy = data[1]/100; //getting 0 to 100
    	this.silence = data[2]; //value in ms

		// Plugged on channel 4 with silence data, 0 or 1
		// if (typeof data == "undefined" || data[0] == null || data == null) {
		// 	return;
		// }

		if (this.silence > 0) { this.silenceCounter++; }
		else if (this.silence == 0) { this.speakingCounter++; }
		
		if (this.silenceCounter >= this.silenceCountMax) {
			this.silenceCounter = 0;
			this.spokenRate--;
			if (this.spokenRate <= this.minSpokenRate) { this.spokenRate = this.minSpokenRate; }
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			this.speakingCounter = 0;
			this.spokenRate++;
			if (this.spokenRate >= this.maxSpokenRate) { this.spokenRate = this.maxSpokenRate; }
		}
		
		//if (this.expBuffer.length >= this.expBufferSize) { this.expBuffer.shift(); }
		//this.expBuffer.push(parseFloat(data[1]));
		// this.simulateExpressiveness();
		// this.simulateEnergy();
		//this.expBuffer.push(this.expressiveness);
		
		var births = Math.floor(Math.random()*(1 + this.birthRate));// 1 in ?
		var deaths = Math.floor(Math.random()*(1 + this.deathRateBasis + this.spokenRate * this.spokenRateToDeathRate));// 1 in ?
		
		// Life! :D
		this.feed(births);
		
		// Kill particles only if there are some left...
		if (this.bolts[0].length > deaths) { this.detach(deaths); }
		if (this.spokenRate >= this.maxSpokenRate / 3) {
			// Detach early (1/3) otherwise too few particles in bolts afterwards
			this.splitBolt(this.splitThisBolt);
			this.splitThisBolt++;
			this.splitThisBolt %= this.boltsNb;
			// Back to 0
			this.spokenRate = this.minSpokenRate;
		}
		
		this.movePositrons(canvas);
		this.moveElectrons(canvas); 
    },
    draw: function(ctx, color) {

    	this.color = color;
        this.drawElectrons(ctx, color);
    },
    start: function(ctx, canvas, extraArgs) {
		// For the brush thunderbolt, extraArgs == [{Number}, {Number}, {String}]
		// ctx.rect(0, 0, canvas.width, canvas.height);
		// ctx.fillStyle = "black";
		// ctx.fill();
		
		var xStart = extraArgs[0] * canvas.width;
		var yStart = extraArgs[1] * canvas.height;
		var way = extraArgs[2];

		this.maxX = canvas.width;
		this.maxY = canvas.height;
		
		for (var i = 0; i < this.boltsNb; i++) {
			this.bolts.push([]);
			this.falling.push([]);
			this.positrons.push({
				x: xStart,
				y: yStart,
				xSpeed: null,
				ySpeed: null,
				speed: 0.5,
				r: 5,
				way: way,
				angleOffset: 0
			});
		}
		
		this.feed(this.generation1perBolt);
    },
	// simulateExpressiveness: function() {
	// 	this.expCounter++;
	// 	this.expressiveness = 0.5 + 0.4 * Math.sin(2*Math.PI*this.expCounter/this.expressivenessVar) * Math.sin(55/67*Math.PI*this.expCounter/this.expressivenessVar);
		
	// },
	// simulateEnergy: function() {
	// 	this.energyCounter++;
	// 	this.energy = 0.5 + 0.4 * Math.sin(2*Math.PI*this.energyCounter/this.energyVar) * Math.cos(2/8.5*Math.PI*this.energyCounter/this.energyVar);
	// },
	addElectron: function(boltKey, x, y, xSpeed, ySpeed) {
		this.bolts[boltKey].push({
			x: x,
			xLast: x,
			y: y,
			yLast: y,
			xSpeed: xSpeed,
			ySpeed: ySpeed,
			yDist: 0
		});
	},
	movePositrons: function(canvas) {
		for (var key1 = 0; key1 < this.positrons.length; key1++) {
			var positron = this.positrons[key1];
			// Angle in desired range. If expressiveness remains around 0.5, the bolt with hore an horizontal overall motion
			// var positronSpeedAng = 2*Math.PI/360 * ( this.minAngleDeg + (this.maxAngleDeg - this.minAngleDeg) * this.expressiveness ) + positron.angleOffset;

			//TODO: Understand Why these angles
			var positronSpeedAng = 2*Math.PI/360 * ( 60 + this.minAngleDeg + (this.maxAngleDeg - this.minAngleDeg) * this.expressiveness ) + positron.angleOffset;
			
			// Left or right? Can be improved, using directly angle launch from painter parameter
			positronSpeedAng += (positron.way == "right" ? 0 : Math.PI);
			
			positron.xSpeed = positron.speed * Math.cos(positronSpeedAng); 
			positron.ySpeed = positron.speed * Math.sin(positronSpeedAng); 
			positron.x += positron.xSpeed;
			positron.y += positron.ySpeed;

			//TODO: Check if this makes sense
			positron.x = (positron.x > this.maxX || positron.x < 0) ? positron.x % this.maxX : positron.x;
			positron.y = (positron.y > this.maxY || positron.y < 0) ? positron.y % this.maxY : positron.y;

			positron.r = this.energyToPositronRadiusRate * this.energy;
		}
	},
	moveElectrons: function(canvas) {
	
		// In bolts
		for (boltKey in this.bolts) {
			var positron = this.positrons[boltKey];
			for (key in this.bolts[boltKey]) {
				var electron = this.bolts[boltKey][key];
				electron.xLast = electron.x;
				electron.yLast = electron.y;
				var distToPositronCenter = Math.sqrt(Math.pow(electron.x - positron.x, 2) + Math.pow(electron.y - positron.y, 2));
				// Spread the bolts electrons in the whole positron radius effect
				electron.xSpeed = positron.xSpeed; //+ 0.01 * Math.random() * Math.max(this.positronRad - distToPositronCenter, 0);
				electron.ySpeed = positron.ySpeed; //+ 0.01 * Math.random() * Math.max(this.positronRad - distToPositronCenter, 0);
				electron.x += electron.xSpeed;
				electron.y += electron.ySpeed;
				var newDistToPositronCenter = Math.sqrt(Math.pow(electron.x - positron.x, 2) + Math.pow(electron.y - positron.y, 2));
				var toReduceBy = newDistToPositronCenter / positron.r;
				electron.x  = positron.x + (electron.x - positron.x)/toReduceBy;
				electron.y  = positron.y + (electron.y - positron.y)/toReduceBy;
				// Don't forget last positions, otherwise ugly lines
				electron.xLast  = positron.x + (electron.xLast - positron.x)/toReduceBy;
				electron.yLast  = positron.y + (electron.yLast - positron.y)/toReduceBy;
				
			}
		}
		
		// In falling
		for (key2 in this.falling) {
			var positron = this.positrons[key2];
			for (key3 in this.falling[key2]) {
				var electron = this.falling[key2][key3];
				
				electron.xLast = electron.x;
				electron.yLast = electron.y;
				
				// Extra force so that the still follow the shape of the main beam
				//var attractor = (electron.y > this.positronY ? electron.y - this.positronY : 0);
				var attractor = (electron.y - positron.y) / 100;
				//electron.ySpeed += this.positronSpeedY / 10;
				
				// "Gravity"
				electron.ySpeed += this.inverseOfStickiness * attractor;
				
				// Motion
				electron.xSpeed = positron.xSpeed;
				electron.x += electron.xSpeed;
				//electron.y += electron.ySpeed;
				//electron.yDist *= 1 + this.inverseOfStickiness;
				electron.yDist += electron.ySpeed;
				
				electron.y = positron.y + electron.yDist;
				
				// Kill electrons that reach the edges of the canvas
				if (electron.x > canvas.width || electron.y > canvas.height || electron.x < 0 || electron.y < 0) {
					this.falling[key2].splice(key3, 1);
				}
			}
		}
		
	},
	drawElectrons: function(ctx, color) {

		// In bolts
		for (key in this.bolts) {
			for (key2 in this.bolts[key]) {
				var electron = this.bolts[key][key2];
				ctx.strokeStyle = "rgba("+ this.color.join(",") +", " + this.beamOpacity + ")";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(electron.xLast, electron.yLast);
				ctx.lineTo(electron.x, electron.y);
				ctx.stroke();
			}
		}
		
		// In falling
		for (key3 in this.falling) {
			for (key4 in this.falling[key3]) {
				var electron = this.falling[key3][key4];
				ctx.strokeStyle = "rgba("+ this.color.join(",") +", " + this.fallingParticlesOpacity + ")";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(electron.xLast, electron.yLast);
				ctx.lineTo(electron.x, electron.y);
				ctx.stroke();
			}
		}
	},
	feed: function(howMany) {
		for (key in this.bolts) {
			var positron = this.positrons[key];
			for (var i = 0; i < howMany; i++) {
				var angle = 2 * Math.PI * Math.random();
				var r = positron.r;
				// Particles added at the limit of the positron's area (its radius)
				this.addElectron(key, positron.x + r * Math.cos(angle), positron.y + r * Math.sin(angle), positron.xSpeed, positron.ySpeed);
			}
		}
	},
	detach: function(howMany) {
		for (key in this.bolts) {
			for (var i = 0; i < howMany; i++) {
				this.falling[key].push(this.bolts[key].shift());
			}
		}
	},
	splitBolt: function(boltKey) {
		// Preserve symmetry
		var multip = (this.positrons[boltKey].way == "right" ? 1 : -1);
		var tearApartBy = 1/8 * Math.PI * (this.positrons[boltKey].ySpeed > 0 ? multip : -multip);
		this.positrons[boltKey].angleOffset += tearApartBy;
	}
});
ARTGEN.addBrush('thunderboltfailure', {
    init: function() {
		
		this.generation1 = 350;
		this.beamOpacity = 0.1;
		this.fallingParticlesOpacity = 0.05;
		this.birthRate = 2.4;
		this.deathRateBasis = 1.6;
		this.spokenRateToDeathRate = 0.1;
		this.energyToPositronRadiusRate = 10;
		this.inverseOfStickiness = 0.002;
		this.minAngleDeg = -90;
		this.maxAngleDeg = 90;
		
		/** Particle arrays **/
		this.bolts = [];
		this.bolts.push([]);
		this.lightfalls = [];
		this.lightfalls.push([]);
		
		/** Delayers **/
		// Only for spoken rate
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 1;
		this.speakingCountMax = 3;
		// Required for expressiveness and energy as well if real data
		
		/** Spoken rate **/
		this.spokenRate = 25;
		this.minSpokenRate = 0;
		this.maxSpokenRate = 50;
		
		/** Expressiveness **/
		this.expressiveness = 0.5;
		this.expCounter = 0;
		this.expressivenessVar = 500;
		
		/** Energy **/
		this.energy = .5;
		this.energyCounter = 0;
		this.energyVar = 1000;
		
		/** Positrons **/
		this.positrons = [
			{
				x: null,
				y: null,
				xSpeed: null,
				ySpeed: null,
				r: null
			}
		];
		
		this.splitOnce = 1;
    },
    update: function(canvas, ctx, data) {
		
		// Plugged on channel 4 with silence data, 0 or 1
		if (typeof data == "undefined" || data[0] == null || data == null) {
			return;
		}
		if (data[0] == 0) { this.silenceCounter++; }
		else if (data[0] == 1) { this.speakingCounter++; }
		
		if (this.silenceCounter >= this.silenceCountMax) {
			this.silenceCounter = 0;
			this.spokenRate--;
			if (this.spokenRate <= this.minSpokenRate) { this.spokenRate = this.minSpokenRate; }
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			this.speakingCounter = 0;
			this.spokenRate++;
			if (this.spokenRate >= this.maxSpokenRate) { this.spokenRate = this.maxSpokenRate; }
		}
		
		//if (this.expBuffer.length >= this.expBufferSize) { this.expBuffer.shift(); }
		//this.expBuffer.push(parseFloat(data[1]));
		this.simulateExpressiveness();
		this.simulateEnergy();
		//this.expBuffer.push(this.expressiveness);
		
		var births = Math.floor(Math.random()*(1 + this.birthRate));// 1 in ?
		var deaths = Math.floor(Math.random()*(1 + this.deathRateBasis + this.spokenRate * this.spokenRateToDeathRate));// 1 in ?
		
		// Life! :D
		this.feed(births);
		
		// Kill particles only if there are some left...
		if (this.bolts[0].length > deaths) { this.detach(deaths); }
		if (this.spokenRate == this.maxSpokenRate && this.splitOnce == 1) {
			this.splitBolt(0);
			this.splitOnce = 0;
		}
		this.movePositrons(canvas);
		this.moveElectrons(canvas);
		
    },
    draw: function(ctx) {
        this.drawElectrons(ctx);
    },
    start: function(ctx, canvas, extraArgs) {
		// For the brush thunderbolt, extraArgs = [{Number}]
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fill();
		
		this.positrons[0].x = 0;
		this.positrons[0].y = canvas.height * extraArgs[0];
		this.positrons[0].xSpeed = 0;
		this.positrons[0].ySpeed = 0;
		this.positrons[0].speed = 0.5;
		this.positrons[0].r = 5;
		
		this.feed(this.generation1);
    },
	simulateExpressiveness: function() {
		this.expCounter++;
		this.expressiveness = 0.5 + 0.4 * Math.sin(2*Math.PI*this.expCounter/this.expressivenessVar) * Math.sin(55/67*Math.PI*this.expCounter/this.expressivenessVar);
		
	},
	simulateEnergy: function() {
		this.energyCounter++;
		this.energy = 0.5 + 0.4 * Math.sin(2*Math.PI*this.energyCounter/this.energyVar) * Math.cos(2/8.5*Math.PI*this.energyCounter/this.energyVar);
	},
	addElectron: function(boltKey, x, y, xSpeed, ySpeed) {
		this.bolts[boltKey].push({
			x: x,
			xLast: x,
			y: y,
			yLast: y,
			xSpeed: xSpeed,
			ySpeed: ySpeed,
			yDist: 0
		});
	},
	movePositrons: function(canvas) {
		for (var key1 = 0; key1 < this.positrons.length; key1++) {
			var positron = this.positrons[key1];
			var positronSpeedAng = 2*Math.PI/360 * ( this.minAngleDeg + (this.maxAngleDeg - this.minAngleDeg) * this.expressiveness );
			
			positron.xSpeed = positron.speed * Math.cos(positronSpeedAng); 
			positron.ySpeed = positron.speed * Math.sin(positronSpeedAng); 
			positron.x += positron.xSpeed;
			positron.y += positron.ySpeed;
			positron.r = this.energyToPositronRadiusRate * this.energy;
		}
	},
	moveElectrons: function(canvas) {
		
		// In bolts
		for (var boltKey = 0; boltKey < this.bolts.length; boltKey++) {
		
			var bolt = this.bolts[boltKey];
			var positron = this.positrons[boltKey];
			
			for (var key2 = 0; key2 < bolt.length; key2++) {
				var electron = bolt[key2];
				electron.xLast = electron.x;
				electron.yLast = electron.y;
				
				// Spread the air electrons in the whole positron radius effect
				electron.xSpeed = positron.xSpeed;
				electron.ySpeed = positron.ySpeed;
				electron.x += electron.xSpeed;
				electron.y += electron.ySpeed;
				
				// Keep it in the positron's area defined by positron current radius
				var newDistToPositronCenter = Math.sqrt(Math.pow(electron.x - positron.x, 2) + Math.pow(electron.y - positron.y, 2));
				var toReduceBy = newDistToPositronCenter / positron.r;
				electron.x  = positron.x + (electron.x - positron.x)/toReduceBy;
				electron.y  = positron.y + (electron.y - positron.y)/toReduceBy;
				
				// Don't forget last positions, otherwise ugly lines
				electron.xLast  = positron.x + (electron.xLast - positron.x)/toReduceBy;
				electron.yLast  = positron.y + (electron.yLast - positron.y)/toReduceBy;
				
			}
		}
		
		// In lightfalls
		for (var key3 = 0; key3 < this.lightfalls.length; key3++) {
			var self = this;
			(function(key3clo) {
				var positron = self.positrons[key3];
				for (var key4 = 0; key4 < self.lightfalls[key3clo].length; key4++) {
					(function(key4clo) {
						var electron = self.lightfalls[key3clo][key4clo];
						
						electron.xLast = electron.x;
						electron.yLast = electron.y;
						
						// Extra force so that they still follow the shape of the main beam
						var attractor = (electron.y - positron.y) / 100;
						
						// "Gravity", the farther the particle from the beam, the higher the 'repulsion'
						electron.ySpeed += self.inverseOfStickiness * attractor;
						
						// Motion
						electron.xSpeed = positron.xSpeed;
						electron.x += electron.xSpeed;
						
						// Intermediate y coordinate, will always be translated by the positron's y coordinate
						electron.yDist += electron.ySpeed;
						electron.y = positron.y + electron.yDist;
						
						// Kill electrons that reach the edges of the canvas
						if (electron.x > canvas.width || electron.y > canvas.height || electron.x < 0 || electron.y < 0) {
							self.lightfalls[key3clo].splice(key4clo, 1);
						}
					})(key4);
				}
			})(key3);
		}
		
	},
	drawElectrons: function(ctx) {
		// In bolts
		for (var boltKey2 = 0; boltKey2 < this.bolts.length; boltKey2++) {
			var bolt = this.bolts[boltKey2];
			for (var key5 = 0; key5 < bolt.length; key5++) {
				var electron = bolt[key5];
				ctx.strokeStyle = "rgba(255, 255, 255, " + this.beamOpacity + ")";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(electron.xLast, electron.yLast);
				ctx.lineTo(electron.x, electron.y);
				ctx.stroke();
			}
		}
		
		// In lightfalls
		for (var key6 = 0; key6 < this.lightfalls.length; key6++) {
			var fall = this.lightfalls[key6];
			for (var key7 = 0; key7 < fall.length; key7++) {
				var electron = fall[key7];
				ctx.strokeStyle = "rgba(255, 255, 255, " + this.fallingParticlesOpacity + ")";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(electron.xLast, electron.yLast);
				ctx.lineTo(electron.x, electron.y);
				ctx.stroke();
			}
		}
	},
	feed: function(howMany) {
		for (var boltKey3 = 0; boltKey3 < this.bolts.length; boltKey3++) {
			var bolt = this.bolts[boltKey3];
			var positron = this.positrons[boltKey3];
			for (var i = 0; i < howMany; i++) {
				var angle = 2 * Math.PI * Math.random();
				var r = positron.r;
				// Particles added at the limit of the positron's area (its radius)
				this.addElectron(boltKey3, positron.x + r * Math.cos(angle), positron.y + r * Math.sin(angle), positron.xSpeed, positron.ySpeed);
			}
		}
	},
	detach: function(howMany) {
		var self = this;
		for (var i = 0; i < this.bolts.length; i++) {
			(function(iClo) {
				for (var j = 0; j < howMany; j++) {
					self.lightfalls[iClo].push(self.bolts[iClo].shift());
				}
			})(i);
		}
	},
	splitBolt: function(boltKey) {
		
		var positron = this.positrons[boltKey];
		
		// Create new bolt, new fall and new positron
		this.bolts.push([]);
		this.lightfalls.push([]);
		this.positrons.push({
			x: positron.x,
			y: positron.y + 30,
			xSpeed: positron.xSpeed,
			ySpeed: positron.ySpeed,
			r: positron.r
		});
		
		// Fill them with half the content of the boltKey'th bolt and fall
		for (var i = 0; i < Math.floor(this.bolts[boltKey].length / 2); i++) {
			this.bolts[this.bolts.length - 1].push(this.bolts[boltKey].shift());
		}
		for (var j = 0; j < Math.floor(this.lightfalls[boltKey].length / 2); j++) {
			var what = {};
			jQuery.extend(true, what, this.lightfalls[boltKey].shift() );
			console.log(what);
			/*this.lightfalls[this.lightfalls.length - 1].push({
				x: what.x,
				xLast: what.xLast,
				y: what.y,
				yLast: what.yLast,
				xSpeed: what.xSpeed,
				ySpeed: what.ySpeed,
				yDist: what.yDist
			});*/
			this.lightfalls[this.lightfalls.length - 1].push(what);
			console.log(this.lightfalls[this.lightfalls.length - 1][this.lightfalls[this.lightfalls.length - 1].length - 1]);// WTF!?
			//this.lightfalls[boltKey].push( jQuery.extend({}, this.lightfalls[boltKey].shift()) );
		}
	}
});
ARTGEN.addBrush('transient', {
    init: function() {
	
        this.explosionRadius = 15;
        
		this.superColor = "rgba(255,255,255,0.2)";
		
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 10;
		this.speakingCountMax = 10;
		
		this.acceleration = 0;
		this.accelerationSmooth = 1000;
		this.expCounter = 0;
		this.expressivenessVar = 5000;
		this.expressiveness = 0;
		this.around = [];
		this.flying = [];
		this.bigRadius = null;
		this.bigCenterX = null;
		this.bigCenterY = null;
		
    },
    update: function(canvas, ctx, data) {
		if (typeof data == "undefined") {
			return;
		}
		if (data == 0) {
			this.silenceCounter++;
		} else if (data == 1) {
			this.speakingCounter++;
		}
		else{}
		
		if (this.silenceCounter >= this.silenceCountMax) {
			this.acceleration--;
			if(this.acceleration <= 0) {
				this.acceleration = 0;
			}
			this.silenceCounter = 0;
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			this.acceleration++;
			this.speakingCounter = 0;
		}
		
		this.simulateExpressiveness();
		this.naturalAccelerationDecrease();
		this.feed();
		//this.detach();
		this.moveBullets(canvas);
    },
    draw: function(ctx) {
        this.drawBullets(ctx);
    },
    start: function(ctx, canvas) {
		this.bigRadius = 0.45 * Math.min(canvas.height, canvas.width);
		this.bigCenterX = canvas.width/2;
		this.bigCenterY = canvas.height/2;
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fill();
    },
	simulateExpressiveness: function() {
		this.expCounter++;
		this.expressiveness = 0.5 + 0.5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
	},
	naturalAccelerationDecrease: function(){
		this.acceleration -= 0.01;
		if (this.acceleration <= 0) {
			this.acceleration = 0;
		}
	},
	addBullet: function(way) {
		var rad = this.bigRadius + 10*Math.random();
		var angle = 2*Math.PI*Math.random();
		this.around.push({
			r: rad,
			rLast: rad,
			ang: angle,
			angLast: angle,
			angSpeed: 0.01,
			way: way
		});
	},
	moveBullets: function(canvas) {
		// In around
		for (key in this.around) {
			// Whay way will motion happen?
			if (this.around[key].way == "clockwise") {
				var multip = -1;
			} else if (this.around[key].way == "anticlockwise") {
				var multip = 1;
			}
			else { console.log('No way'); }
			
			// New angle speed
			var oldAngSpeed = this.around[key].angSpeed;
			this.around[key].angSpeed = oldAngSpeed + (multip * this.acceleration / this.accelerationSmooth);
			
			// New angle
			this.around[key].angLast = this.around[key].ang;
			this.around[key].ang += this.around[key].angSpeed;
			
		}
		/*
		// In flying
		for (key2 in this.flying) {
			//keep the bullet within the canvas
			if (this.around[key].x > canvas.width) {
				this.around[key].x = canvas.width;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);
			}
			if (this.around[key].y > canvas.height) {
				this.around[key].y = canvas.height;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);				
			}
			if (this.around[key].x < 0) {
				this.around[key].x = 0;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);				
			}
			if (this.around[key].y < 0) {
				this.around[key].y = 0;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);			
			}
		}
		*/
	},
	drawBullets: function(ctx) {
		ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "rgba(0,0,0,0.01)";
		ctx.fill();
		for (key in this.around) {
			var x = this.bigCenterX + this.around[key].r * Math.cos(this.around[key].ang);
			var y = this.bigCenterY + this.around[key].r * Math.sin(this.around[key].ang);
			var xLast = this.bigCenterX + this.around[key].rLast * Math.cos(this.around[key].angLast);
			var yLast = this.bigCenterY + this.around[key].rLast * Math.sin(this.around[key].angLast);
			ctx.beginPath();
			ctx.moveTo(xLast,yLast);
			ctx.lineTo(x,y);
			ctx.strokeStyle = this.superColor;
			ctx.lineWidth = 2;
			ctx.stroke();
		}
		/*
		for (key2 in this.flying) {
			ctx.beginPath();
			ctx.moveTo(this.bullets[key].xLast,this.bullets[key].yLast);
			ctx.lineTo(this.bullets[key].x,this.bullets[key].y);
			ctx.strokeStyle = this.superColor;
			ctx.lineWidth = 3;
			ctx.stroke();
		}
		*/
	},
	feed: function(){
		// Add bullets to around array
		var howMany = Math.floor(1.01*Math.random());
		for (var i = 0; i < howMany; i++) {
			this.addBullet("clockwise");
		}
	},
	detach: function(ctx) {
		// Moves bullets from around array to flying array
		// Gives them a bunch of new properties
		var howMany = Math.floor(10*this.expressiveness);
		for (var i = 0; i < howMany; i++) {
			var newFlyer = this.around.shift();
		/*
			newFlyer.x = 
			newFlyer.y = 
			newFlyer.xLast = 
			newFlyer.yLast = 
			newFlyer.xTarget = 
			newFlyer.yTarget = 
			newFlyer.mass = 
		*/
			this.flying.push(newFlyer);
		}
		this.dying = [];
	},
});
ARTGEN.addBrush('veronoi', {

    init: function(c) {

        //context
        this.ctx = c;
        //include enable/disable method
        this._enabled = false;

        //general settings
        this._settings = _.extend({
            COLOR: "rgba(52, 152, 219,0.1)",
        }, (this._settings || {}));

        //Positions
        this.positionX;
        this.positionY;

        this.voronoi = new Voronoi();
        this.sites = [{
            x: 0,
            y: 0
        }];
        this.bbox = {
            xl: 0,
            xr: this.ctx.canvas.width,
            yt: 0,
            yb: this.ctx.canvas.height
        };

        this.diagram = this.voronoi.compute(this.sites, this.bbox);
        this.target = this.sites[0];
        this.style = 'fill';
    },

    start: function(x, y) {
        this.target.x = x;
        this.target.y = y;
        this.diagram = this.voronoi.compute(this.sites, this.bbox);
    },


    setTarget: function(x, y) {
        this.target.x = x;
        this.target.y = y;
        this.diagram = this.voronoi.compute(this.sites, this.bbox);
    },

    setStyle: function(style) {
        this.style = style;
    },

    enable: function() {
        this._enabled = true;
        this._settings.COLOR = this.color;
    },

    disable: function() {
        this._enabled = false;
        this._settings.COLOR = "rgba(255,255,255,0)";
    },

    setColor: function(color) {
        this.color = color;
        if (this._enabled) this._settings.COLOR = color;
    },

    addRandom: function(number) {
        for (var i = 0; i < number; i++) {
            this.sites.push({
                x: Math.round(Math.random() * this.ctx.canvas.width),
                y: Math.round(Math.random() * this.ctx.canvas.height)
            });
        }
        this.diagram = this.voronoi.compute(this.sites, this.bbox);
    },

    clearAll: function() {
        this.sites = [{
            x: 0,
            y: 0
        }];
        this.target = this.sites[0];
        this.diagram = this.voronoi.compute(this.sites, this.bbox);
    },

    addPoint: function() {
        this.sites.push({
            x: this.target.x+1,
            y: this.target.y+1
        });
        this.diagram = this.voronoi.compute(this.sites, this.bbox);
        this.target = this.sites[0];
    },

    update: function() {
        this.bbox = {
            xl: 0,
            xr: this.ctx.canvas.width,
            yt: 0,
            yb: this.ctx.canvas.height
        };
    },

    draw: function() {

        var cell = this.diagram.cells[this.sites[0].voronoiId];
        if (cell) {
            var halfedges = cell.halfedges,
                nHalfedges = halfedges.length;
            if (nHalfedges > 2) {
                var v = halfedges[0].getStartpoint();
                this.ctx.beginPath();
                this.ctx.moveTo(v.x, v.y);
                for (var iHalfedge = 0; iHalfedge < nHalfedges; iHalfedge++) {
                    v = halfedges[iHalfedge].getEndpoint();
                    this.ctx.lineTo(v.x, v.y);
                }

                if(this.style === 'stroke') {
                    this.ctx.strokeStyle = this._settings.COLOR;
                    this.ctx.stroke();
                } else {
                    this.ctx.fillStyle = this._settings.COLOR;
                    this.ctx.fill();
                }

            }
        }
    },

});
ARTGEN.addBrush('vortex', {
    init: function() {
	
        this.explosionRadius = 15;
        
		this.superColor = "rgba(255,255,255,0.2)";
		
		this.silenceCounter = 0;
		this.speakingCounter = 0;
		this.silenceCountMax = 1;
		this.speakingCountMax = 2;
		
		this.repulsion = 0;
		this.minRep = 0;
		this.maxRep = 50;
		this.maxRepScale = 50;//px
		this.acceleration = 5;
		this.accelerationSmooth = 100000;
		this.minAcc = -10;
		this.maxAcc = 10;
		this.minAngSpeed = -10;
		this.maxAngSpeed = 10;
		
		this.expCounter = 0;
		this.expressivenessVar = 5000;
		this.expressiveness = 0;
		
		this.around = [];
		this.flying = [];
		this.bigRadius = null;
		this.bigCenterX = null;
		this.bigCenterY = null;
		
    },
    update: function(canvas, ctx, data) {
		if (typeof data == "undefined") {
			return;
		}
		if (data == 0) {
			this.silenceCounter++;
		} else if (data == 1) {
			this.speakingCounter++;
		}
		else{}
		
		if (this.silenceCounter >= this.silenceCountMax) {
			/*this.acceleration--;
			if(this.acceleration <= this.minAcc) {
				this.acceleration = this.minAcc;
			}
			this.silenceCounter = 0;*/
			this.repulsion--;
			if(this.repulsion <= this.minRep) {
				this.repulsion = this.minRep;
			}
			this.silenceCounter = 0;
			
		}
		if (this.speakingCounter >= this.speakingCountMax) {
			/*this.acceleration++;
			if(this.acceleration >= this.maxAcc) {
				this.acceleration = this.maxAcc;
			}
			this.speakingCounter = 0;*/
			this.repulsion++;
			if(this.repulsion >= this.maxRep) {
				this.repulsion = this.maxRep;
			}
			this.speakingCounter = 0;
		}
		
		this.simulateExpressiveness();
		this.naturalAccelerationDecrease();
		this.naturalRepulsionDecrease();
		var howMany = Math.floor(Math.random()*(1+1*this.expressiveness));
		//howMany = 1;
		this.feed(howMany);
		this.detach(howMany);
		this.moveBullets(canvas);
    },
    draw: function(ctx) {
        this.drawBullets(ctx);
    },
    start: function(ctx, canvas) {
		this.bigRadius = 0.45 * Math.min(canvas.height, canvas.width);
		this.bigCenterX = canvas.width/2;
		this.bigCenterY = canvas.height/2;
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black";
		ctx.fill();
		
		this.feed(50);
    },
	simulateExpressiveness: function() {
		this.expCounter++;
		this.expressiveness = 0.5 + 0.5*Math.sin(this.expCounter/this.expressivenessVar*2*Math.PI);
	},
	naturalAccelerationDecrease: function(){
		this.acceleration -= 0.01;
		if (this.acceleration <= 0) {
			this.acceleration = 0;
		}
	},
	naturalRepulsionDecrease: function(){
		this.repulsion -= 1-0.95;
		if (this.repulsion <= this.minRep) {
			this.repulsion = this.minRep;
		}
	},
	addBullet: function(way) {
		var rad = this.bigRadius + 10*Math.random();
		var angle = 2*Math.PI*Math.random();
		this.around.push({
			r: rad,
			rLast: rad,
			ang: angle,
			angLast: angle,
			angSpeed: 0.005,
			way: way
		});
	},
	moveBullets: function(canvas) {
		// In around
		for (key in this.around) {
			// Whay way will motion happen?
			if (this.around[key].way == "clockwise") {
				var multip = -1;
			} else if (this.around[key].way == "anticlockwise") {
				var multip = 1;
			}
			else { console.log('No way'); }
			
			// New angle speed
			var oldAngSpeed = this.around[key].angSpeed;
			this.around[key].angSpeed = oldAngSpeed + (multip * this.acceleration / this.accelerationSmooth);
			// Well, careful
			this.around[key].angSpeed = Math.min(Math.max(this.around[key].angSpeed, this.minAngSpeed), this.maxAngSpeed);
			// New angle
			this.around[key].angLast = this.around[key].ang;
			this.around[key].ang += this.around[key].angSpeed;
			
			// New radius with repulsion
			this.around[key].r += (2*Math.random()-1) * (this.maxRepScale * (this.repulsion-this.minRep)/(this.maxRep-this.minRep));
		}
		/*
		// In flying
		for (key2 in this.flying) {
			//keep the bullet within the canvas
			if (this.around[key].x > canvas.width) {
				this.around[key].x = canvas.width;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);
			}
			if (this.around[key].y > canvas.height) {
				this.around[key].y = canvas.height;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);				
			}
			if (this.around[key].x < 0) {
				this.around[key].x = 0;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);				
			}
			if (this.around[key].y < 0) {
				this.around[key].y = 0;
				this.dying.push(this.around[key]);
				this.around.splice(key,1);			
			}
		}
		*/
	},
	drawBullets: function(ctx) {
		ctx.rect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "rgba(0,0,0,0.002)";
		ctx.fill();
		for (key in this.around) {
			var x = this.bigCenterX + this.around[key].r * Math.cos(this.around[key].ang);
			var y = this.bigCenterY + this.around[key].r * Math.sin(this.around[key].ang);
			var xLast = this.bigCenterX + this.around[key].rLast * Math.cos(this.around[key].angLast);
			var yLast = this.bigCenterY + this.around[key].rLast * Math.sin(this.around[key].angLast);
			ctx.beginPath();
			ctx.moveTo(xLast,yLast);
			ctx.lineTo(x,y);
			ctx.strokeStyle = this.superColor;
			ctx.lineWidth = 2;
			ctx.stroke();
		}
		/*
		for (key2 in this.flying) {
			ctx.beginPath();
			ctx.moveTo(this.bullets[key].xLast,this.bullets[key].yLast);
			ctx.lineTo(this.bullets[key].x,this.bullets[key].y);
			ctx.strokeStyle = this.superColor;
			ctx.lineWidth = 3;
			ctx.stroke();
		}
		*/
	},
	feed: function(howMany){
		// Add bullets to around array
		for (var i = 0; i < howMany; i++) {
			this.addBullet("clockwise");
		}
	},
	detach: function(howMany) {
		// Moves bullets from around array to flying array
		// Gives them a bunch of new properties
		for (var i = 0; i < howMany; i++) {
			var newFlyer = this.around.shift();
		/*
			newFlyer.x = 
			newFlyer.y = 
			newFlyer.xLast = 
			newFlyer.yLast = 
			newFlyer.xTarget = 
			newFlyer.yTarget = 
			newFlyer.mass = 
		*/
			this.flying.push(newFlyer);
		}
	},
});
ARTGEN.addPainter('astronaut', {
	brushes: ['stellar'],
	//brushes: ['vortex'],
    paint: function(time, data){
    	var moon = this.getBrush(0);
    	if(!this._instantiated){
    		moon.setColor(randomColor());
    		moon.start(this.ctx,this.canvas);
    		this._instantiated = true;
    	}
    	moon.update(this.canvas,this.ctx,data);
    	moon.draw(this.ctx);
    }
})
//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('circle', {

    /* =============== META INFORMATION ================= */

    title: "Circle",
    description: "The ephemeral nature of speech represented through deformed rings",
    tags: ["energy", "color", "expressiveness"],

    // determine, in order, what the data values are used for
    data_values: [{
        description: "used for the 1st and 3rd brushes",
        options: ["mfcc", "zcr", "rms", "spectralCentroid", "spectralSlope", "spectralSpread", "energy", "spectralRolloff", "spectralKurtosis", "spectralSkewness", "loudness", "perceptualSpread", "perceptualSharpness"]
    }, {
        description: "used for the 2nd and 5th brushes",
        options: ["rms", "zcr", "mfcc", "spectralCentroid", "spectralSlope", "spectralSpread", "energy", "spectralRolloff", "spectralKurtosis", "spectralSkewness", "loudness", "perceptualSpread", "perceptualSharpness"]
    }, {
        description: "used for the 4th brush",
        options: ["energy", "zcr", "rms", "spectralCentroid", "spectralSlope", "spectralSpread", "mfcc", "spectralRolloff", "spectralKurtosis", "spectralSkewness", "loudness", "perceptualSpread", "perceptualSharpness"]
    }],

    //extra visual options
    options: {
        color: {
            name: "Color",
            description: "used for determine the color palette",
            options: ["red", "blue", "purple", "monochromatic", "green", "orange", "gold", "*"]
        }
    },


    /* =============== IMPLEMENTATION ================= */

    brushes: ['flock', 'flock', 'flock', 'flock', 'flock'],

    _calcPos: function(func, time, data, order, radius, reference) {
        func = Math[func];
        return func(time % (2 * Math.PI)) * (radius / 3 + (data * 50 + (order*10) )) + reference;
    },

    paint: function(time, data) {

        if (!this._instantiated) {
            this.first_time = time;
            this.brushes = _.shuffle(this.brushes);
        }

        var flocks = [];
        for (var i = 0; i < this.brushes.length; i++) {
            flocks[i] = this.brushes[i];
        };

        var margin, min_x, max_x, min_y, max_y,
            max_width, max_height, center_x, center_y,
            length, zero_x, zero_y;
        //margins improve quality
        margin = 50;
        min_x = margin;
        max_x = this.canvas.width - margin;
        max_width = max_x - min_x;
        min_y = margin;
        max_y = this.canvas.height - margin;
        max_height = max_y - min_y;
        center_x = this.canvas.width / 2;
        center_y = this.canvas.height / 2,
            length = flocks.length;

        var time_var = (time - this.first_time) / 1000;

        var radius = max_height / 2;
        zero_x = this._calcPos('cos', time_var, 0, 0, radius, center_x);
        zero_y = this._calcPos('sin', time_var, 0, 0, radius, center_y);


        var targets = [];
        for (var i = 0; i < length; i++) {
            var p = new Vector();
            var d = data[i] || 0;
            p.x = this._calcPos('cos', time_var, d, i, radius, center_x);
            p.y = this._calcPos('sin', time_var, d, i, radius, center_y);
            targets.push(p);
        }

        if (!this._instantiated) {
            this.color = "#FFFFFF";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

            function formatColors(rgbArray) {
                var c = [];
                for (var i = 0; i < rgbArray.length; i++) {
                    c.push("rgba(" + rgbArray[i].join(',') + ",0.1)");
                };
                return c;
            }

            this.colors = formatColors(randomColor({
                hue: this.options.color,
                format: 'rgbArray',
                count: 5
            }));

            //initial positions and colors based on silence
            for (var i = 0; i < flocks.length; i++) {
                flocks[i].setColor(this.colors[i]);
                flocks[i].start(targets[i].x, targets[i].y);
                flocks[i].enable();
            };

            this._instantiated = true;
        }

        // for (var i = 0; i < flocks.length; i++) {
        //     var color = (data) ? this.colorDark1 : this.colorLight1;
        //     flocks[i].setColor(color);
        // }

        var color = "rgba(255,255,255,0.001)";
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // target_x2 -= (!data * max_width);

        for (var i = 0; i < flocks.length; i++) {
            if (targets[i].x === zero_x && targets[i].y === zero_y) {
                flocks[i].disable();
            } else {
                flocks[i].enable();
            }

            flocks[i].setTarget(targets[i].x, targets[i].y);
            flocks[i].update();
            flocks[i].draw();
        }

    }
});
//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('gogh', {
	brushes: ['circles'],
    paint: function(time, data) {

    	if(!this._instantiated) {
    		this.first_time = time;
    	}

        var flock = this.getBrush(0);

    	//margins improve quality
    	margin = 50;
    	min_x = margin;
    	max_x = this.canvas.width - margin;
    	max_width = max_x - min_x;
    	min_y = margin;
    	max_y = this.canvas.height - margin;
    	max_height = max_y - min_y;

    	//x is time, y is random

    	var x = (time - this.first_time) / 100;

    	//go back
    	var back = (Math.floor(x/max_width)%2 !== 0);
    	if(x > max_width && back ) {
    		x = max_width - (x % max_width);
    	}
    	else if(x > max_width) {
    		x = x % max_width;
    	}

    	var target_x = min_x + x, target_y = min_y + (data * max_height);

    	if(!this._instantiated) {
    		this.color = "#F1F1EA";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

            //choose a random dark color
            var color1 = randomColor({hue: 'red', luminosity: 'dark', format: 'rgbArray'});
            var color2 = randomColor({hue: 'blue', luminosity: 'dark', format: 'rgbArray'});
            var color3 = randomColor({hue: 'red', luminosity: 'dark', format: 'rgbArray'});
            var color4 = randomColor({hue: 'blue', luminosity: 'dark', format: 'rgbArray'});

            this.color1 = 'rgba('+color1.join(',')+',0.2)';
            this.color2 = 'rgba('+color2.join(',')+',0.2)';
            this.color3 = 'rgba('+color3.join(',')+',0.2)';
            this.color4 = 'rgba('+color4.join(',')+',0.2)';

    		flock.setColor(this.color1);
    		flock.start(target_x, target_y);
	    	flock.enable();
    		this._instantiated = true;

	    	this._prevData = data;

    	}

    	if(data > this._prevData && !back) {
    		flock.setColor(this.color1);            
    	}
    	else if(data > this._prevData && back) {
    		flock.setColor(this.color3);
    	}
    	else if(data < this._prevData && !back) {        
    		flock.setColor(this.color2);
    	}
    	else if(data < this._prevData && back) {
    		flock.setColor(this.color4);
    	}
	
		this._prevData = data;    	 

    	flock.setTarget(target_x, target_y);
    	flock.update();
    	flock.draw();
    }
})
ARTGEN.addPainter('leonardo', {
	brushes: ['ink'],
    paint: function(time, data) {
    	var ink = this.getBrush(0);
    	if(!this._instantiated) {
    		ink.setColor(randomColor());
    		ink.start(this.canvas.width / 2, this.canvas.height / 2, 2000);
    		this._instantiated = true;
    	}
    	ink.update(this.canvas, data);
    	ink.draw(this.ctx);
    }
})
ARTGEN.addPainter('ondrugs', {
	brushes: ['poneytail'],
	//brushes: ['colorose'],
	//brushes: ['sunburst'],
	//brushes: ['cannon'],
	//brushes: ['transient'],
    paint: function(time, data){
    	var moon = this.getBrush(0);
    	if(!this._instantiated){
    		moon.setColor(randomColor());
    		moon.start(this.ctx,this.canvas, data);
    		this._instantiated = true;
    	}
    	moon.update(this.canvas,this.ctx,data);
    	moon.draw(this.ctx);
    }
})
//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('picasso', {
    brushes: ['flock', 'spray', 'hairy', 'hairy', 'flock', 'spray', 'flock', 'flock', 'spray', 'hairy'],
    paint: function(time, data) {

        if (!this._instantiated) {
            this.first_time = time;
            this.brushes = _.shuffle(this.brushes);
            this.posX = [];
            this.posY = [];
            for (var i = 0; i < this.brushes.length; i++) {
                this.brushes[i]._settings.BOIDS = _.random(20,50);
                this.posX[i] = Math.random();
                this.posY[i] = Math.random();
            };
        }


        var flocks = [];
        for (var i = 0; i < this.brushes.length; i++) {
            flocks[i] = this.brushes[i];
        };
        half = flocks.length / 2;

        //margins improve quality
        margin = 50;
        min_x = margin;
        max_x = this.canvas.width - margin;
        max_width = max_x - min_x;
        min_y = margin;
        max_y = this.canvas.height - margin;
        max_height = max_y - min_y;

        //x is time, y is random

        var y = (time - this.first_time) / 100;

        var target_x2 = min_x + (data * max_width),
            target_y2 = min_y + y;

        if (!this._instantiated) {
            this.color = "#FFFCEF";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

            //choose a random dark color
            var colorLight = [
                [89,3,3],
                [220, 220, 220]
            ];
            var colorDark = [
                [209,13,13],
                [35, 35, 35]
            ];
            this.colorLight1 = 'rgba(' + colorLight[0].join(',') + ',0.1)';
            this.colorLight2 = 'rgba(' + colorLight[1].join(',') + ',0.1)';
            this.colorDark1 = 'rgba(' + colorDark[0].join(',') + ',0.1)';
            this.colorDark2 = 'rgba(' + colorDark[1].join(',') + ',0.1)';

            //initial positions and colors based on silence
            for (var i = 0; i < flocks.length; i++) {
                var first, c, posX, posY, v;
                first = !(i < half);
                v = this.posX[i] * max_width;
                v2 = this.posY[i] * max_height;
                posX = (first) ? this.canvas.width - target_x2 - v : target_x2 + v;
                posY = target_y2 + v2;

                flocks[i].setColor(this.colorLight1);
                flocks[i].start(posX, posY);
                flocks[i].enable();
            };

            this._instantiated = true;
        }

        for (var i = 0; i < flocks.length; i++) {
            var color = (data) ? this.colorDark1 : this.colorLight1;
            flocks[i].setColor(color);
        }

        target_x2 -= (!data * max_width);

        for (var i = 0; i < flocks.length; i++) {
            var first, posX, posY, half, v;
            first = !(i < half);

            v = this.posX[i] * max_width;
            v2 = this.posY[i] * max_height;

            posX = (first) ? this.canvas.width - target_x2 - v : target_x2 + v;
            posY = target_y2 + v2;

            //go back
            var back = (Math.floor(posY / max_height) % 2 !== 0);
            if (posY > max_height && back) {
                posY = max_height - (posY % max_height);
            } else if (posY > max_height) {
                posY = posY % max_height;
            }

            flocks[i].setTarget(posX, posY);
            flocks[i].update();
            flocks[i].draw();
        }

    }
});
//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('pollock', {
	brushes: ['splash'],
    paint: function(time, data) {

    	if(!this._instantiated) {
    		this.first_time = time;
    	}

        var splash = this.getBrush(0);

    	//margins improve quality
    	margin = 50;
    	min_x = margin;
    	max_x = this.canvas.width - margin;
    	max_width = max_x - min_x;
    	min_y = margin;
    	max_y = this.canvas.height - margin;
    	max_height = max_y - min_y;

    	//x is time, y is random

    	var x = (time - this.first_time) / 100;

    	//go back
    	var back = (Math.floor(x/max_width)%2 !== 0);
    	if(x > max_width && back ) {
    		x = max_width - (x % max_width);
    	}
    	else if(x > max_width) {
    		x = x % max_width;
    	}

    	var target_x = min_x + x, target_y = min_y + (data * max_height);

    	if(!this._instantiated) {
    		this.color = "#F1F1EA";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

            //choose a random dark color
            var color1 = randomColor({hue: 'red', luminosity: 'dark', format: 'rgbArray'});
            var color2 = randomColor({hue: 'blue', luminosity: 'dark', format: 'rgbArray'});
            var color3 = randomColor({hue: 'red', luminosity: 'dark', format: 'rgbArray'});
            var color4 = randomColor({hue: 'blue', luminosity: 'dark', format: 'rgbArray'});

            this.color1 = 'rgba('+color1.join(',')+',0.2)';
            this.color2 = 'rgba('+color2.join(',')+',0.2)';
            this.color3 = 'rgba('+color3.join(',')+',0.2)';
            this.color4 = 'rgba('+color4.join(',')+',0.2)';

    		splash.setColor(this.color1);
    		splash.start(target_x, target_y);
	    	splash.enable();
    		this._instantiated = true;

	    	this._prevData = data;

    	}

    	if(data > this._prevData && !back) {
    		splash.setColor(this.color1);            
    	}
    	else if(data > this._prevData && back) {
    		splash.setColor(this.color3);
    	}
    	else if(data < this._prevData && !back) {        
    		splash.setColor(this.color2);
    	}
    	else if(data < this._prevData && back) {
    		splash.setColor(this.color4);
    	}
	
		this._prevData = data;    	 

        this.color = "rgba(241,241,234,0.5)";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();

    	splash.setTarget(Math.random() * this.canvas.width, 100 * data);
    	splash.update();
    	splash.draw();
    }
})
//gogh is an example of painter that paints only monochromatic colors
ARTGEN.addPainter('vangoghnoi', {

    /* =============== META INFORMATION ================= */

    title: "Van Goghnoi",
    description: "Using veronoi diagrams to express speech",
    tags: ["energy", "color", "expressiveness"],

    // determine, in order, what the data values are used for
    data_values: [{
        description: "determines when a point will be added",
        options: ["silence", "emotion", "intensity", "speed", "rms", "energy", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]

        //all possible
    }, {
        description: "used for X position",
        options: ["emotion", "intensity", "silence", "speed", "rms", "energy", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]
    }, {
        description: "used for Y position",
        options: ["intensity", "emotion", "silence", "speed", "rms", "energy", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]
    }, {
        description: "used for color",
        options: ["intensity", "emotion", "silence", "speed", "rms", "energy", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]
    }],

    //extra visual options
    options: {
        color1: {
            name: "Color 1",
            description: "used for determine the first color",
            options: ["green", "red", "orange", "yellow", "blue", "purple", "pink", "monochrome"]
        },
        color2: {
            name: "Color 2",
            description: "used for determine the second",
            options: ["red", "green", "orange", "yellow", "blue", "purple", "pink", "monochrome"]
        },
        style: {
            name: "Style",
            description: 'Style of this paiting',
            options: ['fill', "stroke"]
        },
        intervals: {
            name: "Intervals",
            description: 'Draw Intervals?',
            options: ['no', "yes"]
        }
    },


    /* =============== IMPLEMENTATION ================= */

    brushes: ['veronoi'],

    paint: function(time, data) {

        function formatColor(rgbArray, alph) {
            if (!alph) alph = 0.08;
            return "rgba(" + rgbArray.join(',') + "," + alph.toString() + ")";
        }

        function interpolateColors(rgb1, rgb2, percentage) {
            var res = [];
            for (var i = 0; i < 3; i++) {
                res[i] = Math.round(rgb1[i] + ((rgb2[i] - rgb1[i]) * percentage));
            }
            return res;
        }

        var brush = this.brushes[0];

        function easeIn(t, d) {
            t /= d;
            return d * t * t * t;
        };

        function easeOut(t, d) {
            t /= d;
            t--;
            return d * (t * t * t + 1);
        };

        function easeOutIn(t, d) {
            var half = d / 2;
            if (t <= half) {
                return easeOut(t, half);
            } else {
                return half + easeIn((t - half), half);
            }
        }

        var max_x = this.canvas.width,
            max_y = this.canvas.height,
            center_x = this.canvas.width / 2,
            center_y = this.canvas.height / 2,
            target_x = easeOutIn(data[1], 100) / 100 * max_x || 0,
            target_y = easeOutIn(data[2], 100) / 100 * max_y || 0,
            ratio_x = 1;
            ratio_y = 1;

            target_x = target_x * 1/ratio_x;
            target_y = target_y * 1/ratio_y;

        if (!this._instantiated) {
            this.first_time = time;
        }

        if (!this._instantiated) {


            var color = "#FFFFFF";
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = color;
            this.ctx.fill();

            // this.ctx.globalCompositeOperation = 'source-over';

            if (this.options.style === 'fill') {
                this.color1 = randomColor({
                    hue: this.options.color1,
                    format: 'rgbArray'
                });

                this.color2 = randomColor({
                    hue: this.options.color2,
                    format: 'rgbArray'
                });
            } else {
                this.color1 = randomColor({
                    hue: this.options.color1,
                    format: 'rgbArray',
                    luminosity: 'dark'
                });

                this.color2 = randomColor({
                    hue: this.options.color2,
                    format: 'rgbArray',
                    luminosity: 'dark'
                });
            }

            brush.setColor(formatColor(this.color1));
            brush.start(target_x, target_y);
            brush.addRandom(200);

            this._instantiated = true;
            this._prevData = 1;
            if (this.options.intervals === "yes") {
                brush.enable();
            }
        }

        // for (var i = 0; i < flocks.length; i++) {
        //     var color = (data) ? this.colorDark1 : this.colorLight1;
        //     flocks[i].setColor(color);
        // }

        // var color = "rgba(255,255,255,0.)";
        // this.ctx.beginPath();
        // this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.fillStyle = color;
        // this.ctx.fill();

        // target_x2 -= (!data * max_width);

        //data 0 is used for adding points

        if (this._prevData !== 0 && data[0] === 0) {
            //not silent
            if (this.options.intervals === "no") {
                brush.enable();
            }
        } else if (this._prevData === 0 && data[0] !== 0) {
            //now its silent
            if (this.options.intervals === "no") {
                // brush.clearAll();
                // brush.addRandom(this.options.size);
                brush.addPoint();
                brush.disable();
            }
        }
        this._prevData = data[0];

        var change = (data[3] / 100);
        if (change > 1) change = 1;
        if (change < 0) change = 0;

        var color = interpolateColors(this.color1, this.color2, change);

        if (this.options.intervals === "yes" && data[0] > 0) {
            color = [255, 255, 255];
        }


        // var color = "rgba(255,255,255,0.001)";
        // this.ctx.beginPath();
        // this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.fillStyle = color;
        // this.ctx.fill();

        //data 3 is used for color scale

        brush.setStyle(this.options.style);
        var alpha = (this.options.style === 'fill') ? 0.08 : 0.1;
        brush.setColor(formatColor(color, alpha));

        //only move if not silent when drawing 
        if (this.options.intervals !== "yes" || data[0] === 0) {
            brush.setTarget(target_x, target_y);
        }
        brush.update();
        brush.draw();
    }
});
ARTGEN.addPainter('zeus', {

    /* =============== META INFORMATION ================= */

    title: "Zeus",
    description: "Thunders everywhere",
    tags: ["energy", "color", "expressiveness"],

    // determine, in order, what the data values are used for
    data_values: [{
        description: "determines the angle",
        options: ["intensity", "silence", "emotion", "speed", "rms", "energy", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]
    },
    {
        description: "determines the radius",
        options: ["energy", "silence", "emotion", "intensity", "speed", "rms", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]
    },
    {
        description: "determines when particles die",
        options: ["silence", "emotion", "intensity", "speed", "rms", "energy", "zcr", "amplitudeSpectrum", "powerSpectrum", "spectralCentroid", "spectralFlatness", "spectralSlope", "spectralRolloff", "spectralSpread", "spectralSkewness", "spectralKurtosis", "mfcc"]
    }],

    //extra visual options
    options: {
        background: {
            name: "Background",
            description: "used for determine the background color",
            options: ["black", "green", "red", "orange", "yellow", "blue", "purple", "pink", "monochrome", "white"]
        },
        stroke: {
            name: "Stroke",
            description: "used for determine the foreground color",
            options: ["white", "red", "green", "orange", "yellow", "blue", "purple", "pink", "monochrome"]
        }
    },


    /* =============== IMPLEMENTATION ================= */


	brushes: ['thunderbolt'],
    paint: function(time, data) {
    	
        var bolt = this.getBrush(0);
    	// var bolt2 = this.getBrush(1);
    	
        if(!this._instantiated) {
            
            this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            if(this.options.background === "black" || this.options.background === "white") {
                this.ctx.fillStyle = this.options.background;
            }
            else {
                this.ctx.fillStyle = randomColor({ hue: this.options.background, luminosity: 'dark' });
            }
            this.ctx.fill();

            if(this.options.stroke === "black" || this.options.stroke === "white") {
                this.color = (this.options.stroke === "white") ? [255,255,255] : [0,0,0];
            }
            else {
                var luminosity = (this.options.background === "white") ? 'dark' :  'light';
                this.color = randomColor({ hue: this.options.stroke, luminosity: luminosity, format:"rgbArray" });
            }

    		bolt.start(this.ctx, this.canvas, [0, 1/2, "right"]);
    		// bolt2.start(this.ctx, this.canvas, [1, 1/2, "left"]);
    		this._instantiated = true;
    	}
    	
        bolt.update(this.canvas, this.ctx, data);
    	bolt.draw(this.ctx, this.color);

		// bolt2.update(this.canvas, this.ctx, data);
  //   	bolt2.draw(this.ctx);
    }
})
	return ARTGEN;
}));