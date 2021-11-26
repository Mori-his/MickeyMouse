import { useRouter } from "next/router";
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { ImageParentData, ImageWidget } from "../../layout/core/layout";



const imageWidget = new ImageWidget()
const imageWidget1 = new ImageWidget()
const imageWidget2 = new ImageWidget()
imageWidget.addAll([imageWidget1, imageWidget2])
imageWidget.visitChildren((child) => {
    console.log(child);
})
class Root {}

const owner = new Root()

imageWidget.attach(owner);
// console.log(imageWidget)


const Button = styled.div`
    background-color: red;
    color: ${props => props.$color};
`



class TestDecorator {
    @decoratorTest
    text = 123;

}

function decoratorTest(target: any, a: any) {
    console.log(target, a);
}


function Users() {
    const router = useRouter();
    const { query } = router;
    // console.log(query);
    const a = useQuery(['todo', 5], async () => (await fetch('http://localhost:3000/api/hello')).json());
    console.log(a)
    return (
        <div>
            <p>id: { query.id }</p>
        </div>
    );
}


export default Users;




