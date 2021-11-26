import React from 'react';

interface Configs {
    $color: string
}


declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes, Configs {

    }
}
