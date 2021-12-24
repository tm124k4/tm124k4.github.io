/** kentaur.js
 *  (c)2021 Takahiro Misaka
 *  Released under the MIT license.
 *  https://github.com/tamisaka/kentaur/
 */


E=function(e){
    var type=Object.prototype.toString.call(e);
    //typecheck
    if(type=="[object String]" && e!==E){
        e=document.querySelector(e);
    }else{
        if(e===E){
            return {
                set:function(o,e){
                    E[o]=e;
                    return E(e);
                }
            }
        }
    }

    return {
        line:function(x1,y1,x2,y2,speed){
            var c=document.createElement("span"),
            l=Math.hypot(y2-y1,x2-x1),
            d=Math.atan2(y2-y1,x2-x1)*180/Math.PI;
        
            c.style=`
                transform-origin:left 50%;
                position:absolute;
                left:${x1}${E.units};
                top:${y1}${E.units};
                width:${l}${E.units};
                height:${E.width}${E.units};
                transform:rotate(${d}deg);
                background-color:${E.fcolor}                    
            `
            c.setAttribute("class","line");
            e.appendChild(c);
            c.animate({width:[0+E.units,l+E.units]},speed)
   
            return E(e);
        },
        box:function(x,y,w,h){
            var c=document.createElement("span");
            c.style=`
                transform-origin:50% 50%;
                position:absolute;
                left:${x}${E.units};
                top:${y}${E.units};
                width:${w}${E.units};
                height:${h}${E.units};
                border:${E.border};
                background-color:${E.fcolor};
            `
            c.setAttribute("class","box");
            e.appendChild(c);
            return E(e);
        },
        arc:function(x,y,w,h){
            var c=document.createElement("span");
            c.style=`
                transform-origin:50% 50%;
                position:absolute;
                left:${x}${E.units};
                top:${y}${E.units};
                width:${w}${E.units};
                height:${h}${E.units};
                border:${E.border};
                background-color:${E.fcolor};
                border-radius:50%;
            `
            c.setAttribute("class","arc");
            e.appendChild(c);
            return E(e);
        },
        hex:function(x,y,w=E.w,h){
            var c=document.createElement("span");
            if(h===void 0){h=w};
            c.style=`
                transform-origin:50% 50%;
                position:absolute;
                left:${x}${E.units};
                top:${y}${E.units};
                width:${w}${E.units};
                height:${h}${E.units};
                background-color:${E.fcolor};
                clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)
            `
            c.setAttribute("class","hex");
            e.appendChild(c);
            return E(e);
        },
        delta:function(x,y,w=E.w,h,d=0){
            var c=document.createElement("span");
            if(h===void 0){h=w};
            c.style=`
                transform-origin:50% 50%;
                position:absolute;
                left:${x}${E.units};
                top:${y}${E.units};
                width:${w}${E.units};
                height:${h}${E.units};
                background-color:${E.fcolor};
                clip-path:polygon(50% 0,0 100%,100% 100%);
                transform:rotate(${d}deg);
            `
            c.setAttribute("class","delta");
            e.appendChild(c);
            return E(e);
        },
        bezier2:function(x1,y1,dx,dy,x2,y2){
            var a=document.createElementNS("http://www.w3.org/2000/svg","svg"),
                b=document.createElementNS("http://www.w3.org/2000/svg","path");
            a.style=`
                position:absolute;
                left:0;
                top:0;
            `

            b.setAttribute("d",`M ${x1} ${y1} E ${dx} ${dy} ${x2} ${y2}`);
            b.setAttribute("stroke",E.fcolor);
            b.setAttribute("fill","transparent");
            a.appendChild(b);
            e.appendChild(a);
            return E(e);
        },
        /**
         * 円グラフを作成します。
         * @param {Number} a 数値a 
         * @param {Number} b 数値b
         * @param {Number} x 表示座標 横
         * @param {Number} y 表示座標 縦 
         * @param {Number} w サイズ 横 
         * @param {Number} h サイズ 縦 
         * @param {String} c1 数値aの色 
         * @param {String} c2 数値bの色
         * @returns 
         */
        piechart:function(a,b,x,y,w,h,c1="blue",c2="red"){
            var c=document.createElement("span"),
            p,trans="";
            if(a>b){
                p=b/a*100;
                a=p;b=100-p;
                if(a>50){trans="transfrom:rotateY(180deg);"}
            }else if(b>a){
                p=c1;c1=c2;c2=p;
                p=a/b*100;
                b=p;a=100-p;
            }else{
                a=50;b=50;
            }

            a=Math.round(Math.max(0,Math.min(a,100))*100)/100;
            b=Math.round(Math.max(0,Math.min(b,100))*100)/100;
            if(b>50 && b>a){
                p=a;a=b;b=p;
                E.result={a:a,b:b};
            }else{
                E.result={a:b,b:a};
            }

            c.style=`
                position:absolute;
                left:${x}${E.units};
                top:${y}${E.units};
                width:${w}${E.units};
                height:${h}${E.units};
                background-image:radial-gradient(${E.bcolor} 50%,transparent 51%),conic-gradient(${c1} 0% ${a}%,${c2} ${b}% 100%);
                ${trans}
                border-radius:50%;
            `

            c.setAttribute("class","piechart");
            e.appendChild(c);
            E.target=c;
            return E(e);
        },
        make:function(tag,inner,cname){
            var c=document.createElement(tag);
            c.innerHTML=inner;
            if(cname!==void 0){c.setAttribute("class",cname)};
            e.appendChild(c);
            return E(e);
        },
        move:function(x,y,easetype="linear",duration=0){
            var b=e.getBoundingClientRect(),
            ax=b.x,ay=b.y,
            px=ax,py=ay,
            gx=0,gy=0,
            ox=ax-x,oy=ay-y,begin=Date.now(),
            xreverse=1,yreverse=1,easefunc,now;

            //現在座標より指定座標が上もしくは左の場合、その軸の進捗を逆転する
            if(x<ax){xreverse=-1;gx=100}
            if(y<ay){yreverse=-1;gy=100}
            //同じ軸同士の現在座標と指定座標が同じだった場合、その軸は進捗を停止する
            if(x==ax){xreverse=0;gx=100}
            if(y==ay){yreverse=0;gy=100}

            //イージングタイプによって処理を分ける
            if(Number.isInteger(easetype)){
                duration=easetype;
                easefunc=E.easelist.linear
            }else{
                easefunc=E.easelist[easetype.toLowerCase()]
            }
            
            //移動する
            e.style.setProperty("--move","true")
            var move = function(){

                //進捗（0〜100%）を加算する。durationに指定したms分時間がかかる
                now=Date.now()
                gx=(now-begin)/duration*100
                gy=(now-begin)/duration*100
                gx=Math.max(0,Math.min(gx,100));
                gy=Math.max(0,Math.min(gy,100));

                //進捗に応じて実際に要素を移動
                //移動元が移動先より手前にある場合、現在位置に対して減算する
                if(xreverse>0){
                    px = x * easefunc(gx / 100) + ax;
                }else{
                    px = ax - ox * easefunc(gx / 100);
                }
                if(yreverse>0){
                    py = y * easefunc(gy / 100) + ay;
                }else{
                    py = ay - oy * easefunc(gy / 100) 
                }
                e.style.left=px+"px"
                e.style.top=py+"px"
        
                //アニメーションが完了していない場合
                //かつ、その要素のCSSカスタムプロパティの--moveがtrueである場合は続行
                if(
                    (gx >= 0 || gx <= 100) && (gy >= 0 || gy <= 100)
                    && e.style.getPropertyValue("--move")=="true"
                ){
                    requestAnimationFrame(move)
                }
                
            }
        
            //初回実行
            requestAnimationFrame(move);
            
            //移動完了したタイミングで--moveをfalseにしておく
            setTimeout(function(){
                e.style.setProperty("--move","false")
            },duration)
            return E(e);
        },
        fadeout:function(easetype,duration,reverse=false){
            easetype=easetype.toLowerCase()
            var begin=performance.now(),easefunc,now;

            //イージングタイプによって処理を分ける
            if(Number.isInteger(easetype)){
                duration=easetype;
                easefunc=E.easelist.linear
            }else{
                easefunc=E.easelist[easetype]
            }
            //移動する
            e.style.setProperty("--fade","true")
            var ease = function(){
                //進捗（0〜100%）を加算する。durationに指定したms分時間がかかる
                now=performance.now()
                gx=Math.max(0,Math.min(((now-begin)/duration*100),100));
           
                //reverseがtrueならフェードを逆転させる
                if(reverse){
                    //フェードイン
                    e.style.opacity = 1-1/(gx*easefunc(gx/100));
                }else{
                    //フェードアウト
                    e.style.opacity = 1/(gx*easefunc(gx/100));
                }

                //その要素のCSSカスタムプロパティの--fadeがtrueである場合は続行
                if( 
                    e.style.getPropertyValue("--fade")=="true"
                ){
                    requestAnimationFrame(ease)
                }else{
                    e.style.opacity=0||reverse|0;
                }
            }
            
            //初回実行
            requestAnimationFrame(ease);
            
            //移動完了したタイミングで--fadeをfalseにしておく
            setTimeout(function(){
                e.style.setProperty("--fade","false")
            },duration)
            return E(e);
        },
        fadein:function(easetype,duration){
            E(e).fadeout(easetype,duration,true)
        },
        dom:function(){
            return e;
        }
    }
}

