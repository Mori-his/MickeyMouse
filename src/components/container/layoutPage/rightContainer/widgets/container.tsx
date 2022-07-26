import { observer } from "mobx-react";
import Select, { GroupBase, mergeStyles, StylesConfig } from 'react-select';
import { TitleCollapse } from "@components/container/common/title";
import ownerCaretaker from "@models/owners";
import { ContainerWidget, usedBys } from "@widgets/container";
import { selectCustomTheme } from "@styles/layout.theme";
import { selectStyle } from "@styles/globals";


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
        width: '100%'
    }),
});

export const ContainerRender = observer(function() {
    const currWidget = ownerCaretaker.currOwner.currWidget as ContainerWidget;

    return (
        <TitleCollapse
            title="使用此容器的对象"
            >
            <div className="padding16">
                <Select
                    value={ usedBys.find(option => option.value === currWidget.usedBy.value) }
                    options={ usedBys }
                    styles={ withSelectStyles }
                    theme={ selectCustomTheme }
                    onChange={ (option) => (currWidget.setUsedBy(option))}
                    />
            </div>

        </TitleCollapse>
    );
});
