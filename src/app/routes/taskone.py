# app/routes/taskone.py
from flask import Blueprint, render_template, jsonify, Response

taskone_bp = Blueprint("taskone", __name__)

@taskone_bp.route("/")
def index():
    return render_template("taskone.html")

@taskone_bp.route('/hidden-data', methods=['GET'])
def hidden_data():
    return jsonify({
    "flag": "intro{b451c_n3TW0rK1nG}"
})

@taskone_bp.route('/hidden-data-post', methods=['POST'])
def hidden_data_post():
    return jsonify({
    "flag": "intro{n3TW0rK1nG_l1k3_A_b055}"
})

@taskone_bp.route("/js/taskone.js")
def getjavascript():
    return Response(render_template("js/taskone.js"), mimetype='application/javascript')
