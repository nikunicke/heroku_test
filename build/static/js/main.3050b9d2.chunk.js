(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{13:function(t,n,e){t.exports=e(39)},38:function(t,n,e){},39:function(t,n,e){"use strict";e.r(n);var a=e(0),o=e.n(a),r=e(11),c=e.n(r),u=e(12),i=e(2),l=function(t){var n=t.note,e=t.toggleImportance,a=n.important?"Not important":"Important";return o.a.createElement("li",{className:"note"},n.content,o.a.createElement("button",{onClick:e},a))},m=function(t){var n=t.message;return null===n?null:o.a.createElement("div",{className:"error"},n)},f=e(3),s=e.n(f),p=function(){return s.a.get("/api/notes").then(function(t){return t.data})},d=function(t){return s.a.post("/api/notes",t).then(function(t){return t.data})},b=function(t,n){return s.a.put("".concat("/api/notes","/").concat(t),n).then(function(t){return t.data})},v=function(){var t=Object(a.useState)([]),n=Object(i.a)(t,2),e=n[0],r=n[1],c=Object(a.useState)(""),f=Object(i.a)(c,2),s=f[0],v=f[1],E=Object(a.useState)(!0),g=Object(i.a)(E,2),h=g[0],j=g[1],O=Object(a.useState)(null),k=Object(i.a)(O,2),w=k[0],S=k[1];Object(a.useEffect)(function(){p().then(function(t){return r(t)})},[]);var I=h?e:e.filter(function(t){return!0===t.important});return o.a.createElement("div",null,o.a.createElement("h1",null,"Muistiinpanot"),o.a.createElement(m,{message:w}),o.a.createElement("div",null,o.a.createElement("button",{onClick:function(){return j(!h)}},"N\xe4yt\xe4 ",h?"T\xe4rke\xe4t":"Kaikki")),o.a.createElement("ul",null,I.map(function(t){return o.a.createElement(l,{key:t.id,note:t,toggleImportance:function(){return function(t){var n=e.find(function(n){return n.id===t}),a=Object(u.a)({},n,{important:!n.important});console.log(n),b(t,a).then(function(n){r(e.map(function(e){return e.id!==t?e:n}))}).catch(function(a){S("Muistiinpano '".concat(n.content,"' on jo valitettavasti poistettu palvelimelta")),setTimeout(function(){S(null)},5e3),r(e.filter(function(n){return n.id!==t}))})}(t.id)}})})),o.a.createElement("form",{onSubmit:function(t){t.preventDefault();var n={content:s,date:(new Date).toISOString(),important:Math.random()>.5};d(n).then(function(t){r(e.concat(t)),v("")})}},o.a.createElement("input",{value:s,onChange:function(t){v(t.target.value)}}),o.a.createElement("button",{type:"submit"},"Tallenna")))};e(38);c.a.render(o.a.createElement(v,null),document.getElementById("root"))}},[[13,1,2]]]);
//# sourceMappingURL=main.3050b9d2.chunk.js.map