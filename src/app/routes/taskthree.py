# app/routes/tasktwo.py
from flask import Flask, Blueprint, Response, render_template, request, redirect, session, jsonify

taskthree_bp = Blueprint("taskthree", __name__)


def init_user():
    """Initialize session data for new users."""
    if "balance" not in session:
        session["balance"] = 50
    if "inventory" not in session:
        session["inventory"] = {}


@taskthree_bp.route("/")
def index():
    init_user()
    return render_template(
        "tasktwo.html",
        balance=session["balance"],
        inventory=session["inventory"]
    )


@taskthree_bp.route("/buy")
def buy():
    init_user()

    product = request.args.get("product", "")
    price = request.args.get("price", "")

    # Vulnerability: server trusts user-controlled price
    try:
        price = int(price)
    except:
        return "Invalid price", 400

    # Update session-stored balance and inventory
    session["balance"] -= price
    inventory = session["inventory"]
    inventory[product] = inventory.get(product, 0) + 1
    session["inventory"] = inventory  # Save back to session

    return redirect("/")


@taskthree_bp.route("/reset", methods=["POST"])
def reset():
    session.clear()
    return redirect("/")

@taskthree_bp.route("/js/tasktwo.js")
def getjavascript():
    return Response(render_template("js/tasktwo.js"), mimetype='application/javascript')
