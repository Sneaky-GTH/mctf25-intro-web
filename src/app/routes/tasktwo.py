# app/routes/tasktwo.py
from flask import Flask, Blueprint, Response, render_template, request, redirect, session, url_for
import uuid
import json
import os

tasktwo_bp = Blueprint("tasktwo", __name__)

STORE_FILE = "tasktwo_users.json"

# -------------------------
# JSON store helpers
# -------------------------
def load_store():
    if os.path.exists(STORE_FILE):
        with open(STORE_FILE, "r") as f:
            return json.load(f)
    return {}

def save_store(store):
    with open(STORE_FILE, "w") as f:
        json.dump(store, f)

# -------------------------
# User helpers
# -------------------------
def get_user_id():
    """Assign a unique user ID if not present in session."""
    if "user_id" not in session:
        session["user_id"] = str(uuid.uuid4())
    return session["user_id"]

def init_user():
    """Load or create server-side user data from JSON store."""
    store = load_store()
    user_id = get_user_id()
    if user_id not in store:
        store[user_id] = {"balance": 50, "inventory": {}, "error": None}
        save_store(store)
    return store[user_id]

def save_user(user):
    """Save updated user data to JSON store."""
    store = load_store()
    store[get_user_id()] = user
    save_store(store)

# -------------------------
# Index - display shop
# -------------------------
@tasktwo_bp.route("/")
def index():
    user = init_user()
    error = user.get("error")
    user["error"] = None
    save_user(user)
    return render_template(
        "tasktwo.html",
        balance=user["balance"],
        inventory=user["inventory"],
        error=error,
        buy_url=url_for("tasktwo.buy"),
        buy_method="GET"  # default GET version
    )

# -------------------------
# Buy endpoints
# -------------------------
@tasktwo_bp.route("/buy")
def buy():
    """GET-based purchase"""
    user = init_user()
    product = request.args.get("product", "")
    price = request.args.get("price", "")

    try:
        price = int(price)
    except:
        user["error"] = "Invalid price."
        save_user(user)
        return redirect(url_for("tasktwo.index"))

    if user["balance"] < price:
        user["error"] = "Not enough money!"
        save_user(user)
        return redirect(url_for("tasktwo.index"))

    user["balance"] -= price
    user["inventory"][product] = user["inventory"].get(product, 0) + 1
    save_user(user)
    return redirect(url_for("tasktwo.index"))

# -------------------------
# Reset endpoint
# -------------------------
@tasktwo_bp.route("/reset", methods=["POST", "GET"])
def reset():
    user_id = get_user_id()
    store = load_store()
    store[user_id] = {"balance": 50, "inventory": {}, "error": None}
    save_store(store)
    return redirect(url_for("tasktwo.index"))

# -------------------------
# Serve JS
# -------------------------
@tasktwo_bp.route("/js/tasktwo.js")
def getjavascript():
    return Response(render_template("js/tasktwo.js"), mimetype='application/javascript')

# -------------------------
# Serve flag
# -------------------------
@tasktwo_bp.route("/flag")
def flag():
    user = init_user()
    if user["balance"] < 50000:
        user["error"] = "Need 50000$ to enter the ultra special VIP zone!"
        save_user(user)
        return redirect(url_for("tasktwo.index"))
    return render_template(
        "tasktwoflag.html",
        flag="intro{b4s1c_r3qUE5t_f0rG3Ry}"
    )
