import { useRouter } from "next/router";
import { useQuery } from 'react-query';
import styled from 'styled-components';
import ImageWidget from "../../../layout/widgets/image";


class TestDecorator {
    
    text = 123;
}

function decoratorTest(target: any, a: any) {
    console.log(target, a);
}

const image = new ImageWidget({
    id: '1111',
    src: '',
})
console.log(image)


function Users() {
    const router = useRouter();
    const { query } = router;
    return (
        <div>
            <p>id: { query.id }</p>
        </div>
    );
}


export default Users;




