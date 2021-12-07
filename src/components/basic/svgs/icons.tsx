import React from "react";
import styled, { css } from "styled-components";

export interface IconProps {
    active?: boolean
    activeColor?: string
    hoverColor?: string
    defaultColor?: string
}
type IconPropsWithSize<P> = P & {
    size: number
}

export interface SvgWrapperProps {
    activeColor?: string
    hoverColor?: string
    defaultColor?: string
    active: boolean
    size: number
}

export const SvgWrapperStyle = styled.div<SvgWrapperProps>`
    .svg-stroke {
        stroke: ${props => props.active ? props.activeColor : props.defaultColor || '#818181'};
    }
    .svg-fill {
        fill: ${props => props.active ? props.activeColor : props.defaultColor || '#818181'};
    }
    &:hover {
        .svg-stroke {
            stroke: ${props => props.hoverColor || '#fff'};
        }
        .svg-fill {
            fill: ${props => props.hoverColor || '#fff'};
        }
    }
`;

const SvgWrapper = styled.div<SvgWrapperProps>`
    width: ${props => props.size - 8}px;
    height: ${props => props.size - 8}px;
`;


export function IconWrapper(props: React.PropsWithChildren<IconPropsWithSize<IconProps>>) {
    const { active = false } = props;
    return (
        <SvgWrapper
            activeColor={ props.activeColor }
            hoverColor={ props.hoverColor }
            active={ active }
            size={ props.size }
            >
            { props.children }
        </SvgWrapper>
    )
}



/**
 * 替换外层容器的正则表达式:
 * <rect\s*id="(.*?)"\s*width="24"\s*height="24"\s*fill="none"/>
 * 替换为： <rect id="$1" width="100%" height="100%" fill="none"/>
 * 删除svg中[width, height]属性
 * <svg(\s*(id=".*?"\s*)?xmlns=".*?"\s*)width="24"\s*height="24"\s*viewBox="0 0 24 24">
 * 替换为： <svg$1 viewBox="0 0 24 24">
 */

/**
 * ##设计ICON时注意事项##
 * 1、Icon以正方形呈现
 * 2、icon容器会比实际Icon大8px
 * 3、提供的size一定要大于实际icon大小8px
 * 4、`svgWrapper`会自动计算size大小, 不需要额外处理
 * 5、`svg`元素全部替换为根据父元素大小而变化，在设计中要用矩形全透明元素撑大容器为24*24
 */

/**
 * icons设计规则
 * 1、必须以24*24的大小输出，因为设计稿是按照8栅格来设计的
 * 2、每个icon用以上正则替换
 */