//現在の状態


E.oldtarget="";
E.result=0;
E.fcolor="rgba(250,0,0,1.0)";
E.bcolor="black";
E.border="1px solid black";
E.x=0;
E.y=0;
E.width=10;
E.height=0;
E.bwidth=10;
E.units="px";
E.aspeed=0
E.delay=0;

//イージング関連
E.easelist={
linear      :function(p){return p},
insine      :function(p){return 1-Math.cos((p*3.14)/2)},
outsine     :function(p){return Math.sin((p*3.14)/2)},
inoutsine   :function(p){return -(Math.cos(3.14*p)-1)/2},
incubic     :function(p){return p**3},
outcubic    :function(p){return 1-((1-p)**3)},
inoutcubic  :function(p){return p<0.5?4*p**3:1-((-2*p+2)**3)/2},
inquint     :function(p){return p**5},
outquint    :function(p){return 1-((1-p)**5)},
inoutquint  :function(p){return p<0.5?16*(p**5):1-((-2*p+2)**5)/2},
incirc      :function(p){return 1-Math.sqrt(1-(p*p))},
outcirc     :function(p){return Math.sqrt(1-((p-1)**2))},
inoutcirc   :function(p){return p<0.5?(1-Math.sqrt(1-((2*p)**2)))/2:(Math.sqrt(1-((-2*p+2)**2))+1)/2},
inback      :function(p){return 2.7*(p**3)-1.7*p*p},
outback     :function(p){return 1+2.7*((p-1)**3)+1.7*((p-1)**2)},
inoutback   :function(p){return p<0.5?(((2*p)**2)*(3.6*2*p-2.6))/2:(((2*p-2)**2)*(3.6*(p*2-2)+2.6)+2)/2},
inexpo      :function(p){return p==0?0:2**(10*p-10)},
outexpo     :function(p){return p==1?1:1-(2**(-10*p))},
inoutexpo   :function(p){return p==0?0:p==1?1:p<0.5?(2**(20*p-10))/2:(2-(2**(-20*p+10)))/2},
inquart     :function(p){return p**4},
outquart    :function(p){return 1-((1-p)**4)},
inoutquart  :function(p){return p<0.5?8*(p**4):1-((-2*p+2)**4)/2},
inquad      :function(p){return p*p},
outquad     :function(p){return 1-(1-p)**2},
inoutquad   :function(p){return p<0.5?2*p*p:1-((-2*p+2)**2)/2},
outbounce   :function(p){return p<0.37?7.5625*p*p:p<0.73?7.5625*(p-=0.5454)*p+0.75:p<0.91?7.5625*(p-=0.8181)*p+0.9375:7.5625*(p-=0.9545)*p+0.984375;},
inbounce    :function(p){return 1-E.easelist.outbounce(1-p)},
inoutbounce :function(p){return p<0.5?(1-E.easelist.outbounce(1-2*p))/2:(1+E.easelist.outbounce(2*p-1))/2},
inelastic   :function(p){return p==0?0:p==1?1:-(2**(10*p-10))*Math.sin((p*10-10.75)*2.0933)},
outelastic  :function(p){return p==0?0:p==1?1:2**(-10*p)*Math.sin((p*10-0.75)*2.0933)+1},
inoutelastic:function(p){return p==0?0:p==1?1:p<0.5?-(2**(20*p-10)*Math.sin((20*p-11.125)*1.3955))/2:(2**(-20*p+10)*Math.sin((20*p-11.125)*1.3955))/2+1}
}