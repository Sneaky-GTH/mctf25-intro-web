from flask import Flask, Blueprint, render_template, request, redirect, url_for, make_response, Response, session
import os
import json
from datetime import datetime
import threading
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

taskthree_bp = Blueprint("taskthree", __name__)

# Path to JSON file
ESSAY_FILE = "essays.json"
lock = threading.Lock()


# -----------------------------
# JSON STORAGE FUNCTIONS
# -----------------------------

def load_essays():
    """Load all essays from the JSON file."""
    if not os.path.exists(ESSAY_FILE):
        return []
    with open(ESSAY_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []


def save_essays(essays):
    """Write all essays back to the JSON file."""
    with open(ESSAY_FILE, "w") as f:
        json.dump(essays, f, indent=2)


def get_next_id(essays):
    """Compute next ID based on existing essays."""
    if not essays:
        return 0
    return max(e["id"] for e in essays) + 1


# -----------------------------
# SELENIUM BOT
# -----------------------------

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--user-agent=Kibi/1.0')

    service = Service('/usr/bin/chromedriver')
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver


def visit_essay_as_bot(essay_id):
    try:
        flag = "intro{b451C_XSS}"
        driver = setup_driver()

        # Ensure domain context exists
        driver.get('http://localhost:5000/taskthree/')
        time.sleep(1)

        # Set the flag cookie
        driver.add_cookie({
            'name': 'flag',
            'value': flag,
            'path': '/',
            'domain': 'localhost'
        })

        # Visit the essay
        essay_url = f"http://localhost:5000/taskthree/essay/{essay_id}"
        print(f"Bot visiting: {essay_url}")
        driver.get(essay_url)

        time.sleep(5)
        driver.quit()

    except Exception as e:
        print(f"Error visiting essay {essay_id}: {str(e)}")


def trigger_bot_visit(essay_id):
    def visit_delayed():
        time.sleep(2)
        visit_essay_as_bot(essay_id)

    thread = threading.Thread(target=visit_delayed)
    thread.daemon = True
    thread.start()


# -----------------------------
# ROUTES
# -----------------------------

@taskthree_bp.before_request
def checkaccess():
    if session.get("progress", 1) < 7:
        return redirect(url_for("main.index"))

@taskthree_bp.route('/')
def index():
    return render_template('taskthree.html')


@taskthree_bp.route('/submit', methods=['POST'])
def submit_essay():
    title = request.form.get('title', 'Untitled')
    content = request.form.get('content', '')

    if content:
        with lock:
            essays = load_essays()
            new_id = get_next_id(essays)

            essay = {
                'id': new_id,
                'title': title,
                'content': content,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'proofread': False
            }

            essays.append(essay)
            save_essays(essays)

        trigger_bot_visit(new_id)
        print(f"Essay {new_id} submitted, bot visit triggered")

    return redirect(url_for('taskthree.view_essay', essay_id=new_id))


@taskthree_bp.route('/essay/<int:essay_id>')
def view_essay(essay_id):
    essays = load_essays()
    essay = next((e for e in essays if e['id'] == essay_id), None)

    if not essay:
        return "Essay not found", 404

    return make_response(render_template('taskthreeessay.html', essay=essay))

@taskthree_bp.route("/js/taskthree.js")
def getjavascript():
    return Response(render_template("js/taskthree.js"), mimetype='application/javascript')