const icons = {
    /**
     * 加号  
     * ![加号](https://p4.ssl.qhimg.com/t01b47a0286ad38b223.jpg)
     */
    add() {
        return (
            <svg
                id="加号"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <rect id="加号容器" width="100%" height="100%" fill="none"/>
                <line
                    id="横线"
                    className="svg-stroke"
                    x2="15"
                    transform="translate(4.5 12.5)"
                    fill="none"
                    stroke="#707070"
                    strokeLinecap="round"
                    strokeWidth="4"
                    />
                <line
                    id="竖线"
                    className="svg-stroke"
                    x2="15"
                    transform="translate(12 5) rotate(90)"
                    fill="none"
                    stroke="#707070"
                    strokeLinecap="round"
                    strokeWidth="4"
                    />
            </svg>
        );
    },
    /**
     * 左对齐  
     * ![左对齐](https://p2.ssl.qhimg.com/t01f27bae505b23dadf.jpg)
     */
    alignLeft() {
        return (
            <svg id="左对齐" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="对齐容器" width="100%" height="100%" fill="none"/>
                <line id="贴靠线" className="svg-stroke" y2="12" transform="translate(4.25 6)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="1"/>
                <line id="直线_31" className="svg-stroke" data-name="直线 31" x2="8" transform="translate(7.5 9.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
                <line id="直线_32" className="svg-stroke" data-name="直线 32" x2="11" transform="translate(7.5 14.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
            </svg>
        );
    },
    /**
     * 顶对齐
     * ![左对齐](https://p1.ssl.qhimg.com/t01126bb578c3788435.jpg)
     */
    alignTop() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g id="顶部对齐" transform="translate(24) rotate(90)">
                    <rect id="对齐容器" width="100%" height="100%" fill="none"/>
                    <line id="贴靠线" className="svg-stroke" y2="12" transform="translate(4.25 6)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="1"/>
                    <line id="直线_31" className="svg-stroke" data-name="直线 31" x2="8" transform="translate(7.5 9.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
                    <line id="直线_32" className="svg-stroke" data-name="直线 32" x2="11" transform="translate(7.5 14.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
                </g>
            </svg>
        );
    },
    /**
     * 右对齐  
     * ![左对齐](https://p4.ssl.qhimg.com/t0166cdcf0a1e25d9d9.jpg)
     */
    alignRight() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g id="右对齐" transform="translate(24 24) rotate(180)">
                    <rect id="对齐容器" width="100%" height="100%" fill="none"/>
                    <line id="贴靠线" className="svg-stroke" y2="12" transform="translate(4.25 6)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="1"/>
                    <line id="直线_31" className="svg-stroke" data-name="直线 31" x2="8" transform="translate(7.5 9.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
                    <line id="直线_32" className="svg-stroke" data-name="直线 32" x2="11" transform="translate(7.5 14.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
                </g>
            </svg>
        );
    },
    /**
     * 底部对齐  
     * ![alignBottom](https://p2.ssl.qhimg.com/t0103e13cc02b97d795.jpg)
     */
    alignBottom() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g id="底部对齐" transform="translate(0 24) rotate(-90)">
                    <rect id="对齐容器" width="100%" height="100%" fill="none"/>
                    <line id="贴靠线" className="svg-stroke" y2="12" transform="translate(4.25 6)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="1"/>
                    <line id="直线_31" className="svg-stroke" data-name="直线 31" x2="8" transform="translate(7.5 9.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
                    <line id="直线_32" className="svg-stroke" data-name="直线 32" x2="11" transform="translate(7.5 14.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
                </g>
            </svg>
        );
    },
    /**
     * 垂直居中  
     * ![垂直居中](https://p5.ssl.qhimg.com/t013a893494a0748298.jpg)
     */
    vertical() {
        return (
            <svg id="垂直居中" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="居中容器" width="100%" height="100%" fill="none"/>
                <line id="直线_3" className="svg-stroke" data-name="直线 3" x2="12" transform="translate(6 12.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="1"/>
                <line id="直线_33" className="svg-stroke" data-name="直线 33" y2="9" transform="translate(13.5 8)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="2"/>
                <line id="直线_34" className="svg-stroke" data-name="直线 34" y2="11" transform="translate(10.5 7)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="2"/>
            </svg>
        );
    },
    /**
     * 水平居中
     * ![水平居中](https://p1.ssl.qhimg.com/t010aeaf216ff75ab4b.jpg)
     */
    horizontal() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g id="水平居中" transform="translate(0 24) rotate(-90)">
                    <rect id="居中容器" width="100%" height="100%" fill="none"/>
                    <line id="直线_3" className="svg-stroke" data-name="直线 3" x2="12" transform="translate(6 12.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="1"/>
                    <line id="直线_33" className="svg-stroke" data-name="直线 33" y2="9" transform="translate(13.5 8)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="2"/>
                    <line id="直线_34" className="svg-stroke" data-name="直线 34" y2="11" transform="translate(10.5 7)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="2"/>
                </g>
            </svg>
        );
    },
    /**
     * 宽度自适应  
     * ![宽度自适应](https://p2.ssl.qhimg.com/t01e5e0c4ba72608d9d.jpg)
     */
    widthAuto() {
        return (
            <svg id="自适应" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g id="双向箭头" transform="translate(3.987 11.602) rotate(-90)">
                    <path id="联合_4" className="svg-fill" data-name="联合 4" d="M2.248,15.532l-2.1-3.454A1,1,0,0,1,1,10.558H2.326v-5.1H1a1,1,0,0,1-.855-1.52L2.248.481a1,1,0,0,1,1.708,0l2.1,3.454A1,1,0,0,1,5.2,5.455H3.878v5.1H5.2a1,1,0,0,1,.855,1.52l-2.1,3.454a1,1,0,0,1-1.708,0Z" fill="#818181"/>
                </g>
                <text id="AUTO" className="svg-fill" transform="translate(3.987 18.603)" fill="#818181" fontSize="6" fontFamily="STHeitiSC-Medium, Heiti SC" fontWeight="500"><tspan x="0" y="0">AUTO</tspan></text>
                <rect id="自适应容器" width="100%" height="100%" fill="none"/>
            </svg>

        );
    },
    heightAuto() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g id="自适应" transform="translate(24) rotate(90)">
                    <g id="双向箭头" transform="translate(4.432 11.603) rotate(-90)">
                        <path id="联合_4" className="svg-fill" data-name="联合 4" d="M2.248,15.532l-2.1-3.454A1,1,0,0,1,1,10.558H2.326v-5.1H1a1,1,0,0,1-.855-1.52L2.248.481a1,1,0,0,1,1.709,0l2.1,3.454A1,1,0,0,1,5.2,5.455H3.878v5.1H5.2a1,1,0,0,1,.854,1.52l-2.1,3.454a1,1,0,0,1-1.709,0Z" transform="translate(0 0)" fill="#818181"/>
                    </g>
                    <text id="AUTO" className="svg-fill" transform="translate(4.444 18.603)" fill="#818181" fontSize="6" fontFamily="STHeitiSC-Medium, Heiti SC" fontWeight="500"><tspan x="0" y="0">AUTO</tspan></text>
                    <rect id="自适应容器" width="100%" height="100%" fill="none"/>
                </g>
            </svg>

        );
    },
    /**
     * 鼠标点击  
     * ![鼠标点击](https://p4.ssl.qhimg.com/t01f4840ada8c72a2ba.jpg)
     */
    mouse() {
        return (
            <svg id="鼠标点击" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path id="FontAwsome_mouse_" className="svg-fill" data-name="FontAwsome (mouse)" d="M0,11a5,5,0,0,0,5,5H7a5,5,0,0,0,5-5V7H0ZM7,0H6.5V6H12V5A5,5,0,0,0,7,0Z" transform="translate(6 4)" fill="#818181"/>
                <path id="FontAwsome_mouse_2" className="svg-fill" data-name="FontAwsome (mouse)" d="M5.5,0H5A5,5,0,0,0,0,5V6H5.5Z" transform="translate(6 4)" fill="#818181"/>
                <rect id="delete_容器" data-name="delete 容器" width="100%" height="100%" fill="none"/>
            </svg>
        );
    },
    /**
     * 删除
     * ![删除](https://p4.ssl.qhimg.com/t01b43068c126d1baba.jpg)
     */
    delete() {
        return (
            <svg id="删除" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="delete_容器" data-name="delete 容器" width="100%" height="100%" fill="none"/>
                <path id="delete" className="svg-fill" d="M13.5,1H9.75L9.456.415A.75.75,0,0,0,8.784,0H5.213a.741.741,0,0,0-.669.416L4.25,1H.5a.5.5,0,0,0-.5.5v1A.5.5,0,0,0,.5,3h13a.5.5,0,0,0,.5-.5v-1A.5.5,0,0,0,13.5,1ZM1.663,14.594A1.5,1.5,0,0,0,3.159,16h7.681a1.5,1.5,0,0,0,1.5-1.406L13,4H1Z" transform="translate(4.952 4)" fill="#818181"/>
            </svg>
        );
    },
    /**
     * 删除条状
     * ![删除条状](https://p2.ssl.qhimg.com/t018f12119efa3211be.jpg)
     */
    deleteHollow() {
        return (
            <svg id="删除条状" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path id="FontAwsome_trash-alt_" className="svg-fill" data-name="FontAwsome (trash-alt)" d="M9.571,14.857h.857a.429.429,0,0,0,.429-.429V6.714a.429.429,0,0,0-.429-.429H9.571a.429.429,0,0,0-.429.429v7.714A.429.429,0,0,0,9.571,14.857Zm5.857-12H12.485L11.271.832A1.714,1.714,0,0,0,9.8,0H6.2A1.714,1.714,0,0,0,4.73.832L3.515,2.857H.571A.571.571,0,0,0,0,3.429V4a.571.571,0,0,0,.571.571h.571v12a1.714,1.714,0,0,0,1.714,1.714H13.143a1.714,1.714,0,0,0,1.714-1.714v-12h.571A.571.571,0,0,0,16,4V3.429A.571.571,0,0,0,15.429,2.857ZM6.137,1.818a.214.214,0,0,1,.184-.1H9.679a.214.214,0,0,1,.184.1l.624,1.039H5.514Zm7.006,14.753H2.857v-12H13.143ZM5.571,14.857h.857a.429.429,0,0,0,.429-.429V6.714a.429.429,0,0,0-.429-.429H5.571a.429.429,0,0,0-.429.429v7.714A.429.429,0,0,0,5.571,14.857Z" transform="translate(4 3)" fill="#818181"/>
                <rect id="删除容器" width="100%" height="100%" fill="none"/>
            </svg>
        )
    },
    /**
     * 睁眼/显示
     * ![睁眼/显示](https://p4.ssl.qhimg.com/t01ca71d6299dc3ad0d.jpg)
     */
    eye() {
        return (
            <svg id="显示状态" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path id="显示" className="svg-fill" d="M17.919,7.487A10.05,10.05,0,0,0,9.014,2,10.052,10.052,0,0,0,.109,7.487a.99.99,0,0,0,0,.9,10.05,10.05,0,0,0,8.905,5.487A10.052,10.052,0,0,0,17.919,8.39a.99.99,0,0,0,0-.9ZM9.014,12.392a4.454,4.454,0,1,1,4.507-4.454A4.481,4.481,0,0,1,9.014,12.392Zm0-7.423a3.016,3.016,0,0,0-.792.117A1.467,1.467,0,0,1,8.075,7.01a1.511,1.511,0,0,1-1.947.146,2.945,2.945,0,0,0,1.223,3.236,3.027,3.027,0,0,0,3.494-.109,2.942,2.942,0,0,0,1.014-3.306A3,3,0,0,0,9.014,4.969Z" transform="translate(2.986 4)" fill="#469adb"/>
                <rect id="显示容器" width="100%" height="100%" fill="none"/>
            </svg>
        )
    },
    /**
     * 闭眼/隐藏  
     * ![闭眼/隐藏](https://p4.ssl.qhimg.com/t012729f9758db9f484.jpg)
     */
    eyeClose() {
        return (
            <svg id="隐藏" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path id="隐藏-2" className="svg-fill" data-name="隐藏" d="M10,12.5A4.483,4.483,0,0,1,5.534,8.34L2.256,5.807A10.415,10.415,0,0,0,1.109,7.544a1.011,1.011,0,0,0,0,.912A10.023,10.023,0,0,0,10,14a9.707,9.707,0,0,0,2.434-.327l-1.622-1.255A4.5,4.5,0,0,1,10,12.5Zm9.807,1.816-3.455-2.67a10.352,10.352,0,0,0,2.539-3.19,1.011,1.011,0,0,0,0-.912A10.023,10.023,0,0,0,10,2,9.63,9.63,0,0,0,5.4,3.178L1.421.105a.5.5,0,0,0-.7.088L.105.983a.5.5,0,0,0,.088.7l18.386,14.21a.5.5,0,0,0,.7-.088l.614-.79A.5.5,0,0,0,19.807,14.316ZM14.066,9.878l-1.228-.949a2.961,2.961,0,0,0-3.628-3.81A1.489,1.489,0,0,1,9.5,6a1.458,1.458,0,0,1-.048.313l-2.3-1.778A4.447,4.447,0,0,1,10,3.5,4.5,4.5,0,0,1,14.5,8a4.393,4.393,0,0,1-.434,1.878Z" transform="translate(2 3.938)" fill="#818181"/>
                <rect id="隐藏容器" width="100%" height="100%" fill="none"/>
            </svg>
        );
    },
    /**
     * 减号/展开状态  
     * ![减号/展开状态](https://p3.ssl.qhimg.com/t019fb97d1f09c98987.jpg)
     */
    minus() {
        return (
            <svg id="展开状态" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="展开icon" className="svg-fill" width="2" height="8" rx="1" transform="translate(8 13) rotate(-90)" fill="#818181"/>
                <rect id="展开容器" width="100%" height="100%" fill="none"/>
            </svg>

        );
    },
    /**
     * 加号/收起
     * ![加号/收起](https://p3.ssl.qhimg.com/t01d6a3bc2916edc3c6.jpg)
     */
    plus() {
        return (
            <svg id="收起" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="收起容器" width="100%" height="100%" fill="none"/>
                <path id="收起-2" className="svg-fill" data-name="收起" d="M2531,1345v-2h-2a1,1,0,0,1,0-2h2v-2a1,1,0,0,1,2,0v2h2a1,1,0,1,1,0,2h-2v2a1,1,0,1,1-2,0Z" transform="translate(-2520 -1330)" fill="#818181"/>
            </svg>

        );
    },
    /**
     * 锁
     * ![锁](https://p5.ssl.qhimg.com/t01c41959cd57b1be03.jpg)
     */
    lock() {
        return (
            <svg id="lock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path id="Icon_awesome-lock" className="svg-fill" data-name="Icon awesome-lock" d="M12.5,7h-.75V4.75a4.75,4.75,0,0,0-9.5,0V7H1.5A1.5,1.5,0,0,0,0,8.5v6A1.5,1.5,0,0,0,1.5,16h11A1.5,1.5,0,0,0,14,14.5v-6A1.5,1.5,0,0,0,12.5,7ZM9.25,7H4.75V4.75a2.25,2.25,0,0,1,4.5,0Z" transform="translate(5 4)" fill="#469adb"/>
                <rect id="lock容器" width="100%" height="100%" fill="none"/>
            </svg>
        );
    },
    /**
     * 解锁  
     * ![解锁](https://p3.ssl.qhimg.com/t01153f214432c89043.jpg)
     */
    unlock() {
        return (
            <svg id="unlock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path id="Icon_awesome-lock-open" className="svg-fill" data-name="Icon awesome-lock-open" d="M13.234,0A4.781,4.781,0,0,0,8.5,4.8V7h-7A1.5,1.5,0,0,0,0,8.5v6A1.5,1.5,0,0,0,1.5,16h11A1.5,1.5,0,0,0,14,14.5v-6A1.5,1.5,0,0,0,12.5,7H11V4.778a2.25,2.25,0,1,1,4.5-.028v2.5a.748.748,0,0,0,.75.75h1A.748.748,0,0,0,18,7.25V4.75A4.755,4.755,0,0,0,13.234,0Z" transform="translate(3 4)" fill="#818181"/>
                <rect id="unlock容器-2" data-name="unlock容器" width="100%" height="100%" fill="none"/>
            </svg>

        );
    },
    /**
     * 下箭头
     * ![下箭头](https://p0.ssl.qhimg.com/t0100791a26d6515ea2.jpg)
     */
    arrowDown() {
        return (
            <svg id="箭头" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g id="箭头-2" data-name="箭头" transform="translate(-164 -307)">
                    <line id="直线_4" className="svg-stroke" data-name="直线 4" x2="8" y2="8" transform="translate(168 315)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                    <line id="直线_5" className="svg-stroke" data-name="直线 5" x1="8" y2="8" transform="translate(176 315)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                </g>
                <rect id="箭头容器" width="100%" height="100%" fill="none"/>
            </svg>
        );
    },
    /**
     * 裁剪ICON  
     * ![裁剪](https://p1.ssl.qhimg.com/t01e80d11243b2d01fa.jpg)
     */
    shear() {
        return (
            <svg id="裁剪" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="矩形_405" data-name="矩形 405" width="100%" height="100%" fill="none"/>
                <path id="联合_8" className="svg-stroke" data-name="联合 8" d="M2535.985,1349.376a1.5,1.5,0,0,1,.148-2.864l-2.13-3.041-6.314-.479,3.978.3,2.336.177-3.512-5.015,3.512,5.015,3.73.283a1.5,1.5,0,1,1,.477,1.082,1.494,1.494,0,0,1-.477-1.082l-3.73-.283,2.13,3.041a1.5,1.5,0,1,1-.148,2.864Z" transform="translate(-2522.677 -1331.977)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
            </svg>
        );
    },
    /**
     * 配置  
     * ![配置](https://p5.ssl.qhimg.com/t019cea60cc5c27fa82.jpg)
     */
    config() {
        return (
            <svg id="icon-基础" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="矩形_433" data-name="矩形 433" width="100%" height="100%" fill="none"/>
                <path id="联合_9" className="svg-stroke" data-name="联合 9" d="M2495.5,1318h0a1.5,1.5,0,0,1,3,0h0a1.5,1.5,0,1,1-3,0Z" transform="translate(-2486.5 -1313)" fill="rgba(0,0,0,0)" stroke="#707070" strokeWidth="2"/>
                <path id="联合_10" className="svg-stroke" data-name="联合 10" d="M2498.5,1318h0a1.5,1.5,0,0,1,3,0h0a1.5,1.5,0,1,1-3,0Z" transform="translate(-2486.5 -1306)" fill="none" stroke="#707070" strokeWidth="2"/>
                <path id="联合_11" className="svg-stroke" data-name="联合 11" d="M2495.5,1318h0a1.5,1.5,0,0,1,3,0h0a1.5,1.5,0,1,1-3,0Z" transform="translate(-2486.5 -1299)" fill="none" stroke="#707070" strokeWidth="2"/>
            </svg>
        );
    },
    /**
     * 走马灯
     * ![走马灯](https://p2.ssl.qhimg.com/t0136d44ca868abe243.jpg)
     */
    swiper() {
        return (
            <svg id="走马灯icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="走马灯容器" width="100%" height="100%" fill="none"/>
                <path id="上方" className="svg-fill" d="M3,0h8l3,4H0Z" transform="translate(5 3)" fill="#707070"/>
                <path id="下方" className="svg-fill" d="M3,4h8l3-4H0Z" transform="translate(5 17)" fill="#707070"/>
                <rect id="中间方块" className="svg-fill" width="14" height="8" transform="translate(5 8)" fill="#707070"/>
            </svg>
        );
    },
    /**
     * 截取字符串  
     * ![截取字符串](https://p2.ssl.qhimg.com/t01aa0009b04113aa85.jpg)
     */
    substr() {
        return (
            <svg id="截取字符串" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="矩形_361" data-name="矩形 361" width="24" height="24" rx="8" fill="none"/>
                <path id="联合_5" className="svg-stroke" data-name="联合 5" d="M2530,1340h0v0h0v0Z" transform="translate(-2524.5 -1330.5)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                <path id="联合_6" className="svg-stroke" data-name="联合 6" d="M2,2H2V2H2V2Z" transform="translate(15.5 20.5) rotate(180)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                <path id="联合_7" className="svg-stroke" data-name="联合 7" d="M2530,1338v0Zm-2,0h0Z" transform="translate(-2520.5 -1325.5)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                <circle id="椭圆_1" className="svg-fill" data-name="椭圆 1" cx="1" cy="1" r="1" transform="translate(12 5)" fill="#707070"/>
                <circle id="椭圆_2" className="svg-fill" data-name="椭圆 2" cx="1" cy="1" r="1" transform="translate(15 5)" fill="#707070"/>
                <circle id="椭圆_3" className="svg-fill" data-name="椭圆 3" cx="1" cy="1" r="1" transform="translate(18 5)" fill="#707070"/>
            </svg>
        );
    },
    /**
     * 文本左对齐  
     * ![文本左对齐](https://p5.ssl.qhimg.com/t0137fcb5fdc9387054.jpg)
     */
    alignLeftText() {
        return (
            <svg id="左对齐" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="对齐容器" width="100%" height="100%" fill="none"/>
                <line id="直线_12" className="svg-stroke"  data-name="直线 12" x2="14" transform="translate(5 6)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line id="直线_13" className="svg-stroke" data-name="直线 13" x2="8" transform="translate(5 10)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line id="直线_15" className="svg-stroke" data-name="直线 15" x2="8" transform="translate(5 18)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line id="直线_14" className="svg-stroke" data-name="直线 14" x2="14" transform="translate(5 14)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
            </svg>
        );
    },
    /**
     * 文本居中对齐  
     * ![文本居中对齐](https://p0.ssl.qhimg.com/t01777eca1fd8b3e67a.jpg)
     */
    alignCenterText() {
        return (
            <svg id="居中对齐" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="对齐容器" width="100%" height="100%" fill="none"/>
                <line id="直线_12" className="svg-stroke" data-name="直线 12" x2="14" transform="translate(5 6)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line id="直线_13" className="svg-stroke" data-name="直线 13" x2="8" transform="translate(8.5 10)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line id="直线_15" className="svg-stroke" data-name="直线 15" x2="8" transform="translate(8.5 18)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line id="直线_14" className="svg-stroke" data-name="直线 14" x2="14" transform="translate(5 14)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
            </svg>
        );
    },
    /**
     * 文本右对齐  
     * ![文本右对齐](https://p1.ssl.qhimg.com/t01c971b7e140717502.jpg)
     */
    alignRightText() {
        return (
            <svg id="右对齐" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="对齐容器" width="100%" height="100%" fill="none"/>
                <line id="直线_12" className="svg-stroke" data-name="直线 12" x2="14" transform="translate(5 6)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line id="直线_13" className="svg-stroke" data-name="直线 13" x2="8" transform="translate(11 10)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line id="直线_15" className="svg-stroke" data-name="直线 15" x2="8" transform="translate(11 18)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line id="直线_14" className="svg-stroke" data-name="直线 14" x2="14" transform="translate(5 14)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
            </svg>
        );
    },
    /**
     * 数字格式化  
     * ![数字格式化](https://p2.ssl.qhimg.com/t0118689ff2e29d13e4.jpg)
     */
    format() {
        return (
            <svg id="数字格式化" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="矩形_362" data-name="矩形 362" width="100%" height="100%" fill="none"/>
                <rect id="矩形_363" className="svg-stroke" data-name="矩形 363" width="3" height="6" transform="translate(4.5 13)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                <rect id="矩形_364" className="svg-stroke" data-name="矩形 364" width="3" height="6" transform="translate(11.5 13)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                <rect id="矩形_365" className="svg-stroke" data-name="矩形 365" width="3" height="6" transform="translate(16.5 13)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                <circle id="椭圆_4" data-name="椭圆 4" cx="1" cy="1" r="1" transform="translate(8.5 17.5)" fill="#707070"/>
                <text id="_" className="svg-fill" data-name="%" transform="translate(16 10)" fill="#666" fontSize="8" fontFamily="PingFangSC-Medium, PingFang SC" fontWeight="500"><tspan x="-3.96" y="0">%</tspan></text>
                <text id="_2" className="svg-fill" data-name="￥" transform="translate(8 10)" fill="#666" fontSize="8" fontFamily="PingFangSC-Medium, PingFang SC" fontWeight="500"><tspan x="-4" y="0">￥</tspan></text>
            </svg>
        );
    },
    /**
     * 正常数字  
     * ![正常数字](https://p5.ssl.qhimg.com/t01f13d486473ddbad7.jpg)
     */
    number() {
        return (
            <svg id="正常数字" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="正常数字背景" width="100%" height="100%" fill="none"/>
                <path className="svg-fill" id="排除_1" data-name="排除 1" d="M2542,1350h-12a2,2,0,0,1-2-2v-8a2,2,0,0,1,2-2h12a2,2,0,0,1,2,2v8A2,2,0,0,1,2542,1350Zm-4.024-4.8h0a2.025,2.025,0,0,0,.672,1.463,2.124,2.124,0,0,0,1.408.448,2.2,2.2,0,0,0,1.5-.512,1.7,1.7,0,0,0,.544-1.3,1.21,1.21,0,0,0-.288-.832,1.6,1.6,0,0,0-.768-.473,1.236,1.236,0,0,0,.943-1.255,1.427,1.427,0,0,0-.511-1.152,2.14,2.14,0,0,0-1.384-.416,1.937,1.937,0,0,0-1.368.472,1.851,1.851,0,0,0-.632,1.328h.856a1.178,1.178,0,0,1,.344-.792,1.159,1.159,0,0,1,.808-.264,1.126,1.126,0,0,1,.776.232.865.865,0,0,1,.248.656.833.833,0,0,1-.273.664,1.184,1.184,0,0,1-.792.231h-.408v.656h.416a1.314,1.314,0,0,1,.856.24.884.884,0,0,1,.312.744.966.966,0,0,1-.3.712,1.258,1.258,0,0,1-.887.319,1.134,1.134,0,0,1-1.193-1.175Zm-2.687-3.289a1.123,1.123,0,0,1,.776.24.931.931,0,0,1,.264.72,1.4,1.4,0,0,1-.392.936,5.905,5.905,0,0,1-.816.656,7.251,7.251,0,0,0-1.288,1.04,2.16,2.16,0,0,0-.568,1.5h3.936v-.769h-2.856a2.812,2.812,0,0,1,1.1-1.08,7.867,7.867,0,0,0,1.184-.92,1.988,1.988,0,0,0,.56-1.352,1.617,1.617,0,0,0-.519-1.232,1.942,1.942,0,0,0-1.353-.472,1.878,1.878,0,0,0-1.472.616,2.213,2.213,0,0,0-.552,1.536h.872a1.746,1.746,0,0,1,.3-1.049A.955.955,0,0,1,2535.288,1341.912Zm-4.081.424V1347h.872v-5.712h-.656a3.278,3.278,0,0,1-1.528.9v.864a3.109,3.109,0,0,0,1.311-.718Z" transform="translate(-2524 -1332)" fill="#707070"/>
            </svg>

        );
    },
    /**
     * 透明度  
     * ![透明度](https://p3.ssl.qhimg.com/t01e22214a3a31e86a1.jpg)
     */
    opacity() {
        return (
            <svg id="透明度" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="透明图容器" width="100%" height="100%" fill="none"/>
                <path id="透明度-2" className="svg-stroke" data-name="透明度" d="M2544,1354h-16v-16h16v16Zm-14-14h0l12,12Zm0,4h0l8,8Zm0,5h0l3,3Zm4-9h0l8,8Zm5,0h0l3,3Z" transform="translate(-2524 -1334)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
            </svg>
        );
    },
    /**
     * 全角状态
     * ![圆角锁定状态](https://p0.ssl.qhimg.com/t01b424c70e5b073fc0.jpg)
     */
    angleFull() {
        return (
            <svg id="圆角锁定状态" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="锁定容器" width="100%" height="100%" fill="none"/>
                <g id="锁定图形" className="svg-stroke" transform="translate(4 4)" fill="none" stroke="#707070" strokeWidth="1">
                    <rect width="16" height="16" rx="4" stroke="none"/>
                    <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="none"/>
                </g>
            </svg>
        );
    },
    /**
     * 圆角释放状态
     * ![圆角释放状态](https://p2.ssl.qhimg.com/t0152c10efccd9053f6.jpg)
     */
    angleMulti() {
        return (
            <svg id="圆角释放状态" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="释放容器" width="100%" height="100%" fill="none"/>
                <path id="angle-top-left" className="svg-stroke" d="M4.509,8.979c-.133-.9-.139-4.8,4.5-4.489" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
                <path id="angle-bottom-left" className="svg-stroke" d="M4.509,4.473c-.133.9-.139,4.8,4.5,4.489" transform="translate(0 10.527)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
                <path id="angle-top-right" className="svg-stroke" d="M8.972,8.979c.133-.9.139-4.8-4.5-4.489" transform="translate(10.527 0.021)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
                <path id="angle-bottom-right" className="svg-stroke" d="M8.972,4.473c.133.9.139,4.8-4.5,4.489" transform="translate(10.527 10.527)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
            </svg>
        );
    },
    /**
     * 选择框-选中
     * ![checkout](https://p2.ssl.qhimg.com/t01851f66dc5aba7b0a.jpg)
     */
    checkout() {
        return (
            <svg id="checkout" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="矩形_388" data-name="矩形 388" width="100%" height="100%" fill="none"/>
                <g id="矩形_389" className="svg-stroke" data-name="矩形 389" transform="translate(4 4)" fill="none" stroke="#707070" strokeWidth="2">
                    <rect width="16" height="16" rx="4" stroke="none"/>
                    <rect x="1" y="1" width="14" height="14" rx="3" fill="none"/>
                </g>
            </svg>
        );
    },
    /**
     * 选择框-选中
     * ![checked](https://p2.ssl.qhimg.com/t011bce9863cf9be8d5.jpg)
     */
    checked() {
        return (
            <svg id="checkout" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="矩形_388" data-name="矩形 388" width="100%" height="100%" fill="none"/>
                <g id="路径_14" data-name="路径 14" transform="translate(4 4)" fill="none">
                    <path d="M4,0h8a4,4,0,0,1,4,4v8a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z" stroke="none"/>
                    <path className="svg-fill" d="M 4 2 C 2.897199630737305 2 2 2.897199630737305 2 4 L 2 12 C 2 13.1028003692627 2.897199630737305 14 4 14 L 12 14 C 13.1028003692627 14 14 13.1028003692627 14 12 L 14 4 C 14 2.897199630737305 13.1028003692627 2 12 2 L 4 2 M 4 0 L 12 0 C 14.20913982391357 0 16 1.790860176086426 16 4 L 16 12 C 16 14.20913982391357 14.20913982391357 16 12 16 L 4 16 C 1.790860176086426 16 0 14.20913982391357 0 12 L 0 4 C 0 1.790860176086426 1.790860176086426 0 4 0 Z" stroke="none" fill="#469adb"/>
                </g>
                <path id="路径_13" className="svg-stroke" data-name="路径 13" d="M-2265.183-1159.506l2.657,3.615,4.984-6.109" transform="translate(2273.183 1170.945)" fill="none" stroke="#469adb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            </svg>
        );
    },
    /**
     * 高斯模糊  
     * ![高斯模糊](https://p4.ssl.qhimg.com/t019645c04d7112deb9.jpg)
     */
    blur() {
        return (
            <svg id="高斯模糊" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="高斯模糊容器" width="100%" height="100%" fill="none"/>
                <g id="高斯模糊-2" data-name="高斯模糊" transform="translate(-279.293 -167.819)">
                    <path id="路径_15" className="svg-stroke" data-name="路径 15" d="M-2238.878-1166.049s-4.082,4.233-4.753,6.213c-2.667,8.666,12.244,8.821,9.579,0C-2234.837-1161.852-2238.878-1166.049-2238.878-1166.049Z" transform="translate(2530.191 1339.318)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                    <path id="路径_16" className="svg-stroke" data-name="路径 16" d="M-2240.6-1155.17c1.057.058,2.276,1.49,2.1,2.315" transform="translate(2528.474 1336.56)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
                    <line id="直线_21" className="svg-stroke" data-name="直线 21" x2="9.704" y2="10.45" transform="translate(286.455 175.918)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
                </g>
            </svg>
        );
    },
    /**
     * contain-裁剪图片
     * ![contain-裁剪图片](https://p3.ssl.qhimg.com/t01472407b4ca961157.jpg)
     */
    containImage() {
        return (
            <svg id="图片裁剪contain" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="矩形_402" data-name="矩形 402" width="100%" height="100%" fill="none"/>
                <path id="排除_4" className="svg-fill" data-name="排除 4" d="M2234.5,1179h-10a.5.5,0,0,1-.5-.5v-8a.5.5,0,0,1,.5-.5h10a.5.5,0,0,1,.5.5v8A.5.5,0,0,1,2234.5,1179Zm-9.5-6.5v5.5h9v-3.816l-2.111-.949-5.182.188L2225,1172.5Zm2.234-1.458a.645.645,0,0,0-.514.214.873.873,0,0,0,0,1.057.653.653,0,0,0,.514.212.661.661,0,0,0,.514-.21.779.779,0,0,0,.18-.53.769.769,0,0,0-.18-.532A.654.654,0,0,0,2227.234,1171.044Zm-1.474,0a.615.615,0,0,0-.519.226.929.929,0,0,0-.006,1.034.638.638,0,0,0,.528.224.62.62,0,0,0,.4-.132.637.637,0,0,0,.224-.39h-.212a.447.447,0,0,1-.15.252.483.483,0,0,1-.614-.072.775.775,0,0,1,0-.792.407.407,0,0,1,.348-.158.442.442,0,0,1,.256.068.349.349,0,0,1,.139.214h.211a.529.529,0,0,0-.19-.345A.636.636,0,0,0,2225.76,1171.044Zm7.149.382h.007l.739,1.075h.211v-1.428h-.218v1.062h-.008l-.73-1.062h-.22v1.428h.219v-1.074Zm-4.542,0h.008l.738,1.075h.211v-1.428h-.218v1.062h-.008l-.73-1.062h-.22v1.428h.218v-1.074Zm2.7.706h.614l.134.368h.234l-.55-1.428h-.249l-.55,1.428h.232l.134-.368Zm1.126-1.06v1.428h.216v-1.428Zm-2.216.186v1.242h.215v-1.242h.476v-.186H2229.5v.186Zm-2.74,1.078a.438.438,0,0,1-.354-.152.715.715,0,0,1,0-.795.487.487,0,0,1,.706-.005.622.622,0,0,1,.123.4.608.608,0,0,1-.123.4A.434.434,0,0,1,2227.234,1172.336Zm4.378-.384h-.482l.238-.646h.008l.236.645Z" transform="translate(-2217.5 -1162.5)" fill="#707070"/>
                <g id="外层容器" className="svg-stroke" transform="translate(5 5)" fill="none" stroke="#707070" strokeWidth="1" strokeDasharray="1">
                    <rect width="14" height="14" stroke="none"/>
                    <rect x="0.5" y="0.5" width="13" height="13" fill="none"/>
                </g>
            </svg>

        );
    },
    /**
     * fill-裁剪图片  
     * ![fill-裁剪图片](https://p3.ssl.qhimg.com/t010767a7abac12bb0b.jpg)
     */
    fillImage() {
        return (
            <svg id="图片裁剪fill" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="矩形_402" data-name="矩形 402" width="100%" height="100%" fill="none"/>
                <path id="排除_2" className="svg-fill" data-name="排除 2" d="M2214.5,1185h-14a.5.5,0,0,1-.5-.5v-14a.5.5,0,0,1,.5-.5h14a.5.5,0,0,1,.5.5v14A.5.5,0,0,1,2214.5,1185Zm-13.5-10.21V1184h13v-3.551l-3.229-3.11-7.1.551-2.675-3.1Zm8.476-2.146v2.856h2v-.372h-1.572v-2.484Zm-2.364,0v2.856h2v-.372h-1.571v-2.484Zm-1,0v2.856h.431v-2.856Zm-2.333,0v2.856h.437v-1.28h1.42v-.372h-1.42v-.833h1.5v-.372Z" transform="translate(-2195.5 -1165.5)" fill="#707070"/>
                <g id="矩形_404" className="svg-stroke" data-name="矩形 404" transform="translate(5 5)" fill="none" stroke="#707070" strokeWidth="1" strokeDasharray="1">
                    <rect width="14" height="14" stroke="none"/>
                    <rect x="0.5" y="0.5" width="13" height="13" fill="none"/>
                </g>
            </svg>
        );
    },
    /**
     * cover-裁剪图片  
     * ![cover-裁剪图片](https://p5.ssl.qhimg.com/t01adf521cb9eecb404.jpg)
     */
    coverImage() {
        return (
            <svg id="图片裁剪cover" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
                <defs>
                    <clipPath id="clip-path">
                        <path id="路径_20" className="svg-fill" data-name="路径 20" d="M-2156.495-1166.132l.166,11.741-11.228,3.7h-5.356l.4-15.444Z" transform="translate(2480 1338)" fill="#fff"/>
                    </clipPath>
                </defs>
                <rect id="裁剪容器" width="100%" height="100%" fill="none"/>
                <g id="裁剪图" transform="translate(-303.088 -167.868)">
                    <g id="蒙版组_15" data-name="蒙版组 15" clipPath="url(#clip-path)">
                    <rect id="矩形_402" data-name="矩形 402" width="12" height="12" transform="translate(309 174)" fill="none"/>
                    <g id="组_20" data-name="组 20">
                        <g id="矩形_404" className="svg-stroke" data-name="矩形 404" transform="translate(309 173)" fill="none" stroke="#707070" strokeWidth="1" strokeDasharray="1">
                        <rect width="14" height="14" stroke="none"/>
                        <rect x="0.5" y="0.5" width="13" height="13" fill="none"/>
                        </g>
                        <path id="排除_3" className="svg-fill" data-name="排除 3" d="M2493.906,1352.073h-13.319a.5.5,0,0,1-.5-.5v-13.206a.5.5,0,0,1,.5-.5h13.319a.5.5,0,0,1,.5.5v13.206A.5.5,0,0,1,2493.906,1352.073Zm-12.819-8.363v7.363h12.318V1349.5l-2.888-3.263-7.1.646-2.334-3.17Zm4.6-3.078a.967.967,0,0,0-.77.321,1.311,1.311,0,0,0,0,1.587,1.1,1.1,0,0,0,1.542,0,1.311,1.311,0,0,0,0-1.594A.984.984,0,0,0,2485.685,1340.632Zm-2.21,0a.926.926,0,0,0-.78.339,1.4,1.4,0,0,0-.009,1.551.957.957,0,0,0,.792.336.922.922,0,0,0,.594-.2.946.946,0,0,0,.336-.585h-.318a.669.669,0,0,1-.225.378.728.728,0,0,1-.921-.107,1.164,1.164,0,0,1,0-1.189.611.611,0,0,1,.522-.237.667.667,0,0,1,.384.1.521.521,0,0,1,.207.32h.318a.794.794,0,0,0-.285-.516A.949.949,0,0,0,2483.474,1340.632Zm3.387.042h0l.768,2.142h.4l.769-2.142h-.354l-.606,1.776h-.009l-.608-1.776Zm4.407,1.256h.579a.43.43,0,0,1,.282.078.375.375,0,0,1,.114.258l.027.266a.558.558,0,0,0,.093.283h.355a.522.522,0,0,1-.126-.315l-.036-.342a.393.393,0,0,0-.321-.378v-.006a.474.474,0,0,0,.279-.189.51.51,0,0,0,.09-.3.562.562,0,0,0-.2-.465.821.821,0,0,0-.516-.147h-.948v2.142h.328v-.885Zm-2.25-1.256v2.142h1.589v-.279h-1.263v-.681h1.14v-.279h-1.14v-.624h1.212v-.279Zm-3.334,1.9a.658.658,0,0,1-.531-.228,1.075,1.075,0,0,1,0-1.191.637.637,0,0,1,.531-.231.644.644,0,0,1,.528.222.935.935,0,0,1,.183.606.915.915,0,0,1-.183.6A.652.652,0,0,1,2485.685,1342.57Zm6.162-.917h-.579v-.7h.576a.529.529,0,0,1,.33.084.319.319,0,0,1,.1.261.329.329,0,0,1-.105.261A.5.5,0,0,1,2491.847,1341.653Z" transform="translate(-2171.247 -1164.948)" fill="#707070"/>
                    </g>
                    </g>
                    <g id="裁剪" transform="translate(312 179)">
                    <rect id="矩形_405" data-name="矩形 405" width="12" height="12" fill="none"/>
                    <path id="联合_8" className="svg-stroke" data-name="联合 8" d="M4.035,5.311a.73.73,0,0,1,.072-1.393L3.071,2.439,0,2.206l1.935.147,1.136.086L1.363,0,3.071,2.439l1.814.138a.73.73,0,1,1,.232.526.726.726,0,0,1-.232-.526L3.071,2.439,4.106,3.918a.73.73,0,1,1-.072,1.393Z" transform="translate(2.438 3.151)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                    </g>
                </g>
            </svg>
        );
    },
    /**
     * Code
     * ![Code](https://p5.ssl.qhimg.com/t0133498dbd0ec7f2ad.jpg)
     */
    code() {
        return (
            <svg id="code" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="code容器" width="100%" height="100%" fill="none"/>
                <g id="left" transform="translate(-376 -170)">
                    <line id="直线_27" className="svg-stroke" data-name="直线 27" x1="6" y2="6" transform="translate(380 176)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                    <line id="直线_28" className="svg-stroke" data-name="直线 28" x2="6" y2="6" transform="translate(380 182)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                </g>
                <g id="right" transform="translate(14 6)">
                    <line id="直线_27-2" className="svg-stroke" data-name="直线 27" x2="6" y2="6" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                    <line id="直线_28-2" className="svg-stroke" data-name="直线 28" x1="6" y2="6" transform="translate(0 6)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                </g>
            </svg>
        );
    },
    /**
     * JSON  
     * ![JSON](https://p5.ssl.qhimg.com/t01534a73c9d10e7fc1.jpg)
     */
    json() {
        return (
            <svg id="JSON" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="矩形_447" data-name="矩形 447" width="100%" height="100%" fill="none"/>
                <text id="_" className="svg-fill" data-name="{" transform="translate(4 18)" fill="#818181" fontSize="16" fontFamily="PingFangSC-Medium, PingFang SC" fontWeight="500"><tspan x="0" y="0">{'{'}</tspan></text>
                <text id="_2" className="svg-fill" data-name="}" transform="translate(15 18)" fill="#818181" fontSize="16" fontFamily="PingFangSC-Medium, PingFang SC" fontWeight="500"><tspan x="0" y="0">{'}'}</tspan></text>
            </svg>
        );
    },
    /**
     * 导入  
     * ![导入](https://p0.ssl.qhimg.com/t01a3e8ee121e98d3c1.jpg)
     */
    import() {
        return (
            <svg id="导入-import" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="矩形_450" data-name="矩形 450" width="100%" height="100%" fill="none"/>
                <path id="联合_12" className="svg-stroke" data-name="联合 12" d="M2492.6,1322.761h1.888c.282-6.125-3.526-6.663-3.487-6.724,5.915-.545,5.929,4.975,5.788,6.724h1.812l-3,6Z" transform="translate(-2482.5 -1310.5)" fill="none" stroke="#707070" strokeWidth="1"/>
            </svg>
        );
    },
    /**
     * 导出  
     * ![导出](https://p1.ssl.qhimg.com/t01b291c725c995ce61.jpg)
     */
    export() {
        return (
            <svg id="导出-export" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="矩形_451" data-name="矩形 451" width="100%" height="100%" fill="none"/>
                <path id="联合_13" className="svg-stroke" data-name="联合 13" d="M2492.6,1322.761h1.888c.282-6.125-3.526-6.663-3.487-6.724,5.915-.545,5.929,4.975,5.788,6.724h1.812l-3,6Z" transform="matrix(-0.574, -0.819, 0.819, -0.574, 359.634, 2814.379)" fill="none" stroke="#707070" strokeWidth="1"/>
            </svg>

        );
    },
    /**
     * 关闭
     * ![关闭](https://p1.ssl.qhimg.com/t0101aa368bdd1af069.jpg)
     */
    close() {
        return (
            <svg id="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <line id="直线_29" className="svg-stroke" data-name="直线 29" x2="12" y2="12" transform="translate(5.884 5.884)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line id="直线_30" className="svg-stroke" data-name="直线 30" x2="12" y2="12" transform="translate(18.116 5.884) rotate(90)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <rect id="close-容器" width="100%" height="100%" fill="none"/>
            </svg>
        );
    },
    /**
     * 设置  
     * ![设置](https://p2.ssl.qhimg.com/t01418a1eb2bdac2755.jpg)
     */
    settings() {
        return (
            <svg id="settings" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect id="settings-容器" width="100%" height="100%" fill="none"/>
                <path id="联合_14" className="svg-fill" data-name="联合 14" d="M2498.5,1332a.5.5,0,0,1-.5-.5v-.571a6.937,6.937,0,0,1-1.6-.429l-.286.495a.5.5,0,0,1-.683.184l-.866-.5a.5.5,0,0,1-.183-.683l.287-.5a7.069,7.069,0,0,1-1.168-1.169l-.5.287a.5.5,0,0,1-.683-.183l-.5-.867a.5.5,0,0,1,.183-.682l.5-.286a6.949,6.949,0,0,1-.429-1.6h-.572a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h.572a6.961,6.961,0,0,1,.428-1.6l-.5-.286a.5.5,0,0,1-.183-.683l.5-.867a.5.5,0,0,1,.683-.183l.5.287a7.059,7.059,0,0,1,1.169-1.169l-.287-.5a.5.5,0,0,1,.183-.683l.866-.5a.5.5,0,0,1,.683.184l.286.495a6.943,6.943,0,0,1,1.6-.429v-.571a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5v.571a6.947,6.947,0,0,1,1.6.429l.285-.495a.5.5,0,0,1,.683-.184l.866.5a.5.5,0,0,1,.183.683l-.287.5a7.07,7.07,0,0,1,1.169,1.169l.5-.288a.5.5,0,0,1,.683.184l.5.866a.5.5,0,0,1-.183.683l-.5.286a6.948,6.948,0,0,1,.428,1.6h.572a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5h-.572a6.947,6.947,0,0,1-.428,1.6l.5.286a.5.5,0,0,1,.183.683l-.5.867a.5.5,0,0,1-.683.183l-.5-.288a7.07,7.07,0,0,1-1.169,1.169l.287.5a.5.5,0,0,1-.183.683l-.866.5a.5.5,0,0,1-.683-.183l-.286-.5a6.936,6.936,0,0,1-1.6.429v.571a.5.5,0,0,1-.5.5Zm-3.5-8a4,4,0,1,0,4-4A4,4,0,0,0,2495,1324Z" transform="translate(-2487 -1312)" fill="#707070"/>
            </svg>
        );
    }
}

export type IconsType = typeof icons;
export type IIcons = keyof IconsType


export function getIcon(iconName: IIcons) {
    return icons[iconName];
}

export default icons;



