from data import data_manager
from psycopg2 import sql

def get_shows():
    return data_manager.execute_select('SELECT id, title FROM shows;')


def get_most_rated_shows(column='rating', sort='DESC') -> dict:
    return data_manager.execute_select(sql.SQL("""
        SELECT shows.id, shows.title, 
        EXTRACT(YEAR FROM shows.year) AS year, 
        shows.runtime,
        ROUND(shows.rating, 1) AS rating,
        STRING_AGG(genres.name, ', ') AS genres,
        shows.trailer, shows.homepage FROM shows
        LEFT JOIN show_genres
        ON shows.id = show_genres.show_id
        LEFT JOIN genres
        ON show_genres.genre_id = genres.id
        GROUP BY shows.id
        ORDER BY {col} {sorting_order};
    """).format(col=sql.Identifier(column), sorting_order=sql.SQL(sort)))

# Call the query with the passed order by and if its desc or asc
# Default - sorted by rating and DESC

