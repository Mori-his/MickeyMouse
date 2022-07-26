import { widgetType } from "@models/factory/widgetTypeClassManage";
import { AudioAnimWidget } from "./audioAnim";


/**
 * 呼吸灯动画
 */
@widgetType('audioAnimLive', {label: '秀场音频动画', icon: 'audio_animate_text'})
export class AudioAnimLiveWidget extends AudioAnimWidget {
    type: string = 'audioAnim'

}
