import { TreeWidget } from "@layout/core/layout";
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

type NoInfer<T> = [T][T extends any ? 0 : never];

export  function makeObservableWithWidget<T extends TreeWidget, AdditionalKeys extends PropertyKey = never>(
  target: T,
  annotations?: mobx.AnnotationsMap<T, NoInfer<AdditionalKeys>> | undefined,
  options?: mobx.CreateObservableOptions | undefined
): T {
  return mobx.makeObservable(target, {
      add: mobx.action,
      addAll: mobx.action,
      insert: mobx.action,
      move: mobx.action,
      remove: mobx.action,
      removeAll: mobx.action,
      setShrink: mobx.action,
      setLock: mobx.action,
      setVisible: mobx.action,
      setChildCount: mobx.action,
      setParent: mobx.action,
      childCount: mobx.observable,
      parent: mobx.observable,
      lastChild: mobx.observable,
      _shrink: mobx.observable,
      _lock: mobx.observable,
      visible: mobx.observable,
      shrink: mobx.computed,
      lock: mobx.computed,
      ...annotations,
  }, options);
}
