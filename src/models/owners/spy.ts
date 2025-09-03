import { Reaction } from "mobx";




const spyCallbacks: Function[] = [];
export const spy = function(callback: Function) {
    const index = spyCallbacks.findIndex(item => item === callback);
    if (index > -1) {
        spyCallbacks[index] = callback;
    } else {
        spyCallbacks.push(callback);
    }
    return () => {
        const index = spyCallbacks.findIndex(item => item === callback);
        spyCallbacks.splice(index, 1);
    }
}


export const emitSpy = function(newValue: any, prevValue: any, reaction: Reaction | Object) {
    spyCallbacks.forEach(callback => {
        callback(newValue, prevValue, reaction);
    });
}

