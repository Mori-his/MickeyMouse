
HSB(HSV) 基于 RGB ，是一个更人性化的表示方法。
H(Hue) 为色相,  取值范围：0-360°，基础颜色。
S(Saturation) 为饱和度， 取值范围：0 - 1(0% - 100%),  表示色彩的纯度。
B(Brightness)为明度, 取值范围：0 - 1(0% - 100%)，表示对光量的感知。

H = 色相  
S = 饱和度  
V/B = 明度  


$h_i = [{{h}\over{60}}] \quad mod \quad 6$  
[]是取整符号  


$f = {{h}\over{60}} - h_i$  


$p = v \times (1 - s)$  


$q = v \times (1 - f \times s)$  


$t = v \times (1 - (1 - f) \times s)$



如果:  
饱和度S = 1    
明度V/B = 1  
色相H = 0
- 公式如下  
$h_i = [{{0}\over{60}}] \quad mod \quad 6 = 0$  
$p = 1 \times (1 - 1) = 0$  
$q = 1 \times (1 - f \times 1) = 1 - f $  
$t = 1 \times (1 - (1 - f) \ times 1) = f$  
$f = {{h}\over{60}} - h_i = h_i$  








