from flask import Flask, render_template, url_for, jsonify, request
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
@app.route("/shows")
def most_rated_shows():
    return render_template('most-rated.html')


@app.route('/api/get_shows', methods=['POST'])
def get_shows():
    json_data = request.get_json()
    sort_by = json_data.get('column')
    order = json_data.get('order')
    show_data = queries.get_most_rated_shows(sort_by, order)
    return jsonify(show_data)


@app.route('/show/<int:id>')
def display_show(id):
    show_data = queries.get_show(id)
    return render_template('show.html', show_data=show_data)


@app.route('/design')
def design():
    return render_template('design.html')


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
