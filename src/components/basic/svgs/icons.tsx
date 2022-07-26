import React from "react";
import styled from "styled-components";

export interface IconProps {
    active?: boolean
    activeColor?: string
    hoverColor?: string
    defaultColor?: string
    disabled?: boolean
}
type IconPropsWithSize<P> = P & {
    $size: number
}

export interface SvgWrapperProps {
    activeColor?: string
    hoverColor?: string
    defaultColor?: string
    active: boolean
    $size: number
    disabled?: boolean
}

export const SvgWrapperStyle = styled.div<SvgWrapperProps>`
    .svg-stroke {
        color: ${props => props.activeColor};
        stroke: ${props => props.active ? props.activeColor : props.defaultColor};
    }
    .svg-fill {
        color: blue;
        fill: ${props => props.active ? props.activeColor : props.defaultColor};
    }
    ${props => !props.disabled && `
        &:hover {
            .svg-stroke {
                stroke: ${
                        props.active ? props.activeColor : props.hoverColor
                };
            }
            .svg-fill {
                fill: ${
                    props.active ? props.activeColor : props.hoverColor || props.theme.light
                };
            }
        }
    `}
`;

const SvgWrapper = styled.div<SvgWrapperProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${props => props.$size}px;
    height: ${props => props.$size}px;
    svg {
        width: ${props => props.$size}px;
        height: ${props => props.$size}px;
    }
