
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
(function (global) {
    global.debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments, later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
}(window));
(function (global) {
    global.roundTo = function (num, numDecimals) {
        return (Math.round(num * (Math.pow(10, numDecimals))) / Math.pow(10, numDecimals));
    };
    global.getRandomNum = function (min, max, numDecimals) {
        min = min || 0;
        max = max || 1;
        numDecimals = numDecimals === 0 ? 0 : (numDecimals || 4);
        
        var randomNum = (Math.random() * (max - min)) + min;
        return global.roundTo(randomNum, numDecimals);
        
    };
})(window);
(function(global) {
        
function createCanvas(canvasSelector, wrapperSelector, width, height, resizeDelay) {
    var canvasWidth, canvasHeight, wrapper;
    
if (!wrapperSelector) {
        canvasWidth = width || global.innerWidth;
        canvasHeight = height || global.innerHeight;
    } else {
        var wrapper = global.document.querySelector(wrapperSelector);    
        canvasWidth = wrapper.offsetWidth;
        if (canvasWidth < 400) {
            canvasHeight = canvasWidth;
        } else {
            canvasHeight = canvasWidth / 2;
        }
    }
    var canvas = global.document.querySelector(canvasSelector);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.setAttribute('style', "position: relative; margin: 0; display: block;");
    var ctx = canvas.getContext('2d');
    ctx.width = canvasWidth;
    ctx.height = canvasHeight;
    var devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                            ctx.mozBackingStorePixelRatio ||
                            ctx.msBackingStorePixelRatio ||
                            ctx.oBackingStorePixelRatio ||
                            ctx.backingStorePixelRatio || 1,
         ratio = devicePixelRatio / backingStoreRatio;
    if (devicePixelRatio !== backingStoreRatio) {
        var oldWidth = canvas.width;
        var oldHeight = canvas.height;
        canvas.width = oldWidth * ratio;
        canvas.height = oldHeight * ratio;
        canvas.style.width = oldWidth + 'px';
        canvas.style.height = oldHeight + 'px';
        // now scale the context to counter
        // the fact that we've manually scaled
        // our canvas element
        ctx.scale(ratio, ratio);
    }   
    return ctx;
}
    global.c = createCanvas;    
})(window);
/* Given canvas context, x, y, radius, stroke, fill, draw a circle */
(function(global) {
    var arcComponent = function(x, y, radius, startingAngle, endingAngle, strokeColor, fillColor, clockwise) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.startingAngle = startingAngle;
        this.endingAngle = endingAngle;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
        this.clockwise = clockwise;
    }   
    arcComponent.prototype.draw = function(ctx, clearCanvas) {
        if (clearCanvas) {
            ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.startingAngle, this.endingAngle, this.clockwise);
        if (this.strokeColor) {
            ctx.lineWidth = this.lineWidth || 0.9;
            ctx.strokeStyle = this.strokeColor;           
            if (this.checkIfVisible() || this.alwaysVis) {    
                ctx.stroke();  
            }
        }
        if (this.fillColor) {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        }
    }
    arcComponent.prototype.checkIfVisible = function () {
        var angle = this.endingAngle;
        var yPos = Math.sin(angle) * this.radius + this.y;
        var xPos = Math.cos(angle) * this.radius + this.x;
        
        if (xPos >= 0 && xPos <= ctx.width &&
            yPos >= 0 && yPos <= ctx.height ) {
            return true;
        } else {
            return false;
        }
    }
    
    arcComponent.prototype.changeArc = function(startingAngle, endingAngle) {
        this.endingAngle = endingAngle;
        this.startingAngle = startingAngle;
    }
    
    arcComponent.prototype.move = function(x, y) {
        this.x = x;
        this.y = y;        
    }

    arcComponent.prototype.moveRelative = function(xDiff, yDiff) {
        this.move(this.x + xDiff, this.y + yDiff);
    }
    
    var circleComponent = function(x, y, radius, strokeColor, fillColor) {
        arcComponent.call(this, x, y, radius, 0, 2 * Math.PI, strokeColor, fillColor)
    }   
    
    circleComponent.prototype = Object.create(arcComponent.prototype);
    
    var dotComponent = function(x, y) {
        circleComponent.call(this, x, y, 1, null, 'black');
    }
    
    dotComponent.prototype = Object.create(circleComponent.prototype);
    
    var lineComponent = function(startingX, startingY, endingX, endingY, strokeColor, lineCap) {
        this.startingX = startingX;
        this.startingY = startingY; 
        this.endingX = endingX;
        this.endingY = endingY;
        this.strokeColor = strokeColor || "black";
        this.lineCap = lineCap || 'butt';
    }
    
    lineComponent.prototype.move = function(startingX, startingY, endingX, endingY) {
        this.startingX = startingX;
        this.startingY = startingY; 
        this.endingX = endingX;
        this.endingY = endingY;        
    }
    
    lineComponent.prototype.moveRelative = function(startingxDiff, startingyDiff, endingxDiff, endingyDiff) {
        this.move(this.startingX + startingxDiff, this.startingY + startingyDiff, 
                  this.endingX + endingxDiff, this.endingY + endingYDiff);
    }
    
    lineComponent.prototype.draw = function(ctx, clearCanvas) {
        if (clearCanvas) {
            ctx.clearRect(0, 0, ctx.width, ctx.height);
        }
        ctx.beginPath();
        ctx.moveTo(this.startingX, this.startingY);
        ctx.lineTo(this.endingX, this.endingY);
        ctx.lineWidth = this.lineWidth || 0.9;
        ctx.lineCap = this.lineCap;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();              
    }
    
    global.arc = arcComponent;
    global.circle = circleComponent;
    global.dot = dotComponent;
    global.line = lineComponent;
})(window);

