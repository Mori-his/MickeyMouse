const assert = console.assert;


export default abstract class AbstractNode {
    private _depth: number = 0;
    private _owner: Object | null = null;
    private _parent: AbstractNode | null = null;

    protected redepthChild(child: AbstractNode): void {
        assert(child.owner === this.owner);
        if (child._depth <= this._depth) {
            child._depth = this._depth + 1;
            // [child]深度变了children的深度也要变
            child.redepthChildren();
        }
    }

    /**
     * redepthChildren
     * @description 主要用于更新当前节点下的子节点[depth]
     */
    redepthChildren(): void {}

    /**
     * 附加到指定owner
     * @param owner {Object} 所有者
     */
    attach(owner: Object): void {
        assert(owner !== null);
        // 要给当前[node]增加owner当前[node]不能有[owner]
        assert(this._owner === null);
        this._owner = owner;
    }

    detach(): void {
        assert(this._owner !== null);
        this._owner = null;
        assert(this.parent === null || this.attached === this.parent!.attached)
    }

    /**
     * 添加子节点
     * @param child 要关联的[AbstractNode]
     */
    protected adoptChild(child: AbstractNode) {
        assert(Boolean(child));
        // 没有关联父节点
        assert(child._parent === null);
        assert((() => {
            // 新插入的节点不能是自己的父节点
            let node: AbstractNode = this;
            while (node.parent !== null)
                node = node.parent!;
            assert(node !== child);
            return true;
        })());
        // 给子节点指定父节点
        child._parent = this;
        if (this.attached)
            // 给子节点附加owner
            child.attach(this._owner!);
        // 更新[child]深度[_depth]
        this.redepthChild(child);
    }

    protected dropChild(child: AbstractNode): void {
        assert(child !== null);
        assert(child._parent === this);
        assert(child.attached === this.attached);
        child._parent = null;
        if (this.attached)
            // 如果当前节点有[owner],则脱离owner
            child.detach();
    }

    get parent() {
        return this._parent;
    }

    /**
     * attached
     * @description 获取当前是否有根节点
     * @returns {Boolean}
     */
    get attached(): Boolean {
        return Boolean(this._owner);
    }
    /**
     * depth
     * @description 当前节点深度
     * @returns {number}
     */
    get depth(): number {
        return this._depth;
    }

    /**
     * owner
     * @description 当前节点所有者
     * @returns {Object | null | undefined}
     */
    get owner() {
        return this._owner;
    }
}

