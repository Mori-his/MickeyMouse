import { Node } from "@models/factory/types";
import { widgetBuildBFS } from "@models/factory/widgetBuild.factory";
import ownerCaretaker, { Owner } from "@models/owners";
import { spy } from "@models/owners/spy";
import { useEffect } from "react";

import testJson from './test.json';

export const useInnitLayout = function() {
    useEffect(() => {

        let timer: NodeJS.Timeout;
        spy(() => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                // 10秒执行一次存储
                if (ownerCaretaker.childCount) {
                    window.localStorage.setItem("ownerCaretaker", JSON.stringify(ownerCaretaker.toJson()));
                } else {
                    window.localStorage.removeItem("ownerCaretaker");
                }
            }, 5000)
        });
        try {
            const treeData = window.localStorage.getItem('ownerCaretaker')
            if (treeData) {
                const tree = JSON.parse(treeData);
                const selectIndex = tree.selectIndex || 0;

                ownerCaretaker.removeAll();
                let selectOwner: Owner;
                if (tree.owners[selectIndex]) {
                    const owner = tree.owners[selectIndex];
                    if(owner.root[0]) {
                        selectOwner = new Owner(owner.name);
                        selectOwner.add(widgetBuildBFS(owner.root[0]));
                        ownerCaretaker.add(selectOwner);
                        ownerCaretaker.selectedOwner(selectOwner, 0);
                    }
                }

                setTimeout(() => {
                    const owners: Owner[] = []
                    tree.owners.forEach((owner: {name?: string, root: any}, index: number) => {
                        if (index === selectIndex) {
                            owners.push(selectOwner);
                        } else if (owner.root[0]) {
                            const currOwner = new Owner(owner.name);
                            currOwner.add(widgetBuildBFS(owner.root[0]));
                            owners.push(currOwner);
                        }
                    });
                    // treeData
                    ownerCaretaker.removeAll();
                    ownerCaretaker.addAll(owners);
                    ownerCaretaker.selectedOwner(selectOwner, selectIndex);

                }, 100);
            } else {
                
                const owner = new Owner();
                owner.add(widgetBuildBFS(testJson as unknown as Node));
                ownerCaretaker.removeAll();
                ownerCaretaker.add(owner);
                ownerCaretaker.selectedOwner(owner, 0);
            }

        } catch(err) {
            console.error(err);
        }
        window.onbeforeunload = function(event) {
            if (ownerCaretaker.childCount) {
                window.localStorage.setItem("ownerCaretaker", JSON.stringify(ownerCaretaker.toJson()));
            }
            return "确定要离开此页面吗?"
        }
    
        return () => {
            window.onbeforeunload = null
        }
    }, []);
}
