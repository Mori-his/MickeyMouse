import { ClassType } from '../types/types';
import { assert } from './assert';
import AbstractNode from './node';

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
export type ContainerParentDataMixin<ChildType extends BasicNode> = {
    previousSibling?: ChildType;
    nextSibling?: ChildType;
    detach(): void
}

type BasicNodeVisitor<T extends BasicNode> = (child: T, index: number) => void

export default class BasicNode extends AbstractNode {

    parentData: ParentData | null = null;

    setupParentData(child: BasicNode) {
        if (!(child.parentData instanceof ParentData))
            child.parentData = new ParentData();
    }

    /**
     * 
     * @param child 
     * @override
     */
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

    visitChildren(visitor: BasicNodeVisitor<BasicNode>): void {}

}





/**
 * 混入方法，只能用于混入[BasicNode]及它的派生类
 * @param TargetClass 继承自BasicNode的对象
 * @returns 
 */
export function ContainerNodeMixin<ChildType extends BasicNode, ParentDataType extends ContainerParentDataMixin<ChildType>>(
    TargetClass: ClassType<BasicNode>
) {
    abstract class _ContainerNodeMixin extends TargetClass {
        constructor(...args: any[]) {
            super(...args);
        }

        childCount: number = 0;
        
        firstChild?: ChildType;

        lastChild?: ChildType;
    
        /**
         * 测试头部节点是否和比较的节点相等
         * @param child 当前child
         * @param equals 要比较的child
         * @returns 是否相等
         */
        protected _debugUltimatePreviousSiblingOf(child: ChildType, equals?: ChildType): boolean {
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
        protected _debugUltimateNextSiblingOf(child: ChildType, equals?: ChildType): boolean {
            let childParentData: ParentDataType = child.parentData! as ParentDataType;
            while (childParentData.nextSibling) {
              assert(childParentData.nextSibling !== child);
              child = childParentData.nextSibling!;
              childParentData = child.parentData! as ParentDataType;
            }
            return child === equals;
        }
        
        /**
         * 插入子节点
         * @param child 要插入的节点
         * @param after 要插入到指定节点位置后面
         */
        protected _insertIntoChildList(child: ChildType, after?: ChildType): void {
            const childParentData = child.parentData! as ParentDataType;
            assert(!childParentData.nextSibling);
            assert(!childParentData.previousSibling);
            this.setChildCount(this.childCount + 1);
            assert(this.childCount > 0);
            if (!after) {
                childParentData.nextSibling = this.firstChild;
                if (this.firstChild) {
                    const _firstChildParsentData = this.firstChild.parentData! as ParentDataType;
                    _firstChildParsentData.previousSibling = child;
                }
                this.firstChild = child;
                this.lastChild ??= child;
            } else {
                assert(this.firstChild);
                assert(this.lastChild);
                // _firstChild是否是第一个节点
                assert(this._debugUltimatePreviousSiblingOf(after, this.firstChild));
                // _lastChild是否是尾部节点
                assert(this._debugUltimateNextSiblingOf(after, this.lastChild));

                const afterParentData = after.parentData! as ParentDataType;
                if (!afterParentData.nextSibling) {
                    // after节点没有了下一个节点，说明after是最后一个节点
                    assert(after === this.lastChild);
                    // 替换下位置, 当前节点的上一个节点是after
                    childParentData.previousSibling = after;
                    // after节点下一个位置是当前要插入的节点
                    afterParentData.nextSibling = child;
                    this.lastChild = child;
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
        
        /**
         * 插入子节点
         * @param child 要插入的节点
         * @param after 要插入此节点的子节点
         */
        insert(child: ChildType, after?: ChildType): void {
            assert(!Object.is(child, this), '不能插入到自身中');
            assert(!Object.is(after, this), '不能同时是另一个 BasicNode 的父级和兄弟级。');
            assert(child !== after, '不能插入在其自身之后');
            assert(child !== this.firstChild);
            assert(child !== this.lastChild);

            this.adoptChild(child)
            this._insertIntoChildList(child, after);
        }

        /**
         * 插入到节点末端
         * @param child 新增子节点
         */
        add(child: ChildType) {
            this.insert(child, this.lastChild);
        }

        /**
         * 插入节点集合到末端
         * @param children 要插入的节点集合
         */
        addAll(children: ChildType[]) {
            children.forEach(this.add.bind(this));
        }

        /**
         * 删除指定节点
         * @param child 要删除的子节点
         */
        private _removeFromChildList(child: ChildType) {
            const childParentData: ParentDataType = child.parentData! as ParentDataType;
            assert(this._debugUltimatePreviousSiblingOf(child, this.firstChild));
            assert(this._debugUltimateNextSiblingOf(child, this.lastChild));
            assert(this.childCount >= 0);

            if (childParentData.previousSibling) {
                // 要删除的child有上一个节点
                const childPreviousSiblingParentData: ParentDataType = childParentData.previousSibling!.parentData! as ParentDataType;
                // 要删除的child的上一个节点的下一个节点是要删除child节点的下一个节点
                childPreviousSiblingParentData.nextSibling = childParentData.nextSibling;
            } else {
                // 如果没有上一个节点说明要删除的节点是顶部节点
                assert(this.firstChild === child);
                // 顶部节点重新赋值给要删除节点的下一个节点
                this.firstChild = childParentData.nextSibling;
            }
            if (childParentData.nextSibling) {
                // 要删除的节点有下一个兄弟节点
                const childNextSiblingParentData: ParentDataType = childParentData.nextSibling!.parentData! as ParentDataType;
                // 要删除节点的下一个兄弟节点的上一个节点修改为要删除节点的上一个兄弟节点
                childNextSiblingParentData.previousSibling = childParentData.previousSibling;
            } else {
                // 没有下一个节点，说明要删除的节点是最底部节点
                assert(this.lastChild === child);
                // 最后一个节点修改为要删除节点的上一个节点
                this.lastChild = childParentData.previousSibling;
            }

            childParentData.previousSibling = undefined;
            childParentData.nextSibling = undefined;
            this.setChildCount(this.childCount - 1)
        }

        /**
         * 要删除的节点并且取消关联[owner]
         * @param child 要删除的节点
         */
        remove(child: ChildType) {
            this._removeFromChildList(child);
            this.dropChild(child);
        }

        /**
         * 删除所有节点
         */
        removeAll() {
            let child: ChildType = this.firstChild!;
            while(child) {
                const childParentData = child.parentData! as ParentDataType;
                const next: ChildType = childParentData.nextSibling!;
                childParentData.previousSibling = undefined;
                childParentData.nextSibling = undefined;
                this.dropChild(child);
                child = next;
            }
            this.firstChild = undefined;
            this.lastChild = undefined;
            this.setChildCount(0);
        }

        /**
         * 移动子节点到指定位置
         * @param child 要移动的节点
         * @param after 移动到此节点的后面
         * @returns void
         */
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

        abstract strideMove(widget: ChildType, after?: ChildType): void

        /**
         * 附加到目标
         * @param owner 附加到此目标
         * @override
         */
        attach(owner: Object) {
            super.attach(owner);
            let child: ChildType = this.firstChild!;
            while(child) {
                child.attach(owner);
                const childParentData: ParentDataType = child.parentData! as ParentDataType;
                child = childParentData.nextSibling!;
            }
        }

        /**
         * 分离附加【owner]
         * @override
         */
        detach() {
            super.detach();
            let child: ChildType = this.firstChild!;
            while(child) {
                child.detach();
                const childParentData: ParentDataType = child.parentData! as ParentDataType;
                child = childParentData.nextSibling!;
            }
        }

        /**
         * 重新计算所有子节点的[depth]深度
         */
        redepthChildren() {
            let child: ChildType = this.firstChild!;
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
            let child: ChildType = this.firstChild!;
            let index = 0;
            while(child) {
                (() => visitor(child, index))();
                const childParentData: ParentDataType = child.parentData! as ParentDataType;
                child = childParentData.nextSibling!;
                index++;
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

        setChildCount(count: number) {
            this.childCount = count;
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


