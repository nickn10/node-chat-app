
function getParams(uri){
    var queryString = {};
    uri.replace(
      new RegExp(
        "([^?=&]+)(=([^&#]*))?", "g"),
        function($0, $1, $2, $3) {
          queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
        }
      );
   return queryString;
 };

function scrollToBottom() {
  const newMessage = messages.lastElementChild;
  const prevMessage = newMessage.previousElementSibling;
 
  const clientHeight = messages.clientHeight;
  const scrollTop = messages.scrollTop;
  const scrollHeight = messages.scrollHeight;
 
  const newMessageStyle = window.getComputedStyle(newMessage, null);
  const newMessageHeight = parseInt(newMessageStyle.getPropertyValue("height"));
  let prevMessageHeight = 0;
  if (prevMessage) {
    const prevMessageStyle = window.getComputedStyle(prevMessage, null);
    prevMessageHeight = parseInt(prevMessageStyle.getPropertyValue("height"));
  }
 
  if ((clientHeight + scrollTop + newMessageHeight + prevMessageHeight) >= scrollHeight) {
    messages.scrollTop = scrollHeight;
  }
}


