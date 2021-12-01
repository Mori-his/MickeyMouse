import * as mobx from "mobx";

const annotationsSymbol = Symbol('');
const objectPrototype: Object = Object.prototype;

export function makeSimpleAutoObservable(target: any, overrides?: any, options?: any) {
  // Make sure nobody called makeObservable/makeAutoObservable/extendObservable/makeSimpleAutoObservable previously (eg in parent constructor)
  if (mobx.isObservable(target)) {
    throw new Error("Target must not be observable");
  }

  let annotations = target[annotationsSymbol];
  if (!annotations) {
    annotations = {}
    const proto = Object.getPrototypeOf(target)
    let current = proto;
    while (current && current !== objectPrototype) {
      Reflect.ownKeys(current).forEach(key => {
        if (key === mobx.$mobx || key === 'constructor') return;
        annotations[key] = !overrides ? true : key in overrides ? overrides[key] : true
      });
      current = Object.getPrototypeOf(current);
    }
    // Cache if class
    if (proto && proto !== objectPrototype) {
      Object.defineProperty(proto, annotationsSymbol, { value: annotations });
    }
  }

  return mobx.makeObservable(target, annotations, options);
}