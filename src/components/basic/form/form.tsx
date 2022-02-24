import { createContext, PropsWithChildren } from "react";
import styled from "styled-components";

const FormSelf = styled.form``;

const FormContext = createContext({})

interface FormProps {

}
export default function Form(props: PropsWithChildren<FormProps>) {

    return (
        <FormContext.Provider value={{}}>
            <FormSelf>
                { props.children }
            </FormSelf>
        </FormContext.Provider>
    );
}
