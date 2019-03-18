function handleClickBadge(wordId) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200 || xhr.status === 201) {
        const res = JSON.parse(xhr.responseText);
        if (res.success) {
          location.reload();
        }
      } else {
        console.error(xhr.responseText);
      }
    }
  };
  xhr.open("PUT", "/words/" + wordId);
  xhr.send();
}
