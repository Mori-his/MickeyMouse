import styled from 'styled-components';

export const IconsContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: ${props => props.theme.primary};
    border-radius: 12px;
    padding: 4px 8px;
`;

export const PaddingRL8 = styled.div`
    padding: 0 8px;
`;


export const TextareaBox = styled.div`
    padding: 0 0 8px;
`;

export const FlexJustifyBetween = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const TextPanelItem = styled(FlexJustifyBetween)`
    padding: 8px 0;
`;

export const InputBeforeSpan = styled.span`
    flex-shrink: 0;
    color: ${props => props.theme.lesserText};
    margin: 0 8px;
`;
