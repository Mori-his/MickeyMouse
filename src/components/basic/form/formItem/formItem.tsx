import styled from "styled-components";

const FormItemWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 0;
`;

interface FormItemProps {
}
export default function FormItem(props: React.PropsWithChildren<FormItemProps>) {
    return (
        <FormItemWrapper>
            { props.children }
        </FormItemWrapper>
    );
}
