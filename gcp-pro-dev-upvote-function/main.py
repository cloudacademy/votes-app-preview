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


def write_to_database(id:str, vote:int):
    with database.batch() as batch:
        batch.insert(
            table='votes',
            columns=('id', 'vote'),
            values=[(id, vote)],
        )

def write_to_spanner(request):
    if request and 'vote' in request:
        id = str(uuid.uuid4())
        vote = request['vote']
        write_to_database(id, vote)
        return '{"message": "OK"}'
    else:
        return '{"message": "ERROR"}'

@functions_framework.http
def upvote(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    request_json = request.get_json(silent=True)

    response = make_response(write_to_spanner(request_json))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'

    return response
