import { assert } from "./assert";



export default abstract class AbstractNode {
    depth: number = 0;
    owner: Object | null = null;
    parent: AbstractNode | null = null;

    protected redepthChild(child: AbstractNode): void {
        assert(child.owner === this.owner);
        if (child.depth <= this.depth) {
            child.depth = this.depth + 1;
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
        assert(this.owner === null);
        this.owner = owner;
    }

    detach(): void {
        assert(this.owner !== null);
        this.owner = null;
        assert(this.parent === null || this.attached === this.parent!.attached)
    }

    /**
     * 添加子节点
     * @param child 要关联的[AbstractNode]
     */
    protected adoptChild(child: AbstractNode) {
        assert(Boolean(child));
        // 没有关联父节点
        assert(child.parent === null);
        assert((() => {
            // 新插入的节点不能是自己的父节点
            let node: AbstractNode = this;
            while (node.parent !== null)
                node = node.parent!;
            assert(node !== child);
            return true;
        })());
        // 给子节点指定父节点
        child.setParent(this);
        if (this.attached)
            // 给子节点附加owner
            child.attach(this.owner!);
        // 更新[child]深度[_depth]
        this.redepthChild(child);
    }

    protected dropChild(child: AbstractNode): void {
        assert(child !== null);
        assert(child.parent === this);
        assert(child.attached === this.attached);
        child.setParent(null);
        if (this.attached)
            // 如果当前节点有[owner],则脱离owner
            child.detach();
    }

    public setParent(parent: AbstractNode | null) {
        this.parent = parent;
    }

    /**
     * attached
     * @description 获取当前是否有根节点
     * @returns {Boolean}
     */
    get attached(): Boolean {
        return Boolean(this.owner);
    }

}

