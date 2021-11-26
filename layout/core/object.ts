import AbstractNode from './node';


const assert = console.assert;

type Class<T> = new (...args: any[]) => T;

export class ParentData {
    detach() {}

    toString() {
        return '<none>';
    }
}

export function ContainerParentDataMixin<ChildType extends BasicNode>(Base: Class<ParentData>) {
    /**
     * 以链表的形式管理children
     */
    class _ContainerParentDataMixin extends Base {
        previousSibling?: ChildType;
        nextSibling?: ChildType;

        detach(): void {}
    }
    return _ContainerParentDataMixin
}
type ContainerParentDataMixin<ChildType extends BasicNode> = {
    previousSibling?: ChildType;
    nextSibling?: ChildType;
    detach(): void
}

type BasicNodeVisitor<T extends BasicNode> = (child: T) => void

export default class BasicNode extends AbstractNode {

    parentData: ParentData | null = null;

    setupParentData(child: BasicNode) {
        if (!(child.parentData instanceof ParentData))
            child.parentData = new ParentData();
    }

    adoptChild(child: BasicNode) {
        assert(child);
        this.setupParentData(child);
        super.adoptChild(child);
    }

    dropChild(child: BasicNode) {
        assert(child);
        assert(child.parentData);
        child.parentData?.detach();
        child.parentData = null;
        super.dropChild(child);
    }

    attach(owner: Object) {
        super.attach(owner);
    }

    detach() {
        super.detach();
    }

    visitChildren(visitor: BasicNodeVisitor<BasicNode>): void {}

}

type ClassType<T> = new(...args: any[]) => T;



/**
 * 混入方法，只能用于混入[BasicNode]及它的派生类
 * @param TargetClass 继承自BasicNode的对象
 * @returns 
 */
