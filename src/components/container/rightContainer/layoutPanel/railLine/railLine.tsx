import styled from 'styled-components';

const LayoutRailLineWrapper = styled.div`
    position: relative;
    width: 44px;
    height: 16px;
    overflow: hidden;
`;
export enum RailLineDirection {
    TOP,
    BOTTOM,
}
export enum RailLineLocation {
    LEFT,
    RIGHT
}

interface LayoutRailLineProps {
    direction?: RailLineDirection
    location?: RailLineLocation
}
const borderWidth = 1;
const LayoutRailLine = styled.div<LayoutRailLineProps>`
    position: absolute;
    ${props => props.location === RailLineLocation.LEFT
        ? `
            right: -12px;
        ` : `
            left: -12px;
        `};
    ${props => props.direction === RailLineDirection.TOP
        ? `
            top: 0;
        ` : `
            bottom: 0;
        `};
    border-radius: 8px;
    width: 56px;
    height: 40px;
    border: ${borderWidth}px solid ${props => props.theme.white50};
`;

interface RailLineProps extends LayoutRailLineProps {

}

export default function RailLine(props: RailLineProps) {
    const { location, direction } = props;
    return (
        <LayoutRailLineWrapper>
            <LayoutRailLine
                location={ location }
                direction={ direction }
                />
        </LayoutRailLineWrapper>
    );
}