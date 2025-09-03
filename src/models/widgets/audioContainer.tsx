import { widgetType } from "@models/factory/widgetTypeClassManage";
import { AudioViewWidget } from ".";

@widgetType('audioContainer', {label: '秀场音频模式', icon: 'audio_text'})
export class AudioContainerWidget extends AudioViewWidget {
    type: string = 'audioContainer';
    
}