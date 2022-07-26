import styled from "styled-components";
import Image from "next/image";

const SideBarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
    width: 56px;
    height: 100vh;
    background: ${props => props.theme.main};
    box-shadow: 1px 0 6px rgba(0, 0, 0, .3);
`;

export const SideBar = function() {


    return (
        <SideBarWrapper>
            <Image
                src="https://p5.ssl.qhimg.com/t01a90d4fe5dbd6733a.png"
                alt="logo"
                width={40}
                height={48}
                />
        </SideBarWrapper>
    );
}

