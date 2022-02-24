import { Gradient } from "@layout/core/gradient"
import { Fillet, TreeWidget, WidgetOptions } from "@layout/core/layout"
import { makeObservableWithWidget } from "@utils/makeAutoObservablePrototype"
import { action, computed, observable } from "mobx"


export interface RootWidgetOptions extends WidgetOptions{
    gameId?: number
    config?: string
    gradient?: Gradient
    fillet?: Fillet
}


export default class RootWidget extends TreeWidget {
    type: string = 'root'
    gameId!: number
    config?: string
    /**
     * 渐变
     */
    gradient?: Gradient
    /**
     * 圆角
     */
    fillet?: Fillet

    __forbidMove: boolean = true;
    allowSibling: boolean = false;

    constructor({
        gameId,
        config,
        gradient,
        fillet,
        ...superOptions
    }: RootWidgetOptions) {
        super(superOptions);
        this.gameId = gameId || 0;
        this.config = config || '';
        this.fillet = fillet;
        makeObservableWithWidget(this, {
            gameId: observable,
            config: observable,
            gradient: observable,
            fillet: observable,

            setGameId: action,
            setConfig: action,
            setGradient: action,
        }, {
            deep: true
        });
    }

    
    setGameId(newId: number) {
        this.gameId = newId;
    }

    setConfig(config?: string) {
        this.config = config;
    }

    setGradient(gradient?: Gradient) {
        this.gradient = gradient;
    }

    toJson() {
        const childrenJson: Array<Object> = [];
        this.visitChildren(child => {
            const currChild = child as TreeWidget;
            childrenJson.push(currChild.toJson());
        });
        return {
            name: this.type,
            game: this.gameId,
            desc: this.description,
            h5Config: this.config,
            prop: {
                layout: {
                }
            },
            child: childrenJson,
        };
    }
}