(function(global){
    function animationHandler(ctx, autoplay) {
        this.anims = [];
        this.ctx = ctx;
        this.paused = false;
    }
    
    animationHandler.prototype.setContext = function(ctx) {
        this.ctx = ctx;
    }
    
    animationHandler.prototype.addAnim= function(item) {
        this.anims.push(item);
    }
    animationHandler.prototype.pause = function() {
        this.paused = true;
    }
    
    animationHandler.prototype.play = function() {
        if (this.paused === true) {
            this.paused = false;
            this.animateAll();
        }
    }
    animationHandler.prototype.setEventHandler = function(eventType, callback) {
        var self = this;
        global.addEventListener(eventType, function(e) {
            var event = e;
            requestAnimationFrame(function() {                
            self.anims.forEach(function(item) {
                callback.call(item.elem, e);
            });
        });
        });
    }
    
    animationHandler.prototype.setIntervalEvent = function(callback, interval) {
        var self = this;
        requestAnimationFrame(function() {
            setInterval(function() {
                self.anims.forEach(function(item) {
                    callback.call(item.elem);
                });
            }, interval);
        });        
    }
    
    animationHandler.prototype.removeItem = function(item) {
        var index = this.anims.findIndex(function(obj) { return obj.elem === item});
        if (index > -1)
            this.anims.splice(index, 1);
    }
    
    animationHandler.prototype.lastDate = new Date();
    animationHandler.prototype.newDate = new Date();
    
    animationHandler.prototype.animateAll = function() {
        if (!this.ctx) {
            console.error('animationHandler Error: Context not set.');
            return;
        }
        this.date = new Date() //Setting animation frame date in case any callbacks need elapsed time;
        this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
            // Clears canvas over time, so movement leaves fading trails 
            /*ctx.fillStyle = 'rgba(242,242,242,0.2)'; 
            ctx.fillRect(0, 0, ctx.width, ctx.height);*/
            
        var self = this;  
        if (!self.paused)
            requestAnimationFrame(function() {self.animateAll()});
        
        this.anims.forEach(function(item) {
          
            item.callback.call(item.elem);
            
        });
        
        animationHandler.prototype.lastDate = this.newDate;
        animationHandler.prototype.newDate = new Date();
}
    global.animHandler = new animationHandler(global.document.querySelector('canvas'));
    
}(window))
var Graph = {
    setContext : function(ctx) {
        this.ctx = ctx;
    },
    setSpacing : function(spacing) {
        this.spacing = spacing;
    },
    setHBase : function(hBase) {
        this.hBase = hBase;
    },
    setVBase : function(vBase) {
        this.vBase = vBase
    },
    setHiddenRegion : function(hideAfter) {
        this.hideAfter = (hideAfter - this.lowX) * this.xRatio;
        this.initialHideAfter = this.hideAfter;
    },
    setGraphExplanation : function(gE) {
        this.graphExplanation = gE;
    },
    resetGraph : function() {
        this.points = [];
        this.xLimit = this.pointsStartingX;
        this.xLimitInitial = this.pointsStartingX;
        this.rectLimit = this.pointsStartingX;
        this.lastIndex = undefined;
        this.hideAfter = this.initialHideAfter;
        this.activeInitialPoint = -1;
        this.activePoint = -1;
        this.graphExplanation.style.transform = "scaleY(0)";
        this.graphExplanation.style.height = 0;
        this.graphExplanation.setAttribute('aria-hidden', 'true');
    },
    revealGraph : function() {
        this.hideAfter = -1;
        this.rectLimit -= this.xDiff;
        this.activeInitialPoint = -1;
        this.activePoint = -1;
        this.graphExplanation.style.transform = "scaleY(1)";
        this.graphExplanation.style.height = 'auto';
        this.graphExplanation.setAttribute('aria-hidden', 'false');
    },
    parseInput: function(xCoord, yCoord) {
        if(typeof this.highX === 'undefined' || this.highX < xCoord) {
            this.highX = xCoord;
        }
        if(typeof this.lowX === 'undefined' || this.lowX > xCoord) {
            this.lowX = xCoord;
        }
        if(typeof this.highY === 'undefined' || this.highY < yCoord) {
            this.highY = yCoord;
        }
        if(typeof this.lowY === 'undefined' || this.lowY > yCoord) {   
            this.lowY = yCoord;
        }
        return [xCoord, yCoord];
    },
    addInitialPoints: function(inputPoints) {
        var self = this;
        if (!this.initialPoints) {
            this.initialPoints = [];
        }
        while (inputPoints.length) {
            var x = parseFloat(inputPoints.shift(), 10);
            var y = parseFloat(inputPoints.shift(), 10);
            var result = self.parseInput(x, y);
            if (!isNaN(result[0]) && !isNaN(result[1])) {
                self.initialPoints[result[0]] = result[1];
            } else {
                console.error('Provided data is not a number.');
            }
        }
        this.xRange = this.highX - this.lowX;
        this.yRange = this.highY - this.lowY;
        this.rangeRatio = this.yRange / this.xRange;
        this.xSpace = this.ctx.width - this.vBase;
        this.ySpace = this.ctx.height - this.hBase;
        this.spaceRatio = this.ySpace / this.xSpace;
        this.maxDist = Math.max(this.xRange, this.yRange); 
        //Determine limiting ratio
        if (this.spaceRatio > this.rangeRatio) {
            this.maxSpace = this.xSpace;
            this.maxDist = this.xRange;            
        } else {
            this.maxDist = this.yRange;
            this.maxSpace = this.ySpace;
        }
        this.buffer = this.maxSpace * .1;
        this.maxSpace -= this.buffer * 2;
        this.ratio = this.maxSpace / this.maxDist;
        this.xSpace -= this.xSpace / 10;
        this.ySpace -= this.ySpace / 10;
        this.xRatio = this.xSpace / this.xRange;
        this.yRatio = this.ySpace / this.yRange;
        this.convertArray(self.initialPoints);    
    },
    convertArray : function(inputArray) {
        var oldArray = inputArray.slice(0);
        var newArray = []
        this.initialPoints = [];
        var self = this;
        var lastX = 0;
        var lastY = 0;
        var xDiff;
        var yDiff;
        oldArray.forEach(function(point, index) {
           var x = Math.round(((index - self.lowX) * self.xRatio));
           var y = (point - self.lowY) * self.yRatio;
           newArray[x] = y;
            if ((typeof xDiff === 'undefined' || xDiff > x - lastX) && x - lastX > 0) {
                xDiff = x - lastX;
            }
            if ((typeof yDiff === 'undefined' || yDiff > y - lastY) && y - lastY > 0) {
                yDiff = y - lastY;
            }
           lastX = x;
           lastY = y;
        });
        self.xDiff = window.roundTo(xDiff, 4);
        self.yDiff = window.roundTo(yDiff, 4);
        self.highYConverted = (self.highY - self.lowY) * self.yRatio;
        self.highXConverted = (self.highX - self.lowX) * self.xRatio;
        newArray.forEach(function(point, index) {
            var x = Math.round(index / self.xDiff) * self.xDiff;
            self.initialPoints[x] = point;
        });
    },
    addPoint : function(xCoord, yCoord) {
        if (!this.points) {
            this.points = [];
        }
        xCoord = Math.round(xCoord / this.xDiff) * this.xDiff;
        yCoord = Math.round(yCoord);
        this.points[xCoord] = yCoord;    
        this.activePoint = xCoord;
    },
    setDrawLine : function(drawLineCallback) {
        this.drawLineCallback = drawLineCallback || 
            function(ctx, sX, sY, eX, eY, color, lineWidth, lineDash) {
                var lineColor = color || 'rgba(80, 107, 138, 1)'
                var newLine = new line(sX, sY, eX, eY, lineColor, 'round');
                if (lineDash) {
                    ctx.save();
                    ctx.setLineDash(lineDash);
                }
                newLine.lineWidth = lineWidth || 0.9;
                newLine.draw(ctx);
                ctx.restore();
            }
    },
    setDrawPoint : function(drawPointCallback) {
        this.drawPointCallback = drawPointCallback || 
            function(ctx, x, y, setColor, rad) {
            if (this.vBase > 0)
                var radius = 10;
            else
                var radius = rad || 2;
            var color = setColor || 'rgba(126, 163, 205, 1)';
            var point = new circle(x, y, radius, null, color);
            point.draw(ctx);
        }
    },
    drawLine : function(fromX, fromY, toX, toY, color, lineWidth, lineDash) {
        this.drawLineCallback(this.ctx, fromX + this.vBase, 
                              this.ctx.height - fromY - this.hBase, 
                              toX + this.vBase, this.ctx.height - toY - this.hBase, 
                              color, lineWidth, lineDash)
    },
    drawPoint : function(x, y, color, rad) {
        this.drawPointCallback(this.ctx, x + this.vBase, (this.ctx.height - this.hBase) - y, color, rad)
    },
    drawGrid : function() {
        var gridColor = "#004562",
            lineWidth = 0.2,
            gridSpacing = 2,
            labelSpacing = 2,
            howManyHorizontal = (this.ctx.height - this.hBase) / this.spacing,
            howManyVertical = (this.ctx.width - this.vBase) /  this.xDiff,
            txtHeight = 14,
            font = "Arial",
            color = "black",
            text, textX, textY;
        if (this.vBase > 0) {
            this.ctx.save();
            this.ctx.font = "18px Oswald";
            this.ctx.fillStyle = "black";
            text = 'Y Axis Legend';
            var textDims = this.ctx.measureText(text);
            this.ctx.translate(this.vBase /4,  this.ctx.height / 2  + (textDims.width /2))
            this.ctx.rotate(Math.PI * -.5);
            this.ctx.fillText(text,
                          0, 
                          0);
            this.ctx.restore();
        } else {
            labelSpacing = 4;
        }
        this.drawText(this.lowX, 0, 0 - this.hBase / 1.5, txtHeight, color, font, true, true);
        for (var i = 1; i < howManyHorizontal; i++) {
            if (i % gridSpacing === 0) {
                this.drawLine(0 , i *  this.spacing, this.ctx.width, i *  this.spacing, gridColor, lineWidth)
            }
            if (i % 4 === 0 && this.vBase > 0) {
                text = window.roundTo(i * this.spacing / this.yRatio + this.lowY, 2) + '%';
                textX = 0 - this.vBase /2.8;
                textY = i * this.spacing;
                this.drawText(text, textX,textY, txtHeight, color, font, true, true);
             }
        }
        for (var i = 1; i < howManyVertical; i++) {
            if (i % gridSpacing === 0) {
                this.drawLine(i * this.xDiff, 0, i * this.xDiff, this.ctx.height, gridColor, lineWidth)
            }
            if (i % labelSpacing === 0) {
                text = Math.round(i * this.xDiff / this.xRatio + this.lowX);
                textX = i * this.xDiff;
                textY = 0 - this.hBase / 1.5;
                this.drawText(text, textX,textY, txtHeight, color, font, true, true);
             }
        }
    },
    drawText: function(text, x, y, size, color, font, nobackground, noverticaloffset) {
        this.ctx.font = size + "px " + font;               
        var textDims = this.ctx.measureText(text);  
        if (!noverticaloffset) {
            var verticalOffset = (y + this.hBase) > (this.ctx.height / 2) ? this.yDiff * 5: -this.yDiff * 5;
        } else {
            var verticalOffset = 0;
        }
        if (x + this.vBase + (textDims.width / 2) >= this.ctx.width) {
            x = this.ctx.width - (textDims.width / 2);
        } else if (this.vBase === 0 && x - (textDims.width / 2) <= this.vBase) {
            x = this.vBase + (textDims.width / 2);
        }
        if (!nobackground) {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect((x + this.vBase) - (textDims.width / 2),
            this.ctx.height - (y + this.hBase) + verticalOffset  - size,
            textDims.width,
            size + 5);
        }
        this.ctx.fillStyle = color;
        this.ctx.fillText(text,
                     (x + this.vBase) - (textDims.width / 2),
                     this.ctx.height - (y + this.hBase) + verticalOffset);
    },
    drawAxes: function() {
        this.drawLine(0, 0, 0, this.ctx.height);
        this.drawLine(0, 0, this.ctx.width, 0);
    },
    draw: function() {
        this.drawAxes();
        this.drawGrid();
        this.lastIndexInitial;
        this.lastPointInitial;
        this.initialLines = [];
        var endingX = 0,
            endingY = 0,
            self = this;
        self.initialPoints.forEach(function(point, index) {
            var x = index;
            var y = point;
            if (self.hideAfter < 0 || index <self.hideAfter) {
                var x = index;
                var y = point;
                if (x <= self.xLimitInitial) {
                    self.drawPoint(x, y, 'black');
                }
                if (typeof self.lastIndexInitial !== 'undefined' && self.lastIndexInitial < x) {
                    self.initialLines.push([self.lastIndexInitial, self.lastPointInitial, x, y, '#004562', 5]);
                } 
                self.lastIndexInitial = x;
                self.lastPointInitial = y;
            }      
        });
        if (self.xLimit === 0) {
            self.lastIndex = self.lastIndexInitial;
        }
        self.initialLines.forEach(function(line) {
             if (line[2] <= self.xLimitInitial) {
                 self.drawLine(line[0], line[1], line[2], line[3], line[4], line[5]);
                 endingX = line[2];
                 endingY = line[3];
             } else if (line[0] < self.xLimitInitial) {
                    var xDiff = line[2] - line[0];
                    var yDiff = line[3] - line[1];
                    var tempY =  ((self.xLimitInitial - line[0])* (yDiff / xDiff)) + line[1];
                    self.drawLine(line[0], line[1], self.xLimitInitial, tempY, line[4], line[5]);
                    endingX = self.xLimitInitial;
                    endingY = tempY;
            }
        });
        self.lastIndex; 
        self.lastPoint; 
        self.lines = []; 
        if (typeof self.pointsStartingX === 'undefined') {
                self.pointsStartingX = self.lastIndexInitial;
                self.pointsStartingY = self.lastPointInitial;
        }
        if (self.points && self.points.length) {
            self.points.forEach(function(point, index) {
                var x = index;
                var y = point;
                self.drawPoint(x, y, 'rgba(0,0,0,0.25)');
                if (typeof self.lastIndex !== 'undefined' && self.lastIndex < x) {
                    self.lines.push([self.lastIndex, self.lastPoint, x, y, 'rgba(0,0,0,1)', 1, [2, 2]]);
                } else {
                    self.lines.push([self.pointsStartingX, self.pointsStartingY, x, y, 'rgba(0,0,0,1)', 1, [2, 2]]);
                }
                self.lastIndex = x;
                self.lastPoint = y;
            });
            self.lines.forEach(function(line) {
                 if (line[2] <= self.xLimit) {
                     self.drawLine(line[0], line[1], line[2], line[3], line[4], line[5], line[6]);
                     
                 } else if (line[0] < self.xLimit) {
                        var xDiff = line[2] - line[0];
                        var yDiff = line[3] - line[1];
                        var tempY =  ((self.xLimit - line[0])* (yDiff / xDiff)) + line[1];
                        self.drawLine(line[0], line[1], self.xLimit, tempY, line[4], line[5], line[6]);
                    }
            });
        }
        self.ctx.fillStyle ="rgba(50,50,50,0.1)";
        self.ctx.fillRect(self.vBase + self.rectLimit,0,self.ctx.width, self.ctx.height  - self.hBase);
        if (typeof self.activePoint !== 'undefined' && self.activePoint >= 0) {
            var txtHeight = 14;
            var font = "Oswald"
            var color = "black"
            var text = Math.round(self.activePoint / self.xRatio + self.lowX) + ', ' + window.roundTo((self.points[self.activePoint] /  self.yRatio) + self.lowY, 2) + '%';
            var textX = self.activePoint
            var textY = self.points[self.activePoint]
            self.drawText(text, textX,textY, txtHeight, color, font, false, true);
        }     
        if (self.activeInitialPoint >= 0 && ((self.activeInitialPoint <self.hideAfter) ||self.hideAfter < 0)) {
            var txtHeight = 14;
            var font = "Oswald"
            var color = "black"
            var text = Math.round(self.activeInitialPoint / self.xRatio + self.lowX) + ', ' + (((self.initialPoints[self.activeInitialPoint] / self.yRatio) + self.lowY)) + '%';
            var textX = self.activeInitialPoint
            var textY = self.initialPoints[self.activeInitialPoint]
            self.drawText(text, textX,textY, txtHeight, color, font);
        }
        var revealSpeed = self.xSpace / 4000;
        if (self.xLimitInitial < self.lastIndexInitial) {
            self.xLimitInitial += (window.animHandler.newDate - window.animHandler.lastDate) * revealSpeed;   
        }
        if (self.xLimit < self.lastIndex) {
            self.xLimit += (window.animHandler.newDate - window.animHandler.lastDate) * revealSpeed;
        }
        if (self.rectLimit < self.xLimitInitial+ self.xDiff  || ((self.hideAfter < 0) && (self.rectLimit < self.ctx.width))) {
            if (self.rectLimit + ((window.animHandler.newDate - window.animHandler.lastDate) * revealSpeed) > self.pointsStartingX + self.xDiff - 1 &&self.hideAfter === self.initialHideAfter) {
                self.rectLimit = self.pointsStartingX + self.xDiff - 1;
            } else {
                self.rectLimit += (window.animHandler.newDate - window.animHandler.lastDate) * revealSpeed;
            }
        }
        if ((typeof self.points === 'undefined' || self.points.length === 0) && self.hideAfter > 0) {
            var fontSize = 17;
            self.drawText("Click or tap", (self.ctx.width - self.vBase ) / 2 + self.rectLimit / 2 , (self.ctx.height - self.hBase)/2 + (fontSize / 1.3), fontSize, "black", "Oswald", true, true);
            self.drawText("to complete the graph.", (self.ctx.width - self.vBase ) / 2 + self.rectLimit / 2 , (self.ctx.height - self.hBase)/2 - (fontSize / 1.3), fontSize,  "black", "Oswald", true, true);
            
        }
        if (self.vBase === 0) {
            var txtHeight = 14;
            var font = "Oswald"
            var color = "black"
            var textX = 0
            var textY = self.initialPoints[0]
            var text = (((self.initialPoints[0] / self.yRatio) + self.lowY)) + '%';
            self.drawPoint(textX, textY, 'green', 7);
            self.drawText(text, textX,textY, txtHeight, color, font);
            text = window.roundTo(((endingY / self.yRatio) + self.lowY), 1) + '%';
            textX = endingX
            textY = endingY + (4 * self.yDiff);
            self.drawPoint(endingX, endingY, 'green', 7);
            self.drawText(text, textX,textY, txtHeight, color, font, false, true);            
        }
    }    
}
Graph.init = function(ctx, vBase, hBase, spacing, hiddenRegion, data, graphExplanation) {
    this.xLimit = 0;
    this.xLimitInitial = 0;
    this.rectLimit = 0;
    this.setContext(ctx);    
    if (ctx.width < 650) {
        this.setVBase(0);
    } else { 
        this.setVBase(vBase);
    }
        this.setHBase(hBase);
    this.setSpacing(spacing);
    
    this.setDrawLine();
    this.setDrawPoint();
    this.addInitialPoints(data);
    this.setHiddenRegion(hiddenRegion);    
    this.setGraphExplanation(graphExplanation)
}
Graph.init.prototype = Graph;
Graph = Graph.init;

