import { ISyncAttr, NodeSync } from "@/types/types";
import Button from "@components/basic/button";
import ownerCaretaker from "@models/owners";
import { basicSyncs, syncAttrManage } from "@models/syncManage/manage";
import { observer } from "mobx-react";
import { nanoid } from "nanoid";
import { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import { SyncItem } from "./widgets/syncItem";


const SyncWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 8px;
`;

const AddSyncBtn = styled(Button)`
    width: 160px;
    height: 40px;
    font-size: 16px;
    margin-top: 16px;
`;


export const SyncPanel = observer(function SyncPanel() {
    const [syncs, setSyncs] = useState<ISyncAttr[]>([]);
    const currWidget = ownerCaretaker.currOwner.currWidget!;


    useEffect(() => {
        if (currWidget) {
            let currSyncs: ISyncAttr[] = syncAttrManage.get(currWidget.type);
            if (currSyncs) {
                currSyncs = currSyncs.map(sync => {
                    if (typeof sync.label !== 'string') {
                        return {
                            label: sync.value,
                            value: sync.value,
                        };
                    }
                    return sync;
                })
            }
            setSyncs(basicSyncs.concat(currSyncs));
        }
    }, [currWidget]);

    const handleAddClick = function() {
        const widgetSyncs = currWidget.syncs || [];
        currWidget.setSyncs([...widgetSyncs, {
            key: '',
            value: ''
        }]);
    }

    const handleSyncChange = function(option: NodeSync, index: number) {
        const widgetSyncs = [...currWidget.syncs];
        if (widgetSyncs[index]) {
            widgetSyncs[index] = option;
            currWidget.setSyncs([...widgetSyncs]);
        }
    }

    const handleSyncDelete = function(index: number) {
        const widgetSyncs = [...currWidget.syncs];
        widgetSyncs.splice(index, 1);
        currWidget.setSyncs([...widgetSyncs]);
    }


    const MapSyncItem = function(): ReactNode {
        const widgetSyncs = currWidget.syncs;
        return widgetSyncs.map((widgetSync, index) => {

            const currSync = syncs.find(sync => sync.value === widgetSync.key)
            
            return (
                <SyncItem
                    key={ widgetSync.key || nanoid(4) }
                    syncs={ syncs.filter(sync => !widgetSyncs.find(widgetSync => widgetSync.key === sync.value)) }
                    defaultSync={currSync ? {
                        ...currSync,
                        syncValue: widgetSync.value
                    } : {
                        // 目前为了兼容有遗漏的可绑定sync的key做出以下兼容
                        // 传递给Item时 上面同理
                        // [value]代表着选择框的key,
                        value: widgetSync.key,
                        // [label]代表选择框对外展示的名称, 
                        label: widgetSync.key,
                        // [syncValue]是代表着sync表达式
                        syncValue: widgetSync.value
                    }}
                    onChange={ (option) => handleSyncChange(option, index) }
                    onDelete={ () => handleSyncDelete(index) }
                    />
            );
        })
    }


    return (
        <SyncWrapper>
            { MapSyncItem() }
            <AddSyncBtn
                onClick={ handleAddClick }
                >添加</AddSyncBtn>
        </SyncWrapper>
    );
});