// This contains no flags or anything of interest - go back, wanderer, and search elsewhere!
// (I'm serious, that's not a red herring - this is just stuff to make the cool website work)

document.addEventListener('DOMContentLoaded', () => {

  const rp = new RipplePopup();
  var progress = 0;
  var progressmap = new Map();

  progressmap.set(5, false);
  progressmap.set(6, false);

  async function checkProgress() {
  while (true) {
      try {
          const response = await fetch("/progress");
          const data = await response.json();
          progress = data.progress;

          if (progressmap.get(progress) == false) {
            switch(progress) {
              case 5:
                if (sessionStorage.getItem('2_1') != "false") {
                  fetch("{{ url_for('static', filename='html/tasktwo_message_one.html') }}")
                  .then(res => res.text())
                  .then(html => {
                    rp.trigger("30vw", 400, "2_1", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
                  })
                  .catch(err => console.error("Failed to load HTML:", err));
                }
                break;
              case 6:
                if (sessionStorage.getItem('2_5') != "false") {
                  fetch("{{ url_for('static', filename='html/tasktwo_message_five.html') }}")
                  .then(res => res.text())
                  .then(html => {
                    rp.trigger("35vw", 200, "2_5", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
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
      case "2_1":
        sessionStorage.setItem('2_1', "false");
        break;
      case "2_2":
        sessionStorage.setItem("2_2", "false");
        break;
      case "2_4":
        sessionStorage.setItem("2_4", "false");
        break;
      case "2_5":
        sessionStorage.setItem("2_5", "false");
        break;
      default:
        break;
    }
  });

  document.addEventListener("ripplePopup:open", e => {
    switch(e.detail.messageId){
      case "2_3":
        sessionStorage.setItem('2_3', "false");
        sessionStorage.setItem('2_4', "true");
        break;
      case "2_5":
        sessionStorage.setItem('2_5', "false");
      default:
        break;
    }
  });

  document.querySelectorAll('.buybutton').forEach(el => {
    el.addEventListener('click', () => {
      if (sessionStorage.getItem("2_2") == "false" && sessionStorage.getItem("2_3") != "false") {
        sessionStorage.setItem('2_3', "true");
      }
    });
  });

  document.getElementById('vip-btn').addEventListener('click', () => {
    if (sessionStorage.getItem("2_1") == "false" && sessionStorage.getItem("2_2") != "false") {
      sessionStorage.setItem('2_2', "true");
    }
  });


  if (sessionStorage.getItem("2_2") == "true") {
    fetch("{{ url_for('static', filename='html/tasktwo_message_two.html') }}")
      .then(res => res.text())
      .then(html => {
        rp.trigger("65vw", 200, "2_2", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
      })
      .catch(err => console.error("Failed to load HTML:", err));
  }

  if (sessionStorage.getItem("2_4") == "true") {
    fetch("{{ url_for('static', filename='html/tasktwo_message_four.html') }}")
      .then(res => res.text())
      .then(html => {
        rp.trigger("35vw", 400, "2_4", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
      })
      .catch(err => console.error("Failed to load HTML:", err));
  }

  if (sessionStorage.getItem("2_3") == "true") {
  fetch("{{ url_for('static', filename='html/tasktwo_message_three.html') }}")
    .then(res => res.text())
    .then(html => {
      rp.trigger("35vw", 200, "2_3", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
    })
    .catch(err => console.error("Failed to load HTML:", err));
  }

});
