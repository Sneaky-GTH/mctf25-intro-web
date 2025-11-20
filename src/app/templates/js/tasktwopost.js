// This contains no flags or anything of interest - go back, wanderer, and search elsewhere!
// (I'm serious, that's not a red herring - this is just stuff to make the cool website work)

document.addEventListener('DOMContentLoaded', () => {

  const rp = new RipplePopup();
  var progress = 0;
  var progressmap = new Map();

  progressmap.set(7, false);

  async function checkProgress() {
  while (true) {
      try {
          const response = await fetch("/progress");
          const data = await response.json();
          progress = data.progress;

          if (progressmap.get(progress) == false) {
            switch(progress) {
              case 7:
                if (sessionStorage.getItem('2_8') != "false") {
                  fetch("{{ url_for('static', filename='html/tasktwo_message_eight.html') }}")
                  .then(res => res.text())
                  .then(html => {
                    rp.trigger("30vw", 400, "2_8", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
                  })
                  .catch(err => console.error("Failed to load HTML:", err));
                }
                break;
              default:
                break;
            }

            progressmap.set(progress, true);

          }

      } catch (err) {
          console.error("Error checking progress:", err);
      }

      await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3 sec
    }
    
  }

  checkProgress();

  document.addEventListener("ripplePopup:close", e => {
    switch(e.detail.messageId){
      case "2_6":
        sessionStorage.setItem('2_6', "false");
        break;
      case "2_7":
        sessionStorage.setItem('2_7', "false");
        break;
      default:
        break;
    }
  });

  document.querySelectorAll('.buybutton').forEach(el => {
    el.addEventListener('click', () => {
      if (sessionStorage.getItem("2_6") == "false" && sessionStorage.getItem("2_7") != "false") {
        sessionStorage.setItem('2_7', "true");
      }
    });
  });


  if (sessionStorage.getItem("2_6") != "false") {
    fetch("{{ url_for('static', filename='html/tasktwo_message_six.html') }}")
      .then(res => res.text())
      .then(html => {
        rp.trigger("70vw", 220, "2_6", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
      })
      .catch(err => console.error("Failed to load HTML:", err));
  }

  if (sessionStorage.getItem("2_7") == "true") {
    fetch("{{ url_for('static', filename='html/tasktwo_message_seven.html') }}")
      .then(res => res.text())
      .then(html => {
        rp.trigger("60vw", 300, "2_7", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
      })
      .catch(err => console.error("Failed to load HTML:", err));
  }

});
