// This contains no flags or anything of interest - go back, wanderer, and search elsewhere!
// (I'm serious, that's not a red herring - this is just stuff to make the cool website work)

document.addEventListener('DOMContentLoaded', () => {

  const rp = new RipplePopup();
  var progress = 0;
  progressmap = new Map();
  helpmap = new Map();

  progressmap.set(8, false);

  async function checkProgress() {
  while (true) {
      try {
          const response = await fetch("/progress");
          const data = await response.json();
          progress = data.progress;

          if (progressmap.get(progress) == false) {
            switch(progress) {
              case 8:
                fetch("{{ url_for('static', filename='html/taskthree_message_six.html') }}")
                .then(res => res.text())
                .then(html => {
                  rp.trigger("60vw", 300, "1", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
                })
                .catch(err => console.error("Failed to load HTML:", err));
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
      case "3_1":
        sessionStorage.setItem('3_1', "false");
        break;
      case "3_2":
        sessionStorage.setItem('3_2', "false");
        sessionStorage.setItem('3_3', "true");
        break;
      case "3_3":
        console.log("test");
        sessionStorage.setItem('3_3', "false");
        break;
      case "3_4":
        sessionStorage.setItem('3_4', "false");
        sessionStorage.setItem('3_5', "true");
        break;
      case "3_4":
        sessionStorage.setItem('3_5', "false");
        break;
      default:
        break;
    }
  });

  if (window.location.pathname.includes("/essay/") == false) {
    document.getElementById('submit-btn').addEventListener('click', () => {
      if (sessionStorage.getItem("3_1") == "false" && sessionStorage.getItem("3_2") != "false") {
        sessionStorage.setItem('3_2', "true");
      }
      if (sessionStorage.getItem("3_3") == "false" && sessionStorage.getItem("3_4") != "false") {
        sessionStorage.setItem('3_4', "true");
      }
    });
  }

  if (sessionStorage.getItem("3_1") != "false") {
    fetch("{{ url_for('static', filename='html/taskthree_message_one.html') }}")
      .then(res => res.text())
      .then(html => {
        rp.trigger("50vw", 500, "3_1", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
      })
      .catch(err => console.error("Failed to load HTML:", err));
  }

  if (sessionStorage.getItem("3_2") == "true" && window.location.pathname.includes("/essay/") == true) {
    fetch("{{ url_for('static', filename='html/taskthree_message_two.html') }}")
      .then(res => res.text())
      .then(html => {
        rp.trigger("60vw", 300, "3_2", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
      })
      .catch(err => console.error("Failed to load HTML:", err));
  }

  if (sessionStorage.getItem("3_3") == "true" && window.location.pathname.includes("/essay/") == false) {
    fetch("{{ url_for('static', filename='html/taskthree_message_three.html') }}")
      .then(res => res.text())
      .then(html => {
        rp.trigger("50vw", 500, "3_3", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
      })
      .catch(err => console.error("Failed to load HTML:", err));
  }

    if (sessionStorage.getItem("3_4") == "true" && window.location.pathname.includes("/essay/") == true) {
    fetch("{{ url_for('static', filename='html/taskthree_message_four.html') }}")
      .then(res => res.text())
      .then(html => {
        rp.trigger("60vw", 300, "3_4", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
      })
      .catch(err => console.error("Failed to load HTML:", err));
  }

  if (sessionStorage.getItem("3_5") == "true" && window.location.pathname.includes("/essay/") == false) {
    fetch("{{ url_for('static', filename='html/taskthree_message_five.html') }}")
      .then(res => res.text())
      .then(html => {
        rp.trigger("50vw", 500, "3_5", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
      })
      .catch(err => console.error("Failed to load HTML:", err));
  }

});
