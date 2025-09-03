import Input from "@components/basic/form/input/input";
import { Textarea } from "@components/basic/form/textarea";
import LightTippy from "@components/basic/toolTip/lightTippy";
import { TextPanelItem } from "@components/container/common/styleds/containerStyle";
import { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { selectStyle } from "@styles/globals";
import { selectCustomTheme } from "@styles/layout.theme";
import { canvasMargins, RootWidget } from "@widgets/root";
import { observer } from "mobx-react";
import Select, { GroupBase, mergeStyles, StylesConfig } from "react-select";


const withSelectStyles: StylesConfig<any, false, GroupBase<any>> = mergeStyles(selectStyle, {
    control: (style) => ({
        ...style,
        backgroundColor: 'transparent',
    }),
    option: (style) => ({
        ...style,
        color: '#fff',
        lineHeight: 1.1,
    }),
    container: (style) => ({
        ...style,
        width: '100%',
    }),
});

export const RootRender = observer(function() {
    const currWidget = ownerCaretaker.currOwner.currWidget as RootWidget;

    return (
        <TitleCollapse
            title="容器配置"
            >
            <div className="padding16">
                <TextPanelItem>
                    <Input
                        label="实际内容高度"
                        labelAnimation
                        type="number"
                        width={ 80 }
                        minimum={ 100 }
                        maximun={ 3000 }
                        center
                        select
                        auto
                        placeholder="实际内容高度"
                        onBlur={ e => currWidget.setting.setContentHeight(e.target.value) }
                        defaultValue={ currWidget.setting.contentHeight }
                        />
                    <Input
                        label="弹幕区最小高度"
                        labelAnimation
                        type="number"
                        width={ 80 }
                        minimum={ 0 }
                        maximun={ 1000 }
                        center
                        select
                        auto
                        placeholder="弹幕区最小高度"
                        onBlur={ e => currWidget.setting.setMinMsgsViewHeight(e.target.value) }
                        defaultValue={ currWidget.setting.minMsgsViewHeight }
                        />
                    <LightTippy
                        content='弹幕上边界距布局顶的高度'
                        >
                        <Input
                            type="number"
                            width={ 80 }
                            minimum={ 0 }
                            maximun={ 1000 }
                            center
                            select
                            auto
                            placeholder="弹幕上边界距布局顶的高度"
                            onBlur={ e => currWidget.setting.setChatAreaMarginTop(e.target.value) }
                            defaultValue={ currWidget.setting.chatAreaMarginTop }
                            />
                    </LightTippy>
                </TextPanelItem>
                <LightTippy
                    content='可选，端上默认从台标下开始画布局。可选贴着屏幕顶开始画'
                    >
                    <TextPanelItem>
                        <Select
                            isClearable={ true }
                            value={ canvasMargins.find(option => option.value === currWidget.setting.canvasMargin) }
                            options={ canvasMargins }
                            styles={ withSelectStyles }
                            theme={ selectCustomTheme }
                            onChange={ (option) => currWidget.setting.setCanvasMargin(option?.value) }
                            />
                    </TextPanelItem>
                </LightTippy>
            </div>
        </TitleCollapse>
    );
});