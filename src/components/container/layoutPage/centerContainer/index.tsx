import styled, { css, keyframes } from "styled-components";
import { MouseEvent, useEffect, useRef, useState } from "react";
import ownerCaretaker from "@models/owners";
import { IReactionDisposer, reaction} from "mobx";
import { observer } from "mobx-react";
import LightTippy from "@components/basic/toolTip/lightTippy";
import { spy } from "@models/owners/spy";
import { getOffsetTop, getParentScrollEl, toScroll } from "@utils/styleTool";

const CenterWrapper = styled.section`
    margin: 0 auto;
    color: ${props => props.theme.lightText};
`;

interface LayoutContainerProps {
    pid?: string | null
}

const selectPidKeyframes = keyframes`
    0% {
        box-shadow: 0 0 5px rgba(34, 0, 255, 0.2), inset 0 0 5px rgba(255, 0, 187, 0.1), 0 1px 0 #393;
    }
    50% {
        box-shadow: 0 0 20px rgba(0, 42, 255, 0.6), inset 0 0 10px rgba(255, 0, 179, 0.6), 0 1px 0 #6f6;
    }
    100% {
        box-shadow: 0 0 5px rgba(34, 0, 255, 0.2), inset 0 0 5px rgba(255, 0, 187, 0.1), 0 1px 0 #393;
    }
`;

const selectPid = css<LayoutContainerProps>`
    [pid="${props => props.pid}"] {
        border: 1px dashed #fff;
        animation: ${selectPidKeyframes} 2s linear infinite;
    }
    #${props => props.pid} {
        border: 1px dashed #fff;
        animation: ${selectPidKeyframes} 2s linear infinite;
    }
`;


const LayoutContainer = styled.div<LayoutContainerProps>`
    position: relative;
    width: 375px;
	height: 667px;
    border-radius: 20px;
    overflow: hidden;
    background-color: ${props => props.theme.contrast};
    ${props => props.pid ? selectPid : ''};
`;
const LayoutTitle = styled.h1`
    max-width: 375px;
    margin: 5vh 0 8px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

let scrollEl: HTMLElement | null;
export default observer(function CenterContainer() {
    const [selectId, setSelectId] = useState<string | null>(null);
    const containerRef = useRef(null);
    const layoutViewRef = useRef<any>(null);
    const { childCount } = ownerCaretaker;

    const initLayoutView = async function() {
        const {default: LayoutView} = await import('@q/HJ-LayoutView');
        layoutViewRef.current = new LayoutView();
        const layoutView = layoutViewRef.current;

        layoutView.init({
            dom: containerRef.current, // 容器
            unplayCB: async () => { // 看播播放器无法自动播放的回调
                layoutView.vPlayer.unplay(); // 用户手势触发播放
            },
            muteAudio: false, // 看播播放器是否关闭，默认不关闭。 
        });
        ownerCaretaker.currOwner && (ownerCaretaker.currOwner.isAutoImage = true);
        layoutView.updateSync({
            p_layout: ownerCaretaker.currOwner?.firstChild?.toJson()
        });
        ownerCaretaker.currOwner && (ownerCaretaker.currOwner.isAutoImage = false);
        let timer: NodeJS.Timeout;
        let first = true;
        spy(() => {
            if (first) {
                ownerCaretaker.currOwner && (ownerCaretaker.currOwner.isAutoImage = true);
                layoutView.updateSync({
                    p_layout: ownerCaretaker.currOwner?.firstChild?.toJson()
                });
                ownerCaretaker.currOwner && (ownerCaretaker.currOwner.isAutoImage = false);
                first = false;
            }
            if (layoutViewRef.current) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    ownerCaretaker.currOwner && (ownerCaretaker.currOwner.isAutoImage = true);
                    layoutView.updateSync({
                        p_layout: ownerCaretaker.currOwner?.firstChild?.toJson(),
                        dynamic: false
                    });
                    ownerCaretaker.currOwner && (ownerCaretaker.currOwner.isAutoImage = false);
                }, 100);
            }
        });
    }


    useEffect(() => {
        try {
            initLayoutView();
        } catch (err) {
            console.error(err);
        }
    }, []);
    useEffect(() => {
        if (!childCount) return;
        let stopReaction: IReactionDisposer = (() => {}) as IReactionDisposer;
        // 初始化LayoutView

        // 监听 widget的切换  然后同步选中LayoutView上的元素
        stopReaction = reaction(() => ownerCaretaker.currOwner.currWidget, (newWidget) => {
            if (newWidget) {
                let pid = newWidget.id;
                switch(newWidget.type) {
                    case 'video':
                        pid = `${pid}-video`
                        break;
                }
                if (newWidget.type)
                setSelectId(pid.toString());
            } else {
                setSelectId(null);
            }
        });

        return () => {
            stopReaction();                
        }
    }, [childCount]);

    const handleWidgetClick = function(event: MouseEvent<HTMLDivElement>) {
        const divEl: HTMLDivElement = event.target as HTMLDivElement;
        let pid = divEl.getAttribute('pid');
        if (!pid) {
            const id = divEl.getAttribute('id');
            if (id) {
                pid = id.replace(/(.*)\-video/, '$1');
            }
        }
        if (pid) {
            const selectWidget = ownerCaretaker.currOwner?.rollTree[pid];
            ownerCaretaker.currOwner.selectedWidget(selectWidget);

            try {
                if (selectWidget.__el && !scrollEl) {
                    scrollEl = getParentScrollEl(selectWidget.__el);
                }
                if (scrollEl && selectWidget.__el) {
                    const offsetTop = getOffsetTop(selectWidget.__el );
                    toScroll(
                        offsetTop - scrollEl.clientHeight / 2,
                        'scrollTop',
                        scrollEl,
                        11
                    );
                }
            } catch(err) {
                console.error(err);
            }
        }
        setSelectId(pid);
    }
    
    return (
        <CenterWrapper>
            <LightTippy
                content={ ownerCaretaker.currOwner?.name || '' }
                >
                <LayoutTitle>{ ownerCaretaker.currOwner?.name || '' }</LayoutTitle>
            </LightTippy>
            <LayoutContainer
                ref={ containerRef }
                onClick={ event => handleWidgetClick(event)}
                pid={ selectId }
                >
            </LayoutContainer>
        </CenterWrapper>
    )
});
