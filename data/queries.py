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
def get_show(id):
    return data_manager.execute_select(sql.SQL("""
       SELECT shows.title,
       (CASE
           WHEN shows.runtime % 60 = 0
           THEN CONCAT(shows.runtime/60, 'h')
           WHEN shows.runtime < 60
           THEN CONCAT(shows.runtime, 'min')
           ELSE CONCAT(shows.runtime/60, 'h', shows.runtime % 60, 'min')
           END) AS runtime,
       shows.overview,
       EXTRACT( YEAR FROM shows.year) AS year,
       ROUND(shows.rating, 1) AS rating,
       STRING_AGG(DISTINCT genres.name, ', ') AS genres,
       STRING_AGG(DISTINCT actors.name, ', ') AS actors,
       (CASE
           WHEN shows.trailer IS NOT null THEN SPLIT_PART(shows.trailer, 'v=', 2)
           ELSE shows.trailer
           END) AS trailer
       FROM shows
       LEFT JOIN show_genres
       ON shows.id = show_genres.show_id
       LEFT JOIN genres
       ON show_genres.genre_id = genres.id
       JOIN show_characters
       ON shows.id = show_characters.show_id
       JOIN actors
       ON show_characters.actor_id = actors.id
       WHERE shows.id = {show_id}
       GROUP BY shows.id;
    """).format(show_id=sql.Literal(id)), fetchall=False)


def get_seasons_of_show(show_id):
    return data_manager.execute_select(sql.SQL("""
        SELECT * 
        FROM seasons
        WHERE show_id = {show_id};
    """).format(show_id=sql.Literal(show_id)))