window.onload = function() {
    var gE = document.querySelector('.graph-explanation');
var ctx = c('#interactive-graph', '#canvas-wrapper');
var a = window.animHandler;
a.setContext(ctx);
var str = ctx.canvas.dataset.graphData;
var input = str.split(',');
var myGraph = new Graph(ctx, 100, 45, 10, 2000.5, input, gE);
a.addAnim({elem: myGraph, callback: function() {this.draw()}});
a.animateAll();
var mouseDown = false;
ctx.canvas.addEventListener('mousedown', function(e) {mouseDown = true; e.preventDefault();});
ctx.canvas.addEventListener('mouseleave', function(e) {myGraph.activePoint = -1; myGraph.activeInitialPoint = -1;});
ctx.canvas.addEventListener('touchstart', function(e) {setPointfromMouse(e); mouseDown = true; e.preventDefault();});
document.addEventListener('touchend', function(e) {mouseDown = false;});
document.addEventListener('mouseup', function(e) {mouseDown = false;});
window.resetGraph = myGraph.resetGraph.bind(myGraph);
window.revealGraph = myGraph.revealGraph.bind(myGraph);
var setPointfromMouse = function(e) {
  var e = e.touches ? e.touches[0] : e;
   if (myGraph.hideAfter < 0) {
       return;
   }    
    var mouseX = e.pageX - ctx.canvas.offsetLeft;
    var mouseY = e.pageY - ctx.canvas.offsetTop ;
    var nx = mouseX - myGraph.vBase;
    var ny = ctx.height - mouseY -  myGraph.hBase;
    if (nx >= 0 && nx <= ctx.width && ny >= 0 && ny <= ctx.height && nx > myGraph.hideAfter) {
        nx = Math.round(nx / myGraph.xDiff) * myGraph.xDiff;
        myGraph.addPoint(nx, ny);
    } 
}
ctx.canvas.addEventListener('click', setPointfromMouse);
ctx.canvas.addEventListener('mousemove', function(e) {
    var radius = 9;
    if (mouseDown == true) {
        setPointfromMouse(e);
    }
    var x = (e.pageX - ctx.canvas.offsetLeft - myGraph.vBase);    
    x = Math.round(x / myGraph.spacing) * myGraph.spacing;
    myGraph.activeInitialPoint = -1;
    myGraph.activePoint = -1;
    myGraph.initialPoints.forEach(function(point, index){   
        if (x  <= index + radius && x >= index - radius) {
           myGraph.activeInitialPoint = index;
        }
    });
    if (myGraph.points) {
    myGraph.points.forEach(function(point, index){        
        if (x  <= index + radius && x >= index - radius) {
           myGraph.activePoint = index;
        }
    });
    }
});
ctx.canvas.addEventListener('touchmove', function(e) {
    if (mouseDown == true) {
        setPointfromMouse(e);
        e.preventDefault();
    }
});

window.myGraph = myGraph;
}
