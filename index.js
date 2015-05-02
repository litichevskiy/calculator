(function(window){

    var actions = {
        '+' : function (a, b) { return a + b },
        '-' : function (a, b) { return a - b },
        '*' : function (a, b) { return a * b },
        '/' : function (a, b) { return a / b }
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
                this.value = actions[this.action](this.value, value);
            } else {
                throw('unknown action "' + this.action + '"');
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

    window.Calc = Calc;
})(window);


(function(){

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

                var newNumber = event.target.getAttribute('data-calc-val'),
                    oldNumber =calcNode.input.value,
                    value = oldNumber + newNumber;

                calcNode.input.value = isNaN(value)
                    ? oldNumber
                    : value;
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

    initCalcs( findCalcs() );
})();
