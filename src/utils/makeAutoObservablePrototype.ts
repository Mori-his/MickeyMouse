import { NoInfer } from "@/types/types";
import { TreeWidget } from "@widgets/treeWidget";
import * as mobx from "mobx";

const annotationsSymbol = Symbol('');
// eslint-disable-next-line @typescript-eslint/ban-types
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

export  function makeObservableWithWidget<T extends TreeWidget, AdditionalKeys extends PropertyKey = never>(
  target: T,
  annotations?: mobx.AnnotationsMap<T, NoInfer<AdditionalKeys>> | undefined,
  options?: mobx.CreateObservableOptions | undefined
): T {
    if ((target as any)[mobx.$mobx]) {
        throw new Error('父类已经注册过了，请使用[mobx.makeObservable]来注册子类的监听');
    }
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
        
        setId: mobx.action,
        setName: mobx.action,
        setAttachOnClick: mobx.action,
        setHorizontal: mobx.action,
        setVertical: mobx.action,
        setBottom: mobx.action,
        setLeft: mobx.action,
        setRight: mobx.action,
        setTop: mobx.action,
        setWidth: mobx.action,
        setHeight: mobx.action,
        setWidthAdaptive: mobx.action,
        setHeightAdaptive: mobx.action,
        setIsDragEnter: mobx.action,
        setSyncs: mobx.action,
        
        id: mobx.observable,
        name: mobx.observable,
        position: mobx.observable,
        size: mobx.observable,
        attachOnClick: mobx.observable,
        childCount: mobx.observable,
        parent: mobx.observable,
        lastChild: mobx.observable,
        _shrink: mobx.observable,
        _lock: mobx.observable,
        visible: mobx.observable,
        syncs: mobx.observable,
        shrink: mobx.computed,
        lock: mobx.computed,
        ...annotations,
    }, options ? {
        ...options
    } : undefined);
}
