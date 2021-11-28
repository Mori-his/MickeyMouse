import { useRouter } from "next/router";
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { ContainerParentDataMixin } from "../../layout/core/object";
import ImageWidget from "../../layout/widgets/image";


const Button = styled.div`
    background-color: red;
    color: ${props => props.$color};
`

const imageWidget = new ImageWidget({
    id: '33333',
    type: 'Image'
});
const childImageWidget = new ImageWidget({
    id: '4444',
    type: 'Image'
});


imageWidget.add(childImageWidget);
imageWidget.visitChildren((child) => {
   const childParentData: ContainerParentDataMixin<ImageWidget> =  child.parentData!;
   childParentData.nextSibling
})

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




