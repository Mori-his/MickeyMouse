
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
$if(h_i == 0) \{r, g, b\} = \{v, t, p\}$  
$if(h_i == 1) \{r, g, b\} = \{q, v, p\}$  
$if(h_i == 2) \{r, g, b\} = \{p, u, t\}$  
$if(h_i == 3) \{r, g, b\} = \{p, q, v\}$  
$if(h_i == 4) \{r, g, b\} = \{t, p, v\}$  
$if(h_i == 5) \{r, g, b\} = \{v, p, q\}$  


### rgb to hs(b/v) [来源](https://www.rapidtables.com/convert/color/rgb-to-hsv.html)

$$R' = R/255
\\
G' = G/255
\\
B' = B/255
\\
Cmax = max(R', G', B')
\\
Cmin = min(R', G', B')
\\
\Delta = Cmax - Cmin
$$
### Hue(色相)计算公式
$$
H = \left\{
\begin{align}
0° \qquad\qquad\qquad, \Delta \equiv 0\qquad\\
60° \times (\frac{G - B}{\Delta} mod 6), Cmax \equiv R\\
60° \times (\frac{B^\Delta - R}{\Delta} + 2), Cmax \equiv G\\
60° \times (\frac{R - G}{\Delta} + 4), Cmax \equiv B\\
\end{align}
\right.
$$
### Saturation(饱和度)计算公式
$$
S = \left\{
\begin{align}
0 \quad\quad, Cmax \equiv 0\\
\frac{\Delta}{Cmax}, Cmax \equiv R\\
\end{align}
\right.
$$

### Value/Brightness(明度)计算公式
$$
V = Cmax
$$



