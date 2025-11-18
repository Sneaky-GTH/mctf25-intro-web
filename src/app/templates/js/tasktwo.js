// This contains no flags or anything of interest - go back, wanderer, and search elsewhere!
// (I'm serious, that's not a red herring - this is just stuff to make the cool website work)

document.addEventListener('DOMContentLoaded', () => {

  const rp = new RipplePopup();
  var progress = 0;
  progressmap = new Map();
  helpmap = new Map();

 for (let i = 6; i <= 12; i++) {
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
              case 6:
                fetch("{{ url_for('static', filename='html/tasktwo_message_six.html') }}")
                .then(res => res.text())
                .then(html => {
                  rp.trigger("30vw", 400, "7", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
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
    /*switch(e.detail.messageId){
      case "1":
        fetch("{{ url_for('static', filename='html/taskone_message_two.html') }}")
          .then(res => res.text())
          .then(html => {
            rp.trigger("57vw", 35, "2", html, "{{ url_for('static', filename='img/martinsactually.png') }}");
          })
          .catch(err => console.error("Failed to load HTML:", err));
        break;
      default:
        break;*/
    });

});