export function ContainerNodeMixin<ChildType extends BasicNode, ParentDataType extends ContainerParentDataMixin<ChildType>>(
    TargetClass: ClassType<BasicNode>
) {
    class _ContainerNodeMixin extends TargetClass {
        constructor(...args: any[]) {
            super(...args);
        }

        private _childCount: number = 0;
        get childCount(): number {return this._childCount}
        
        private _firstChild?: ChildType;
        get firstChild(): ChildType | undefined {return this._firstChild}
        private _lastChild?: ChildType;
        get lastChild(): ChildType | undefined {return this._lastChild}
    
        /**
         * 测试头部节点是否和比较的节点相等
         * @param child 当前child
         * @param equals 要比较的child
         * @returns 是否相等
         */
        private _debugUltimatePreviousSiblingOf(child: ChildType, equals?: ChildType): boolean {
            let childParentData: ParentDataType = child.parentData! as ParentDataType;
            while (childParentData.previousSibling) {
                assert(childParentData.previousSibling !== child);
                child = childParentData.previousSibling!;
                childParentData = child.parentData! as ParentDataType;
            }
            return child === equals;
        }
        /**
         * 测试尾部节点是否和比较节点相等
         * @param child 当前节点
         * @param equals 要比较的节点
         * @returns 是否相等
         */
        private _debugUltimateNextSiblingOf(child: ChildType, equals?: ChildType): boolean {
            let childParentData: ParentDataType = child.parentData! as ParentDataType;
            while (childParentData.nextSibling) {
              assert(childParentData.nextSibling !== child);
              child = childParentData.nextSibling!;
              childParentData = child.parentData! as ParentDataType;
            }
            return child === equals;
          }
    
        private _insertIntoChildList(child: ChildType, after?: ChildType) {
            const childParentData = child.parentData! as ParentDataType;
            assert(!childParentData.nextSibling);
            assert(!childParentData.previousSibling);
            this._childCount += 1;
            assert(this._childCount > 0);
            if (!after) {
                childParentData.nextSibling = this._firstChild;
                if (this._firstChild) {
                    const _firstChildParsentData = this._firstChild.parentData! as ParentDataType;
                    _firstChildParsentData.previousSibling = child;
                }
                this._firstChild = child;
                this._lastChild ??= child;
            } else {
                assert(this._firstChild);
                assert(this._lastChild);
                // _firstChild是否是第一个节点
                assert(this._debugUltimatePreviousSiblingOf(after, this._firstChild));
                // _lastChild是否是尾部节点
                assert(this._debugUltimateNextSiblingOf(after, this._lastChild));
                const afterParentData = after.parentData! as ParentDataType;
                if (!afterParentData.nextSibling) {
                    // after节点没有了下一个节点，说明after是最后一个节点
                    assert(after === this._lastChild);
                    // 替换下位置, 当前节点的上一个节点是after
                    childParentData.previousSibling = after;
                    // after节点下一个位置是当前要插入的节点
                    afterParentData.nextSibling = child;
                } else { // after 不是最后一个节点
                    // 当前节点的下个节点就是after的节点
                    childParentData.nextSibling = afterParentData.nextSibling;
                    // 当前节点的上一个节点就是after
                    childParentData.previousSibling = after;
    
                    const childPreviousSiblingParentData: ParentDataType =  childParentData.previousSibling!.parentData! as ParentDataType;
                    const childNextSiblingParentData: ParentDataType = childParentData.nextSibling!.parentData! as ParentDataType;
                    // 当前节点的上一个节点的下一个节点是自己
                    childPreviousSiblingParentData.nextSibling = child;
                    // 当前节点的下一个节点的上一个节点是自己
                    childNextSiblingParentData.previousSibling = child;
                    assert(afterParentData.nextSibling === child);
                }
            }
        }
    
        insert(child: ChildType, after?: ChildType) {
            assert(!Object.is(child, this), '不能插入到自身中');
            assert(!Object.is(after, this), '不能同时是另一个 BasicNode 的父级和兄弟级。');
            assert(child !== after, '不能插入在其自身之后');
            assert(child !== this._firstChild);
            assert(child !== this._lastChild);

            this.adoptChild(child)
            this._insertIntoChildList(child, after);
        }

        add(child: ChildType) {
            this.insert(child, this._lastChild);
        }
        addAll(children: ChildType[]) {
            children.forEach(this.add.bind(this));
        }

        private _removeFromChildList(child: ChildType) {
            const childParentData: ParentDataType = child.parentData! as ParentDataType;
            assert(this._debugUltimatePreviousSiblingOf(child, this._firstChild));
            assert(this._debugUltimateNextSiblingOf(child, this._lastChild));
            assert(this._childCount >= 0);

            if (childParentData.previousSibling) {
                // 要删除的child有上一个节点
                const childPreviousSiblingParentData: ParentDataType = childParentData.previousSibling!.parentData! as ParentDataType;
                // 要删除的child的上一个节点的下一个节点是要删除child节点的下一个节点
                childPreviousSiblingParentData.nextSibling = childParentData.nextSibling;
            } else {
                // 如果没有上一个节点说明要删除的节点是顶部节点
                assert(this._firstChild === child);
                // 顶部节点重新赋值给要删除节点的下一个节点
                this._firstChild = childParentData.nextSibling;
            }
            if (childParentData.nextSibling) {
                // 要删除的节点有下一个兄弟节点
                const childNextSiblingParentData: ParentDataType = childParentData.nextSibling!.parentData! as ParentDataType;
                // 要删除节点的下一个兄弟节点的上一个节点修改为要删除节点的上一个兄弟节点
                childNextSiblingParentData.previousSibling = childParentData.previousSibling;
            } else {
                // 没有下一个节点，说明要删除的节点是最底部节点
                assert(this._lastChild === child);
                // 最后一个节点修改为要删除节点的上一个节点
                this._lastChild = childParentData.previousSibling;
            }

            childParentData.previousSibling = undefined;
            childParentData.nextSibling = undefined;
            this._childCount -= 1;
        }

        remove(child: ChildType) {
            this._removeFromChildList(child);
            this.dropChild(child);
        }

        removeAll() {
            let child: ChildType = this._firstChild!;
            while(child) {
                const childParentData = child.parentData! as ParentDataType;
                const next: ChildType = childParentData.nextSibling!;
                childParentData.previousSibling = undefined;
                childParentData.nextSibling = undefined;
                this.dropChild(child);
                child = next;
            }
            this._firstChild = undefined;
            this._lastChild = undefined;
            this._childCount = 0;
        }

        move(child: ChildType, after?: ChildType) {
            assert(!Object.is(child, this));
            assert(!Object.is(after, this));
            assert(child !== after);
            assert(child.parent === this);
            const childParentData = child.parentData! as ParentDataType;
            
            if (childParentData.previousSibling === after) return;
            this._removeFromChildList(child);
            this._insertIntoChildList(child, after);
            // 这里要有个钩子
        }

        attach(owner: Object) {
            super.attach(owner);
            let child: ChildType = this._firstChild!;
            while(child) {
                child.attach(owner);
                const childParentData: ParentDataType = child.parentData! as ParentDataType;
                child = childParentData.nextSibling!;
            }
        }

        detach() {
            super.detach();
            let child: ChildType = this._firstChild!;
            while(child) {
                child.detach();
                const childParentData: ParentDataType = child.parentData! as ParentDataType;
                child = childParentData.nextSibling!;
            }
        }

        redepthChildren() {
            let child: ChildType = this._firstChild!;
            while(child) {
                this.redepthChild(child);
                const childParentData: ParentDataType = child.parentData! as ParentDataType;
                child = childParentData.nextSibling!;
            }
        }

        /**
         * 以访问者模式处理[children]
         * @param visitor 访问者
         */
        visitChildren(visitor: BasicNodeVisitor<ChildType>) {
            let child: ChildType = this._firstChild!;
            while(child) {
                visitor(child);
                const childParentData: ParentDataType = child.parentData! as ParentDataType;
                child = childParentData.nextSibling!;
            }
        }
        /**
         * 获取指定节点的上一个节点
         * @param child 指定节点
         * @returns 
         */
        childBefore(child: ChildType): ChildType | undefined {
            assert(child);
            assert(child.parent === this);
            const childParentData: ParentDataType = child.parentData! as ParentDataType;
            return childParentData.previousSibling;
        }
        /**
         * 获取指定节点的下一个节点
         * @param child 指定节点
         * @returns 
         */
        childAfter(child: ChildType): ChildType | undefined {
            assert(child);
            assert(child.parent === this);
            const childParentData: ParentDataType = child.parentData! as ParentDataType;
            return childParentData.nextSibling;
        }
    }
    return _ContainerNodeMixin;
}


// export abstract class MultiChild {

//     constructor(public children: Layout[]) {
//         assert(children !== null);
//         assert((() => {
//             for (let i = 0; i < children.length; i++) {
//                 if (children[i] === null) {
//                     throw new Error(`在children中的第${i}中发现有空的子节点`)
//                 }
//             }
//             return true;
//         })());
//     }


// }


