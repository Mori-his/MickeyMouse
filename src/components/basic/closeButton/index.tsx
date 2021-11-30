import styled from "styled-components";


export const CloseWrapper = styled.div`
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
`;


export const CloseIcon = styled.div``;


export function CloseButton() {
    return (
        <CloseWrapper>
            <CloseIcon>
                <svg id="close组合" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
                    <rect id="close组合背景" width="20" height="20" rx="10" fill="#141719"/>
                    <g id="close" transform="translate(1 1)">
                        <line id="直线_29" data-name="直线 29" x2="6" y2="6" transform="translate(5.884 5.884)" fill="none" stroke="#707070" stroke-linecap="round" stroke-width="2"/>
                        <line id="直线_30" data-name="直线 30" x2="6" y2="6" transform="translate(12.116 5.884) rotate(90)" fill="none" stroke="#707070" stroke-linecap="round" stroke-width="2"/>
                        <rect id="close-容器" width="24" height="24" fill="none"/>
                    </g>
                </svg>
            </CloseIcon>
        </CloseWrapper>
    );
}
