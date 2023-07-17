import json
import os
import uuid
import functions_framework
from google.cloud import spanner
from flask import make_response

instance_name = os.environ['instance'].split('/')[-1]
database_name = os.environ['database'].split('/')[-1]

spanner_client = spanner.Client()
instance = spanner_client.instance(instance_name)
database = instance.database(database_name)


def get_votes_count_from_spanner() -> str:
    with database.snapshot() as snapshot:
        results = snapshot.execute_sql(
            "SELECT COUNT(*) FROM votes LIMIT 0"
        )
        for row in results:
            response = {"votes": str(row[0])}
            return json.dumps(response)
        return '{"votes": "-1"}'

@functions_framework.http
def votes(request) -> str:
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    response = make_response(get_votes_count_from_spanner())

    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'

    return response
