import React from 'react';

interface SizeConfigs {
    $width: number
    $height: number
}
interface LayoutConfigs {
    $left: number
    $top: number
    $right: number
    $bottom: number
}

interface ContainerConfigs {
    $color: string
    $backgroundColor: string
    $fillet: number
}

interface ImageConfigs {
    $src: string
}
interface Configs {
    $color: string
}


declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes, Partial<Configs> {

    }
}
