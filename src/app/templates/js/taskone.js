// This contains no flags or anything of interest - go back, wanderer, and search elsewhere!
// (I'm serious, that's not a red herring - this is just stuff to make the cool website work)

document.addEventListener('DOMContentLoaded', () => {

  const rp = new RipplePopup();
  var progress = 0;
  progressmap = new Map();
  helpmap = new Map();

 for (let i = 0; i <= 5; i++) {
   progressmap.set(i, false);
 }

  async function checkProgress() {
  while (true) {
      try {
          const response = await fetch("/progress");
          const data = await response.json();
          progress = data.progress;

          console.log(progressmap.get(progress))
          if (progressmap.get(progress) == false) {
            switch(progress) {
              case 1:
                fetch("{{ url_for('static', filename='html/taskone_message_one.html') }}")
                .then(res => res.text())
                .then(html => {
                  rp.trigger("30vw", 400, "1", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
                })
                .catch(err => console.error("Failed to load HTML:", err));
                break;
              case 2:
                fetch("{{ url_for('static', filename='html/taskone_message_three.html') }}")
                .then(res => res.text())
                .then(html => {
                  rp.trigger("70vw", 500, "3", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
                })
                .catch(err => console.error("Failed to load HTML:", err));
                break;
              case 3:
                fetch("{{ url_for('static', filename='html/taskone_message_four.html') }}")
                .then(res => res.text())
                .then(html => {
                  rp.trigger("45vw", 650, "4", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
                })
                .catch(err => console.error("Failed to load HTML:", err));
                break;
              case 4:
                fetch("{{ url_for('static', filename='html/taskone_message_six.html') }}")
                .then(res => res.text())
                .then(html => {
                  rp.trigger("45vw", 650, "6", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
                })
                .catch(err => console.error("Failed to load HTML:", err));
                break;
              case 5:
                fetch("{{ url_for('static', filename='html/taskone_message_nine.html') }}")
                .then(res => res.text())
                .then(html => {
                  rp.trigger("45vw", 650, "6", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
                })
                .catch(err => console.error("Failed to load HTML:", err));
                break;
              default:
                break;
            }

            progressmap.set(progress, true);

          }

          console.log("Progress:", progress);
      } catch (err) {
          console.error("Error checking progress:", err);
      }

      await new Promise(resolve => setTimeout(resolve, 3000)); // wait 3 sec
    }
    
  }

  checkProgress();

  document.addEventListener("ripplePopup:close", e => {
    console.log("Popup closed:", e.detail.messageId);
    switch(e.detail.messageId){
      case "1":
        fetch("{{ url_for('static', filename='html/taskone_message_two.html') }}")
          .then(res => res.text())
          .then(html => {
            rp.trigger("57vw", 35, "2", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
          })
          .catch(err => console.error("Failed to load HTML:", err));
        break;
      case "4":
        helpmap.set("4", true);
        break;
      case "6":
        fetch("{{ url_for('static', filename='html/taskone_message_seven.html') }}")
        .then(res => res.text())
        .then(html => {
          rp.trigger("60vw", 300, "7", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
        })
        .catch(err => console.error("Failed to load HTML:", err));
        break;
      case "7":
        helpmap.set("8", true);
        break;
      default:
        break;
    }

  });


  document.getElementById('explore-btn').addEventListener('click', () => {
    if (helpmap.get("4") == true) {
      fetch("{{ url_for('static', filename='html/taskone_message_five.html') }}")
          .then(res => res.text())
          .then(html => {
            rp.trigger("50vw", 450, "5", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
          })
          .catch(err => console.error("Failed to load HTML:", err));
        helpmap.set("4", false);
    }
    if (helpmap.get("8") == true) {
        fetch("{{ url_for('static', filename='html/taskone_message_eight.html') }}")
          .then(res => res.text())
          .then(html => {
            rp.trigger("60vw", 300, "8", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
          })
          .catch(err => console.error("Failed to load HTML:", err));
        helpmap.set("8", false);
    }
  });

});
