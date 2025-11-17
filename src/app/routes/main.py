# app/routes/main.py
from flask import Blueprint, render_template, request, jsonify, session

main_bp = Blueprint("main", __name__)

FLAGS = [
    "intro{f1r5t_fL4g!}",
    "intro{s0u4rc3_c0D3_br0W51nG}",
    "intro{b451c_n3TW0rK1nG}",
    "intro{n3TW0rK1nG_l1k3_A_b055}"
    ]

@main_bp.route("/")
@main_bp.route("/index")
def index():
    return render_template("main.html")

@main_bp.route('/submit-flag', methods=['POST'])
def submit_flag():
    data = request.get_json()  # Expect JSON: { "flag": "..." }
    if not data or "flag" not in data:
        return jsonify({"success": False, "error": "No flag provided"}), 400

    user_flag = data["flag"]

    # Make session permanent so it respects the lifetime
    session.permanent = True

    # Get current progress from session (default 1)
    progress = session.get("progress", 1)

    # Check if user is trying to submit beyond available flags
    if progress > len(FLAGS):
        return jsonify({"success": False, "error": "All flags already completed"}), 400

    # Check if submitted flag is correct
    expected_flag = FLAGS[progress - 1]  # progress is 1-indexed
    if user_flag == expected_flag:
        # Flag is correct, increment progress
        progress += 1
        session["progress"] = progress
        return jsonify({"success": True, "message": "Correct flag!"})
    else:
        # Incorrect flag
        return jsonify({"success": False, "error": "Incorrect flag"}), 400

@main_bp.route('/progress')
def get_progress():
    return jsonify({"progress": session.get("progress", 1)})

