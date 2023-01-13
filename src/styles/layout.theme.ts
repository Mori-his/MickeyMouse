import { Theme } from "react-select";


const LayoutTheme = {
    // 应用于[高亮凸显的, 按钮背景色, 选择框背景色, 输入框背景色]
    primary: '#141719',
    // 应用于[背景色，投影]
    main: '#222831',
    // 互补色，主要应用于[选项卡切换和内容底色一致]
    complementaryColor: '#2a313c',
    // 应用于[高亮突出的文本]
    lightText: '#fff',
    // 引用于[高亮突出的背景色或者前景色]
    light: '#fff',
    lesserText: '#666',
    // 应用于[默认的状态色值, 未选中的icon色， 提示按钮背景色, 下拉框箭头色值]
    lesser: '#818181',
    // 应用于[选中状态的值]
    assist: '#469ADB',
    // 反差色， 应用于[和背景色产生的反差色]
    contrast: '#393e46',
    lightContrast: '#e2e2e2', 
    lightContrastText: '#5b5b5b',
    white30: '#7F7F7F',
    white40: '#a7a7a7',
    white50: '#d8d8d8',
    blue: '#2196F3',
    blue400: '#42A5F5',
    blue700: '#1976D2',
    blue800: '#1565C0',
    blue900: '#0D47A1',
    grey: '#757575',
    grey900: '#212121',
    buttons: {
        primary: {
            color: '#fff',
            backgroundColor: '#141719',
        },
        secondary: {
            color: '#fff',
            backgroundColor: '#6c757d',
        },
        success: {
            color: '#fff',
            backgroundColor: '#28a745',
        },
        warning: {
            color: '#212529',
            backgroundColor: '#ffc107',
        },
        danger: {
            color: '#fff',
            backgroundColor: '#dc3545',
        },
        info: {
            color: '#fff',
            backgroundColor: '#17a2b8',
        },
        light: {
            color: '#212529',
            backgroundColor: '#f8f9fa',
        },
        dark: {
            color: '#fff',
            backgroundColor: '#343a40',
        }
    }
}

 
// primary
// primary75
// primary50
// primary25
// danger
// dangerLight
// neutral0
// neutral5
// neutral10
// neutral20
// neutral30
// neutral40
// neutral50
// neutral60
// neutral70
// neutral80
// neutral90
export const selectCustomTheme = (customTheme: Theme) => ({
    ...customTheme,
    colors: {
        ...customTheme.colors,
        primary: LayoutTheme.assist,
        primary75: LayoutTheme.assist,
        neutral0: LayoutTheme.lightText,
    }
});






export default LayoutTheme;