`;


export function IconWrapper(props: React.PropsWithChildren<IconPropsWithSize<IconProps>>) {
    const { active = false } = props;
    return (
        <SvgWrapper
            activeColor={ props.activeColor }
            hoverColor={ props.hoverColor }
            defaultColor={ props.defaultColor }
            active={ active }
            $size={ props.$size }
            >
            { props.children }
        </SvgWrapper>
    )
}



/**
 * 替换外层容器的正则表达式:
 * <rect\s*id="(.*?)"\s*width="24"\s*height="24"\s*fill="none"/>
 * 替换为： <rect width="100%" height="100%" fill="none"/>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <line className="svg-stroke" x2="15" transform="translate(4.5 12.5)" fill="none"  strokeLinecap="round" strokeWidth="4" />
                <line className="svg-stroke" x2="15" transform="translate(12 5) rotate(90)" fill="none" strokeLinecap="round" strokeWidth="4" />
            </svg>
        );
    },
    /**
     * 左对齐  
     * ![左对齐](https://p2.ssl.qhimg.com/t01f27bae505b23dadf.jpg)
     */
    alignLeft() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <line className="svg-stroke" y2="12" transform="translate(4.25 6)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="1"/>
                <line className="svg-stroke" x2="8" transform="translate(7.5 9.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
                <line className="svg-stroke" x2="11" transform="translate(7.5 14.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
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
                <g transform="translate(24) rotate(90)">
                    <rect width="100%" height="100%" fill="none"/>
                    <line className="svg-stroke" y2="12" transform="translate(4.25 6)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="1"/>
                    <line className="svg-stroke" x2="8" transform="translate(7.5 9.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" x2="11" transform="translate(7.5 14.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
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
                <g transform="translate(24 24) rotate(180)">
                    <rect width="100%" height="100%" fill="none"/>
                    <line className="svg-stroke" y2="12" transform="translate(4.25 6)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="1"/>
                    <line className="svg-stroke" x2="8" transform="translate(7.5 9.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" x2="11" transform="translate(7.5 14.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
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
                <g transform="translate(0 24) rotate(-90)">
                    <rect width="100%" height="100%" fill="none"/>
                    <line className="svg-stroke" y2="12" transform="translate(4.25 6)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="1"/>
                    <line className="svg-stroke" x2="8" transform="translate(7.5 9.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" x2="11" transform="translate(7.5 14.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="3"/>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <line className="svg-stroke" x2="12" transform="translate(6 12.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="1"/>
                <line className="svg-stroke" y2="9" transform="translate(13.5 8)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" y2="11" transform="translate(10.5 7)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="2"/>
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
                <g transform="translate(0 24) rotate(-90)">
                    <rect width="100%" height="100%" fill="none"/>
                    <line className="svg-stroke" x2="12" transform="translate(6 12.5)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="1"/>
                    <line className="svg-stroke" y2="9" transform="translate(13.5 8)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="2"/>
                    <line className="svg-stroke" y2="11" transform="translate(10.5 7)" fill="none" stroke="#818181" strokeLinecap="round" strokeWidth="2"/>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g transform="translate(3.987 11.602) rotate(-90)">
                    <path className="svg-fill" d="M2.248,15.532l-2.1-3.454A1,1,0,0,1,1,10.558H2.326v-5.1H1a1,1,0,0,1-.855-1.52L2.248.481a1,1,0,0,1,1.708,0l2.1,3.454A1,1,0,0,1,5.2,5.455H3.878v5.1H5.2a1,1,0,0,1,.855,1.52l-2.1,3.454a1,1,0,0,1-1.708,0Z" fill="#818181"/>
                </g>
                <text className="svg-fill" transform="translate(3.987 18.603)" fill="#818181" fontSize="6" fontFamily="STHeitiSC-Medium, Heiti SC" fontWeight="500"><tspan x="0" y="0">AUTO</tspan></text>
                <rect width="100%" height="100%" fill="none"/>
            </svg>

        );
    },
    heightAuto() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g transform="translate(24) rotate(90)">
                    <g transform="translate(4.432 11.603) rotate(-90)">
                        <path className="svg-fill" d="M2.248,15.532l-2.1-3.454A1,1,0,0,1,1,10.558H2.326v-5.1H1a1,1,0,0,1-.855-1.52L2.248.481a1,1,0,0,1,1.709,0l2.1,3.454A1,1,0,0,1,5.2,5.455H3.878v5.1H5.2a1,1,0,0,1,.854,1.52l-2.1,3.454a1,1,0,0,1-1.709,0Z" transform="translate(0 0)" fill="#818181"/>
                    </g>
                    <text className="svg-fill" transform="translate(4.444 18.603)" fill="#818181" fontSize="6" fontFamily="STHeitiSC-Medium, Heiti SC" fontWeight="500"><tspan x="0" y="0">AUTO</tspan></text>
                    <rect width="100%" height="100%" fill="none"/>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path className="svg-fill" d="M0,11a5,5,0,0,0,5,5H7a5,5,0,0,0,5-5V7H0ZM7,0H6.5V6H12V5A5,5,0,0,0,7,0Z" transform="translate(6 4)" fill="#818181"/>
                <path className="svg-fill" d="M5.5,0H5A5,5,0,0,0,0,5V6H5.5Z" transform="translate(6 4)" fill="#818181"/>
                <rect width="100%" height="100%" fill="none"/>
            </svg>
        );
    },
    mouseHover() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M0,11a5,5,0,0,0,5,5H7a5,5,0,0,0,5-5V7H0ZM7,0H6.5V6H12V5A5,5,0,0,0,7,0Z" transform="translate(6 4)" fill="#818181"/>
                <path d="M5.5,0H5A5,5,0,0,0,0,5V6H5.5Z" transform="translate(6 4)" fill="#fff"/>
                <rect width="100%" height="100%" fill="none"/>
            </svg>
        );
    },
    mouseActive() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M0,11a5,5,0,0,0,5,5H7a5,5,0,0,0,5-5V7H0ZM7,0H6.5V6H12V5A5,5,0,0,0,7,0Z" transform="translate(6 4)" fill="#818181"/>
                <path d="M5.5,0H5A5,5,0,0,0,0,5V6H5.5Z" transform="translate(6 4)" fill="#469adb"/>
                <rect width="100%" height="100%" fill="none"/>
            </svg>

        );
    },
    /**
     * 删除
     * ![删除](https://p4.ssl.qhimg.com/t01b43068c126d1baba.jpg)
     */
    delete() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-fill" d="M13.5,1H9.75L9.456.415A.75.75,0,0,0,8.784,0H5.213a.741.741,0,0,0-.669.416L4.25,1H.5a.5.5,0,0,0-.5.5v1A.5.5,0,0,0,.5,3h13a.5.5,0,0,0,.5-.5v-1A.5.5,0,0,0,13.5,1ZM1.663,14.594A1.5,1.5,0,0,0,3.159,16h7.681a1.5,1.5,0,0,0,1.5-1.406L13,4H1Z" transform="translate(4.952 4)" fill="#818181"/>
            </svg>
        );
    },
    /**
     * 删除条状
     * ![删除条状](https://p2.ssl.qhimg.com/t018f12119efa3211be.jpg)
     */
    deleteHollow() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path className="svg-fill" d="M9.571,14.857h.857a.429.429,0,0,0,.429-.429V6.714a.429.429,0,0,0-.429-.429H9.571a.429.429,0,0,0-.429.429v7.714A.429.429,0,0,0,9.571,14.857Zm5.857-12H12.485L11.271.832A1.714,1.714,0,0,0,9.8,0H6.2A1.714,1.714,0,0,0,4.73.832L3.515,2.857H.571A.571.571,0,0,0,0,3.429V4a.571.571,0,0,0,.571.571h.571v12a1.714,1.714,0,0,0,1.714,1.714H13.143a1.714,1.714,0,0,0,1.714-1.714v-12h.571A.571.571,0,0,0,16,4V3.429A.571.571,0,0,0,15.429,2.857ZM6.137,1.818a.214.214,0,0,1,.184-.1H9.679a.214.214,0,0,1,.184.1l.624,1.039H5.514Zm7.006,14.753H2.857v-12H13.143ZM5.571,14.857h.857a.429.429,0,0,0,.429-.429V6.714a.429.429,0,0,0-.429-.429H5.571a.429.429,0,0,0-.429.429v7.714A.429.429,0,0,0,5.571,14.857Z" transform="translate(4 3)" fill="#818181"/>
                <rect width="100%" height="100%" fill="none"/>
            </svg>
        )
    },
    /**
     * 睁眼/显示
     * ![睁眼/显示](https://p4.ssl.qhimg.com/t01ca71d6299dc3ad0d.jpg)
     */
    eye() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path className="svg-fill" d="M17.919,7.487A10.05,10.05,0,0,0,9.014,2,10.052,10.052,0,0,0,.109,7.487a.99.99,0,0,0,0,.9,10.05,10.05,0,0,0,8.905,5.487A10.052,10.052,0,0,0,17.919,8.39a.99.99,0,0,0,0-.9ZM9.014,12.392a4.454,4.454,0,1,1,4.507-4.454A4.481,4.481,0,0,1,9.014,12.392Zm0-7.423a3.016,3.016,0,0,0-.792.117A1.467,1.467,0,0,1,8.075,7.01a1.511,1.511,0,0,1-1.947.146,2.945,2.945,0,0,0,1.223,3.236,3.027,3.027,0,0,0,3.494-.109,2.942,2.942,0,0,0,1.014-3.306A3,3,0,0,0,9.014,4.969Z" transform="translate(2.986 4)" fill="#469adb"/>
                <rect width="100%" height="100%" fill="none"/>
            </svg>
        )
    },
    /**
     * 闭眼/隐藏  
     * ![闭眼/隐藏](https://p4.ssl.qhimg.com/t012729f9758db9f484.jpg)
     */
    eyeClose() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path className="svg-fill" d="M10,12.5A4.483,4.483,0,0,1,5.534,8.34L2.256,5.807A10.415,10.415,0,0,0,1.109,7.544a1.011,1.011,0,0,0,0,.912A10.023,10.023,0,0,0,10,14a9.707,9.707,0,0,0,2.434-.327l-1.622-1.255A4.5,4.5,0,0,1,10,12.5Zm9.807,1.816-3.455-2.67a10.352,10.352,0,0,0,2.539-3.19,1.011,1.011,0,0,0,0-.912A10.023,10.023,0,0,0,10,2,9.63,9.63,0,0,0,5.4,3.178L1.421.105a.5.5,0,0,0-.7.088L.105.983a.5.5,0,0,0,.088.7l18.386,14.21a.5.5,0,0,0,.7-.088l.614-.79A.5.5,0,0,0,19.807,14.316ZM14.066,9.878l-1.228-.949a2.961,2.961,0,0,0-3.628-3.81A1.489,1.489,0,0,1,9.5,6a1.458,1.458,0,0,1-.048.313l-2.3-1.778A4.447,4.447,0,0,1,10,3.5,4.5,4.5,0,0,1,14.5,8a4.393,4.393,0,0,1-.434,1.878Z" transform="translate(2 3.938)" fill="#818181"/>
                <rect width="100%" height="100%" fill="none"/>
            </svg>
        );
    },
    /**
     * 减号/展开状态  
     * ![减号/展开状态](https://p3.ssl.qhimg.com/t019fb97d1f09c98987.jpg)
     */
    minus() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect className="svg-fill" width="2" height="8" rx="1" transform="translate(8 13) rotate(-90)" fill="#818181"/>
                <rect width="100%" height="100%" fill="none"/>
            </svg>

        );
    },
    /**
     * 加号/收起
     * ![加号/收起](https://p3.ssl.qhimg.com/t01d6a3bc2916edc3c6.jpg)
     */
    plus() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-fill" d="M2531,1345v-2h-2a1,1,0,0,1,0-2h2v-2a1,1,0,0,1,2,0v2h2a1,1,0,1,1,0,2h-2v2a1,1,0,1,1-2,0Z" transform="translate(-2520 -1330)" fill="#818181"/>
            </svg>

        );
    },
    /**
     * 锁
     * ![锁](https://p5.ssl.qhimg.com/t01c41959cd57b1be03.jpg)
     */
    lock() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path className="svg-fill" d="M12.5,7h-.75V4.75a4.75,4.75,0,0,0-9.5,0V7H1.5A1.5,1.5,0,0,0,0,8.5v6A1.5,1.5,0,0,0,1.5,16h11A1.5,1.5,0,0,0,14,14.5v-6A1.5,1.5,0,0,0,12.5,7ZM9.25,7H4.75V4.75a2.25,2.25,0,0,1,4.5,0Z" transform="translate(5 4)" fill="#469adb"/>
                <rect width="100%" height="100%" fill="none"/>
            </svg>
        );
    },
    /**
     * 解锁  
     * ![解锁](https://p3.ssl.qhimg.com/t01153f214432c89043.jpg)
     */
    unlock() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path className="svg-fill" d="M13.234,0A4.781,4.781,0,0,0,8.5,4.8V7h-7A1.5,1.5,0,0,0,0,8.5v6A1.5,1.5,0,0,0,1.5,16h11A1.5,1.5,0,0,0,14,14.5v-6A1.5,1.5,0,0,0,12.5,7H11V4.778a2.25,2.25,0,1,1,4.5-.028v2.5a.748.748,0,0,0,.75.75h1A.748.748,0,0,0,18,7.25V4.75A4.755,4.755,0,0,0,13.234,0Z" transform="translate(3 4)" fill="#818181"/>
                <rect width="100%" height="100%" fill="none"/>
            </svg>

        );
    },
    /**
     * 下箭头
     * ![下箭头](https://p0.ssl.qhimg.com/t0100791a26d6515ea2.jpg)
     */
    arrowDown() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g transform="translate(-164 -307)">
                    <line className="svg-stroke" x2="8" y2="8" transform="translate(168 315)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                    <line className="svg-stroke" x1="8" y2="8" transform="translate(176 315)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                </g>
                <rect width="100%" height="100%" fill="none"/>
            </svg>
        );
    },
    /**
     * 裁剪ICON  
     * ![裁剪](https://p1.ssl.qhimg.com/t01e80d11243b2d01fa.jpg)
     */
    shear() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-stroke" d="M2535.985,1349.376a1.5,1.5,0,0,1,.148-2.864l-2.13-3.041-6.314-.479,3.978.3,2.336.177-3.512-5.015,3.512,5.015,3.73.283a1.5,1.5,0,1,1,.477,1.082,1.494,1.494,0,0,1-.477-1.082l-3.73-.283,2.13,3.041a1.5,1.5,0,1,1-.148,2.864Z" transform="translate(-2522.677 -1331.977)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
            </svg>
        );
    },
    /**
     * 配置  
     * ![配置](https://p5.ssl.qhimg.com/t019cea60cc5c27fa82.jpg)
     */
    config() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path d="M2495.5,1318h0a1.5,1.5,0,0,1,3,0h0a1.5,1.5,0,1,1-3,0Z" transform="translate(-2486.5 -1313)" fill="rgba(0,0,0,0)"/>
                <path className="svg-fill" d="M2497,1315.5a2.5,2.5,0,0,1,2.291,1.5H2506v2h-6.708a2.5,2.5,0,0,1-4.582,0H2491v-2h3.709A2.5,2.5,0,0,1,2497,1315.5Zm0,3a.5.5,0,1,0-.5-.5A.5.5,0,0,0,2497,1318.5Z" transform="translate(-2486.5 -1313)" fill="#707070"/>
                <path className="svg-fill" d="M2500,1315.5a2.5,2.5,0,0,1,2.291,1.5H2506v2h-3.709a2.5,2.5,0,0,1-4.582,0H2491v-2h6.709A2.5,2.5,0,0,1,2500,1315.5Zm0,3a.5.5,0,1,0-.5-.5A.5.5,0,0,0,2500,1318.5Z" transform="translate(-2486.5 -1306)" fill="#707070"/>
                <path className="svg-fill" d="M2497,1315.5a2.5,2.5,0,0,1,2.291,1.5H2506v2h-6.708a2.5,2.5,0,0,1-4.582,0H2491v-2h3.709A2.5,2.5,0,0,1,2497,1315.5Zm0,3a.5.5,0,1,0-.5-.5A.5.5,0,0,0,2497,1318.5Z" transform="translate(-2486.5 -1299)" fill="#707070"/>
            </svg>


        );
    },
    /**
     * 走马灯
     * ![走马灯](https://p2.ssl.qhimg.com/t0136d44ca868abe243.jpg)
     */
    swiper() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-fill" d="M3,0h8l3,4H0Z" transform="translate(5 3)" fill="#707070"/>
                <path className="svg-fill" d="M3,4h8l3-4H0Z" transform="translate(5 17)" fill="#707070"/>
                <rect className="svg-fill" width="14" height="8" transform="translate(5 8)" fill="#707070"/>
            </svg>
        );
    },
    /**
     * 截取字符串  
     * ![截取字符串](https://p2.ssl.qhimg.com/t01aa0009b04113aa85.jpg)
     */
    substr() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <circle className="svg-fill" cx="1" cy="1" r="1" transform="translate(12 5)" fill="#707070"/>
                <circle className="svg-fill" cx="1" cy="1" r="1" transform="translate(15 5)" fill="#707070"/>
                <circle className="svg-fill" cx="1" cy="1" r="1" transform="translate(18 5)" fill="#707070"/>
                <path className="svg-fill" d="M2453,1157.25V1152h-1.249a.75.75,0,1,1,0-1.5H2453v-1.75a.75.75,0,0,1,1.5,0v1.75h5.75a.75.75,0,0,1,0,1.5h-5.75v5.25a.75.75,0,1,1-1.5,0Z" transform="translate(-2447 -1141.501)" fill="#707070"/>
                <path className="svg-fill" d="M2,9.25V4H.751a.75.75,0,1,1,0-1.5H2V.751a.75.75,0,1,1,1.5,0V2.5H9.25a.75.75,0,0,1,0,1.5H3.5V9.25a.75.75,0,1,1-1.5,0Z" transform="translate(18 22.001) rotate(180)" fill="#707070"/>
                <g transform="translate(-2443 -1136.5)" fill="none">
                    <path d="M2453.25,1153.25v-3.75h-1.5a.75.75,0,1,1,0-1.5h4.5a.75.75,0,1,1,0,1.5h-1.5v3.75a.75.75,0,0,1-1.5,0Z" stroke="none"/>
                    <path className="svg-fill" d="M 2454.000244140625 1153.999877929688 C 2453.58544921875 1153.999877929688 2453.249755859375 1153.664184570312 2453.249755859375 1153.250122070312 L 2453.249755859375 1149.499877929688 L 2451.750244140625 1149.499877929688 C 2451.33544921875 1149.499877929688 2450.999755859375 1149.164184570312 2450.999755859375 1148.750122070312 C 2450.999755859375 1148.336181640625 2451.33544921875 1148.00048828125 2451.750244140625 1148.00048828125 L 2456.250244140625 1148.00048828125 C 2456.664306640625 1148.00048828125 2457 1148.336181640625 2457 1148.750122070312 C 2457 1149.164184570312 2456.664306640625 1149.499877929688 2456.250244140625 1149.499877929688 L 2454.75 1149.499877929688 L 2454.75 1153.250122070312 C 2454.75 1153.664184570312 2454.414306640625 1153.999877929688 2454.000244140625 1153.999877929688 Z" stroke="none" fill="#707070"/>
                </g>
            </svg>
        );
    },
    /**
     * 文本左对齐  
     * ![文本左对齐](https://p5.ssl.qhimg.com/t0137fcb5fdc9387054.jpg)
     */
    alignLeftText() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <line className="svg-stroke"  x2="14" transform="translate(5 6)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="8" transform="translate(5 10)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="8" transform="translate(5 18)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="14" transform="translate(5 14)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
            </svg>
        );
    },
    /**
     * 文本居中对齐  
     * ![文本居中对齐](https://p0.ssl.qhimg.com/t01777eca1fd8b3e67a.jpg)
     */
    alignCenterText() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <line className="svg-stroke" x2="14" transform="translate(5 6)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="8" transform="translate(8.5 10)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="8" transform="translate(8.5 18)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="14" transform="translate(5 14)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
            </svg>
        );
    },
    /**
     * 文本右对齐  
     * ![文本右对齐](https://p1.ssl.qhimg.com/t01c971b7e140717502.jpg)
     */
    alignRightText() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <line className="svg-stroke" x2="14" transform="translate(5 6)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="8" transform="translate(11 10)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="8" transform="translate(11 18)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="14" transform="translate(5 14)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
            </svg>
        );
    },
    /**
     * 数字格式化  
     * ![数字格式化](https://p2.ssl.qhimg.com/t0118689ff2e29d13e4.jpg)
     */
    format() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <rect className="svg-stroke" width="3" height="6" transform="translate(4.5 13)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                <rect className="svg-stroke" width="3" height="6" transform="translate(11.5 13)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                <rect className="svg-stroke" width="3" height="6" transform="translate(16.5 13)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                <circle cx="1" cy="1" r="1" transform="translate(8.5 17.5)" fill="#707070"/>
                <text className="svg-fill" transform="translate(16 10)" fill="#666" fontSize="8" fontFamily="PingFangSC-Medium, PingFang SC" fontWeight="500"><tspan x="-3.96" y="0">%</tspan></text>
                <text className="svg-fill" transform="translate(8 10)" fill="#666" fontSize="8" fontFamily="PingFangSC-Medium, PingFang SC" fontWeight="500"><tspan x="-4" y="0">￥</tspan></text>
            </svg>
        );
    },
    /**
     * 正常数字  
     * ![正常数字](https://p5.ssl.qhimg.com/t01f13d486473ddbad7.jpg)
     */
    number() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-fill" d="M2542,1350h-12a2,2,0,0,1-2-2v-8a2,2,0,0,1,2-2h12a2,2,0,0,1,2,2v8A2,2,0,0,1,2542,1350Zm-4.024-4.8h0a2.025,2.025,0,0,0,.672,1.463,2.124,2.124,0,0,0,1.408.448,2.2,2.2,0,0,0,1.5-.512,1.7,1.7,0,0,0,.544-1.3,1.21,1.21,0,0,0-.288-.832,1.6,1.6,0,0,0-.768-.473,1.236,1.236,0,0,0,.943-1.255,1.427,1.427,0,0,0-.511-1.152,2.14,2.14,0,0,0-1.384-.416,1.937,1.937,0,0,0-1.368.472,1.851,1.851,0,0,0-.632,1.328h.856a1.178,1.178,0,0,1,.344-.792,1.159,1.159,0,0,1,.808-.264,1.126,1.126,0,0,1,.776.232.865.865,0,0,1,.248.656.833.833,0,0,1-.273.664,1.184,1.184,0,0,1-.792.231h-.408v.656h.416a1.314,1.314,0,0,1,.856.24.884.884,0,0,1,.312.744.966.966,0,0,1-.3.712,1.258,1.258,0,0,1-.887.319,1.134,1.134,0,0,1-1.193-1.175Zm-2.687-3.289a1.123,1.123,0,0,1,.776.24.931.931,0,0,1,.264.72,1.4,1.4,0,0,1-.392.936,5.905,5.905,0,0,1-.816.656,7.251,7.251,0,0,0-1.288,1.04,2.16,2.16,0,0,0-.568,1.5h3.936v-.769h-2.856a2.812,2.812,0,0,1,1.1-1.08,7.867,7.867,0,0,0,1.184-.92,1.988,1.988,0,0,0,.56-1.352,1.617,1.617,0,0,0-.519-1.232,1.942,1.942,0,0,0-1.353-.472,1.878,1.878,0,0,0-1.472.616,2.213,2.213,0,0,0-.552,1.536h.872a1.746,1.746,0,0,1,.3-1.049A.955.955,0,0,1,2535.288,1341.912Zm-4.081.424V1347h.872v-5.712h-.656a3.278,3.278,0,0,1-1.528.9v.864a3.109,3.109,0,0,0,1.311-.718Z" transform="translate(-2524 -1332)" fill="#707070"/>
            </svg>

        );
    },
    /**
     * 透明度  
     * ![透明度](https://p3.ssl.qhimg.com/t01e22214a3a31e86a1.jpg)
     */
    opacity() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-stroke" d="M2544,1354h-16v-16h16v16Zm-14-14h0l12,12Zm0,4h0l8,8Zm0,5h0l3,3Zm4-9h0l8,8Zm5,0h0l3,3Z" transform="translate(-2524 -1334)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
            </svg>
        );
    },
    /**
     * 全角状态
     * ![圆角锁定状态](https://p0.ssl.qhimg.com/t01b424c70e5b073fc0.jpg)
     */
    angleFull() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <g className="svg-stroke" transform="translate(4 4)" fill="none" stroke="#707070" strokeWidth="1">
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-stroke" d="M4.509,8.979c-.133-.9-.139-4.8,4.5-4.489" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
                <path className="svg-stroke" d="M4.509,4.473c-.133.9-.139,4.8,4.5,4.489" transform="translate(0 10.527)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
                <path className="svg-stroke" d="M8.972,8.979c.133-.9.139-4.8-4.5-4.489" transform="translate(10.527 0.021)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
                <path className="svg-stroke" d="M8.972,4.473c.133.9.139,4.8-4.5,4.489" transform="translate(10.527 10.527)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
            </svg>
        );
    },
    /**
     * 选择框-选中
     * ![checkout](https://p2.ssl.qhimg.com/t01851f66dc5aba7b0a.jpg)
     */
    checkout() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <g className="svg-stroke" transform="translate(4 4)" fill="none" stroke="#707070" strokeWidth="2">
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <g transform="translate(4 4)" fill="none">
                    <path d="M4,0h8a4,4,0,0,1,4,4v8a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0Z" stroke="none"/>
                    <path className="svg-fill" d="M 4 2 C 2.897199630737305 2 2 2.897199630737305 2 4 L 2 12 C 2 13.1028003692627 2.897199630737305 14 4 14 L 12 14 C 13.1028003692627 14 14 13.1028003692627 14 12 L 14 4 C 14 2.897199630737305 13.1028003692627 2 12 2 L 4 2 M 4 0 L 12 0 C 14.20913982391357 0 16 1.790860176086426 16 4 L 16 12 C 16 14.20913982391357 14.20913982391357 16 12 16 L 4 16 C 1.790860176086426 16 0 14.20913982391357 0 12 L 0 4 C 0 1.790860176086426 1.790860176086426 0 4 0 Z" stroke="none" fill="#469adb"/>
                </g>
                <path className="svg-stroke" d="M-2265.183-1159.506l2.657,3.615,4.984-6.109" transform="translate(2273.183 1170.945)" fill="none" stroke="#469adb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            </svg>
        );
    },
    /**
     * 高斯模糊  
     * ![高斯模糊](https://p4.ssl.qhimg.com/t019645c04d7112deb9.jpg)
     */
    blur() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <g transform="translate(-279.293 -167.819)">
                    <path className="svg-stroke" d="M-2238.878-1166.049s-4.082,4.233-4.753,6.213c-2.667,8.666,12.244,8.821,9.579,0C-2234.837-1161.852-2238.878-1166.049-2238.878-1166.049Z" transform="translate(2530.191 1339.318)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                    <path className="svg-stroke" d="M-2240.6-1155.17c1.057.058,2.276,1.49,2.1,2.315" transform="translate(2528.474 1336.56)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
                    <line className="svg-stroke" x2="9.704" y2="10.45" transform="translate(286.455 175.918)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="1"/>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-fill" d="M2234.5,1179h-10a.5.5,0,0,1-.5-.5v-8a.5.5,0,0,1,.5-.5h10a.5.5,0,0,1,.5.5v8A.5.5,0,0,1,2234.5,1179Zm-9.5-6.5v5.5h9v-3.816l-2.111-.949-5.182.188L2225,1172.5Zm2.234-1.458a.645.645,0,0,0-.514.214.873.873,0,0,0,0,1.057.653.653,0,0,0,.514.212.661.661,0,0,0,.514-.21.779.779,0,0,0,.18-.53.769.769,0,0,0-.18-.532A.654.654,0,0,0,2227.234,1171.044Zm-1.474,0a.615.615,0,0,0-.519.226.929.929,0,0,0-.006,1.034.638.638,0,0,0,.528.224.62.62,0,0,0,.4-.132.637.637,0,0,0,.224-.39h-.212a.447.447,0,0,1-.15.252.483.483,0,0,1-.614-.072.775.775,0,0,1,0-.792.407.407,0,0,1,.348-.158.442.442,0,0,1,.256.068.349.349,0,0,1,.139.214h.211a.529.529,0,0,0-.19-.345A.636.636,0,0,0,2225.76,1171.044Zm7.149.382h.007l.739,1.075h.211v-1.428h-.218v1.062h-.008l-.73-1.062h-.22v1.428h.219v-1.074Zm-4.542,0h.008l.738,1.075h.211v-1.428h-.218v1.062h-.008l-.73-1.062h-.22v1.428h.218v-1.074Zm2.7.706h.614l.134.368h.234l-.55-1.428h-.249l-.55,1.428h.232l.134-.368Zm1.126-1.06v1.428h.216v-1.428Zm-2.216.186v1.242h.215v-1.242h.476v-.186H2229.5v.186Zm-2.74,1.078a.438.438,0,0,1-.354-.152.715.715,0,0,1,0-.795.487.487,0,0,1,.706-.005.622.622,0,0,1,.123.4.608.608,0,0,1-.123.4A.434.434,0,0,1,2227.234,1172.336Zm4.378-.384h-.482l.238-.646h.008l.236.645Z" transform="translate(-2217.5 -1162.5)" fill="#707070"/>
                <g className="svg-stroke" transform="translate(5 5)" fill="none" stroke="#707070" strokeWidth="1" strokeDasharray="1">
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-fill" d="M2214.5,1185h-14a.5.5,0,0,1-.5-.5v-14a.5.5,0,0,1,.5-.5h14a.5.5,0,0,1,.5.5v14A.5.5,0,0,1,2214.5,1185Zm-13.5-10.21V1184h13v-3.551l-3.229-3.11-7.1.551-2.675-3.1Zm8.476-2.146v2.856h2v-.372h-1.572v-2.484Zm-2.364,0v2.856h2v-.372h-1.571v-2.484Zm-1,0v2.856h.431v-2.856Zm-2.333,0v2.856h.437v-1.28h1.42v-.372h-1.42v-.833h1.5v-.372Z" transform="translate(-2195.5 -1165.5)" fill="#707070"/>
                <g className="svg-stroke" transform="translate(5 5)" fill="none" stroke="#707070" strokeWidth="1" strokeDasharray="1">
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
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
                <defs>
                    <clipPath id="clip-path">
                        <path className="svg-fill" d="M-2156.495-1166.132l.166,11.741-11.228,3.7h-5.356l.4-15.444Z" transform="translate(2480 1338)" fill="#fff"/>
                    </clipPath>
                </defs>
                <rect width="100%" height="100%" fill="none"/>
                <g transform="translate(-303.088 -167.868)">
                    <g clipPath="url(#clip-path)">
                    <rect width="12" height="12" transform="translate(309 174)" fill="none"/>
                    <g data-name="组 20">
                        <g className="svg-stroke" transform="translate(309 173)" fill="none" stroke="#707070" strokeWidth="1" strokeDasharray="1">
                        <rect width="14" height="14" stroke="none"/>
                        <rect x="0.5" y="0.5" width="13" height="13" fill="none"/>
                        </g>
                        <path className="svg-fill" d="M2493.906,1352.073h-13.319a.5.5,0,0,1-.5-.5v-13.206a.5.5,0,0,1,.5-.5h13.319a.5.5,0,0,1,.5.5v13.206A.5.5,0,0,1,2493.906,1352.073Zm-12.819-8.363v7.363h12.318V1349.5l-2.888-3.263-7.1.646-2.334-3.17Zm4.6-3.078a.967.967,0,0,0-.77.321,1.311,1.311,0,0,0,0,1.587,1.1,1.1,0,0,0,1.542,0,1.311,1.311,0,0,0,0-1.594A.984.984,0,0,0,2485.685,1340.632Zm-2.21,0a.926.926,0,0,0-.78.339,1.4,1.4,0,0,0-.009,1.551.957.957,0,0,0,.792.336.922.922,0,0,0,.594-.2.946.946,0,0,0,.336-.585h-.318a.669.669,0,0,1-.225.378.728.728,0,0,1-.921-.107,1.164,1.164,0,0,1,0-1.189.611.611,0,0,1,.522-.237.667.667,0,0,1,.384.1.521.521,0,0,1,.207.32h.318a.794.794,0,0,0-.285-.516A.949.949,0,0,0,2483.474,1340.632Zm3.387.042h0l.768,2.142h.4l.769-2.142h-.354l-.606,1.776h-.009l-.608-1.776Zm4.407,1.256h.579a.43.43,0,0,1,.282.078.375.375,0,0,1,.114.258l.027.266a.558.558,0,0,0,.093.283h.355a.522.522,0,0,1-.126-.315l-.036-.342a.393.393,0,0,0-.321-.378v-.006a.474.474,0,0,0,.279-.189.51.51,0,0,0,.09-.3.562.562,0,0,0-.2-.465.821.821,0,0,0-.516-.147h-.948v2.142h.328v-.885Zm-2.25-1.256v2.142h1.589v-.279h-1.263v-.681h1.14v-.279h-1.14v-.624h1.212v-.279Zm-3.334,1.9a.658.658,0,0,1-.531-.228,1.075,1.075,0,0,1,0-1.191.637.637,0,0,1,.531-.231.644.644,0,0,1,.528.222.935.935,0,0,1,.183.606.915.915,0,0,1-.183.6A.652.652,0,0,1,2485.685,1342.57Zm6.162-.917h-.579v-.7h.576a.529.529,0,0,1,.33.084.319.319,0,0,1,.1.261.329.329,0,0,1-.105.261A.5.5,0,0,1,2491.847,1341.653Z" transform="translate(-2171.247 -1164.948)" fill="#707070"/>
                    </g>
                    </g>
                    <g transform="translate(312 179)">
                    <rect width="12" height="12" fill="none"/>
                    <path className="svg-stroke" d="M4.035,5.311a.73.73,0,0,1,.072-1.393L3.071,2.439,0,2.206l1.935.147,1.136.086L1.363,0,3.071,2.439l1.814.138a.73.73,0,1,1,.232.526.726.726,0,0,1-.232-.526L3.071,2.439,4.106,3.918a.73.73,0,1,1-.072,1.393Z" transform="translate(2.438 3.151)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <g transform="translate(-376 -170)">
                    <line className="svg-stroke" x1="6" y2="6" transform="translate(380 176)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                    <line className="svg-stroke" x2="6" y2="6" transform="translate(380 182)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                </g>
                <g transform="translate(14 6)">
                    <line className="svg-stroke" x2="6" y2="6" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                    <line className="svg-stroke" x1="6" y2="6" transform="translate(0 6)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <text className="svg-fill" transform="translate(4 18)" fill="#818181" fontSize="16" fontFamily="PingFangSC-Medium, PingFang SC" fontWeight="500"><tspan x="0" y="0">{'{'}</tspan></text>
                <text className="svg-fill" transform="translate(15 18)" fill="#818181" fontSize="16" fontFamily="PingFangSC-Medium, PingFang SC" fontWeight="500"><tspan x="0" y="0">{'}'}</tspan></text>
            </svg>
        );
    },
    /**
     * 导入  
     * ![导入](https://p0.ssl.qhimg.com/t01a3e8ee121e98d3c1.jpg)
     */
    import() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-stroke" d="M2492.6,1322.761h1.888c.282-6.125-3.526-6.663-3.487-6.724,5.915-.545,5.929,4.975,5.788,6.724h1.812l-3,6Z" transform="translate(-2482.5 -1310.5)" fill="none" stroke="#707070" strokeWidth="1"/>
            </svg>
        );
    },
    /**
     * 导出  
     * ![导出](https://p1.ssl.qhimg.com/t01b291c725c995ce61.jpg)
     */
    export() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-stroke" d="M2492.6,1322.761h1.888c.282-6.125-3.526-6.663-3.487-6.724,5.915-.545,5.929,4.975,5.788,6.724h1.812l-3,6Z" transform="matrix(-0.574, -0.819, 0.819, -0.574, 359.634, 2814.379)" fill="none" stroke="#707070" strokeWidth="1"/>
            </svg>

        );
    },
    /**
     * 关闭
     * ![关闭](https://p1.ssl.qhimg.com/t0101aa368bdd1af069.jpg)
     */
    close() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <line className="svg-stroke" x2="12" y2="12" transform="translate(5.884 5.884)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="12" y2="12" transform="translate(18.116 5.884) rotate(90)" fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2"/>
                <rect width="100%" height="100%" fill="none"/>
            </svg>
        );
    },
    /**
     * 设置  
     * ![设置](https://p2.ssl.qhimg.com/t01418a1eb2bdac2755.jpg)
     */
    settings() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-fill" d="M2498.5,1332a.5.5,0,0,1-.5-.5v-.571a6.937,6.937,0,0,1-1.6-.429l-.286.495a.5.5,0,0,1-.683.184l-.866-.5a.5.5,0,0,1-.183-.683l.287-.5a7.069,7.069,0,0,1-1.168-1.169l-.5.287a.5.5,0,0,1-.683-.183l-.5-.867a.5.5,0,0,1,.183-.682l.5-.286a6.949,6.949,0,0,1-.429-1.6h-.572a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h.572a6.961,6.961,0,0,1,.428-1.6l-.5-.286a.5.5,0,0,1-.183-.683l.5-.867a.5.5,0,0,1,.683-.183l.5.287a7.059,7.059,0,0,1,1.169-1.169l-.287-.5a.5.5,0,0,1,.183-.683l.866-.5a.5.5,0,0,1,.683.184l.286.495a6.943,6.943,0,0,1,1.6-.429v-.571a.5.5,0,0,1,.5-.5h1a.5.5,0,0,1,.5.5v.571a6.947,6.947,0,0,1,1.6.429l.285-.495a.5.5,0,0,1,.683-.184l.866.5a.5.5,0,0,1,.183.683l-.287.5a7.07,7.07,0,0,1,1.169,1.169l.5-.288a.5.5,0,0,1,.683.184l.5.866a.5.5,0,0,1-.183.683l-.5.286a6.948,6.948,0,0,1,.428,1.6h.572a.5.5,0,0,1,.5.5v1a.5.5,0,0,1-.5.5h-.572a6.947,6.947,0,0,1-.428,1.6l.5.286a.5.5,0,0,1,.183.683l-.5.867a.5.5,0,0,1-.683.183l-.5-.288a7.07,7.07,0,0,1-1.169,1.169l.287.5a.5.5,0,0,1-.183.683l-.866.5a.5.5,0,0,1-.683-.183l-.286-.5a6.936,6.936,0,0,1-1.6.429v.571a.5.5,0,0,1-.5.5Zm-3.5-8a4,4,0,1,0,4-4A4,4,0,0,0,2495,1324Z" transform="translate(-2487 -1312)" fill="#707070"/>
            </svg>
        );
    },
    /**
     * 编辑  
     * ![编辑](https://p2.ssl.qhimg.com/t01fb85cb91d74c6708.png)
     */
    edit() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-stroke" d="M-3902.17,809.745c-.013.071-8.83,9.08-8.83,9.08l-1.084,3.688,3.734-.563s7.906-8.621,8.792-9.8S-3899.414,808.581-3902.17,809.745Z" transform="translate(3918.005 -805)" fill="none" strokeLinejoin="round" strokeWidth="1.5"/>
                <path className="svg-stroke" d="M0,0H10" transform="translate(8.505 19.5)" fill="none" strokeLinecap="round" strokeWidth="1.5"/>
            </svg>

        )
    },
    /**
     * 树列表  
     * ![树列表](https://p1.ssl.qhimg.com/t01a12605c23b63a61d.png)
     */
    treeList() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <circle className="svg-fill" cx="1.5" cy="1.5" r="1.5" transform="translate(4 5)" />
                <circle className="svg-fill" cx="1.5" cy="1.5" r="1.5" transform="translate(6 11)" />
                <circle className="svg-fill" cx="1.5" cy="1.5" r="1.5" transform="translate(6 17)" />
                <line className="svg-stroke" x2="10.5" transform="translate(8.5 6.5)" fill="none"  strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="8.5" transform="translate(10.5 12.5)" fill="none"  strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="8.5" transform="translate(10.5 18.5)" fill="none"  strokeLinecap="round" strokeWidth="2"/>
            </svg>

        );
    },
    /**
     * 层  
     * ![层](https://p3.ssl.qhimg.com/t01510284d57d8ef21a.png)
     */
    layout() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-fill" d="M1.743,1.937,10.793,0,9.049,8.49,0,10.427Z" transform="matrix(0.695, 0.719, -0.719, 0.695, 12.002, 2.589)" />
                <path className="svg-fill" d="M7.681,5.828h0L0,.664,1.047,0,7.681,4.461,13.953.481l1.046.7L7.681,5.827Z" transform="translate(4.501 11.103)" />
                <path className="svg-fill" d="M7.681,5.828h0L0,.664,1.047,0,7.681,4.461,13.953.481l1.046.7L7.681,5.827Z" transform="translate(4.5 13.046)" />
            </svg>

        );
    },
    /**
     * 设置带箭头  
     * ![设置带箭头](https://p3.ssl.qhimg.com/t01690e03d276c7bda6.png)
     */
    settings_arrow() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <g transform="translate(-4083.485 616.515)" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4093.486-597.514v-1.342a5.965,5.965,0,0,1-.687-.292l-.922.922-2.828-2.828.974-.975q-.109-.24-.2-.486h-1.342v-4h1.342a5.948,5.948,0,0,1,.291-.686l-.922-.922,2.828-2.828.974.974q.24-.109.487-.2v-1.341h4v1.342a5.946,5.946,0,0,1,.686.292l.922-.923,2.83,2.828-.976.975q.109.239.2.486h1.342v4h-1.341a5.958,5.958,0,0,1-.292.687l.921.922-2.827,2.828-.976-.975q-.239.109-.485.2v1.342Z" stroke="none"/>
                    <path className="svg-fill" d="M 4096.48583984375 -598.514404296875 L 4096.48583984375 -598.8566284179688 C 4096.48583984375 -599.2807006835938 4096.75341796875 -599.6586303710938 4097.1533203125 -599.7996826171875 C 4097.2900390625 -599.847900390625 4097.42578125 -599.902587890625 4097.556640625 -599.9622802734375 C 4097.9365234375 -600.135498046875 4098.38330078125 -600.0540771484375 4098.677734375 -599.7597045898438 L 4098.9462890625 -599.4915771484375 L 4100.3603515625 -600.9060668945312 L 4100.14501953125 -601.121337890625 C 4099.84130859375 -601.4255981445312 4099.765625 -601.89013671875 4099.9580078125 -602.27490234375 C 4100.0517578125 -602.4624633789062 4100.13330078125 -602.65478515625 4100.20068359375 -602.8464965820312 C 4100.34130859375 -603.2470092773438 4100.7197265625 -603.5150756835938 4101.14404296875 -603.5150756835938 L 4101.4853515625 -603.5150756835938 L 4101.4853515625 -605.5150756835938 L 4101.1435546875 -605.5150756835938 C 4100.71875 -605.5150756835938 4100.3408203125 -605.783203125 4100.2001953125 -606.183837890625 C 4100.15283203125 -606.3178100585938 4100.0986328125 -606.453125 4100.03759765625 -606.5859985351562 C 4099.86474609375 -606.9656982421875 4099.94580078125 -607.4130249023438 4100.24072265625 -607.7080078125 L 4100.5087890625 -607.9760131835938 L 4099.09423828125 -609.3899536132812 L 4098.87939453125 -609.1748046875 C 4098.57470703125 -608.8701171875 4098.10986328125 -608.7942504882812 4097.7236328125 -608.987548828125 C 4097.53955078125 -609.079833984375 4097.34765625 -609.1614379882812 4097.1533203125 -609.2300415039062 C 4096.75341796875 -609.3711547851562 4096.48583984375 -609.7490844726562 4096.48583984375 -610.173095703125 L 4096.48583984375 -610.5147094726562 L 4094.48583984375 -610.5147094726562 L 4094.48583984375 -610.1734619140625 C 4094.48583984375 -609.7493286132812 4094.21826171875 -609.3712768554688 4093.818115234375 -609.2303466796875 C 4093.681640625 -609.1821899414062 4093.54541015625 -609.1272583007812 4093.4130859375 -609.067138671875 C 4093.03369140625 -608.89453125 4092.587158203125 -608.9754028320312 4092.2919921875 -609.2702026367188 L 4092.024658203125 -609.537353515625 L 4090.610595703125 -608.123291015625 L 4090.82568359375 -607.908203125 C 4091.130126953125 -607.6038208007812 4091.20556640625 -607.1387939453125 4091.012939453125 -606.7537841796875 C 4090.919921875 -606.56787109375 4090.838623046875 -606.3759155273438 4090.770751953125 -606.1831665039062 C 4090.6298828125 -605.7828979492188 4090.251708984375 -605.5150756835938 4089.827392578125 -605.5150756835938 L 4089.485107421875 -605.5150756835938 L 4089.485107421875 -603.5150756835938 L 4089.826904296875 -603.5150756835938 C 4090.251220703125 -603.5150756835938 4090.629150390625 -603.2473754882812 4090.77001953125 -602.8472290039062 C 4090.81787109375 -602.7119750976562 4090.87255859375 -602.5755615234375 4090.933349609375 -602.44189453125 C 4091.10546875 -602.0625610351562 4091.0244140625 -601.6162719726562 4090.72998046875 -601.3216552734375 L 4090.46240234375 -601.05419921875 L 4091.87646484375 -599.6400756835938 L 4092.091552734375 -599.8550415039062 C 4092.395751953125 -600.1596069335938 4092.861572265625 -600.2347412109375 4093.24609375 -600.0421752929688 C 4093.4306640625 -599.9498291015625 4093.623046875 -599.8681640625 4093.818115234375 -599.7994384765625 C 4094.21826171875 -599.658447265625 4094.48583984375 -599.2804565429688 4094.48583984375 -598.8562622070312 L 4094.48583984375 -598.514404296875 L 4096.48583984375 -598.514404296875 M 4097.48583984375 -597.514404296875 L 4093.48583984375 -597.514404296875 L 4093.48583984375 -598.8562622070312 C 4093.252197265625 -598.9385986328125 4093.0224609375 -599.035888671875 4092.798583984375 -599.14794921875 L 4091.87646484375 -598.225830078125 L 4089.04833984375 -601.0541381835938 L 4090.022705078125 -602.0286865234375 C 4089.9501953125 -602.1884765625 4089.884765625 -602.3507690429688 4089.826904296875 -602.5150756835938 L 4088.485107421875 -602.5150756835938 L 4088.485107421875 -606.5150756835938 L 4089.827392578125 -606.5150756835938 C 4089.909423828125 -606.7482299804688 4090.0068359375 -606.9775390625 4090.11865234375 -607.2011108398438 L 4089.196533203125 -608.123291015625 L 4092.024658203125 -610.9515380859375 L 4092.9990234375 -609.9773559570312 C 4093.158935546875 -610.0501098632812 4093.3212890625 -610.115478515625 4093.48583984375 -610.1734619140625 L 4093.48583984375 -611.5147094726562 L 4097.48583984375 -611.5147094726562 L 4097.48583984375 -610.173095703125 C 4097.71923828125 -610.0907592773438 4097.9482421875 -609.99365234375 4098.171875 -609.881591796875 L 4099.09375 -610.8043212890625 L 4101.92333984375 -607.9760131835938 L 4100.94775390625 -607.0007934570312 C 4101.0205078125 -606.8411865234375 4101.0859375 -606.67919921875 4101.1435546875 -606.5150756835938 L 4102.4853515625 -606.5150756835938 L 4102.4853515625 -602.5150756835938 L 4101.14404296875 -602.5150756835938 C 4101.06201171875 -602.2815551757812 4100.96435546875 -602.052001953125 4100.8525390625 -601.828125 L 4101.77392578125 -600.9058837890625 L 4098.94677734375 -598.0775756835938 L 4097.97119140625 -599.05224609375 C 4097.81201171875 -598.979736328125 4097.64990234375 -598.9144897460938 4097.48583984375 -598.8566284179688 L 4097.48583984375 -597.514404296875 Z" stroke="none" />
                </g>
                <g transform="translate(-208 -192)">
                    <path className="svg-fill" d="M1,0,2,2H0Z" transform="translate(219.5 205.114) rotate(-45)" />
                    <line className="svg-stroke" x2="2.328" y2="2.5" transform="matrix(0.998, -0.07, 0.07, 0.998, 221.416, 205.584)" fill="none" strokeWidth="1"/>
                </g>
                <g transform="translate(-208 -192)">
                    <path className="svg-fill" d="M1,0,2,2H0Z" transform="translate(220.828 203.614) rotate(135)" />
                    <line className="svg-stroke" x2="2.5" y2="3.328" transform="translate(216.051 200.223) rotate(-8)" fill="none" strokeWidth="1"/>
                </g>
            </svg>
        );
    },
    /**
     * 全部展开  
     * ![全部展开](https://p5.ssl.qhimg.com/t017e9f74f0b8342fde.png)
     */
    unfold() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <line className="svg-stroke" x2="8" transform="translate(4.5 7.5)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                <line className="svg-stroke" x2="4" transform="translate(8 16.5)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                <line className="svg-stroke" x2="6" transform="translate(6.5 12)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                <g transform="translate(-232 -197)">
                    <path className="svg-fill" d="M0,2.5a.5.5,0,0,1-.354-.146.5.5,0,0,1,0-.707l2-2a.5.5,0,0,1,.707,0,.5.5,0,0,1,0,.707l-2,2A.5.5,0,0,1,0,2.5Z" transform="translate(247 204)" />
                    <path className="svg-fill" d="M2,2.5a.5.5,0,0,1-.354-.146l-2-2a.5.5,0,0,1,0-.707.5.5,0,0,1,.707,0l2,2A.5.5,0,0,1,2,2.5Z" transform="translate(249 204)" />
                </g>
                <g transform="translate(266 221) rotate(180)">
                    <path className="svg-fill" d="M0,2.5a.5.5,0,0,1-.354-.146.5.5,0,0,1,0-.707l2-2a.5.5,0,0,1,.707,0,.5.5,0,0,1,0,.707l-2,2A.5.5,0,0,1,0,2.5Z" transform="translate(247 204)" />
                    <path className="svg-fill" d="M2,2.5a.5.5,0,0,1-.354-.146l-2-2a.5.5,0,0,1,0-.707.5.5,0,0,1,.707,0l2,2A.5.5,0,0,1,2,2.5Z" transform="translate(249 204)" />
                </g>
            </svg>

        );
    },
    /**
     * 全部收起  
     * ![全部收起](https://p4.ssl.qhimg.com/t01b5d978d81ff7bb81.png)
     */
    upfold() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <line className="svg-stroke" x2="8" transform="translate(4.5 7.5)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                <line className="svg-stroke" x2="4" transform="translate(8 16.5)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                <line className="svg-stroke" x2="6" transform="translate(6.5 12)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                <g transform="translate(266 213) rotate(180)">
                    <path className="svg-fill" d="M0,2.5a.5.5,0,0,1-.354-.146.5.5,0,0,1,0-.707l2-2a.5.5,0,0,1,.707,0,.5.5,0,0,1,0,.707l-2,2A.5.5,0,0,1,0,2.5Z" transform="translate(247 204)" />
                    <path className="svg-fill" d="M2,2.5a.5.5,0,0,1-.354-.146l-2-2a.5.5,0,0,1,0-.707.5.5,0,0,1,.707,0l2,2A.5.5,0,0,1,2,2.5Z" transform="translate(249 204)" />
                </g>
                <g transform="translate(-232 -189)">
                    <path className="svg-fill" d="M0,2.5a.5.5,0,0,1-.354-.146.5.5,0,0,1,0-.707l2-2a.5.5,0,0,1,.707,0,.5.5,0,0,1,0,.707l-2,2A.5.5,0,0,1,0,2.5Z" transform="translate(247 204)" />
                    <path className="svg-fill" d="M2,2.5a.5.5,0,0,1-.354-.146l-2-2a.5.5,0,0,1,0-.707.5.5,0,0,1,.707,0l2,2A.5.5,0,0,1,2,2.5Z" transform="translate(249 204)" />
                </g>
            </svg>

        );
    },
    /**
     * 复制  
     * ![复制](https://p2.ssl.qhimg.com/t0171fb38f86fd37d51.png)
     */
    copy() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <g transform="translate(-4082 617.5)" fill="none" strokeLinecap="round">
                    <path d="M4088.375-602H4088a1,1,0,0,1-1-1v-9a1,1,0,0,1,1-1h9a1,1,0,0,1,1,1v.1h-9.625v9.9Z" stroke="none"/>
                    <path className="svg-fill" d="M 4088.37451171875 -601.9996948242188 L 4087.99951171875 -601.9996948242188 C 4087.448486328125 -601.9996948242188 4087.000244140625 -602.4484252929688 4087.000244140625 -603 L 4087.000244140625 -611.9996948242188 C 4087.000244140625 -612.55126953125 4087.448486328125 -613 4087.99951171875 -613 L 4097.00048828125 -613 C 4097.55126953125 -613 4097.99951171875 -612.55126953125 4097.99951171875 -611.9996948242188 L 4097.99951171875 -611.8997802734375 L 4088.37451171875 -611.8997802734375 L 4088.37451171875 -601.9996948242188 Z" stroke="none" />
                </g>
                <g transform="translate(-4080 619)" fill="none" strokeLinecap="round">
                    <path d="M4088.375-602H4088a1,1,0,0,1-1-1v-9a1,1,0,0,1,1-1h9a1,1,0,0,1,1,1v.1h-9.625v9.9Z" stroke="none"/>
                    <path className="svg-fill" d="M 4088.37451171875 -601.9996948242188 L 4087.99951171875 -601.9996948242188 C 4087.448486328125 -601.9996948242188 4087.000244140625 -602.4484252929688 4087.000244140625 -603 L 4087.000244140625 -611.9996948242188 C 4087.000244140625 -612.55126953125 4087.448486328125 -613 4087.99951171875 -613 L 4097.00048828125 -613 C 4097.55126953125 -613 4097.99951171875 -612.55126953125 4097.99951171875 -611.9996948242188 L 4097.99951171875 -611.8997802734375 L 4088.37451171875 -611.8997802734375 L 4088.37451171875 -601.9996948242188 Z" stroke="none" />
                </g>
                <rect className="svg-fill" width="10" height="12" rx="2" transform="translate(9 7.5)" />
            </svg>
        );
    },
    /**
     * 移动  
     * ![移动](https://p4.ssl.qhimg.com/t010fd3680e006a922f.png)
     */
    move() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-fill" d="M4089.828-607.5h0a.5.5,0,0,1,.345.139s0,0,0,0h0s0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0h0l2.829,2.829a.5.5,0,0,1,.146.354.5.5,0,0,1-.146.354.5.5,0,0,1-.707,0l-1.975-1.975v3.207a.5.5,0,0,1-.5.5.5.5,0,0,1-.5-.5v-3.207l-1.974,1.975a.5.5,0,0,1-.707,0,.5.5,0,0,1-.146-.354.5.5,0,0,1,.146-.354l2.828-2.829h0s0,0,0,0h0A.5.5,0,0,1,4089.828-607.5Z" transform="translate(-4077.829 611.757)" />
                <path className="svg-fill" d="M4089.828-607.5h0a.5.5,0,0,1,.345.139s0,0,0,0h0s0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0h0l2.829,2.829a.5.5,0,0,1,.146.354.5.5,0,0,1-.146.354.5.5,0,0,1-.707,0l-1.975-1.975v3.207a.5.5,0,0,1-.5.5.5.5,0,0,1-.5-.5v-3.207l-1.974,1.975a.5.5,0,0,1-.707,0,.5.5,0,0,1-.146-.354.5.5,0,0,1,.146-.354l2.828-2.829h0s0,0,0,0h0A.5.5,0,0,1,4089.828-607.5Z" transform="translate(4101.829 -587.429) rotate(180)" />
                <path className="svg-fill" d="M4089.828-607.5h0a.5.5,0,0,1,.345.139s0,0,0,0h0s0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0h0l2.829,2.829a.5.5,0,0,1,.146.354.5.5,0,0,1-.146.354.5.5,0,0,1-.707,0l-1.975-1.975v3.207a.5.5,0,0,1-.5.5.5.5,0,0,1-.5-.5v-3.207l-1.974,1.975a.5.5,0,0,1-.707,0,.5.5,0,0,1-.146-.354.5.5,0,0,1,.146-.354l2.828-2.829h0s0,0,0,0h0A.5.5,0,0,1,4089.828-607.5Z" transform="translate(-587.501 -4077.828) rotate(90)" />
                <path className="svg-fill" d="M4089.828-607.5h0a.5.5,0,0,1,.345.139s0,0,0,0h0s0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0h0l2.829,2.829a.5.5,0,0,1,.146.354.5.5,0,0,1-.146.354.5.5,0,0,1-.707,0l-1.975-1.975v3.207a.5.5,0,0,1-.5.5.5.5,0,0,1-.5-.5v-3.207l-1.974,1.975a.5.5,0,0,1-.707,0,.5.5,0,0,1-.146-.354.5.5,0,0,1,.146-.354l2.828-2.829h0s0,0,0,0h0A.5.5,0,0,1,4089.828-607.5Z" transform="translate(611.5 4101.829) rotate(-90)" />
            </svg>

        );
    },
    /**
     * 上移一层  
     * ![上移一层](https://p0.ssl.qhimg.com/t013dda4ec4b2ac06e7.png)
     */
    moveUp() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <line className="svg-stroke" x2="8" transform="translate(5.5 8)" fill="none" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="8" transform="translate(5.5 12.5)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                <path className="svg-stroke" d="M0,0H8" transform="translate(5.5 17)" fill="none" strokeLinecap="round" strokeWidth="2"/>
                <g transform="translate(-231 -188.5)">
                    <path className="svg-fill" d="M0,2.5a.5.5,0,0,1-.354-.146.5.5,0,0,1,0-.707l2-2a.5.5,0,0,1,.707,0,.5.5,0,0,1,0,.707l-2,2A.5.5,0,0,1,0,2.5Z" transform="translate(247 204)" />
                    <path className="svg-fill" d="M2,2.5a.5.5,0,0,1-.354-.146l-2-2a.5.5,0,0,1,0-.707.5.5,0,0,1,.707,0l2,2A.5.5,0,0,1,2,2.5Z" transform="translate(249 204)" />
                </g>
                <g transform="translate(-231 -192.5)">
                    <path className="svg-fill" d="M0,2.5a.5.5,0,0,1-.354-.146.5.5,0,0,1,0-.707l2-2a.5.5,0,0,1,.707,0,.5.5,0,0,1,0,.707l-2,2A.5.5,0,0,1,0,2.5Z" transform="translate(247 204)" />
                    <path className="svg-fill" d="M2,2.5a.5.5,0,0,1-.354-.146l-2-2a.5.5,0,0,1,0-.707.5.5,0,0,1,.707,0l2,2A.5.5,0,0,1,2,2.5Z" transform="translate(249 204)" />
                </g>
                <g transform="translate(-231 -196.5)">
                    <path className="svg-fill" d="M0,2.5a.5.5,0,0,1-.354-.146.5.5,0,0,1,0-.707l2-2a.5.5,0,0,1,.707,0,.5.5,0,0,1,0,.707l-2,2A.5.5,0,0,1,0,2.5Z" transform="translate(247 204)" />
                    <path className="svg-fill" d="M2,2.5a.5.5,0,0,1-.354-.146l-2-2a.5.5,0,0,1,0-.707.5.5,0,0,1,.707,0l2,2A.5.5,0,0,1,2,2.5Z" transform="translate(249 204)" />
                </g>
            </svg>
        );
    },
    /**
     * 下移一层  
     * ![下移一层](https://p1.ssl.qhimg.com/t01575c02552fd06ade.png)
     */
    moveDown() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <line className="svg-stroke" x2="8" transform="translate(5.5 8)" fill="none" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" x2="8" transform="translate(5.5 12.5)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                <line className="svg-stroke" x2="8" transform="translate(5.5 17)" fill="none" strokeLinecap="round" strokeWidth="2"/>
                <g transform="translate(15.5 7)">
                    <path className="svg-fill" d="M0-.5a.5.5,0,0,0-.354.146.5.5,0,0,0,0,.707l2,2a.5.5,0,0,0,.707-.707l-2-2A.5.5,0,0,0,0-.5Z" transform="translate(0.5 0.5)" />
                    <path className="svg-fill" d="M2-.5a.5.5,0,0,0-.354.146l-2,2a.5.5,0,0,0,0,.707.5.5,0,0,0,.707,0l2-2a.5.5,0,0,0,0-.707A.5.5,0,0,0,2-.5Z" transform="translate(2.5 0.5)" />
                </g>
                <g transform="translate(15.5 11)">
                    <path className="svg-fill" d="M0-.5a.5.5,0,0,0-.354.146.5.5,0,0,0,0,.707l2,2a.5.5,0,0,0,.707-.707l-2-2A.5.5,0,0,0,0-.5Z" transform="translate(0.5 0.5)" />
                    <path className="svg-fill" d="M2-.5a.5.5,0,0,0-.354.146l-2,2a.5.5,0,0,0,0,.707.5.5,0,0,0,.707,0l2-2a.5.5,0,0,0,0-.707A.5.5,0,0,0,2-.5Z" transform="translate(2.5 0.5)" />
                </g>
                <g transform="translate(15.5 15)">
                    <path className="svg-fill" d="M0-.5a.5.5,0,0,0-.354.146.5.5,0,0,0,0,.707l2,2a.5.5,0,0,0,.707-.707l-2-2A.5.5,0,0,0,0-.5Z" transform="translate(0.5 0.5)" />
                    <path className="svg-fill" d="M2-.5a.5.5,0,0,0-.354.146l-2,2a.5.5,0,0,0,0,.707.5.5,0,0,0,.707,0l2-2a.5.5,0,0,0,0-.707A.5.5,0,0,0,2-.5Z" transform="translate(2.5 0.5)" />
                </g>
            </svg>
        );
    },
    /**
     * 撤销  
     * ![撤销](https://p3.ssl.qhimg.com/t01538f573c15f7cebd.png)
     */
    undo() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.406 24">
                <rect width="100%" height="100%" transform="translate(0.406)" fill="none"/>
                <path className="svg-stroke" d="M381.846,210.929s12.832-6.237,10.93,4.743" transform="translate(-374.088 -199.671)" fill="none" strokeWidth="2"/>
                <path className="svg-fill" d="M6,0l6,7H0Z" transform="matrix(-0.602, -0.799, 0.799, -0.602, 7.222, 19.597)" />
            </svg>
        );
    },
    /**
     * 重做  
     * ![重做](https://p0.ssl.qhimg.com/t0194a32cb711437124.png)
     */
    redo() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.406 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-stroke" d="M392.969,210.929s-12.831-6.237-10.93,4.743" transform="translate(-376.322 -199.671)" fill="none" strokeWidth="2"/>
                <path className="svg-fill" d="M6,0l6,7H0Z" transform="matrix(-0.602, 0.799, -0.799, -0.602, 24.406, 10.014)" />
            </svg>

        );
    },
    widget_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <g transform="translate(-482.992 -49)">
                    <path className="svg-fill" d="M1.046.834,20.636-1.5c1.1,0,3.158,1.227,3.158,2.332V7a2.723,2.723,0,0,1-2.379,2.393H1.046A2.42,2.42,0,0,1-1.009,7V2.881A2.087,2.087,0,0,1,1.046.834Z" transform="translate(496 57)" />
                    <path className="svg-fill" d="M1.718-.478H7.992c1.1,0,1.479.5,1.479,1.608V7.477c0,1.1-.374,1.347-1.479,1.347L1.4,8.289C.294,8.289,0,7.8,0,6.7V1.306A1.6,1.6,0,0,1,1.718-.478Z" transform="translate(495 69)" />
                    <path className="svg-fill" d="M.489-.591,3.984-.664A1.356,1.356,0,0,1,5.188.512V3c0,.552-.652.91-1.2.91L.417,3.742A1.159,1.159,0,0,1-.645,2.627V.512A1.215,1.215,0,0,1,.489-.591Z" transform="translate(507 69)" />
                    <path className="svg-fill" d="M.417-.838H3.93A1.283,1.283,0,0,1,5.114.284l.075,2.507c0,.552-.924,1.01-1.476,1.01l-3.2-.2A1.258,1.258,0,0,1-.645,2.468V.359A1.241,1.241,0,0,1,.417-.838Z" transform="translate(507 75)" />
                    <path className="svg-fill" d="M.583-.814H3.8c.552,0,1.388.58,1.388,1.132v2.5c0,.552-.913,1.256-1.465,1.256L.4,3.893A.991.991,0,0,1-.645,2.949V.318A1.338,1.338,0,0,1,.583-.814Z" transform="translate(514.645 69.186)" />
                    <path className="svg-fill" d="M.649-.681l3.2.193A1.519,1.519,0,0,1,5.188.708V3.276a1.38,1.38,0,0,1-1.2,1.2L.364,4.159c-.552,0-1.009-.98-1.009-1.532V.575A1.535,1.535,0,0,1,.649-.681Z" transform="translate(514.645 75.186)" />
                </g>
                <path className="svg-fill" d="M.04-5.712,1.68,0h.728l1.3-4.76h.024L5.032,0H5.76L7.4-5.712H6.664L5.408-.92H5.376L4.08-5.712H3.368L2.064-.92H2.032L.776-5.712Zm8.024,0V0h.648V-5.712Zm1.848,0V0H11.9A2.671,2.671,0,0,0,13.96-.784a2.958,2.958,0,0,0,.688-2.072,3.044,3.044,0,0,0-.64-2.072,2.574,2.574,0,0,0-2.048-.784Zm.656.568h1.288A2.1,2.1,0,0,1,13.5-4.56a2.505,2.505,0,0,1,.5,1.7,2.436,2.436,0,0,1-.536,1.7,2.225,2.225,0,0,1-1.68.592H10.568ZM18-5.824a2.428,2.428,0,0,0-1.992.9,3.136,3.136,0,0,0-.688,2.1,3.069,3.069,0,0,0,.7,2.08,2.63,2.63,0,0,0,2.1.864A4.479,4.479,0,0,0,19.448-.08a3.035,3.035,0,0,0,1-.52V-2.936h-2.44v.568H19.8V-.912a2.717,2.717,0,0,1-.72.32,3.321,3.321,0,0,1-.9.128,2.09,2.09,0,0,1-1.68-.664,2.555,2.555,0,0,1-.528-1.7,2.61,2.61,0,0,1,.544-1.752A1.82,1.82,0,0,1,18-5.24a1.907,1.907,0,0,1,1.224.368,1.614,1.614,0,0,1,.576.992h.656A2.23,2.23,0,0,0,19.7-5.3,2.581,2.581,0,0,0,18-5.824Zm3.544.112V0h4.184V-.568H22.2v-2.1h3.2v-.568H22.2V-5.144h3.392v-.568Zm4.656,0v.568h2.016V0h.648V-5.144H30.88v-.568Z" transform="translate(9 43)" />
            </svg>
        );
    },
    follow_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <g transform="translate(-425 -49)">
                    <circle className="svg-fill" cx="5" cy="5" r="5" transform="translate(444 57)" />
                    <path className="svg-fill" d="M4102-603h-13a10.011,10.011,0,0,1,10-10,9.9,9.9,0,0,1,6.1,2.08A4.994,4.994,0,0,0,4101-606a4.958,4.958,0,0,0,1,3Z" transform="translate(-3650 681)" />
                    <path className="svg-fill" d="M4093-605a4,4,0,0,1-4-4,4.005,4.005,0,0,1,4-4,4,4,0,0,1,4,4A4,4,0,0,1,4093-605Zm-.5-3.5v2h1v-2h2v-1h-2v-2h-1v2h-2v1Z" transform="translate(-3637 684)" />
                </g>
                <path className="svg-fill" d="M.576-5.712V0h.656V-2.656h3v-.568h-3v-1.92H4.4v-.568Zm7.112-.112a2.534,2.534,0,0,0-2.032.864,3.1,3.1,0,0,0-.7,2.112,3.1,3.1,0,0,0,.7,2.1A2.548,2.548,0,0,0,7.68.112,2.565,2.565,0,0,0,9.712-.744a3.123,3.123,0,0,0,.7-2.1,3.152,3.152,0,0,0-.7-2.12A2.534,2.534,0,0,0,7.688-5.824Zm0,.584a1.89,1.89,0,0,1,1.536.656A2.663,2.663,0,0,1,9.76-2.848a2.632,2.632,0,0,1-.536,1.72A1.931,1.931,0,0,1,7.68-.472a1.894,1.894,0,0,1-1.544-.672,2.613,2.613,0,0,1-.528-1.7A2.621,2.621,0,0,1,6.136-4.56,1.9,1.9,0,0,1,7.688-5.24Zm3.64-.472V0H15.28V-.568h-3.3V-5.712Zm4.7,0V0h3.952V-.568h-3.3V-5.712Zm7.2-.112A2.534,2.534,0,0,0,21.2-4.96a3.1,3.1,0,0,0-.7,2.112,3.1,3.1,0,0,0,.7,2.1,2.548,2.548,0,0,0,2.024.856,2.565,2.565,0,0,0,2.032-.856,3.123,3.123,0,0,0,.7-2.1,3.152,3.152,0,0,0-.7-2.12A2.534,2.534,0,0,0,23.232-5.824Zm0,.584a1.89,1.89,0,0,1,1.536.656A2.663,2.663,0,0,1,25.3-2.848a2.632,2.632,0,0,1-.536,1.72,1.931,1.931,0,0,1-1.544.656,1.894,1.894,0,0,1-1.544-.672,2.613,2.613,0,0,1-.528-1.7A2.621,2.621,0,0,1,21.68-4.56,1.9,1.9,0,0,1,23.232-5.24Zm3.1-.472L27.976,0H28.7l1.3-4.76h.024L31.328,0h.728L33.7-5.712H32.96L31.7-.92h-.032l-1.3-4.792h-.712L28.36-.92h-.032L27.072-5.712Z" transform="translate(8 43)" />
            </svg>
        );
    },
    audio_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <path className="svg-fill" d="M2.248-5.712,0,0H.7l.608-1.6H3.936L4.544,0h.712L3.008-5.712ZM1.52-2.152l1.1-2.856h.032l1.08,2.856Zm4.312-3.56V0H7.816A2.671,2.671,0,0,0,9.88-.784a2.958,2.958,0,0,0,.688-2.072,3.044,3.044,0,0,0-.64-2.072A2.574,2.574,0,0,0,7.88-5.712Zm.656.568H7.776a2.1,2.1,0,0,1,1.648.584,2.505,2.505,0,0,1,.5,1.7,2.436,2.436,0,0,1-.536,1.7A2.225,2.225,0,0,1,7.7-.568H6.488Zm4.992-.568v3.52A2.37,2.37,0,0,0,12.056-.48a2.284,2.284,0,0,0,1.7.592,2.287,2.287,0,0,0,1.712-.6,2.368,2.368,0,0,0,.568-1.7v-3.52h-.656v3.528a1.9,1.9,0,0,1-.376,1.272,1.616,1.616,0,0,1-1.248.448,1.593,1.593,0,0,1-1.248-.448,1.859,1.859,0,0,1-.376-1.272V-5.712Zm5.76,0V0h.648V-5.712Zm4.344-.112a2.534,2.534,0,0,0-2.032.864,3.1,3.1,0,0,0-.7,2.112,3.1,3.1,0,0,0,.7,2.1,2.548,2.548,0,0,0,2.024.856,2.565,2.565,0,0,0,2.032-.856,3.123,3.123,0,0,0,.7-2.1,3.152,3.152,0,0,0-.7-2.12A2.534,2.534,0,0,0,21.584-5.824Zm0,.584a1.89,1.89,0,0,1,1.536.656,2.663,2.663,0,0,1,.536,1.736,2.632,2.632,0,0,1-.536,1.72,1.931,1.931,0,0,1-1.544.656,1.894,1.894,0,0,1-1.544-.672,2.613,2.613,0,0,1-.528-1.7,2.621,2.621,0,0,1,.528-1.712A1.9,1.9,0,0,1,21.584-5.24Z" transform="translate(12 43)" />
                <g data-name="组 72">
                    <line className="svg-stroke" y2="21" transform="translate(24 8)" fill="none"  strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="17" transform="translate(18 10)" fill="none"  strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="13" transform="translate(12 12)" fill="none"  strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="9" transform="translate(6 14)" fill="none"  strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="17" transform="translate(30 10)" fill="none"  strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="13" transform="translate(36 12)" fill="none"  strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="9" transform="translate(42 14)" fill="none"  strokeLinecap="round" strokeWidth="3"/>
                </g>
            </svg>
        );
    },
    video_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <path className="svg-stroke" d="M16.448,12.485,12.74,9.7V20.642l3.708-2.784,3.586-2.687Zm0,0L12.74,9.7V20.642l3.708-2.784,3.586-2.687Zm0,0L12.74,9.7V20.642l3.708-2.784,3.586-2.687ZM13.956,5.531V3.075A12.1,12.1,0,0,0,7.488,5.762L9.215,7.5A9.654,9.654,0,0,1,13.956,5.531ZM7.5,9.215,5.762,7.488a12.1,12.1,0,0,0-2.687,6.468H5.531A9.654,9.654,0,0,1,7.5,9.215Zm-1.97,7.173H3.075a12.1,12.1,0,0,0,2.687,6.468L7.5,21.117A9.565,9.565,0,0,1,5.531,16.387Zm1.957,8.194a12.135,12.135,0,0,0,6.468,2.687V24.812a9.654,9.654,0,0,1-4.741-1.97L7.488,24.581Zm19.841-9.41a12.176,12.176,0,0,1-10.881,12.1V24.812a9.725,9.725,0,0,0,0-19.282V3.075A12.176,12.176,0,0,1,27.329,15.172Z" transform="translate(8.925 3.225)" />
                <path className="svg-stroke" d="M.04-5.712,2.152,0H2.96L5.072-5.712h-.72l-1.784,5H2.544l-1.784-5Zm5.7,0V0h.648V-5.712Zm1.848,0V0H9.568a2.671,2.671,0,0,0,2.064-.784,2.958,2.958,0,0,0,.688-2.072,3.044,3.044,0,0,0-.64-2.072,2.574,2.574,0,0,0-2.048-.784Zm.656.568H9.528a2.1,2.1,0,0,1,1.648.584,2.505,2.505,0,0,1,.5,1.7,2.436,2.436,0,0,1-.536,1.7,2.225,2.225,0,0,1-1.68.592H8.24Zm4.992-.568V0h4.184V-.568H13.888v-2.1h3.2v-.568h-3.2V-5.144H17.28v-.568Zm7.592-.112a2.534,2.534,0,0,0-2.032.864,3.1,3.1,0,0,0-.7,2.112,3.1,3.1,0,0,0,.7,2.1,2.548,2.548,0,0,0,2.024.856,2.565,2.565,0,0,0,2.032-.856,3.123,3.123,0,0,0,.7-2.1,3.152,3.152,0,0,0-.7-2.12A2.534,2.534,0,0,0,20.824-5.824Zm0,.584a1.89,1.89,0,0,1,1.536.656A2.663,2.663,0,0,1,22.9-2.848a2.632,2.632,0,0,1-.536,1.72,1.931,1.931,0,0,1-1.544.656,1.894,1.894,0,0,1-1.544-.672,2.613,2.613,0,0,1-.528-1.7,2.621,2.621,0,0,1,.528-1.712A1.9,1.9,0,0,1,20.824-5.24Z" transform="translate(12 43)" />
            </svg>
        );
    },
    image_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <g transform="translate(-538.5 -48)">
                    <path className="svg-fill" d="M4117.9-599.5h-7.2c-.046-.037-4.687-3.662-6.685-3.939l-.116,0c-2.38,0-8.8-2.821-8.868-2.85h-.132V-612.5h23v13Z" transform="translate(-3544.397 669)" />
                    <g className="svg-stroke" transform="translate(550.5 56.5)" fill="none" strokeWidth="1">
                    <rect width="23" height="21" stroke="none"/>
                    <rect x="0.5" y="0.5" width="22" height="20" fill="none"/>
                    </g>
                </g>
                <path className="svg-fill" d="M.624-5.712V0h.648V-5.712Zm1.848,0V0h.656V-4.544h.024L5.128,0H5.72L7.7-4.544H7.72V0h.656V-5.712H7.56L5.44-.84H5.416L3.288-5.712Zm8.728,0L8.952,0h.7l.608-1.6h2.624L13.5,0h.712L11.96-5.712Zm-.728,3.56,1.1-2.856H11.6l1.08,2.856Zm6.752-3.672a2.428,2.428,0,0,0-1.992.9,3.136,3.136,0,0,0-.688,2.1,3.069,3.069,0,0,0,.7,2.08,2.63,2.63,0,0,0,2.1.864A4.479,4.479,0,0,0,18.672-.08a3.035,3.035,0,0,0,1-.52V-2.936h-2.44v.568h1.792V-.912a2.718,2.718,0,0,1-.72.32,3.321,3.321,0,0,1-.9.128,2.09,2.09,0,0,1-1.68-.664,2.555,2.555,0,0,1-.528-1.7,2.61,2.61,0,0,1,.544-1.752,1.82,1.82,0,0,1,1.48-.656,1.907,1.907,0,0,1,1.224.368,1.614,1.614,0,0,1,.576.992h.656A2.23,2.23,0,0,0,18.928-5.3,2.581,2.581,0,0,0,17.224-5.824Zm3.544.112V0h4.184V-.568H21.424v-2.1h3.2v-.568h-3.2V-5.144h3.392v-.568Z" transform="translate(12 43)" />
            </svg>
        );
    },
    label_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <path className="svg-fill" d="M4106.242-613,4118-601l-11.758,12ZM4089-589v-24h17.242v24Z" transform="translate(-4078 620)" />
                <path className="svg-fill" d="M.576-5.712V0H4.528V-.568h-3.3V-5.712Zm6.376,0L4.7,0h.7l.608-1.6H8.64L9.248,0H9.96L7.712-5.712Zm-.728,3.56,1.1-2.856h.032l1.08,2.856Zm4.312-3.56V0h2.536a2.475,2.475,0,0,0,1.384-.344,1.418,1.418,0,0,0,.592-1.248,1.361,1.361,0,0,0-.32-.928,1.429,1.429,0,0,0-.872-.464,1.516,1.516,0,0,0,.7-.456,1.389,1.389,0,0,0,.256-.832,1.307,1.307,0,0,0-.456-1.056,1.938,1.938,0,0,0-1.264-.384Zm.656.552h1.744a1.478,1.478,0,0,1,.912.232.852.852,0,0,1,.312.72.9.9,0,0,1-.32.744,1.475,1.475,0,0,1-.912.248H11.192Zm0,2.488h1.824a1.647,1.647,0,0,1,1.008.256.95.95,0,0,1,.368.816.912.912,0,0,1-.424.824,1.821,1.821,0,0,1-.952.224H11.192Zm4.76-3.04V0h4.184V-.568H16.608v-2.1h3.2v-.568h-3.2V-5.144H20v-.568Zm5.1,0V0H25V-.568H21.7V-5.712Z" transform="translate(12 42)" />
            </svg>
        );
    },
    background_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <g className="svg-stroke" transform="translate(22 8)" fill="none" strokeWidth="1">
                    <rect width="15" height="14" stroke="none"/>
                    <rect x="0.5" y="0.5" width="14" height="13" fill="none"/>
                </g>
                <path className="svg-fill" d="M.576-5.712V0H3.112A2.475,2.475,0,0,0,4.5-.344a1.418,1.418,0,0,0,.592-1.248,1.361,1.361,0,0,0-.32-.928A1.429,1.429,0,0,0,3.9-2.984a1.516,1.516,0,0,0,.7-.456,1.389,1.389,0,0,0,.256-.832,1.307,1.307,0,0,0-.456-1.056,1.938,1.938,0,0,0-1.264-.384Zm.656.552H2.976a1.478,1.478,0,0,1,.912.232.852.852,0,0,1,.312.72.9.9,0,0,1-.32.744,1.475,1.475,0,0,1-.912.248H1.232Zm0,2.488H3.056a1.647,1.647,0,0,1,1.008.256.95.95,0,0,1,.368.816.912.912,0,0,1-.424.824,1.821,1.821,0,0,1-.952.224H1.232Zm7.2-3.152a2.428,2.428,0,0,0-1.992.9,3.136,3.136,0,0,0-.688,2.1,3.069,3.069,0,0,0,.7,2.08,2.63,2.63,0,0,0,2.1.864A4.479,4.479,0,0,0,9.88-.08a3.035,3.035,0,0,0,1-.52V-2.936H8.44v.568h1.792V-.912a2.718,2.718,0,0,1-.72.32,3.321,3.321,0,0,1-.9.128,2.09,2.09,0,0,1-1.68-.664,2.555,2.555,0,0,1-.528-1.7,2.61,2.61,0,0,1,.544-1.752,1.82,1.82,0,0,1,1.48-.656,1.907,1.907,0,0,1,1.224.368,1.614,1.614,0,0,1,.576.992h.656A2.23,2.23,0,0,0,10.136-5.3,2.581,2.581,0,0,0,8.432-5.824Zm3.544.112V0h3.952V-.568h-3.3V-5.712Zm6.376,0L16.1,0h.7l.608-1.6H20.04L20.648,0h.712L19.112-5.712Zm-.728,3.56,1.1-2.856h.032l1.08,2.856ZM21.4-5.712,23.68-2.32V0h.656V-2.32l2.28-3.392h-.792L24.008-2.928,22.192-5.712Zm8.328-.112A2.534,2.534,0,0,0,27.7-4.96a3.1,3.1,0,0,0-.7,2.112,3.1,3.1,0,0,0,.7,2.1A2.548,2.548,0,0,0,29.72.112a2.565,2.565,0,0,0,2.032-.856,3.123,3.123,0,0,0,.7-2.1,3.152,3.152,0,0,0-.7-2.12A2.534,2.534,0,0,0,29.728-5.824Zm0,.584a1.89,1.89,0,0,1,1.536.656A2.663,2.663,0,0,1,31.8-2.848a2.632,2.632,0,0,1-.536,1.72,1.931,1.931,0,0,1-1.544.656,1.894,1.894,0,0,1-1.544-.672,2.613,2.613,0,0,1-.528-1.7,2.621,2.621,0,0,1,.528-1.712A1.9,1.9,0,0,1,29.728-5.24Zm3.64-.472v3.52A2.37,2.37,0,0,0,33.944-.48a2.284,2.284,0,0,0,1.7.592,2.287,2.287,0,0,0,1.712-.6,2.368,2.368,0,0,0,.568-1.7v-3.52h-.656v3.528A1.9,1.9,0,0,1,36.9-.912a1.616,1.616,0,0,1-1.248.448A1.593,1.593,0,0,1,34.4-.912a1.859,1.859,0,0,1-.376-1.272V-5.712Zm5.272,0v.568h2.016V0H41.3V-5.144H43.32v-.568Z" transform="translate(3 40)" />
                <line className="svg-stroke" x1="14" y2="13" transform="translate(22.5 8.5)" fill="none" strokeWidth="1"/>
                <line className="svg-stroke" x1="10" y2="9" transform="translate(22.5 8.5)" fill="none" strokeWidth="1"/>
                <line className="svg-stroke" x1="6" y2="6" transform="translate(22.5 8.5)" fill="none" strokeWidth="1"/>
                <line className="svg-stroke" x1="10" y2="9" transform="translate(26.5 12.5)" fill="none" strokeWidth="1"/>
                <line className="svg-stroke" x1="5" y2="5" transform="translate(31.5 16.5)" fill="none" strokeWidth="1"/>
                <g transform="translate(-537.532 -41.878)">
                    <path className="svg-fill" d="M15,9H10.3c-.03-.025-3.056-2.535-4.36-2.727l-.075,0C4.317,6.274.128,4.321.086,4.3H0V0H15V9Z" transform="translate(550.532 56.878)" />
                    <g className="svg-stroke" transform="translate(550.532 56.878)" fill="none" strokeWidth="1">
                    <rect width="15" height="13" stroke="none"/>
                    <rect x="0.5" y="0.5" width="14" height="12" fill="none"/>
                    </g>
                </g>
            </svg>
        );
    },
    seat_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <path className="svg-fill" d="M5.69,24.672v4.034H9.724V24.672H23.172v4.034h4.034V20.637H5.69ZM25.861,13.913H29.9v4.034H25.861ZM3,13.913H7.034v4.034H3Zm20.172,4.034H9.724V7.19a2.7,2.7,0,0,1,2.69-2.69h8.069a2.7,2.7,0,0,1,2.69,2.69Z" transform="translate(8 1.897)" />
                <path className="svg-fill" d="M2.5-5.824A2.542,2.542,0,0,0,1.04-5.44,1.3,1.3,0,0,0,.408-4.28a1.208,1.208,0,0,0,.656,1.1,9.562,9.562,0,0,0,1.312.464A6.864,6.864,0,0,1,3.584-2.3a.927.927,0,0,1,.568.84.809.809,0,0,1-.432.72,2.171,2.171,0,0,1-1.136.264,1.839,1.839,0,0,1-1.16-.32,1.57,1.57,0,0,1-.52-1.1H.256A2.036,2.036,0,0,0,1-.32,2.587,2.587,0,0,0,2.584.112,2.765,2.765,0,0,0,4.2-.312,1.387,1.387,0,0,0,4.8-1.5,1.348,1.348,0,0,0,4.088-2.7,7.7,7.7,0,0,0,2.6-3.256a6.648,6.648,0,0,1-1.048-.36.782.782,0,0,1-.488-.7.787.787,0,0,1,.408-.728,1.927,1.927,0,0,1,.992-.208,1.669,1.669,0,0,1,1.08.3,1.442,1.442,0,0,1,.48.92h.648a1.866,1.866,0,0,0-.656-1.36A2.371,2.371,0,0,0,2.5-5.824Zm3.136.112V0H9.816V-.568H6.288v-2.1h3.2v-.568h-3.2V-5.144H9.68v-.568Zm6.768,0L10.152,0h.7l.608-1.6h2.624L14.7,0h.712L13.16-5.712Zm-.728,3.56,1.1-2.856H12.8l1.08,2.856Zm3.872-3.56v.568H17.56V0h.648V-5.144h2.016v-.568Z" transform="translate(14 42)" />
            </svg>
        );
    },
    seat_empty_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <path className="svg-fill" d="M.576-5.712V0H4.76V-.568H1.232v-2.1h3.2v-.568h-3.2V-5.144H4.624v-.568Zm5.1,0V0h.656V-4.544h.024L8.328,0H8.92L10.9-4.544h.024V0h.656V-5.712H10.76L8.64-.84H8.616L6.488-5.712Zm7.056,0V0h.656V-2.336h1.672c1.312,0,1.976-.568,1.976-1.7s-.656-1.68-1.968-1.68Zm.656.568h1.64a1.525,1.525,0,0,1,1.016.28.976.976,0,0,1,.336.832,1.051,1.051,0,0,1-.328.848,1.581,1.581,0,0,1-1.024.28h-1.64Zm4.04-.568v.568H19.44V0h.648V-5.144H22.1v-.568Zm4.856,0L24.56-2.32V0h.656V-2.32L27.5-5.712H26.7L24.888-2.928,23.072-5.712Z" transform="translate(10 43)" />
                <g transform="translate(-0.5)">
                    <path className="svg-fill" d="M5.69,24.672v4.034H9.724V24.672H23.172v4.034h4.034V20.637H5.69ZM25.861,13.913H29.9v4.034H25.861ZM3,13.913H7.034v4.034H3Zm20.172,4.034H9.724V7.19a2.7,2.7,0,0,1,2.69-2.69h8.069a2.7,2.7,0,0,1,2.69,2.69Z" transform="translate(8.552 1.897)" />
                    <line className="svg-stroke" x2="28" y2="24" transform="translate(10.5 6.5)" fill="none" strokeLinecap="round" strokeWidth="4"/>
                </g>
            </svg>
        );
    },
    audio_animate_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <path className="svg-fill" d="M4099-604h-8a2,2,0,0,1-2-2v-4a2,2,0,0,1,2-2h8a2,2,0,0,1,2,2v4A2,2,0,0,1,4099-604Zm-6.017-3.2h1.968l.456,1.2h.534l-1.686-4.284h-.57L4092-606h.528l.456-1.2Zm4.644-1.578c.542,0,.816.3.816.906V-606h.479v-1.908c0-.848-.39-1.277-1.158-1.277a1.1,1.1,0,0,0-.558.144,1.092,1.092,0,0,0-.414.4v-.456h-.481v3.1h.481v-1.872a1,1,0,0,1,.276-.672A.766.766,0,0,1,4097.628-608.778Zm-2.832,1.164h-1.656l.822-2.142h.025l.809,2.141Z" transform="translate(-4061 634)" />
                <g transform="translate(4 1)">
                    <line className="svg-stroke" y2="14" transform="translate(18 8)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="12" transform="translate(14 9)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="8" transform="translate(10 11)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="6" transform="translate(6 12)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="12" transform="translate(22 9)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="8" transform="translate(26 11)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="6" transform="translate(30 12)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                </g>
                <path className="svg-fill" d="M2.248-5.712,0,0H.7l.608-1.6H3.936L4.544,0h.712L3.008-5.712ZM1.52-2.152l1.1-2.856h.032l1.08,2.856Zm4.312-3.56v3.52A2.37,2.37,0,0,0,6.408-.48a2.284,2.284,0,0,0,1.7.592,2.287,2.287,0,0,0,1.712-.6,2.368,2.368,0,0,0,.568-1.7v-3.52H9.736v3.528A1.9,1.9,0,0,1,9.36-.912a1.616,1.616,0,0,1-1.248.448A1.593,1.593,0,0,1,6.864-.912a1.859,1.859,0,0,1-.376-1.272V-5.712Zm5.76,0V0h.648V-5.712Zm1.848,0V0h1.984a2.671,2.671,0,0,0,2.064-.784,2.958,2.958,0,0,0,.688-2.072,3.044,3.044,0,0,0-.64-2.072,2.574,2.574,0,0,0-2.048-.784Zm.656.568h1.288a2.1,2.1,0,0,1,1.648.584,2.505,2.505,0,0,1,.5,1.7,2.436,2.436,0,0,1-.536,1.7,2.225,2.225,0,0,1-1.68.592H14.1Zm7.488-.68a2.534,2.534,0,0,0-2.032.864,3.1,3.1,0,0,0-.7,2.112,3.1,3.1,0,0,0,.7,2.1,2.548,2.548,0,0,0,2.024.856,2.565,2.565,0,0,0,2.032-.856,3.123,3.123,0,0,0,.7-2.1,3.152,3.152,0,0,0-.7-2.12A2.534,2.534,0,0,0,21.584-5.824Zm0,.584a1.89,1.89,0,0,1,1.536.656,2.663,2.663,0,0,1,.536,1.736,2.632,2.632,0,0,1-.536,1.72,1.931,1.931,0,0,1-1.544.656,1.894,1.894,0,0,1-1.544-.672,2.613,2.613,0,0,1-.528-1.7,2.621,2.621,0,0,1,.528-1.712A1.9,1.9,0,0,1,21.584-5.24ZM26.9-5.712,24.648,0h.7l.608-1.6h2.624L29.192,0H29.9L27.656-5.712Zm-.728,3.56,1.1-2.856H27.3l1.08,2.856Zm4.312-3.56V0h.656V-4.7h.024L34.408,0h.672V-5.712h-.656v4.648H34.4L31.168-5.712Z" transform="translate(6 43)" />
            </svg>
        );
    },
    keyframe_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <g transform="translate(-594 -48)">
                    <line className="svg-stroke" x2="32" transform="translate(602 77)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="7" transform="translate(618 70)" fill="none" strokeLinecap="round" strokeWidth="1"/>
                    <path className="svg-fill" d="M6,0l6,7L6,14,0,7Z" transform="translate(612 55)" />
                </g>
                <path className="svg-fill" d="M4.3-5.712,1.232-2.744V-5.712H.576V0h.656V-2l.888-.84L4.64,0h.88L2.576-3.264,5.16-5.712Zm1.792,0V0H10.28V-.568H6.752v-2.1h3.2v-.568h-3.2V-5.144h3.392v-.568Zm4.56,0,2.28,3.392V0h.656V-2.32l2.28-3.392H15.08L13.264-2.928,11.448-5.712Zm5.832,0V0h.656V-2.656h3v-.568h-3v-1.92h3.168v-.568Zm4.616,0V0h.656V-2.456h1.728a1.35,1.35,0,0,1,.824.208.945.945,0,0,1,.36.728l.072.76a1.553,1.553,0,0,0,.232.76h.712a1.529,1.529,0,0,1-.3-.84L25.3-1.72a1.088,1.088,0,0,0-.912-1.04v-.016a1.317,1.317,0,0,0,.776-.5,1.423,1.423,0,0,0,.264-.848,1.458,1.458,0,0,0-.512-1.2,2.084,2.084,0,0,0-1.344-.392Zm.656.568h1.728a1.5,1.5,0,0,1,.976.264,1,1,0,0,1,.3.784,1,1,0,0,1-.3.776,1.458,1.458,0,0,1-.968.3H21.76Zm6.424-.568L25.936,0h.7l.608-1.6h2.624L30.48,0h.712L28.944-5.712Zm-.728,3.56,1.1-2.856h.032l1.08,2.856Zm4.312-3.56V0h.656V-4.544h.024L34.424,0h.592l1.976-4.544h.024V0h.656V-5.712h-.816L34.736-.84h-.024L32.584-5.712Zm7.056,0V0h4.184V-.568H39.48v-2.1h3.2v-.568h-3.2V-5.144h3.392v-.568Z" transform="translate(3 43)" />
            </svg>
        );
    },
    keyframe_pro_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <g transform="translate(1)">
                    <path className="svg-fill" d="M4097-606h-6a2,2,0,0,1-2-2v-3a2,2,0,0,1,2-2h6a2,2,0,0,1,2,2v3A2,2,0,0,1,4097-606Zm-.9-4.184a.945.945,0,0,0-.762.324,1.169,1.169,0,0,0-.263.792,1.168,1.168,0,0,0,.263.789.961.961,0,0,0,.759.321.965.965,0,0,0,.762-.321,1.18,1.18,0,0,0,.263-.789,1.186,1.186,0,0,0-.263-.8A.954.954,0,0,0,4096.106-610.184Zm-2.964.041V-608h.246v-.921h.648a.508.508,0,0,1,.309.078.351.351,0,0,1,.135.274l.028.285a.583.583,0,0,0,.086.285h.268a.58.58,0,0,1-.114-.315l-.033-.33a.408.408,0,0,0-.342-.39v-.006a.493.493,0,0,0,.29-.186.538.538,0,0,0,.1-.318.552.552,0,0,0-.192-.451.779.779,0,0,0-.5-.147Zm-1.926,0V-608h.246v-.876h.626c.492,0,.742-.214.742-.636s-.249-.631-.739-.631Zm4.886,1.966a.714.714,0,0,1-.579-.252.988.988,0,0,1-.2-.639.981.981,0,0,1,.2-.643.716.716,0,0,1,.582-.254.711.711,0,0,1,.576.246,1,1,0,0,1,.2.651,1,1,0,0,1-.2.645A.724.724,0,0,1,4096.1-608.177Zm-4.027-.912h-.614v-.839h.614a.575.575,0,0,1,.382.1.365.365,0,0,1,.125.312.4.4,0,0,1-.123.318A.592.592,0,0,1,4092.076-609.089Zm1.96-.045h-.648v-.794h.648a.564.564,0,0,1,.366.1.371.371,0,0,1,.11.294.371.371,0,0,1-.113.29A.553.553,0,0,1,4094.036-609.134Z" transform="translate(-4062 630)" />
                    <g transform="translate(-594 -45.625)">
                    <line className="svg-stroke" x2="28" transform="translate(602 74.625)" fill="none" strokeLinecap="round" strokeWidth="3"/>
                    <line className="svg-stroke" y2="6" transform="translate(616 68.625)" fill="none" strokeLinecap="round" strokeWidth="1"/>
                    <path className="svg-fill" d="M5,0l5,6.5L5,13,0,6.5Z" transform="translate(611 54.625)" />
                    </g>
                </g>
                <path className="svg-fill" d="M4.3-5.712,1.232-2.744V-5.712H.576V0h.656V-2l.888-.84L4.64,0h.88L2.576-3.264,5.16-5.712Zm1.792,0V0H10.28V-.568H6.752v-2.1h3.2v-.568h-3.2V-5.144h3.392v-.568Zm4.56,0,2.28,3.392V0h.656V-2.32l2.28-3.392H15.08L13.264-2.928,11.448-5.712Zm5.832,0V0h.656V-2.336h1.672c1.312,0,1.976-.568,1.976-1.7s-.656-1.68-1.968-1.68Zm.656.568h1.64a1.525,1.525,0,0,1,1.016.28.976.976,0,0,1,.336.832,1.051,1.051,0,0,1-.328.848,1.581,1.581,0,0,1-1.024.28h-1.64Zm4.48-.568V0h.656V-2.456h1.728a1.35,1.35,0,0,1,.824.208.945.945,0,0,1,.36.728l.072.76A1.553,1.553,0,0,0,25.5,0h.712a1.529,1.529,0,0,1-.3-.84l-.088-.88A1.088,1.088,0,0,0,24.9-2.76v-.016a1.317,1.317,0,0,0,.776-.5,1.423,1.423,0,0,0,.264-.848,1.458,1.458,0,0,0-.512-1.2,2.084,2.084,0,0,0-1.344-.392Zm.656.568h1.728a1.5,1.5,0,0,1,.976.264,1,1,0,0,1,.3.784,1,1,0,0,1-.3.776,1.458,1.458,0,0,1-.968.3H22.28Zm7.248-.68A2.534,2.534,0,0,0,27.5-4.96a3.1,3.1,0,0,0-.7,2.112,3.1,3.1,0,0,0,.7,2.1A2.548,2.548,0,0,0,29.52.112a2.565,2.565,0,0,0,2.032-.856,3.123,3.123,0,0,0,.7-2.1,3.152,3.152,0,0,0-.7-2.12A2.534,2.534,0,0,0,29.528-5.824Zm0,.584a1.89,1.89,0,0,1,1.536.656A2.663,2.663,0,0,1,31.6-2.848a2.632,2.632,0,0,1-.536,1.72,1.931,1.931,0,0,1-1.544.656,1.894,1.894,0,0,1-1.544-.672,2.613,2.613,0,0,1-.528-1.7,2.621,2.621,0,0,1,.528-1.712A1.9,1.9,0,0,1,29.528-5.24Z" transform="translate(8 43)" />
            </svg>
        );
    },
    mute_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <path className="svg-fill" d="M434,60.648V74.857h8L450,79V56l-8,4.648Z" transform="translate(-426 -48)" />
                <line className="svg-stroke" y2="17" transform="translate(40.01 13.49) rotate(45)" fill="none" strokeLinecap="round" strokeWidth="2"/>
                <line className="svg-stroke" y2="17" transform="translate(27.99 13.49) rotate(-45)" fill="none" strokeLinecap="round" strokeWidth="2"/>
                <path className="svg-fill" d="M.576-5.712V0h.656V-4.544h.024L3.232,0h.592L5.8-4.544h.024V0H6.48V-5.712H5.664L3.544-.84H3.52L1.392-5.712Zm7.056,0v3.52A2.37,2.37,0,0,0,8.208-.48a2.284,2.284,0,0,0,1.7.592,2.287,2.287,0,0,0,1.712-.6,2.368,2.368,0,0,0,.568-1.7v-3.52h-.656v3.528A1.9,1.9,0,0,1,11.16-.912a1.616,1.616,0,0,1-1.248.448A1.593,1.593,0,0,1,8.664-.912a1.859,1.859,0,0,1-.376-1.272V-5.712Zm5.272,0v.568H14.92V0h.648V-5.144h2.016v-.568Zm5.392,0V0H22.48V-.568H18.952v-2.1h3.2v-.568h-3.2V-5.144h3.392v-.568Z" transform="translate(13 42)" />
            </svg>
        );
    },
    view_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <g className="svg-stroke" transform="translate(12 7)" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                    <rect width="24" height="23" rx="3" stroke="none"/>
                    <rect x="0.5" y="0.5" width="23" height="22" rx="2.5" fill="none"/>
                </g>
                <line className="svg-stroke" y2="21" transform="translate(19 8)" fill="none" strokeWidth="1" strokeDasharray="1 1"/>
                <line className="svg-stroke" y2="21" transform="translate(29 8)" fill="none" strokeWidth="1" strokeDasharray="1 1"/>
                <line className="svg-stroke" x2="23" transform="translate(12.5 14)" fill="none" strokeWidth="1" strokeDasharray="1"/>
                <line className="svg-stroke" x2="23" transform="translate(12.5 23)" fill="none" strokeWidth="1" strokeDasharray="1 1"/>
                <path className="svg-fill" d="M.04-5.712,2.152,0H2.96L5.072-5.712h-.72l-1.784,5H2.544l-1.784-5Zm5.7,0V0h.648V-5.712Zm1.848,0V0h4.184V-.568H8.24v-2.1h3.2v-.568H8.24V-5.144h3.392v-.568Zm4.56,0L13.784,0h.728l1.3-4.76h.024L17.136,0h.728L19.5-5.712h-.736L17.512-.92H17.48l-1.3-4.792h-.712L14.168-.92h-.032L12.88-5.712Z" transform="translate(14 43)" />
            </svg>
        );
    },
    gender_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <g transform="matrix(0.978, 0.208, -0.208, 0.978, -508.884, -158.799)">
                    <path className="svg-fill" d="M4.814,10.832h0A5.427,5.427,0,1,1,7.1,10.6,5.528,5.528,0,0,0,6.91,9.556c-.046-.16-.1-.319-.158-.472a3.881,3.881,0,1,0-2.513.043A5.487,5.487,0,0,1,4.672,10.2a5.481,5.481,0,0,1,.142.633Z" transform="matrix(0.966, 0.259, -0.259, 0.966, 558.125, 53.107)" />
                    <path className="svg-fill" d="M4.814,10.832h0A5.427,5.427,0,1,1,7.1,10.6,5.528,5.528,0,0,0,6.91,9.556c-.046-.16-.1-.319-.158-.472a3.881,3.881,0,1,0-2.513.043A5.487,5.487,0,0,1,4.672,10.2a5.481,5.481,0,0,1,.142.633Z" transform="matrix(-0.966, -0.259, 0.259, -0.966, 560.377, 71.039)" />
                    <g transform="translate(564.3 52)">
                    <path className="svg-fill" d="M0,4.881a1,1,0,0,1-.707-.293,1,1,0,0,1,0-1.414L3.174-.707a1,1,0,0,1,1.414,0,1,1,0,0,1,0,1.414L.707,4.588A1,1,0,0,1,0,4.881Z" transform="translate(0.776)" />
                    <path className="svg-fill" d="M.775,5.657A1,1,0,0,1-.21,4.821L-.986.164A1,1,0,0,1-.164-.986,1,1,0,0,1,.986-.164l.776,4.657A1,1,0,0,1,.775,5.657Z" transform="translate(4.657)" />
                    <path className="svg-fill" d="M4.657,1H0A1,1,0,0,1-1,0,1,1,0,0,1,0-1H4.657a1,1,0,0,1,1,1A1,1,0,0,1,4.657,1Z" />
                    </g>
                    <path className="svg-fill" d="M1.529,8a1,1,0,0,1-.976-.787l-1.53-7A1,1,0,0,1-.214-.977,1,1,0,0,1,.977-.214l1.53,7A1,1,0,0,1,1.529,8Z" transform="translate(548.003 73.621) rotate(-124)" />
                    <path className="svg-fill" d="M6,1H0A1,1,0,0,1-1,0,1,1,0,0,1,0-1H6A1,1,0,0,1,7,0,1,1,0,0,1,6,1Z" transform="matrix(-0.719, -0.695, 0.695, -0.719, 552.189, 73.494)" />
                </g>
                <path className="svg-fill" d="M3.016-5.824a2.428,2.428,0,0,0-1.992.9,3.136,3.136,0,0,0-.688,2.1,3.069,3.069,0,0,0,.7,2.08,2.63,2.63,0,0,0,2.1.864A4.479,4.479,0,0,0,4.464-.08a3.035,3.035,0,0,0,1-.52V-2.936H3.024v.568H4.816V-.912a2.718,2.718,0,0,1-.72.32,3.321,3.321,0,0,1-.9.128,2.09,2.09,0,0,1-1.68-.664,2.555,2.555,0,0,1-.528-1.7,2.61,2.61,0,0,1,.544-1.752,1.82,1.82,0,0,1,1.48-.656,1.907,1.907,0,0,1,1.224.368,1.614,1.614,0,0,1,.576.992h.656A2.23,2.23,0,0,0,4.72-5.3,2.581,2.581,0,0,0,3.016-5.824Zm3.544.112V0h4.184V-.568H7.216v-2.1h3.2v-.568h-3.2V-5.144h3.392v-.568Zm5.1,0V0h.656V-4.7h.024L15.584,0h.672V-5.712H15.6v4.648h-.024L12.344-5.712Zm5.752,0V0h1.984a2.671,2.671,0,0,0,2.064-.784,2.958,2.958,0,0,0,.688-2.072,3.044,3.044,0,0,0-.64-2.072,2.574,2.574,0,0,0-2.048-.784Zm.656.568h1.288A2.1,2.1,0,0,1,21-4.56a2.505,2.505,0,0,1,.5,1.7,2.436,2.436,0,0,1-.536,1.7,2.225,2.225,0,0,1-1.68.592H18.064Zm4.992-.568V0H27.24V-.568H23.712v-2.1h3.2v-.568h-3.2V-5.144H27.1v-.568Zm5.1,0V0h.656V-2.456h1.728a1.35,1.35,0,0,1,.824.208.945.945,0,0,1,.36.728l.072.76a1.553,1.553,0,0,0,.232.76h.712a1.529,1.529,0,0,1-.3-.84l-.088-.88a1.088,1.088,0,0,0-.912-1.04v-.016a1.317,1.317,0,0,0,.776-.5,1.423,1.423,0,0,0,.264-.848,1.458,1.458,0,0,0-.512-1.2,2.084,2.084,0,0,0-1.344-.392Zm.656.568h1.728a1.5,1.5,0,0,1,.976.264,1,1,0,0,1,.3.784,1,1,0,0,1-.3.776,1.458,1.458,0,0,1-.968.3H28.808Z" transform="translate(8 43)" />
            </svg>
        );
    },
    lottie_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <g transform="translate(-595.878 -47.71)">
                    <path className="svg-stroke" d="M617.08,61.09s5.177,11.406-3.392,14.182c-3.6.9-7.332-5.782.871-8.751,2.835-.04,6.967-.132,7.056-.114" transform="translate(-1 1.151)" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                    <line className="svg-stroke" x2="2.378" transform="translate(613.034 58.278) rotate(48)" fill="none" strokeLinecap="round" strokeWidth="2"/>
                    <line className="svg-stroke" x2="2.378" transform="translate(623.932 67.485)" fill="none" strokeLinecap="round" strokeWidth="2"/>
                    <line className="svg-stroke" x2="2.378" transform="translate(629.877 67.485)" fill="none" strokeLinecap="round" strokeWidth="2"/>
                    <circle className="svg-fill" cx="1" cy="1" r="1" transform="translate(609.878 55.21)" />
                </g>
                <path className="svg-fill" d="M.576-5.712V0H4.528V-.568h-3.3V-5.712Zm7.2-.112a2.534,2.534,0,0,0-2.032.864,3.1,3.1,0,0,0-.7,2.112,3.1,3.1,0,0,0,.7,2.1A2.548,2.548,0,0,0,7.768.112,2.565,2.565,0,0,0,9.8-.744a3.123,3.123,0,0,0,.7-2.1,3.152,3.152,0,0,0-.7-2.12A2.534,2.534,0,0,0,7.776-5.824Zm0,.584a1.89,1.89,0,0,1,1.536.656,2.663,2.663,0,0,1,.536,1.736,2.632,2.632,0,0,1-.536,1.72,1.931,1.931,0,0,1-1.544.656,1.894,1.894,0,0,1-1.544-.672,2.613,2.613,0,0,1-.528-1.7A2.621,2.621,0,0,1,6.224-4.56,1.9,1.9,0,0,1,7.776-5.24Zm3.2-.472v.568h2.016V0h.648V-5.144h2.016v-.568Zm4.952,0v.568h2.016V0h.648V-5.144h2.016v-.568Zm5.44,0V0h.648V-5.712Zm1.848,0V0H27.4V-.568H23.872v-2.1h3.2v-.568h-3.2V-5.144h3.392v-.568Z" transform="translate(10 42)" />
            </svg>
        );
    },
    stamp_text() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <rect width="100%" height="100%" rx="8" fill="none"/>
                <g transform="translate(-650 -51)">
                    <path className="svg-stroke" d="M666,68.163s1.387-.429,0-4.009c1.385-3.721-1.117-3.548,0-5.181.953-1.3,1.474-1.093,3.813,0,1.485-1.339,2.361-1.281,4.524,0,1.974-1.989,4.675,0,4.675,0s1.793-2.2,4.391,0c2.531-2.11,3.126-.5,4.036,0-2.106,4.39,0,5.649,0,5.649s-2.671,1.877,0,4.485c-2.547,2.275,0,5.187,0,5.187s-1.075,2.6-4.284,0c-2.191,2.5-4.821,0-4.821,0s-1.734,2.537-4.334,0c-1.9,2.377-4.54,0-4.54,0s-2.263,2.33-3.46,0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                    <path className="svg-stroke" d="M663.6,80.6s1.1.91,8.7-3.119a8.482,8.482,0,0,1,6.159,1.883" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                    <circle className="svg-fill" cx="1" cy="1" r="1" transform="translate(659 78)" />
                    <path className="svg-stroke" d="M659.455,69.978s5.218,4.041,8.663.609,8.913-1.429,8.913-1.429" fill="none" strokeLinecap="round" strokeWidth="1"/>
                    <path className="svg-fill" d="M4105.585-604h-4.915a8.314,8.314,0,0,0,.438-3.062,17.476,17.476,0,0,0-5.738-1.119,8.694,8.694,0,0,0-3.784.781V-613h14v9Z" transform="translate(-3422.585 675)" />
                </g>
                <path className="svg-fill" d="M2.5-5.824A2.542,2.542,0,0,0,1.04-5.44,1.3,1.3,0,0,0,.408-4.28a1.208,1.208,0,0,0,.656,1.1,9.562,9.562,0,0,0,1.312.464A6.864,6.864,0,0,1,3.584-2.3a.927.927,0,0,1,.568.84.809.809,0,0,1-.432.72,2.171,2.171,0,0,1-1.136.264,1.839,1.839,0,0,1-1.16-.32,1.57,1.57,0,0,1-.52-1.1H.256A2.036,2.036,0,0,0,1-.32,2.587,2.587,0,0,0,2.584.112,2.765,2.765,0,0,0,4.2-.312,1.387,1.387,0,0,0,4.8-1.5,1.348,1.348,0,0,0,4.088-2.7,7.7,7.7,0,0,0,2.6-3.256a6.648,6.648,0,0,1-1.048-.36.782.782,0,0,1-.488-.7.787.787,0,0,1,.408-.728,1.927,1.927,0,0,1,.992-.208,1.669,1.669,0,0,1,1.08.3,1.442,1.442,0,0,1,.48.92h.648a1.866,1.866,0,0,0-.656-1.36A2.371,2.371,0,0,0,2.5-5.824Zm2.7.112v.568H7.208V0h.648V-5.144H9.872v-.568Zm7.064,0L10.008,0h.7l.608-1.6h2.624L14.552,0h.712L13.016-5.712Zm-.728,3.56,1.1-2.856h.032l1.08,2.856Zm4.312-3.56V0H16.5V-4.544h.024L18.5,0h.592l1.976-4.544h.024V0h.656V-5.712h-.816L18.808-.84h-.024L16.656-5.712Zm7.056,0V0h.656V-2.336h1.672c1.312,0,1.976-.568,1.976-1.7s-.656-1.68-1.968-1.68Zm.656.568h1.64a1.525,1.525,0,0,1,1.016.28.976.976,0,0,1,.336.832,1.051,1.051,0,0,1-.328.848,1.581,1.581,0,0,1-1.024.28h-1.64Z" transform="translate(11 43)" />
            </svg>
        );
    },
    exit() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <rect width="100%" height="100%" fill="none"/>
                <path className="svg-fill" d="M5.478,0V1.89h7.3v9.452h-7.3v1.89h9.13V0ZM7.3,3.781v1.89H0v1.89H7.3v1.89l3.652-2.836Z" transform="translate(4.696 5.384)" />
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



