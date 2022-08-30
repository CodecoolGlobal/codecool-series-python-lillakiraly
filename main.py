from flask import Flask, render_template, url_for, jsonify
from data import queries
import math
from dotenv import load_dotenv

load_dotenv()
app = Flask('codecool_series')

@app.route('/')
def index():
    shows = queries.get_shows()
    return render_template('index.html', shows=shows)


@app.route("/shows/most-rated")
def most_rated_shows():
    return render_template('most-rated.html')


@app.route('/api/get_shows')
def get_shows():
    show_data = queries.get_most_rated_shows()
    return jsonify(show_data)


@app.route('/shows/<int:id>')
def display_show(id):
    pass


@app.route('/design')
def design():
    return render_template('design.html')


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
