from data import data_manager
from psycopg2 import sql


def get_shows():
    return data_manager.execute_select('SELECT id, title FROM shows;')


def get_action_shows() -> dict:
    return data_manager.execute_select("""
    SELECT shows.id,
        shows.title,
       EXTRACT(YEAR FROM AGE( shows.year))::int AS show_age,
       COUNT(DISTINCT seasons.id) AS season_num
    FROM shows
    LEFT JOIN seasons
    ON shows.id = seasons.show_id
    INNER JOIN show_genres
    ON shows.id = show_genres.show_id
    INNER JOIN genres
    ON show_genres.genre_id = genres.id
    INNER JOIN show_characters
    ON shows.id = show_characters.show_id
    WHERE genres.name ILIKE 'ACTION'
    GROUP BY shows.id
    HAVING COUNT(DISTINCT show_characters.id) > 3
    ORDER BY show_age DESC;
    """)


def get_actors_by_show_id(show_id: int) -> dict:
    return data_manager.execute_select(sql.SQL("""
    SELECT actors.name,
       COUNT(DISTINCT show_characters.id) AS character_num,
       actors.death
    FROM shows
    INNER JOIN show_characters
    ON shows.id = show_characters.show_id
    INNER JOIN actors
    ON show_characters.actor_id = actors.id
    WHERE shows.id = {id}
    GROUP BY actors.id;
    """).format(id=sql.Literal(show_id)))