import React from 'react';
import {} from 'styled-components/cssprop';

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
interface Configs extends ImageConfigs, ContainerConfigs, LayoutConfigs, SizeConfigs {
    
}


declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes, Partial<Configs> {

    }
}

