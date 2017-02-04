class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(!arguments) throw new Error();
        this.init = config.initial;// for reset
        this.state = config.initial;
        this.states = config.states;
        this.transitions = config.states[this.init].transitions;
        this.history = [this.state];   
        this.deep = 2; // for undo counter    
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
         return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        for(var key in this.states){
            if(state == key){
                
                this.state = state;
                this.transitions = this.states[this.state].transitions;
                this.history.push(this.state);//for undo/redo
                this.deep = 2;
                return;
            }    
        }    
        throw new Error();
        
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        for(var key in this.transitions){
            if(event == key){
                
                this.state = this.transitions[key];
                this.transitions = this.states[this.state].transitions;
                if(!(this.state == this.history[this.history.length-1]))this.history.push(this.state);//for undo/redo
                this.deep = 2;
                return;
            }
        }
        throw new Error();
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.init;
        this.transitions = this.states[this.init].transitions;
        this.history.push(this.state);
        this.deep = 2;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var arr = [];
        if(!event){
            for(var key in this.states){
                arr.push(key);
            }
        }
        else{
            for(var state in this.states){
                for(var trans in this.states[state].transitions){
                    if(event == trans){
                        arr.push(state);
                    }
                }
            }
        }    
        return arr;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.history.length <= 1 || this.history.length - this.deep < 0) return false;
        for( var state in this.states){
            if(state == this.history[this.history.length-this.deep]){
                this.state = this.history[this.history.length-this.deep];
                this.transitions = this.states[state].transitions;
               // this.history.push(this.state);
                this.deep++;
                //this.history.splice(this.history.length-1, 1);
                return true;
            } 
        }
        
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.deep < 3)return false;
        this.deep--;
        this.state = this.history[this.history.length - this.deep+1];
        this.transitions = this.states[this.state].transitions;    
        return true;
         
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
        this.deep = 2;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
