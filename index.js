var Calc = (function(){

    var actions = {
        '+' : function (value) {
            this.value = this.value + value;
        },

        '-' : function (value) {
            this.value = this.value - value;
        },

        '*' : function (value) {
            this.value = this.value * value;
        },

        '/' : function (value) {
            this.value = this.value / value;
        }
    };

    function Calc () {
        this.action = '';
        this.value  = 0;
    }

    Calc.fn = Calc.prototype;

    Calc.fn.eval = function ( value, action ) {

        if ( this.action === '' ) {
            this.action = action;
            this.value = value;
            return this.value;
        } else {

            if ( actions.hasOwnProperty(this.action) ) {
                actions[this.action].call(this, value, action);
            }

            if ( action === '=' ) {
                this.action = '';
            } else {
                this.action = action;
            }

            return this.value;
        }
    };

    Calc.fn.clear = function () {
        this.action = '';
        this.value  = 0;

        return 0;
    };

    return Calc;
})();


var xCalc = (function(){

    function findCalcs () {

        var calcNodes = document.querySelectorAll('[data-calc=cont]');

        return Array.prototype.map.call(calcNodes, function(calcNode){
            return {
                input   : calcNode.querySelector('[data-calc=input]'),
                numbers : calcNode.querySelector('[data-calc=numbers]'),
                actions : calcNode.querySelector('[data-calc=actions]')
            }
        });
    }

    function initCalcs ( calcNodes ) {
        calcNodes.map(function(calcNode){

            calcNode.calc = new Calc();

            calcNode.numbers.addEventListener('click', function (event) {
                if ( calcNode.clearNow ) {
                    calcNode.clearNow = false;
                    calcNode.input.value = '';
                }

                calcNode.input.value += event.target.getAttribute('data-calc-val');
            });

            calcNode.actions.addEventListener('click', function (event) {
                
                var value  = calcNode.input.value || 0,
                    action = event.target.getAttribute('data-calc-val');

                calcNode.clearNow = true;

                if ( action === 'c' ) {
                    calcNode.input.value = calcNode.calc.clear();
                } else {
                    calcNode.input.value = calcNode.calc.eval( +value, action );
                }
            });
        });
    }

    return {
        init : function () {
            initCalcs( findCalcs() )
        }
    }
})();

xCalc.init();

