from flask import Flask, render_template, url_for, request, jsonify
from data import queries
import math
from dotenv import load_dotenv

load_dotenv()
app = Flask('codecool_series')

@app.route('/')
def index():
    shows = queries.get_shows()
    return render_template('index.html', shows=shows)

#SQL + JINJA: Action shows, more than 3 characters, display: title, age of the show, number of sesasons
#SQL + fetch: actors display: name, number of characters, + before name if died alrdy
@app.route('/action-shows')
def action_shows():
    shows = queries.get_action_shows()
    return render_template('action-shows.html', action_shows=shows)


@app.route('/api/actors')
def get_actors():
    show_id = int(request.args.get('show_id'))
    actors = queries.get_actors_by_show_id(show_id)
    return jsonify(actors)

@app.route('/design')
def design():
    return render_template('design.html')


def main():
    app.run(debug=True,
            port=8888)


if __name__ == '__main__':
    main()
