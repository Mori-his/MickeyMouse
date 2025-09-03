import { TreeWidget } from './treeWidget';

export class Basic extends TreeWidget {
    type: string = 'Basic';
    toJson(): Object {
        throw new Error('Method not implemented.');
    }
    
}