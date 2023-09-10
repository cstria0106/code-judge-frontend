function a(s){let e=JSON.parse(s.message);return"data"in e&&"message"in e.data&&typeof e.data.message=="string"?e.data.message:""}export{a as r};
