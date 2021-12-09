/** kentaur.js
 *  (c)2021 Takahiro Misaka
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
        },box:function(x,y,w,h){
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
        fadeout:function(m){
            if(q.offsetWidth>1){
                q.animate({opacity:[1,0]},m);
                q.style.opacity="0";
                var _q=q;
                return setTimeout(function(){_q.remove()},m-1)
            }
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
        move:function(bx,by,ms){
            var o=e.getBoundingClientRect(),
            ax=o.x,ay=o.y;
            e.animate([ 
                {left:ax+E.units,top:ay+E.units},
                {left:bx+E.units,top:by+E.units}
            ],ms);
            e.style.left=bx+E.units;
            e.style.top=by+E.units;
        return E(e);
        },
        fadein:function(m){
            e.animate({opacity:[0,1]},m);
            e.style.opacity="1";
            return E(e);
        },
        fadeout:function(m){
            e.animate({opacity:[1,0]},m);
            e.style.opacity="0";
            return E(e);
        },
        dom:function(){
            return e;
        }
    }
}

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


