/** kentaur.js
 *  (c)2021-2022 Takahiro Misaka
 *  Released under the MIT license.
 *  https://github.com/tamisaka/kentaur/
 */


E=function(e,nth=0){
    var type=Object.prototype.toString.call(e);
    //typecheck
    if(type=="[object String]" && e!==E){
        e=document.querySelectorAll(e)[nth];
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
        line:function(x1,y1,x2,y2,easetype,duration){
            var t;
            if(typeof x2==="string"){if(x2.indexOf("%")>-1){x2=window.innerWidth  * (parseInt(x2.split("%")[0]) / 100)}}
            if(typeof y2==="string"){if(y2.indexOf("%")>-1){y2=window.innerHeight * (parseInt(y2.split("%")[0]) / 100)}}

            var c=document.createElement("span"),
            l=Math.hypot(y2-y1,x2-x1),
            d=Math.atan2(y2-y1,x2-x1)*180/Math.PI,
            progress;
        //      width:${l};
         
            c.style=`
                transform-origin:left 50%;
                position:${E.position};
                left:${x1}${E.units};
                top:${y1}${E.units};
                height:${E.width}${E.units};
                transform:rotate(${d}deg);
                background-color:${E.fcolor}                    
            `
            c.setAttribute("class","line");
            e.appendChild(c);
            //c.animate({width:[0+E.units,l+E.units]},speed)
   
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
            c.style.setProperty("--make-line","true")
            var ease = function(){
                //進捗（0〜100%）を加算する。durationに指定したms分時間がかかる
                now=performance.now()
                progress=Math.max(0,Math.min(((now-begin)/duration*100),100));
            
                    //フェードイン
                    c.style.width = l*(1-1/(progress*easefunc(progress/100))) + E.units;


                //その要素のCSSカスタムプロパティの--fadeがtrueである場合は続行
                if( 
                    progress<100 &&
                    c.style.getPropertyValue("--make-line")=="true"
                ){
                    requestAnimationFrame(ease)
                }else{
                    c.style.setProperty("--make-line","false")
                }
            }
            
            //初回実行
            requestAnimationFrame(ease);
            
            return E(c);
        },
        box:function(x,y,w,h){
            var c=document.createElement("span");
            if(typeof x!=="string"){x=x+E.units}
            if(typeof y!=="string"){y=y+E.units}
            if(typeof w!=="string"){w=w+E.units}
            if(typeof h!=="string"){h=h+E.units}

            c.style=`
                transform-origin:50% 50%;
                position:${E.position};
                left:${x};
                top:${y};
                width:${w};
                height:${h};
                border:${E.border};
                background-color:${E.fcolor};
            `
            c.setAttribute("class","box");
            e.appendChild(c);
            return E(e);
        },
        arc:function(x,y,w,h){
            var c=document.createElement("span");
            if(typeof x!=="string"){x=x+E.units}
            if(typeof y!=="string"){y=y+E.units}
            if(typeof w!=="string"){w=w+E.units}
            if(typeof h!=="string"){h=h+E.units}

            c.style=`
                transform-origin:50% 50%;
                position:${E.position};
                left:${x};
                top:${y};
                width:${w};
                height:${h};
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
            if(typeof x!=="string"){x=x+E.units}
            if(typeof y!=="string"){y=y+E.units}
            if(typeof w!=="string"){w=w+E.units}
            if(typeof h!=="string"){h=h+E.units}
            c.style=`
                transform-origin:50% 50%;
                position:${E.position};
                left:${x};
                top:${y};
                width:${w};
                height:${h};
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
            if(typeof x!=="string"){x=x+E.units}
            if(typeof y!=="string"){y=y+E.units}
            if(typeof w!=="string"){w=w+E.units}
            if(typeof h!=="string"){h=h+E.units}
            c.style=`
                transform-origin:50% 50%;
                position:${E.position};
                left:${x};
                top:${y};
                width:${w};
                height:${h};
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
                position:${E.position};
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
            if(typeof x!=="string"){x=x+E.units}
            if(typeof y!=="string"){y=y+E.units}
            if(typeof w!=="string"){w=w+E.units}
            if(typeof h!=="string"){h=h+E.units}

            var c=document.createElement("span")
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
                position:${E.position};
                left:${x};
                top:${y};
                width:${w};
                height:${h};
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
            progress,
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
                progress=(now-begin)/duration*100
                //gy=(now-begin)/duration*100
                progress=Math.max(0,Math.min(progress,100));
                //gy=Math.max(0,Math.min(gy,100));

                //進捗に応じて実際に要素を移動
                //移動元が移動先より手前にある場合、現在位置に対して減算する
                if(xreverse>0){
                    px = x * easefunc(progress / 100) + ax;
                }else{
                    px = ax - ox * easefunc(progress / 100);
                }
                if(yreverse>0){
                    py = y * easefunc(progress / 100) + ay;
                }else{
                    py = ay - oy * easefunc(progress / 100) 
                }
                e.style.left=px+"px"
                e.style.top=py+"px"
                console.log(progress);
                //アニメーションが完了していない場合
                //かつ、その要素のCSSカスタムプロパティの--moveがtrueである場合は続行
                if(
                    (progress > 0 && progress < 100)
                    && e.style.getPropertyValue("--move")=="true"
                ){
                    requestAnimationFrame(move)
                }else{
                    //アニメーション完了時
                    e.style.setProperty("--move","false")
                }
                
            }
        
            //初回実行
            requestAnimationFrame(move);
            
            //移動完了したタイミングで--moveをfalseにしておく
            return E(e);
        },
        fadeout:function(easetype,duration,reverse=false){
            easetype=easetype.toLowerCase()
            var begin=performance.now(),easefunc,now,progress;

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
                progress=Math.max(0,Math.min(((now-begin)/duration*100),100));
           
                //reverseがtrueならフェードを逆転させる
                if(reverse){
                    //フェードイン
                    e.style.opacity = 1-1/(progress*easefunc(progress/100));
                }else{
                    //フェードアウト
                    e.style.opacity = 1/(progress*easefunc(progress/100));
                }

                //その要素のCSSカスタムプロパティの--fadeがtrueである場合は続行
                if(
                    progress<100 &&
                    e.style.getPropertyValue("--fade")=="true"
                ){
                    requestAnimationFrame(ease)
                }else{
                    e.style.opacity=0||reverse|0;

                e.style.setProperty("--fade","false")
                }
            }
            
            //初回実行
            requestAnimationFrame(ease);
            
            //移動完了したタイミングで--fadeをfalseにしておく

            return E(e);
        },
        fadein:function(easetype,duration){
            E(e).fadeout(easetype,duration,true)
        },
        remove:function(duration){
            setTimeout(function(){
                e.remove();
            },duration)
        },
        dom:function(){
            return e;
        },
        span:function(cname){
            return E(e).make("span","","")
        },
        text:function(str){
            e.textContent=str;
            return E(e)
        },
        html:function(str){
            e.innerHTML=str;
            return E(e)
        },
        //
        //
        //
        fontsize:function(s){
            e.style.setProperty("font-size",s)
            return E(e);
        },
        getcolor:function(type){

            type=type.toLowerCase()
            if(type=="backgroundcolor"){type="background-Color"}
            if(type=="color"){type="color"}

            var A=window.getComputedStyle(e,"")[type].match(/\d+/g),
                B=e.style.getPropertyValue(type),
                C=B.match(/\d+/g);
                if(B.indexOf("rgba")>-1 && C.length>3){
                    return {r:A[0]|0,g:A[1]|0,b:A[2]|0,a:parseFloat(C[3]+"."+C[4])}
                }
                return {r:A[0]|0,g:A[1]|0,b:A[2]|0,a:1}
        },
        getbcolor:function(){
            return E(e).getcolor("background-color");
        },
        setcolor:function(type,colorB,easetype,duration){
            var cstr,colorA,diff={},r,g,b,a;

            // 指定しようとする色の書式が文字列型の場合
                if(typeof colorB==="string"){

                    //
                    // 16進カラーコードの場合
                    if(colorB.indexOf("#")>-1){
                        cstr=colorB;
                        colorB={}

                        // #RRGGBB
                        if(cstr.length>6){
                            colorB.r=parseInt(cstr.substring(1,3),16);
                            colorB.g=parseInt(cstr.substring(3,5),16);
                            colorB.b=parseInt(cstr.substring(5,7),16);
                            // #RRGGBBAA
                            if(cstr.length>8){
                                colorB.a=parseInt(cstr.substring(7,9),16)/255;
                            }
                        }

                        // #RGB
                        else if(colorstr.length==4){
                            colorB.r=parseInt(cstr.substring(1,2),16);
                            colorB.g=parseInt(cstr.substring(2,3),16);
                            colorB.b=parseInt(cstr.substring(3,4),16);
                        }

                        // グレースケール(R,G,Bともに同じにする）
                        // #N
                        else if(colorB.length==3){
                            colorB.r=parseInt(temp.substring(1,2),16);
                            colorB.g=colorB.r;
                            colorB.b=colorB.r;
                        }

                        colorB.a=colorB.a || 1;
                    }

                    //
                    // rgb(r,g,b) または rgba(r,g,b,a)の場合
                    else if(colorB.indexOf("rgb")>-1){
                        temp=ColorB.match(/\d+/g);
                        colorB.r=temp[0];
                        colorB.g=temp[1];
                        colorB.b=temp[2];
                        colorB.a=1;
                        if(colorB.indexOf("rgba(")>-1){
                            colorB.a=temp3[3];
                        }
                    }

                    // キーワードであると推定
                    // キーワードにある色を指定
                    else {
                        colorB=E.colorlist[colorB.toLowerCase()];
                        colorB.a=1;
                    }
                }
            // 現在の要素の背景色を取得
                colorA=E(e).getcolor(type);
                diff.r=colorA.r-colorB.r
                diff.g=colorA.g-colorB.g
                diff.b=colorA.b-colorB.b
                diff.a=Math.round(colorA.a*1000)/1000-Math.round(colorB.a*1000)/1000;

                e.style.setProperty("--done-"+type+"-value","rgba("+colorB.r+","+colorB.g+","+colorB.b+","+colorB.a+")");

            var begin=performance.now(),easefunc,now,progress,m;
            //イージングタイプによって処理を分ける
            easetype=easetype.toLowerCase()
            if(Number.isInteger(easetype)){
                duration=easetype;
                easefunc=E.easelist.linear
            }else{
                easefunc=E.easelist[easetype]
            }

            //移動する
            e.style.setProperty("--animations-"+type,"true")
            var ease = function(){
                //進捗（0〜100%）を加算する。durationに指定したms分時間がかかる
                now=performance.now()
                progress=Math.max(0,Math.min(((now-begin)/duration*100),100));
                m=1-1/(progress*easefunc(progress/100));
                if(diff.r!=0){
                    if(Math.sign(diff.r)==1){
                        r=Math.min(colorA.r,colorA.r-(diff.r*m))
                    }else{
                        r=Math.max(colorA.r,colorA.r-(diff.r*m))
                    }
                }else{r=colorA.r}

                if(diff.g!=0){
                    if(Math.sign(diff.g)==1){
                        g=Math.min(colorA.g,colorA.g-(diff.g*m))
                    }else{
                        g=Math.max(colorA.g,colorA.g-(diff.g*m))
                    }
                }else{g=colorA.g}

                if(diff.b!=0){
                    if(Math.sign(diff.b)==1){
                        b=Math.min(colorA.b,colorA.b-(diff.b*m))
                    }else{
                        b=Math.max(colorA.b,colorA.b-(diff.b*m))
                    }
                }else{b=colorA.b}

                if(diff.a!=0){
                    if(Math.sign(diff.a)==1){
                        a=Math.min(colorA.a,colorA.a-(diff.a*m));
                    }else{
                        a=Math.max(colorA.a+(diff.a*-1)*m,colorA.a);

                    }
                }else{a=colorA.a}

                e.style.setProperty(type,"rgba("+r+","+g+","+b+","+a+")");
                //その要素のCSSカスタムプロパティの--fadeがtrueである場合は続行
                //完了
                if( e.style.getPropertyValue("--animations-"+type)!="false" && progress>99){
                    e.style.setProperty("--animations-"+type,"false")
                    setTimeout(function(){
                        e.style.setProperty(type,e.style.getPropertyValue("--done-"+type+"-value"));
                    },1)
                }else{
                    requestAnimationFrame(ease);
                }

            }

            //初回実行
            requestAnimationFrame(ease);

            //移動完了したタイミングで--fadeをfalseにしておく

            return E(e);
        },
        bcolor:function(colorB,easetype,duration){return E(e).setcolor("background-color",colorB,easetype,duration)},
        fcolor:function(colorB,easetype,duration){return E(e).setcolor("color",colorB,easetype,duration)}
    }
}

//現在の状態

E.position="absolute"
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

//
E.colorlist={
//CSS3 Basic color keywords
black       :{r:  0,g:  0,b:  0},
silver      :{r:192,g:192,b:192},
gray        :{r:128,g:128,b:128},
white       :{r:255,g:255,b:255},
maroon      :{r:128,g:  0,b:  0},
red         :{r:255,g:  0,b:  0},
purple      :{r:128,g:  0,b:128},
fuchsia     :{r:255,g:  0,b:255},
green       :{r:  0,g:128,b:  0},
lime        :{r:  0,g:255,b:  0},
olive       :{r:128,g:128,b:  0},
yellow      :{r:255,g:255,b:  0},
navy        :{r:  0,g:  0,b:128},
blue        :{r:  0,g:  0,b:255},
teal        :{r:  0,g:128,b:128},
aqua        :{r:  0,g:255,b:255},
//CSS3 Extended color keywords (色名重複除く)
aliceblue       :{r:240,g:248,b:255},
antiquewhite    :{r:250,g:235,b:215},
aquamarine      :{r:127,g:255,b:212},
azure           :{r:240,g:255,b:255},
beige           :{r:245,g:245,b:220},
bisque          :{r:255,g:228,b:196},
blanchedalmond  :{r:  0,g:  0,b:255},
blueviolet      :{r:138,g: 43,b:226},
brown           :{r:165,g: 42,b: 42},
burlywood       :{r:222,g:184,b:135},
cadetblue       :{r:95 ,g:158,b:160},
chartreuse      :{r:127,g:255,b:  0},
chocolate       :{r:210,g:105,b: 30},
coral           :{r:255,g:127,b: 80},
cornflowerblue  :{r:100,g:149,b:237},
cornsilk        :{r:255,g:248,b:220},
crimson         :{r:220,g: 20,b: 60},
cyan            :{r:  0,g:255,b:255},
darkblue        :{r:  0,g:  0,b:139},
darkcyan        :{r:  0,g:139,b:139},
darkgoldenrod   :{r:184,g:134,b: 11},
darkgray        :{r:169,g:169,b:169},
darkgreen       :{r:  0,g:100,b:  0},
darkgrey        :{r:169,g:169,b:169},
darkhaki        :{r:189,g:183,b:107},
darkmagenta     :{r:139,g:  0,b:139},
darkolivegreen  :{r: 85,g:107,b: 47},
darkorange      :{r:255,g:140,b:  0},
darkorchid      :{r:153,g: 50,b:204},
darkred         :{r:139,g:  0,b:  0},
darksalmon      :{r:233,g:150,b:122},
darkseagreen    :{r:143,g:188,b:143},
darkslateblue   :{r: 72,g: 61,b:139},
darkslategray   :{r: 47,g: 79,b: 79},
darkslategrey   :{r: 47,g: 79,b: 79},
darkturquoise   :{r:  0,g:206,b:209},
darkviolet      :{r:148,g:  0,b:211},
deeppink        :{r:255,g: 20,b:147},
deepskyblue     :{r:  0,g:191,b:255},
dimgray         :{r:105,g:105,b:105},
dodgerblue      :{r: 30,g:144,b:255},
firebrick       :{r:178,g: 34,b: 34},
floralwhite     :{r:255,g:250,b:240},
forestgreen     :{r: 34,g:139,b: 34},
gainsboro       :{r:220,g:220,b:220},
ghostwhite      :{r:248,g:248,b:255},
gold            :{r:255,g:215,b:  0},
goldenrod       :{r:218,g:165,b: 32},
greenyellow     :{r:173,g:255,b: 47},
grey            :{r:128,g:128,b:128},
honeydew        :{r:240,g:255,b:240},
hotpink         :{r:255,g:105,b:180},
indianred       :{r:205,g: 92,b: 92},
indigo          :{r: 75,g:  0,b:130},
ivory           :{r:255,g:255,b:240},
khaki           :{r:240,g:230,b:140},
lavender        :{r:230,g:230,b:250},
lavenderblush   :{r:255,g:240,b:245},
lawngreen       :{r:124,g:252,b:  0},
lemonchiffon    :{r:255,g:250,b:205},
lightblue       :{r:173,g:216,b:230},
lightcoral      :{r:240,g:128,b:128},
lightcyan       :{r:224,g:255,b:255},
lightgoldenrodyellow:{r:250,g:250,b:210},
lightgray       :{r:211,g:211,b:211},
lightgreen      :{r:144,g:238,b:144},
lightgrey       :{r:211,g:211,b:211},
lightpink       :{r:255,g:182,b:193},
lightsalmon     :{r:255,g:160,b:122},
lightseagreen   :{r: 32,g:178,b:170},
lightskyblue    :{r:135,g:206,b:250},
lightslategray  :{r:119,g:136,b:153},
lightslategrey  :{r:119,g:136,b:153},
lightsteelblue  :{r:176,g:196,b:222},
lightyellow     :{r:255,g:255,b:224},
limegreen       :{r: 50,g:255,b: 50},
linen           :{r:250,g:240,b:230},
magenta         :{r:255,g:  0,b:255},
mediumaquamarine:{r:102,g:205,b:170},
mediumblue      :{r:  0,g:  0,b:205},
mediumorchid    :{r:186,g: 85,b:211},
mediumpurple    :{r:147,g:112,b:219},
mediumseagreen  :{r: 60,g:179,b:113},
mediumslateblue :{r:123,g:104,b:238},
mediumspringgreen:{r: 0,g:250,b:154},
mediumturquoise :{r: 72,g:209,b:204},
mediumvioletred :{r:199,g: 21,b:133},
midnightblue    :{r: 25,g: 25,b:112},
mintcream       :{r:245,g:255,b:250},
mistyrose       :{r:255,g:228,b:225},
moccasin        :{r:255,g:228,b:181},
navajowhite     :{r:255,g:222,b:173},
oldlace         :{r:253,g:245,b:230},
olivedrab       :{r:107,g:142,b: 35},
orange          :{r:255,g:165,b:  0},
orangered       :{r:255,g: 69,b:  0},
orchid          :{r:218,g:112,b:214},
palegoldenrod   :{r:238,g:232,b:170},
palegreen       :{r:152,g:251,b:152},
paleturquoise   :{r:175,g:238,b:238},
palevioletred   :{r:219,g:112,b:147},
papayawhip      :{r:255,g:239,b:213},
peachpuff       :{r:255,g:218,b:135},
peru            :{r:205,g:133,b: 63},
pink            :{r:255,g:192,b:203},
plum            :{r:221,g:160,b:221},
powderblue      :{r:176,g:224,b:230},
rosybrown       :{r:188,g:143,b:143},
royalblue       :{r: 65,g:105,b:225},
saddlebrown     :{r:139,g: 69,b: 19},
salmon          :{r:250,g:128,b:114},
sandybrown      :{r:244,g:164,b: 96},
seagreen        :{r: 46,g:139,b: 87},
seashell        :{r:255,g:245,b:238},
sienna          :{r:160,g: 82,b: 45},
skyblue         :{r:135,g:206,b:235},
slateblue       :{r:106,g: 90,b:205},
slategray       :{r:112,g:128,b:144},
slategrey       :{r:112,g:128,b:144},
snow            :{r:255,g:250,b:250},
springgreen     :{r:  0,g:255,b:127},
steelblue       :{r: 70,g:130,b:180},
tan             :{r:210,g:180,b:140},
teal            :{r:  0,g:128,b:128},
thistle         :{r:216,g:191,b:216},
tomato          :{r:255,g: 99,b: 71},
turquoise       :{r: 64,g:224,b:208},
violet          :{r:238,g:130,b:238},
wheat           :{r:245,g:222,b:179},
whitesmoke      :{r:245,g:245,b:245},
yellowgreen     :{r:154,g:205,b: 50},
//CSS4
rebbeccapurple  :{r:102,g: 51,b:153}
}

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
