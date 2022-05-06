var CreateRDPDesktop=function(e){var s={};function n(e){return(!0===s.m.SwapMouse?[2,0,1,0,0]:[1,0,2,0,0])[e]}function i(e){s.State!=e&&(s.State=e,null!=s.onStateChanged&&s.onStateChanged(s,s.State))}function a(e){var t=s.Canvas.canvas.height/s.CanvasId.clientHeight,n=s.Canvas.canvas.width/s.CanvasId.clientWidth,a=function(e){var t=Array(2);for(t[0]=t[1]=0;e;)t[0]+=e.offsetLeft,t[1]+=e.offsetTop,e=e.offsetParent;return t}(s.Canvas.canvas),n=(e.pageX-a[0])*n,t=(e.pageY-a[1])*t;return e.addx&&(n+=e.addx),e.addy&&(t+=e.addy),{x:n,y:t}}return s.m={},s.State=0,s.canvas=Q(e),"string"==typeof(s.CanvasId=e)&&(s.CanvasId=Q(e)),s.Canvas=s.CanvasId.getContext("2d"),s.ScreenWidth=s.width=1280,s.ScreenHeight=s.height=1024,s.Start=function(e,t,n){i(1),s.nodeid=e,s.port=t;var a={savepass:(s.credentials=n).savecred,useServerCreds:n.servercred,width:n.width,height:n.height,flags:n.flags};n.width&&n.height&&(a.width=s.ScreenWidth=s.width=n.width,a.height=s.ScreenHeight=s.height=n.height,delete n.width,delete n.height),s.render=new Mstsc.Canvas.create(s.canvas),s.socket=new WebSocket("wss://"+window.location.host+"/mstscrelay.ashx"),s.socket.binaryType="arraybuffer",s.socket.onopen=function(){i(2),s.socket.send(JSON.stringify(["infos",{ip:s.nodeid,port:s.port,screen:{width:s.width,height:s.height},domain:n.domain,username:n.username,password:n.password,options:a,locale:Mstsc.locale()}]))},s.socket.onmessage=function(e){if("string"==typeof e.data){var t=JSON.parse(e.data);switch(t[0]){case"rdp-connect":i(3),s.rotation=0,s.Canvas.setTransform(1,0,0,1,0,0),s.Canvas.canvas.width=s.ScreenWidth,s.Canvas.canvas.height=s.ScreenHeight,s.Canvas.fillRect(0,0,s.ScreenWidth,s.ScreenHeight),null!=s.m.onScreenSizeChange&&s.m.onScreenSizeChange(s,s.ScreenWidth,s.ScreenHeight,s.CanvasId);break;case"rdp-bitmap":if(null==s.bitmapData)break;var n=t[1];n.data=s.bitmapData,delete s.bitmapData,s.render.update(n);break;case"rdp-close":s.Stop();break;case"rdp-error":n=t[1];console.log("[mstsc.js] error : "+n.code+"("+n.message+")"),s.Stop();break;case"ping":s.socket.send('["pong"]')}}else s.bitmapData=e.data},s.socket.onclose=function(){i(0)},i(1)},s.Stop=function(){s.Canvas.fillRect(0,0,s.ScreenWidth,s.ScreenHeight),s.socket&&s.socket.close()},s.m.mousemove=function(e){if(s.socket&&3==s.State){var t=a(e);if(!(t.x<0||t.y<0||t.x>s.ScreenWidth||t.y>s.ScreenHeight))return s.mouseNagleData=["mouse",t.x,t.y,0,!1],null==s.mouseNagleTimer&&(s.mouseNagleTimer=setTimeout(function(){s.socket.send(JSON.stringify(s.mouseNagleData)),s.mouseNagleTimer=null},50)),e.preventDefault(),!1}},s.m.mouseup=function(e){if(s.socket&&3==s.State){var t=a(e);if(!(t.x<0||t.y<0||t.x>s.ScreenWidth||t.y>s.ScreenHeight))return null!=s.mouseNagleTimer&&(clearTimeout(s.mouseNagleTimer),s.mouseNagleTimer=null),s.socket.send(JSON.stringify(["mouse",t.x,t.y,n(e.button),!1])),e.preventDefault(),!1}},s.m.mousedown=function(e){if(s.socket&&3==s.State){var t=a(e);if(!(t.x<0||t.y<0||t.x>s.ScreenWidth||t.y>s.ScreenHeight))return null!=s.mouseNagleTimer&&(clearTimeout(s.mouseNagleTimer),s.mouseNagleTimer=null),s.socket.send(JSON.stringify(["mouse",t.x,t.y,n(e.button),!0])),e.preventDefault(),!1}},s.m.handleKeyUp=function(e){if(s.socket&&3==s.State)return s.socket.send(JSON.stringify(["scancode",Mstsc.scancode(e),!1])),e.preventDefault(),!1},s.m.handleKeyDown=function(e){if(s.socket&&3==s.State)return s.socket.send(JSON.stringify(["scancode",Mstsc.scancode(e),!0])),e.preventDefault(),!1},s.m.mousewheel=function(e){if(s.socket&&3==s.State){var t=a(e);if(!(t.x<0||t.y<0||t.x>s.ScreenWidth||t.y>s.ScreenHeight)){null!=s.mouseNagleTimer&&(clearTimeout(s.mouseNagleTimer),s.mouseNagleTimer=null);var n=0;return e.detail?n=120*e.detail:e.wheelDelta&&(n=3*e.wheelDelta),0!=n&&s.socket.send(JSON.stringify(["wheel",t.x,t.y,n,!1,!1])),e.preventDefault(),!1}}},s.m.SendStringUnicode=function(e){s.socket&&3==s.State&&s.socket.send(JSON.stringify(["utype",e]))},s.m.mousedblclick=function(){},s.m.handleKeyPress=function(){},s.m.setRotation=function(){},s}