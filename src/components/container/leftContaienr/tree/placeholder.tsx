import styled from "styled-components";

const PlaceholderWrapper = styled.div`
    width: 100%;
    height: 32px;
    border: 1px dashed #fff;
    border-radius: 8px;
    background-color: ${props => props.theme.primary};
`;

interface PlaceholderProps {
    paddingLeft?: number
    isShow?: boolean
}
export default function Placeholder(props: PlaceholderProps) {
    const { paddingLeft = 0, isShow = false } = props;
    return isShow ? (
        <PlaceholderWrapper
            style={{ paddingLeft, }}
            />
    ) : null;
}
